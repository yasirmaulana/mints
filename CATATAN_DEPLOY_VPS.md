# Catatan Deploy ke VPS

Daftar periksa praktis saat memindahkan aplikasi dari Vercel ke VPS. Isinya turunan dari perbaikan
keamanan yang sudah dikerjakan; rencana lengkap (arsitektur, kapasitas, Redis, antrean) ada di
[`PRD_Produksi_VPS.md`](PRD_Produksi_VPS.md). Dokumen ini hanya mencatat **hal yang akan rusak atau menjadi
tidak aman kalau terlewat**.

Susunan yang direncanakan: `Cloudflare → Nginx → Node (PM2 cluster)`.

---

## 1. IP klien di belakang proxy (`TRUSTED_PROXY_COUNT`) — WAJIB

Semua rate limit (OTP, login admin, voucher, chat, `/orders`, dst.) memakai IP klien dari header
`x-forwarded-for` lewat `getClientIp()` di [`server/utils/rate-limit.ts`](server/utils/rate-limit.ts).

Aplikasi mengambil entri ke-**N dari kanan** header itu, dengan `N = TRUSTED_PROXY_COUNT` (default `1`).
Entri di sisi kiri adalah isian klien dan diabaikan. Di Vercel tidak perlu mengisi apa pun (default 1 benar, karena
Vercel menimpa header dan isinya satu entri). Kalau nilainya salah di VPS:

| Salah konfigurasi | Akibat |
|---|---|
| Terlalu **besar** | Header lebih pendek dari `N`: aplikasi memakai entri pertama dan menulis peringatan `[client-ip] TRUSTED_PROXY_COUNT=…` ke log (sekali per proses). Pengunjung tidak saling terkunci, tapi IP bisa dipalsukan. |
| Terlalu **kecil** | Aplikasi mengambil IP proxy paling dalam (IP Cloudflare/Nginx): banyak pengguna berbagi satu IP dan **saling memblokir** (banyak 429). |

Nilai di luar 1–5 atau bukan angka dianggap `1`.

**Rekomendasi (satu konfigurasi memperbaiki dua lapis sekaligus):** buat Nginx menimpa header dengan IP asli,
lalu pakai `TRUSTED_PROXY_COUNT=1`.

```nginx
# /etc/nginx/conf.d/cloudflare-realip.conf
# Daftar rentang IP Cloudflare: https://www.cloudflare.com/ips-v4  dan  https://www.cloudflare.com/ips-v6
# Perbarui berkala (Cloudflare kadang menambah rentang).
set_real_ip_from 173.245.48.0/20;      # ...salin semua rentang dari daftar di atas
real_ip_header   CF-Connecting-IP;
real_ip_recursive on;
```

```nginx
# di blok location yang melakukan proxy_pass ke Node
proxy_set_header X-Real-IP         $remote_addr;
proxy_set_header X-Forwarded-For   $remote_addr;   # TIMPA, jangan pakai $proxy_add_x_forwarded_for
proxy_set_header X-Forwarded-Proto $scheme;
proxy_set_header Host              $host;
```

Kenapa `real_ip` penting juga untuk Nginx sendiri: `limit_req_zone $binary_remote_addr` (PRD §4.3) di belakang
Cloudflare hanya melihat IP Cloudflare. Tanpa `real_ip`, semua pengunjung berbagi beberapa IP dan batas Nginx
memblokir pengguna sah sekaligus.

Jika **tidak** memakai `real_ip` dan Nginx memakai `$proxy_add_x_forwarded_for` (menambahkan), header menjadi
`klien, IP-Cloudflare` → set `TRUSTED_PROXY_COUNT=2`.

**Node harus mengikat `127.0.0.1` saja** (PRD §4.2). Kalau port Node terjangkau dari internet, pengunjung bisa
melewati Nginx dan mengirim `x-forwarded-for` sesukanya.

