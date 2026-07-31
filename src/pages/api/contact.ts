import type { APIRoute } from 'astro';
import { getSecret } from 'astro:env/server';
import { z } from 'astro/zod';
import { Resend } from 'resend';
import {
  CONTACT_BODY_LIMIT,
  CONTACT_MAX_FORM_AGE_MS,
  CONTACT_MIN_DWELL_MS,
  CONTACT_RATE_LIMIT_MAX,
  CONTACT_RATE_LIMIT_WINDOW_MS,
  contactSchema,
  createClientKey,
  createContactIdempotencyKey,
  escapeHtml,
  type ContactFieldErrors,
  type ContactSubmission,
} from '../../lib/contact';

export const prerender = false;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type ContactResponse = {
  ok: boolean;
  message: string;
  fieldErrors?: ContactFieldErrors;
};

const globalRateLimit = globalThis as typeof globalThis & {
  __panther01ContactRateLimit?: Map<string, RateLimitEntry>;
};

const rateLimitStore =
  globalRateLimit.__panther01ContactRateLimit ??
  (globalRateLimit.__panther01ContactRateLimit = new Map<string, RateLimitEntry>());

function getResponseMode(request: Request) {
  const accept = request.headers.get('accept') ?? '';
  const contentType = request.headers.get('content-type') ?? '';
  const requestedWith = request.headers.get('x-requested-with');

  return accept.includes('application/json') ||
    contentType.includes('application/json') ||
    requestedWith === 'XMLHttpRequest'
    ? 'json'
    : 'redirect';
}

function respond(
  request: Request,
  payload: ContactResponse,
  status: number,
  redirectPath: string,
) {
  const headers = {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
  };

  if (getResponseMode(request) === 'json') {
    return new Response(JSON.stringify(payload), { status, headers });
  }

  return new Response(null, {
    status: 303,
    headers: {
      'Cache-Control': 'no-store',
      Location: redirectPath,
    },
  });
}

function normaliseOrigin(value: string | undefined | null) {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function isAllowedOrigin(request: Request) {
  const requestOrigin = normaliseOrigin(request.headers.get('origin'));
  if (!requestOrigin) return false;

  const allowedOrigins = new Set<string>();
  const siteOrigin = normaliseOrigin(getSecret('SITE_URL'));
  const runtimeOrigin = normaliseOrigin(request.url);
  const forwardedHost = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
  const forwardedProtocol =
    request.headers.get('x-forwarded-proto')?.split(',')[0]?.trim() ?? 'https';

  if (siteOrigin) allowedOrigins.add(siteOrigin);
  if (runtimeOrigin) allowedOrigins.add(runtimeOrigin);
  if (forwardedHost) {
    const forwardedOrigin = normaliseOrigin(`${forwardedProtocol}://${forwardedHost}`);
    if (forwardedOrigin) allowedOrigins.add(forwardedOrigin);
  }

  return allowedOrigins.has(requestOrigin);
}

function getClientIdentifier(request: Request, clientAddress?: string) {
  const forwardedFor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const address =
    request.headers.get('cf-connecting-ip')?.trim() ||
    request.headers.get('x-real-ip')?.trim() ||
    clientAddress ||
    forwardedFor ||
    'unknown';

  return createClientKey(address);
}

function checkRateLimit(clientKey: string, now = Date.now()) {
  for (const [key, entry] of rateLimitStore) {
    if (entry.resetAt <= now) rateLimitStore.delete(key);
  }

  const current = rateLimitStore.get(clientKey);
  if (!current || current.resetAt <= now) {
    while (rateLimitStore.size >= 5_000) {
      const oldestKey = rateLimitStore.keys().next().value;
      if (!oldestKey) break;
      rateLimitStore.delete(oldestKey);
    }
    rateLimitStore.set(clientKey, {
      count: 1,
      resetAt: now + CONTACT_RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, retryAfter: 0 };
  }

  if (current.count >= CONTACT_RATE_LIMIT_MAX) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1_000)),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfter: 0 };
}

async function readRequestData(request: Request) {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (Number.isFinite(contentLength) && contentLength > CONTACT_BODY_LIMIT) {
    return { error: 'too-large' as const };
  }

  const bytes = new Uint8Array(await request.arrayBuffer());
  if (bytes.byteLength > CONTACT_BODY_LIMIT) {
    return { error: 'too-large' as const };
  }

  const contentType = request.headers.get('content-type')?.toLowerCase() ?? '';

  if (contentType.includes('application/json')) {
    try {
      const value = JSON.parse(new TextDecoder().decode(bytes));
      if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return { error: 'invalid' as const };
      }
      return { data: value as Record<string, unknown> };
    } catch {
      return { error: 'invalid' as const };
    }
  }

  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    try {
      const parsedRequest = new Request(request.url, {
        method: 'POST',
        headers: {
          'Content-Type': request.headers.get('content-type') ?? '',
        },
        body: bytes,
      });
      const formData = await parsedRequest.formData();
      const data: Record<string, unknown> = {};

      for (const [key, value] of formData.entries()) {
        if (typeof value !== 'string') return { error: 'invalid' as const };
        data[key] = value;
      }

      return { data };
    } catch {
      return { error: 'invalid' as const };
    }
  }

  return { error: 'unsupported' as const };
}

