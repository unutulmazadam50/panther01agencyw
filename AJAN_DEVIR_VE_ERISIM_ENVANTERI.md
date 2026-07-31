# Panther01Agency — Ajan Devir ve Erişim Envanteri

> Denetim tarihi: 30 Temmuz 2026  
> Çalışma alanı: `C:\Users\beko\Desktop\panther01agency`

## Güvenlik sınırı

Bu dosya hiçbir API anahtarı, bearer token, OAuth access/refresh token veya başka bir gizli değeri içermez. Yalnızca kimlik bilgisi adları, bulunma durumu ve kullanılabildiği kapsam belgelenmiştir.

Yeni ajan da aynı kurala uymalıdır:

- Gizli değerleri terminal çıktısına, sohbete, loga, Markdown dosyasına veya Git geçmişine yazmamalı.
- Bir anahtarın varlığını kontrol ederken yalnızca `var/yok`, kaynak ve gerekirse maskelemiş durum bilgisi göstermeli.
- Anahtar değiştirme, silme, yenileme veya sağlayıcı tarafında iptal etme işlemini kullanıcı açıkça istemeden yapmamalı.
- Yerel dosyayı ya da ortam değişkenini değiştirebilmek, sağlayıcının hesabında anahtar oluşturma/iptal etme yetkisi olduğu anlamına gelmez.

## Mevcut MCP envanteri

### Bu oturumda çağrılabilir MCP sunucuları

| MCP / bağlantı | Durum | Erişim ve yönetim kapsamı |
|---|---|---|
| `21st` | Çağrılabilir; 35 araç görünür | Arama, üretim, kişisel profil/yer imi yönetimi ve kullanıcının kendi 21st içeriklerinde oluşturma–düzenleme–kaldırma araçları var. Sağlayıcı API anahtarını oluşturma, döndürme veya iptal etme aracı yok. |
| `codex_apps` | Çağrılabilir; 155 araç görünür | Aşağıdaki bağlı uygulama gruplarını sunuyor. Yetki, her aracın kapsamı ve uygulama bağlantısının izinleriyle sınırlı. |
| `node_repl` | Çağrılabilir; 3 araç görünür | Yerel JavaScript çalışma ortamı. Harici API anahtarı yönetmez. |
| `openaiDeveloperDocs` | Çağrılabilir; 5 araç görünür | OpenAI geliştirici belgelerini arama/okuma ve OpenAPI şeması alma. Anahtar gerektiren hesap yönetimi yapmaz. |

`codex_apps` altında bu oturumda görünen gruplar:

| Uygulama grubu | Görünen araç sayısı | Kapsam özeti |
|---|---:|---|
| GitHub | 89 | Repo, issue, PR, dosya, branch ve bazı Actions işlemleri; mutasyonlar aracın ve bağlantının izniyle sınırlı. Ham GitHub tokenı görünmez ve yönetilemez. |
| Higgsfield | 38 | Workspace, medya, model, üretim ve Marketing Studio işlemleri. Ham API anahtarı görünmez ve yönetilemez. |
| Sites | 20 | Site, sürüm, dağıtım, erişim, domain ve runtime environment-variable işlemleri. İşlem için gerçek/opaque site kimliği gerekir. |
| Spreadsheets / Document Control | 3 | Bağlı Excel, PowerPoint veya Sheets oturumlarını keşfetme ve desteklenen komutları çalıştırma. |
| Plugin Management | 4 | Uygulama izinlerini görüntüleme/değiştirme, bağımlılık inceleme ve açık istek üzerine uygulama kaldırma. API anahtarı kasası değildir. |
| Hotline | 1 | Ülkeye göre yerel yardım hattı bilgisi arama; anahtar yönetimiyle ilgisi yok. |

### Codex yapılandırmasında kayıtlı fakat bu oturumda çağrılabilir aracı keşfedilmeyen MCP'ler