**Cara memverifikasi setelah deploy:** dari satu jaringan, kirim 6× permintaan kirim-OTP dengan email berbeda;
permintaan ke-6 harus 429. Lalu ulangi dengan header palsu `-H "X-Forwarded-For: 1.2.3.4"` — batasnya tidak boleh
"reset". Periksa juga log aplikasi: tidak boleh ada peringatan `[client-ip]`.

---

## 2. Preset build Nitro

`nuxt.config.ts` sekarang: `nitro: { preset: 'vercel' }`. Untuk VPS ganti ke preset Node:

```ts
nitro: { preset: 'node-server' }
```

atau tanpa mengubah file: `NITRO_PRESET=node-server npm run build`. Jalankan hasilnya dengan
`node .output/server/index.mjs`. `vercel.json` tidak dipakai di VPS.

## 3. Redis WAJIB di produksi (rate limit)

`checkRateLimit` memakai Upstash bila `UPSTASH_REDIS_REST_URL` dan `UPSTASH_REDIS_REST_TOKEN` terisi; kalau tidak,
jatuh ke `Map` per proses. Di **PM2 cluster** setiap worker punya `Map` sendiri, sehingga batas efektif menjadi
`max × jumlah worker` dan hilang saat restart (PRD §3.6). Sebelum go-live:

- Isi kedua variabel Upstash — atau — ganti klien Redis ke Redis lokal di VPS (perlu perubahan kode di
  `rate-limit.ts`, karena `@upstash/ratelimit` bicara lewat REST).
- Belum ada fail-fast: aplikasi **tidak** menolak start bila Redis tidak dikonfigurasi. Cek manual.

## 4. Cron: Vercel Cron tidak ada di VPS

Vercel Cron memanggil endpoint dengan header `Authorization: Bearer <CRON_SECRET>`. Di VPS buat jadwal sendiri
(cron sistem atau systemd timer) yang memanggil endpoint yang sama. Semua endpoint menjawab 401 tanpa header itu.

| Endpoint | Jadwal di `vercel.json` (UTC) | Fungsi |
|---|---|---|
| `/api/cron/store-expiry` | `0 1 * * *` | Tandai toko kedaluwarsa + pengingat H-7/H-3/H-1 |
| `/api/cron/cleanup-media` | `30 1 * * *` | Hapus video S3 yang tidak pernah dikonfirmasi |
| `/api/cron/reconcile-counters` | `0 2 * * *` | Rekonsiliasi counter kuota toko |
| `/api/cron/cancel-unpaid` | `0 3 * * *` | Batalkan order tak dibayar >26 jam, kembalikan stok |

Contoh entri `crontab` (waktu mengikuti zona waktu server — Vercel memakai **UTC**, sesuaikan):

```cron
CRON_SECRET=isi-sama-dengan-.env
0 1 * * *  curl -fsS -H "Authorization: Bearer $CRON_SECRET" http://127.0.0.1:3000/api/cron/store-expiry
30 1 * * * curl -fsS -H "Authorization: Bearer $CRON_SECRET" http://127.0.0.1:3000/api/cron/cleanup-media
0 2 * * *  curl -fsS -H "Authorization: Bearer $CRON_SECRET" http://127.0.0.1:3000/api/cron/reconcile-counters
0 3 * * *  curl -fsS -H "Authorization: Bearer $CRON_SECRET" http://127.0.0.1:3000/api/cron/cancel-unpaid
```

Panggil lewat `127.0.0.1` langsung ke Node (bukan lewat domain publik) agar tidak melewati Cloudflare/rate limit.
Bila memakai PM2 cluster, cron cukup dipicu **satu kali** (bukan per worker).

Catatan `cancel-unpaid`: order dengan pembayaran transfer manual (`FT`) sengaja **tidak** dibatalkan otomatis
(pembeli mungkin sudah transfer dan menunggu admin); batalkan manual dari panel admin bila perlu.

## 5. Batas ukuran body di Nginx