function createEmailContent(submission: ContactSubmission) {
  const company = submission.company || 'Belirtilmedi';
  const text = [
    'Panther01Agency website iletişim formu',
    '',
    `Ad soyad: ${submission.name}`,
    `E-posta: ${submission.email}`,
    `Şirket: ${company}`,
    '',
    'Mesaj:',
    submission.message,
  ].join('\n');

  const html = `
    <h1>Yeni iletişim talebi</h1>
    <p><strong>Ad soyad:</strong> ${escapeHtml(submission.name)}</p>
    <p><strong>E-posta:</strong> ${escapeHtml(submission.email)}</p>
    <p><strong>Şirket:</strong> ${escapeHtml(company)}</p>
    <h2>Mesaj</h2>
    <p>${escapeHtml(submission.message).replace(/\n/g, '<br />')}</p>
  `;

  return { html, text };
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!isAllowedOrigin(request)) {
    return respond(
      request,
      { ok: false, message: 'İstek doğrulanamadı. Sayfayı yenileyip tekrar deneyin.' },
      403,
      '/?contact=invalid#iletisim',
    );
  }

  const parsedBody = await readRequestData(request);
  if ('error' in parsedBody) {
    const status = parsedBody.error === 'too-large' ? 413 : parsedBody.error === 'unsupported' ? 415 : 400;
    return respond(
      request,
      { ok: false, message: 'Form verisi okunamadı. Alanları kontrol edip tekrar deneyin.' },
      status,
      '/?contact=invalid#iletisim',
    );
  }

  const rawWebsite = parsedBody.data.website;
  if (typeof rawWebsite === 'string' && rawWebsite.trim() !== '') {
    return respond(
      request,
      { ok: true, message: 'Mesajınız alındı.' },
      200,
      '/tesekkurler',
    );
  }

  const validation = contactSchema.safeParse(parsedBody.data);
  if (!validation.success) {
    return respond(
      request,
      {
        ok: false,
        message: 'Lütfen işaretli alanları kontrol edin.',
        fieldErrors: z.flattenError(validation.error).fieldErrors as ContactFieldErrors,
      },
      400,
      '/?contact=invalid#iletisim',
    );
  }

  const submission = validation.data;
  if (submission.startedAt) {
    const elapsed = Date.now() - submission.startedAt;
    if (elapsed > CONTACT_MAX_FORM_AGE_MS) {
      return respond(
        request,
        {
          ok: false,
          message: 'Formun süresi doldu. Sayfayı yenileyip tekrar gönderin.',
          fieldErrors: { startedAt: ['Formun süresi doldu.'] },
        },
        400,
        '/?contact=expired#iletisim',
      );
    }

    if (elapsed < CONTACT_MIN_DWELL_MS) {
      return respond(
        request,
        { ok: true, message: 'Mesajınız alındı.' },
        200,
        '/tesekkurler',
      );
    }
  }

  const rateLimit = checkRateLimit(getClientIdentifier(request, clientAddress));
  if (!rateLimit.allowed) {
    const response = respond(
      request,
      {
        ok: false,
        message: 'Çok fazla gönderim yapıldı. Lütfen kısa bir süre sonra tekrar deneyin.',
      },
      429,
      '/?contact=rate-limited#iletisim',
    );
    if (getResponseMode(request) === 'json') {
      response.headers.set('Retry-After', String(rateLimit.retryAfter));
    }
    return response;
  }

  const apiKey = getSecret('RESEND_API_KEY') || process.env.RESEND_API_KEY || (import.meta.env.RESEND_API_KEY as string | undefined);
  const from = getSecret('CONTACT_FROM_EMAIL') || process.env.CONTACT_FROM_EMAIL || (import.meta.env.CONTACT_FROM_EMAIL as string | undefined);
  const rawTo = getSecret('CONTACT_TO_EMAIL') || process.env.CONTACT_TO_EMAIL || (import.meta.env.CONTACT_TO_EMAIL as string | undefined);
  const to = rawTo
    ?.split(',')
    .map((address) => address.trim())
    .filter(Boolean);

  if (!apiKey || !from || !to?.length) {
    console.error('[contact] Resend environment variables are not configured.');
    return respond(
      request,
      { ok: false, message: 'İletişim servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.' },
      503,
      '/?contact=unavailable#iletisim',
    );
  }

  const resend = new Resend(apiKey);
  const emailContent = createEmailContent(submission);
  try {
    const { error } = await resend.emails.send(
      {
        from,
        to,
        replyTo: submission.email,
        subject: 'Panther01Agency — Yeni iletişim talebi',
        html: emailContent.html,
        text: emailContent.text,
      },
      {
        idempotencyKey: createContactIdempotencyKey(submission),
      },
    );

    if (error) {
      console.error('[contact] Resend delivery failed.', {
        name: error.name,
        message: error.message,
      });
      return respond(
        request,
        { ok: false, message: 'Mesaj gönderilemedi. Lütfen kısa bir süre sonra tekrar deneyin.' },
        502,
        '/?contact=failed#iletisim',
      );
    }
  } catch (error) {
    console.error('[contact] Resend request failed.', {
      message: error instanceof Error ? error.message : 'Unknown delivery error',
    });
    return respond(
      request,
      { ok: false, message: 'Mesaj gönderilemedi. Lütfen kısa bir süre sonra tekrar deneyin.' },
      502,
      '/?contact=failed#iletisim',
    );
  }

  return respond(
    request,
    { ok: true, message: 'Mesajınız alındı. En kısa sürede size dönüş yapacağız.' },
    200,
    '/tesekkurler',
  );
};