| MCP | Yapılandırma durumu | Kimlik doğrulama gözlemi |
|---|---|---|
| `fal_ai` | `~/.codex/config.toml` içinde kayıtlı | `Authorization` başlığı doğrudan gizli değer taşımıyor; `FAL_KEY` ortam değişkenine referans veriyor. `FAL_KEY` mevcut. Bu oturumda `fal_ai` aracı keşfedilmediği için fiilen kullanıma hazır olduğu varsayılmamalı. |
| `apify` | `~/.codex/config.toml` içinde kayıtlı | URL üzerinde credential query alanı yok; `APIFY_API_TOKEN` ortam değişkeni bulunmadı. Bu oturumda Apify aracı keşfedilmedi. Bağlantı/kimlik doğrulama ayrıca doğrulanmalı. |

Not: Browser, Chrome, Computer Use, Documents, PDF, Presentations, Spreadsheets, Sites ve benzeri kurulu eklentiler bulunabilir; bunların tümü ayrı bir MCP sunucusu değildir. İhtiyaca göre skill/eklenti üzerinden etkinleşebilir.

## API anahtarı ve oturum kimliği envanteri

| Kimlik bilgisi | Durum | Nerede / ne için | Ajanın gerçek yönetim sınırı |
|---|---|---|---|
| `API_KEY_21ST` | Mevcut | Process ve kullanıcı ortam değişkeni; `21st` MCP tarafından kullanılıyor | Ajan yerel ortam/yapılandırma üzerinde teknik olarak değişiklik yapabilir, ancak bunu yalnızca açık kullanıcı talimatıyla yapmalı. 21st hesabında anahtar oluşturma, döndürme veya iptal etme yetkisi doğrulanmadı. |
| `FAL_KEY` | Mevcut | Process ve kullanıcı ortam değişkeni; `fal_ai` MCP yapılandırmasındaki Authorization başlığı buna referans veriyor | Yerel referans değiştirilebilir; sağlayıcı tarafı anahtar yaşam döngüsü yönetimi doğrulanmadı. Mevcut oturumda fal.ai araçları çağrılabilir değil. |
| `RESEND_API_KEY` | Eksik | `src/pages/api/contact.ts` bu runtime secret'ı bekliyor; yayın planında da P0 görev olarak işaretli | Anahtar değeri kullanıcıdan/sağlayıcıdan güvenli biçimde temin edilmeden e-posta gönderimi tamamlanmış sayılmamalı. Ajan kendiliğinden anahtar üretemez. |
| `OPENAI_API_KEY` | Eksik | Process, kullanıcı ve makine ortamında yok; `~/.codex/auth.json` alanı da boş | OpenAI API anahtarı yönetim yetkisi yok. |
| `APIFY_API_TOKEN` | Eksik | Denetlenen process/kullanıcı/makine ortamında yok | Apify bağlantısı için gerekirse kullanıcıdan güvenli kurulum/bağlantı istenmeli. |
| Codex OAuth oturum tokenları | Mevcut | `~/.codex/auth.json` içinde access/refresh token alanları var | Bunlar API anahtarı değildir. Asla okunmamalı, kopyalanmamalı veya belgeye yazılmamalı. Oturum açma altyapısı tarafından yönetilir. |

### Sites runtime secret yönetimi

Bu çalışma alanında `.openai/hosting.json` bulunmadı. Sites araçları runtime environment variable okuyup güncelleyebilir, fakat bunun için doğrulanmış bir Sites `project_id` gerekir. Bu nedenle mevcut projeye ait Sites secret yönetim yetkisi şu anda doğrulanmış değildir.

## VPS erişim yolu

VPS için yerel SSH alias'ı hazırdır:

| Alan | Değer |
|---|---|
| SSH alias | `berkay-vps` |
| SSH komutu | `ssh berkay-vps` |
| Sunucu | `108.165.233.107` |
| Kullanıcı | `root` |
| Port | `22` |
| Kimlik dosyası | `~/.ssh/id_ed25519` |
| SSH yapılandırması | `C:\Users\beko\.ssh\config` |
| Son TCP port kontrolü | 30 Temmuz 2026 tarihinde başarılı |