Default Nginx `client_max_body_size` adalah **1 MB**, sedangkan unggahan gambar (sudah dikompres ke WebP di browser,
maks. 2 MB per file, banyak file per produk) akan gagal dengan 413. Naikkan hanya untuk rute unggah:

```nginx
location ~ ^/api/(store/[^/]+/(image|products)|admin/products|admin/orders/[^/]+/upload-proof) {
    client_max_body_size 20m;
    proxy_pass http://127.0.0.1:3000;
    # + proxy_set_header seperti di bagian 1
}
location /api/csp-report { client_max_body_size 8k; proxy_pass http://127.0.0.1:3000; }
```

Video **tidak** lewat Nginx: diunggah langsung dari browser ke S3 (presigned URL).

## 6. Header keamanan: jangan dobel

Aplikasi sudah memasang header dari [`server/middleware/security-headers.ts`](server/middleware/security-headers.ts):
`Content-Security-Policy` (`frame-ancestors`, `base-uri`, `object-src`), `Content-Security-Policy-Report-Only`,
`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, dan HSTS (hanya bila
`NODE_ENV=production`).

- Kalau Nginx juga memasang header yang sama (PRD §4.3), hasilnya **header ganda**: HSTS/CSP ganda bisa membuat
  browser memakai nilai yang tidak diharapkan. Pilih satu tempat. Paling sederhana: biarkan aplikasi yang
  memasangnya, dan di Nginx cukup `proxy_hide_header Server; proxy_hide_header X-Powered-By;`.
- PRD §4.3 menyebut HSTS `includeSubDomains; preload` dan `X-Frame-Options: DENY`. Aplikasi sengaja memakai
  `max-age=31536000` tanpa `includeSubDomains/preload` dan `SAMEORIGIN`. `preload` sulit dibatalkan — putuskan
  dengan sadar sebelum menambahkannya.
- **Wajib `NODE_ENV=production`** di PM2 (`ecosystem.config.cjs` → `env`). Tanpa itu HSTS tidak terkirim.
- CSP masih **Report-Only**. Pantau `[csp-report]` di log aplikasi (`pm2 logs`) selama beberapa hari, sesuaikan daftar
  host, baru pindahkan ke mode memblokir. Bila Nginx memblokir/menulis ulang CSP (PRD §8.3), pastikan
  `/api/csp-report` tetap terjangkau.

## 7. Variabel environment

Semua yang ada di `.env` lokal harus ada di server (Vercel tidak dipakai lagi). Yang sering terlewat:

| Variabel | Catatan |
|---|---|
| `NODE_ENV=production` | Wajib (HSTS, dan konfigurasi Nitro). |
| `SESSION_SECRET` | Mengganti nilainya = semua pembeli dan admin keluar dan token chat lama tidak valid. |
| `CRON_SECRET` | Harus sama dengan yang dipakai crontab di atas. |
| `TRUSTED_PROXY_COUNT` | Lihat bagian 1. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Lihat bagian 3. |
| `RECAPTCHA_SITE_KEY` + `RECAPTCHA_SECRET_KEY` | Harus berpasangan; site key terisi tanpa secret → login menjawab 500. |
| `APP_URL` | Dipakai di pesan WA dan tautan (mis. pengingat langganan). Ganti ke domain baru. |
| `DUITKU_CALLBACK_URL`, `DUITKU_RETURN_URL` | Ganti ke domain VPS (HTTPS, dapat dijangkau Duitku), dan daftarkan di dashboard Duitku. |
| `NUXT_OAUTH_GOOGLE_CLIENT_ID/SECRET` | Tambahkan redirect URI `https://<domain>/auth/google` di Google Cloud Console. |
| `NUXT_SESSION_PASSWORD` | ≥ 32 karakter (dibutuhkan `nuxt-auth-utils`). |
| `DATABASE_URL`, `DIRECT_URL` | Bila memakai PgBouncer: `DATABASE_URL` lewat PgBouncer (`?pgbouncer=true`), `DIRECT_URL` langsung ke PostgreSQL untuk `prisma db push`. Bukan URL `prisma://` — Accelerate hanya dipakai bila `DATABASE_URL` berawalan `prisma`. |
| `ADMIN_SEED_PASSWORD` | Hanya untuk `npm run db:seed` (min. 12 karakter). Tidak ada password bawaan. |

