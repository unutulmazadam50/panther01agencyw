import { createHash } from 'node:crypto';
import { z } from 'astro/zod';

export const CONTACT_BODY_LIMIT = 16 * 1024;
export const CONTACT_MIN_DWELL_MS = 200;
export const CONTACT_MAX_FORM_AGE_MS = 24 * 60 * 60 * 1_000;
export const CONTACT_RATE_LIMIT_MAX = 20;
export const CONTACT_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1_000;

export type ContactField =
  | 'name'
  | 'email'
  | 'company'
  | 'message'
  | 'consent'
  | 'startedAt'
  | 'submissionId';

export type ContactFieldErrors = Partial<Record<ContactField, string[]>>;

const consentSchema = z.preprocess(
  (value) => value === true || value === 'true' || value === '1' || value === 'on',
  z.literal(true, { error: 'Devam etmek için aydınlatma metnini okuduğunuzu onaylayın.' }),
);

const optionalTrimmedString = (max: number) =>
  z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().max(max, `Bu alan en fazla ${max} karakter olabilir.`).optional(),
  );

export const contactSchema = z.object({
  name: z
    .string({ error: 'Ad soyad alanı zorunludur.' })
    .trim()
    .min(2, 'Ad soyad en az 2 karakter olmalıdır.')
    .max(80, 'Ad soyad en fazla 80 karakter olabilir.'),
  email: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : value),
    z.email('Geçerli bir e-posta adresi girin.').max(254, 'E-posta adresi çok uzun.'),
  ),
  company: optionalTrimmedString(120),
  message: z
    .string({ error: 'Mesaj alanı zorunludur.' })
    .trim()
    .min(20, 'Mesaj en az 20 karakter olmalıdır.')
    .max(3_000, 'Mesaj en fazla 3000 karakter olabilir.'),
  consent: consentSchema,
  website: optionalTrimmedString(200),
  startedAt: z.preprocess(
    (value) => (value === undefined || value === null || value === '' ? undefined : value),
    z.coerce
      .number({ error: 'Form başlangıç zamanı geçersiz.' })
      .int('Form başlangıç zamanı geçersiz.')
      .positive('Form başlangıç zamanı geçersiz.')
      .optional(),
  ),
  submissionId: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.uuid('Gönderim kimliği geçersiz.').optional(),
  ),
});

export type ContactSubmission = z.infer<typeof contactSchema>;

export function isPlausibleSubmissionTime(startedAt: number, now = Date.now()) {
  const elapsed = now - startedAt;
  return elapsed >= CONTACT_MIN_DWELL_MS && elapsed <= CONTACT_MAX_FORM_AGE_MS;
}

export function createContactIdempotencyKey(
  submission: Pick<ContactSubmission, 'submissionId' | 'email' | 'message'>,
  now = Date.now(),
) {
  if (submission.submissionId) {
    return `contact-form/${submission.submissionId}`;
  }

  const tenMinuteBucket = Math.floor(now / (10 * 60 * 1_000));
  const digest = createHash('sha256')
    .update(`${submission.email.toLowerCase()}\n${submission.message}\n${tenMinuteBucket}`)
    .digest('hex');

  return `contact-form/${digest}`;
}

export function createClientKey(value: string) {
  return createHash('sha256').update(value).digest('hex').slice(0, 32);
}

export function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      })[character] ?? character,
  );
}