Normal erişim komutu:

```powershell
ssh berkay-vps
```

Alias kullanılamazsa eşdeğer doğrudan bağlantı:

```powershell
ssh -i "$env:USERPROFILE\.ssh\id_ed25519" root@108.165.233.107
```

Yeni ajan için VPS kuralları:

- Önce `ssh -G berkay-vps` ile çözümlenen kullanıcı, host, port ve identity yolunu doğrulamalı.
- Özel anahtar dosyasının içeriğini hiçbir zaman okumamalı, göstermemeli, kopyalamamalı veya çalışma alanına taşımamalı.
- İlk uzak bağlantıda yalnızca gereken read-only durum kontrollerini yapmalı.
- Uzak sunucuda silme, servis durdurma, firewall değiştirme, credential güncelleme veya geri dönüşü zor bir işlem için hedefi önce kesinleştirmeli.
- Panther01Agency yayını için planlanan hedef Coolify'dır. SSH, sunucu yönetim yolu; Coolify ise uygulama deployment yoludur.
- Coolify sunucusu/projesi henüz bu çalışma alanındaki dokümanlarda kesinleştirilmiş değildir. VPS'te Coolify'ın kurulu ve bu projeye bağlı olduğu ayrıca doğrulanmalıdır.
- Mevcut yayın planına göre uygulama static site olarak çalıştırılmamalı; build komutu `npm run build`, start komutu `npm run start`, uygulama portu `4321`, health check yolu `/` olmalıdır.
- `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` ve `SITE_URL` gibi değerler yalnızca Coolify runtime secret/environment alanında tutulmalı; kaynak koda veya deployment loglarına yazılmamalıdır.

## Denetimin kapsamı ve sınırlamaları

Denetlenen kaynaklar:

- Bu Codex oturumunda keşfedilebilen MCP araçları
- `C:\Users\beko\.codex\config.toml` içindeki bölüm ve credential alan adları
- `C:\Users\beko\.codex\auth.json` içindeki yalnızca alan adları ve dolu/boş durumu
- Process, Windows kullanıcı ve makine ortam değişkenlerinde seçili anahtar adlarının varlığı
- Çalışma alanındaki kaynak kod ve dokümanlarda secret değişkeni referansları

Denetlenmeyen veya buradan doğrulanamayan alanlar:

- Sağlayıcı panellerindeki anahtar listeleri, roller, faturalandırma ve anahtar iptal/döndürme yetkileri
- Windows Credential Manager veya tarayıcı parola kasasındaki gizli değerler
- Kullanıcının başka makineleri, CI/CD secret kasaları ve harici hosting panelleri
- Bir MCP aracının çağrı anında OAuth yenilemesi veya ek onay isteyip istemeyeceği

Bu nedenle “mevcut” ifadesi yerel/oturum bağlamında kullanılmalı; “sağlayıcı hesabında yönetilebilir” şeklinde genişletilmemelidir.

## Yeni ajan nasıl devam etmeli?

Yeni ajan ilk olarak bu dosyayı, ardından `PRODUCT.md`, `DESIGN.md` ve `PANTHER01AGENCY_BILGI_TOPLAMA_VE_YAYIN_PLANI.md` dosyalarını okumalıdır. Çalışma alanı şu anda bir Git deposu değildir; `git status` başarısız olur. Bu durum kullanıcı istemeden değiştirilmemelidir.

Önerilen başlangıç sırası:

1. Kullanıcının güncel hedefini netleştir veya aşağıdaki prompttaki hedefi uygula.
2. Bu envanteri güncel kabul etmeden önce secret değerlerini göstermeden kısa bir varlık kontrolü yap.
3. İlgili dosyaları ve mevcut değişiklikleri incele; kullanıcı verilerini ve mevcut çalışmayı koru.
4. Kod değişikliği gerekiyorsa küçük ve kontrollü yamalar uygula.
5. Uygun olduğunda `npm run check` ve ardından `npm run build` çalıştır.
6. Harici servis yazma işlemi, deployment, mesaj gönderimi, anahtar değişikliği veya veri silme için kullanıcının açık kapsamını gözet.
7. Sonuçta değişen dosyaları, yapılan doğrulamayı ve kalan engelleri kısa biçimde raporla.