Di Google reCAPTCHA admin console, tambahkan domain VPS ke daftar domain kunci.

## 8. Cookie dan HTTPS

Cookie sesi memakai `secure: true` dan `sameSite: strict` (login OTP) / `lax` (Google). Cookie hanya dikirim lewat
HTTPS, jadi seluruh akses harus HTTPS dari sisi browser (Cloudflare mode **Full (strict)** + sertifikat valid di Nginx).
Uji login di domain final, bukan hanya lewat IP.

## 9. Cloudflare

- Mode SSL/TLS: **Full (strict)**.
- Cache: `/api/s3-image/*` boleh di-cache lama (nama objek unik/immutable). **Jangan** cache `/api/*` lainnya
  (auth, checkout, chat, callback pembayaran) — atur *Cache Rules* agar hanya rute gambar yang di-cache.
- Callback Duitku (`/api/payment/callback`, `/api/subscription/callback`) tidak boleh diblokir WAF/bot-fight.

## 10. Hal lain yang perlu diingat

- **Perintah Prisma:** tetap `npx prisma db push`, bukan `migrate dev` (repo ini tidak punya folder migrations).
- Setelah `npx nuxt build`, hapus `.nuxt` (`rm -rf .nuxt`) sebelum `npm run dev` lagi di mesin dev.
- **Video di Safari/iOS** butuh dukungan `Range`; endpoint `/api/s3-image` sudah meneruskannya ke S3. Bila Nginx
  di depan melakukan `proxy_cache` ke S3 langsung (PRD §6 opsi 2), pastikan `Range` tetap diteruskan.
- **Bukti transfer admin** (`proofs/…`) tidak bisa dibuka lewat `/api/s3-image` (prefix tidak diizinkan, disengaja
  agar bukti transfer tidak publik). Bila perlu dilihat di panel admin, buat endpoint khusus admin — jangan membuka
  prefix itu di proxy publik.
- **`Payment.orderId` bersifat unik**: satu order hanya bisa punya satu `Payment`, jadi mengganti metode pembayaran
  untuk order yang sama gagal dengan error unik. Belum diperbaiki; putuskan perilaku yang diinginkan.

---

## Daftar periksa singkat sebelum go-live

- [ ] `nitro.preset` = `node-server`, build berhasil, `node .output/server/index.mjs` jalan di bawah PM2.
- [ ] `NODE_ENV=production`, Node mengikat `127.0.0.1`, hanya 22/80/443 terbuka.
- [ ] Nginx: `real_ip` Cloudflare + `X-Forwarded-For $remote_addr`, `TRUSTED_PROXY_COUNT=1`.
- [ ] Uji 6× kirim-OTP → ke-6 = 429; header `X-Forwarded-For` palsu tidak menghindari batas; tidak ada peringatan `[client-ip]`.
- [ ] Redis/Upstash terhubung (rate limit dibagi antar worker).
- [ ] Crontab 4 endpoint terpasang dengan `CRON_SECRET` yang benar; uji manual satu kali (harus 200, bukan 401).
- [ ] `client_max_body_size` untuk rute unggah; uji unggah 3 foto produk.
- [ ] Header keamanan tidak dobel (cek dengan `curl -I https://<domain>/`).
- [ ] Login OTP, Google, dan admin jalan di domain final; reCAPTCHA menerima domain baru.
- [ ] Callback Duitku terverifikasi (bayar sandbox → order jadi `PAID`, WA terkirim satu kali).
- [ ] Log `[csp-report]` dipantau beberapa hari sebelum CSP diubah ke mode memblokir.