## Yeni ajana verilecek kopyala-yapıştır promptu

Aşağıdaki metindeki `[GÜNCEL HEDEF]` bölümünü gerçek görevle değiştir:

```text
C:\Users\beko\Desktop\panther01agency çalışma alanındaki Panther01Agency projesine kaldığı yerden devam et.

İlk olarak şu dosyaları tamamen oku:
1. C:\Users\beko\Desktop\panther01agency\AJAN_DEVIR_VE_ERISIM_ENVANTERI.md
2. C:\Users\beko\Desktop\panther01agency\PRODUCT.md
3. C:\Users\beko\Desktop\panther01agency\DESIGN.md
4. C:\Users\beko\Desktop\panther01agency\PANTHER01AGENCY_BILGI_TOPLAMA_VE_YAYIN_PLANI.md

Güncel hedef:
[GÜNCEL HEDEF]

Çalışma kuralları:
- Mevcut dosyaları ve kullanıcı değişikliklerini koru; kullanıcı istemeden proje yapısını sıfırlama.
- Bu klasör şu anda Git deposu değil; kullanıcı açıkça istemedikçe Git deposu oluşturma.
- Hiçbir API key, token, parola veya secret değerini terminale, sohbete, loga ya da dosyaya yazma.
- Credential kontrolünde yalnızca değişken adı, kaynak ve var/yok durumu göster.
- API_KEY_21ST ve FAL_KEY mevcut olabilir; değerlerini okuma veya gösterme. RESEND_API_KEY en son denetimde eksikti.
- Yerel credential dosyasını değiştirebilmek ile sağlayıcı panelinde anahtar oluşturma/iptal etme yetkisini birbirine karıştırma.
- MCP ve bağlantı durumu zamanla değişebileceği için ihtiyaç duyduğun bağlantıyı işlem öncesinde güvenli biçimde yeniden doğrula.
- Kullanıcının hedefi kod değişikliği gerektiriyorsa doğrudan uygula; yalnızca teşhis istenmişse izinsiz düzeltme yapma.
- Harici yazma, deployment, e-posta/mesaj gönderme, veri silme veya anahtar değiştirme işlemlerinde kullanıcının açık kapsamını aşma.
- VPS erişimi gerektiğinde önce ssh -G berkay-vps ile bağlantı hedefini doğrula, ardından ssh berkay-vps kullan. Özel SSH anahtarını asla gösterme veya kopyalama.
- VPS SSH bağlantısını sunucu yönetimi için, Coolify'ı uygulama deployment'ı için kullan. Coolify kurulumunu ve proje eşleşmesini varsayma; önce read-only olarak doğrula.
- Değişiklikten sonra uygun doğrulamaları çalıştır. Astro projesi için önce npm run check, sonra npm run build kullan.
- Son yanıtta sonucu, değişen dosyaları, test/build durumunu ve varsa gerçek engelleri bildir.

Önce mevcut durumu kısa biçimde özetle, sonra [GÜNCEL HEDEF] üzerinde çalışmaya başla. Sadece plan sunup durma; güvenli ve yetkili olan uygulama adımlarını tamamla.
```

## Hızlı devir promptu

Daha kısa bir seçenek:

```text
C:\Users\beko\Desktop\panther01agency projesine devam et. Önce AJAN_DEVIR_VE_ERISIM_ENVANTERI.md, PRODUCT.md, DESIGN.md ve PANTHER01AGENCY_BILGI_TOPLAMA_VE_YAYIN_PLANI.md dosyalarını tamamen oku. Secret değerlerini asla gösterme; yalnızca var/yok kontrolü yap. Bu klasör Git deposu değil. Güncel hedefim: [GÜNCEL HEDEF]. Hedefi uygula, npm run check ve npm run build ile doğrula, değişen dosyaları ve kalan engelleri raporla.
```
