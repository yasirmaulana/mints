# PRD: MINTS — Kesiapan Produksi di VPS (Performa & Keamanan)

**Versi:** 1.0
**Tanggal:** 23 September 2026
**Status:** Draft
**Dokumen terkait:** `PRD_Ecommerce_Mints.md`, `PRD_Multi_Toko_Langganan.md`

---

## 1. Ringkasan

Vercel menjadi lingkungan **staging**. Produksi pindah ke **VPS**. Sasarannya: melayani **ribuan pengguna bersamaan** dengan aman.

Kepindahan ini mengubah dua hal sekaligus. Pertama, tanggung jawab yang selama ini ditanggung Vercel — TLS, mitigasi DDoS, CDN, penskalaan otomatis, isolasi proses — kini menjadi tanggung jawab kita. Kedua, beberapa asumsi dalam kode saat ini hanya aman karena sifat serverless, dan menjadi tidak aman di server yang berumur panjang.

Dokumen ini dibagi tiga: **cacat yang harus diperbaiki lebih dulu** (§3), **arsitektur produksi** (§4–§9), dan **roadmap** (§12).

> **Penting:** §3 memuat dua cacat keamanan yang sudah aktif di produksi saat ini, bukan risiko yang baru muncul di VPS. Keduanya harus diperbaiki terlepas dari rencana migrasi.

---

## 2. Sasaran Kinerja

Angka di bawah adalah target yang akan diuji, bukan perkiraan.

| Metrik | Target | Cara ukur |
|---|---|---|
| Pengguna bersamaan | 5.000 sesi aktif | Uji beban k6, skenario campuran |
| Throughput katalog | 2.000 req/detik pada `/api/products` | k6, p95 < 200 ms |
| p95 latensi API (baca) | < 200 ms | Diukur di Nginx, bukan di aplikasi |
| p95 latensi API (tulis) | < 500 ms | Checkout end-to-end |
| p99 latensi checkout | < 1,5 detik | Termasuk transaksi DB |
| Tingkat galat saat puncak | < 0,1% | 5xx per total permintaan |
| Waktu muat halaman katalog (LCP) | < 2,5 detik pada 4G | Lighthouse + RUM |
| Ketersediaan | 99,5% bulanan | Uptime probe eksternal |
| Waktu pulih setelah restart | < 30 detik | Zero-downtime deploy |
| RPO / RTO | RPO 5 menit / RTO 1 jam | Uji restore, bukan hanya backup |

**Skenario puncak yang harus tahan:** flash sale. Ribuan pengguna membuka halaman yang sama dan menekan "Beli" dalam hitungan detik pada stok terbatas. Ini menggabungkan beban baca ekstrem dan pertikaian tulis pada baris yang sama — profil beban tersulit di aplikasi ini dan menjadi tolok ukur utama.

---

## 3. Cacat yang Harus Diperbaiki Lebih Dulu

Bagian ini diprioritaskan di atas seluruh pekerjaan infrastruktur. Menambah kapasitas pada aplikasi yang bisa ditembus hanya memperbesar dampak penembusan.

### 3.1 [KRITIS] Cookie sesi pembeli tidak ditandatangani

`buyer_session` berisi **UUID pembeli mentah**, tanpa tanda tangan.

Ditetapkan di [server/api/auth/verify-otp.post.ts:38](server/api/auth/verify-otp.post.ts#L38), [server/routes/auth/google.get.ts:15](server/routes/auth/google.get.ts#L15), [server/api/buyer/profile.patch.ts:23](server/api/buyer/profile.patch.ts#L23). Diterima apa adanya di [server/utils/buyer-auth.ts](server/utils/buyer-auth.ts) dan [server/middleware/buyer-auth.ts](server/middleware/buyer-auth.ts).

**Dampak:** siapa pun yang mengetahui atau menebak UUID seorang pembeli dapat menyetel cookie itu di browsernya dan langsung masuk sebagai pembeli tersebut — membaca pesanan, mengubah profil, melakukan pembayaran. Tidak diperlukan password, OTP, atau token.

UUID v4 memang sulit ditebak secara acak, tetapi ia **bukan rahasia**: nilai yang sama bisa muncul di log, respons API, referensi pihak ketiga, atau tautan. Keamanan sesi tidak boleh bergantung pada kerahasiaan sebuah pengenal basis data.

Kontrasnya, sesi admin **sudah benar** — [server/utils/auth.ts](server/utils/auth.ts) memakai token bertanda tangan HMAC dengan versi, stempel waktu, masa berlaku, dan perbandingan waktu-konstan.

**Perbaikan:** terapkan pola yang sama untuk sesi pembeli. Token `v1.<buyerId>.<issuedAt>.<hmac>`, masa berlaku eksplisit, verifikasi terpusat. Ini menjadi lebih mendesak lagi dengan PRD multi-toko: setelah pembeli bisa menjadi penjual, cookie yang dapat dipalsukan berarti pengambilalihan toko beserta katalog dan pesanannya.

> Dampak pada pengguna: seluruh sesi pembeli yang sedang berjalan akan logout saat perbaikan ini dirilis. Ini konsekuensi yang wajar dan perlu dikomunikasikan.

### 3.2 [KRITIS] Rate limit tidak pernah menolak permintaan

`checkRateLimit()` di [server/utils/rate-limit.ts:56](server/utils/rate-limit.ts#L56) adalah fungsi `async`. Keempat pemanggilnya memanggilnya **tanpa `await`**:

- [server/api/auth/send-otp.post.ts:6](server/api/auth/send-otp.post.ts#L6)
- [server/api/auth/verify-otp.post.ts:3](server/api/auth/verify-otp.post.ts#L3)
- [server/api/admin/login.post.ts:6](server/api/admin/login.post.ts#L6)
- [server/api/chat/start.post.ts:3](server/api/chat/start.post.ts#L3)

`throw` di dalam fungsi `async` menghasilkan Promise yang ditolak, bukan pengecualian sinkron. Karena Promise itu tidak ditunggu, handler **terus berjalan** seolah pemeriksaan lolos. Galat 429 tidak pernah sampai ke klien.

**Dampak:** tidak ada pembatasan laju pada login admin (brute force password), pengiriman OTP (penyalahgunaan kuota SMTP dan pembanjiran inbox), verifikasi OTP (penebakan kode 6 digit), dan pembuatan sesi chat.

Pemeriksaan OTP paling merugikan: kode numerik pendek tanpa batas percobaan dapat ditebak habis-habisan.

**Perbaikan:** tambahkan `await` di keempat pemanggil. Sebagai pengaman agar cacat serupa tidak terulang, ubah tipe kembalian menjadi sesuatu yang membuat pemanggilan tanpa `await` gagal saat kompilasi, atau tambahkan aturan lint `no-floating-promises`.

> Perbaikan ini kecil dan berdiri sendiri. Kerjakan segera, jangan menunggu migrasi VPS.

### 3.3 [TINGGI] Oversell stok pada permintaan bersamaan

[server/api/checkout/regular.post.ts](server/api/checkout/regular.post.ts) memeriksa stok lalu menguranginya:

```ts
const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } })
if (!variant || variant.stock < item.qty) throw ...
await tx.productVariant.update({ data: { stock: { decrement: item.qty } } })
```

`decrement` memang atomik, tetapi **pemeriksaan sebelumnya tidak**. Pada isolasi `READ COMMITTED` (default PostgreSQL), dua transaksi bersamaan dapat sama-sama membaca `stock = 1`, sama-sama lolos pemeriksaan, dan sama-sama mengurangi — menyisakan stok `-1` dan dua pesanan untuk satu barang.

Di Vercel hal ini jarang terjadi karena permintaan tersebar di banyak instance dingin. Di VPS dengan koneksi *keep-alive* dan konkurensi jauh lebih tinggi — apalagi saat flash sale, yang justru dirancang untuk memusatkan permintaan pada detik yang sama — peluangnya meningkat drastis.

**Perbaikan:** jadikan pemeriksaan dan pengurangan satu operasi tunggal:

```ts
const res = await tx.productVariant.updateMany({
  where: { id: item.variantId, stock: { gte: item.qty } },
  data: { stock: { decrement: item.qty } }
})
if (res.count === 0) throw createError({ statusCode: 409, statusMessage: 'Stok tidak cukup' })
```

Database yang memutuskan, bukan aplikasi. Tambahkan pula batasan tingkat basis data `CHECK (stock >= 0)` sebagai jaring pengaman terakhir.

> Alur flash sale existing sudah memakai atomic checkout. Endpoint checkout reguler inilah yang belum.

### 3.4 [TINGGI] Proxy gambar memuat seluruh berkas ke memori

[server/api/s3-image/[...path].get.ts](server/api/s3-image/[...path].get.ts) mengumpulkan seluruh isi objek ke dalam array `chunks` sebelum mengembalikannya.

Untuk foto 2 MB ini boros namun tertahankan. Setelah fitur video masuk (PRD multi-toko, video hingga 200 MB), 20 permintaan video bersamaan berarti **4 GB memori** — proses Node akan kehabisan memori dan mati, memutus seluruh permintaan lain yang sedang dilayaninya.

**Perbaikan:** alirkan (*stream*) badan respons langsung ke klien alih-alih menampungnya, dan **jangan layani media lewat Node sama sekali** di produksi (lihat §6).

### 3.5 [SEDANG] Endpoint katalog tanpa paginasi

[server/api/products/index.get.ts](server/api/products/index.get.ts) menjalankan `findMany` tanpa `take`/`skip`, menyertakan seluruh `variants` dan satu `orders` untuk **setiap** produk.

Dengan katalog satu toko, ini wajar. Dengan marketplace multi-toko berisi ribuan produk, setiap permintaan ke halaman terpopuler akan mengambil seluruh katalog beserta relasinya. Ini akan menjadi sumber kelambatan tunggal terbesar.

**Perbaikan:** paginasi berbasis kursor (bukan `offset`, yang melambat pada halaman jauh), pilih kolom seperlunya dengan `select`, dan ganti `include: { orders: ... }` — yang hanya dipakai untuk menutupi nomor telepon — dengan kolom terdenormalisasi pada `Product`.

### 3.6 [SEDANG] Rate limit dalam memori tidak berlaku lintas proses

Fallback `checkInMemory` di [server/utils/rate-limit.ts:37](server/utils/rate-limit.ts#L37) menyimpan hitungan di `Map` lokal proses. Di VPS dengan mode cluster (§4.2), setiap worker punya `Map` sendiri — batas efektif menjadi `max × jumlah_worker`, dan hitungan hilang setiap restart.

**Perbaikan:** Redis menjadi **wajib** di produksi, bukan opsional. Aplikasi harus menolak start di produksi bila Redis tidak terkonfigurasi, alih-alih diam-diam turun ke fallback yang tidak memadai.

---

## 4. Arsitektur Produksi

### 4.1 Topologi

```
           Internet
              │
        [ Cloudflare ]        TLS, DDoS, WAF, CDN, cache statis
              │
         [ Nginx ]            TLS terminasi, reverse proxy, rate limit,
              │               gzip/brotli, file statis, header keamanan
              │
    ┌─────────┴─────────┐
    │   Node cluster    │     4–8 worker Nuxt/Nitro (PM2)
    └─────────┬─────────┘
              │
    ┌─────────┼──────────┬──────────────┐
    │         │          │              │
[PgBouncer]  [Redis]   [S3]      [Layanan luar]
    │                              Duitku, Fonnte,
[PostgreSQL]                       Raja Ongkir, SMTP
  primary
    │
[Replika baca]  (opsional, tahap lanjut)
```

### 4.2 Lapisan Aplikasi

Node berjalan satu-utas. Satu proses tidak akan memakai lebih dari satu inti CPU, berapa pun besar VPS-nya.

| Aspek | Keputusan |
|---|---|
| Manajer proses | PM2 mode `cluster`, `instances` = jumlah inti CPU |
| Port | Node mengikat `127.0.0.1` saja; hanya Nginx yang boleh menjangkaunya |
| Zero-downtime | `pm2 reload` — worker diganti bergantian |
| Batas memori | `max_memory_restart: 800M` per worker |
| Keadaan dalam proses | **Tidak boleh ada.** Seluruh keadaan bersama di Redis atau PostgreSQL (lihat §3.6) |
| Graceful shutdown | Tangani `SIGTERM`: hentikan penerimaan koneksi baru, tuntaskan permintaan berjalan, tutup koneksi Prisma |
| Pengguna sistem | Proses berjalan sebagai pengguna tanpa hak istimewa, bukan root |

### 4.3 Nginx

| Fungsi | Konfigurasi |
|---|---|
| TLS | TLS 1.2+1.3 saja, sertifikat Let's Encrypt, auto-renew, HSTS `max-age=31536000; includeSubDomains; preload` |
| Kompresi | Brotli untuk teks/JSON, gzip sebagai cadangan |
| Rate limit lapis pertama | `limit_req_zone` per IP: 30 r/s umum, 5 r/s untuk `/api/auth/*` dan `/api/admin/login` |
| Batas koneksi | `limit_conn` 20 per IP |
| Batas body | 1 MB umum; hanya rute unggah yang dinaikkan |
| Timeout | `proxy_read_timeout 30s`, `client_body_timeout 10s` (mitigasi Slowloris) |
| Buffer | Aktif, agar klien lambat tidak menahan worker Node |
| Header respons | `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, CSP (§8.3) |
| Header yang dibuang | `Server`, `X-Powered-By` |

Rate limit Nginx adalah lapis pertama (murah, berbasis IP). Rate limit aplikasi di Redis adalah lapis kedua (berbasis identitas: email, akun, toko). Keduanya diperlukan — IP dapat dibagi banyak pengguna di jaringan seluler Indonesia, dan satu akun dapat berpindah IP.

### 4.4 Basis Data

Prisma Accelerate ([server/utils/prisma.ts](server/utils/prisma.ts)) adalah layanan pooling milik Prisma untuk lingkungan serverless. Di VPS, pooling ditangani sendiri — lebih cepat (tanpa lompatan jaringan tambahan) dan tanpa biaya per permintaan. Kode existing sudah memilih klien berdasarkan skema `DATABASE_URL`, jadi produksi cukup memakai URL PostgreSQL langsung tanpa perubahan kode.

| Aspek | Keputusan |
|---|---|
| Pooling | PgBouncer, mode `transaction` |
| Ukuran pool | `default_pool_size` 25, `max_client_conn` 1000 |
| Koneksi Prisma | `connection_limit` per worker = `pool_size / jumlah_worker` |
| PostgreSQL | v16; `max_connections` 200 (PgBouncer yang menampung sisanya) |
| Setelan memori | `shared_buffers` 25% RAM, `effective_cache_size` 60% RAM, `work_mem` disetel dari profil kueri |
| Kueri lambat | `log_min_duration_statement = 300ms` |
| Ekstensi | `pg_stat_statements` untuk menemukan kueri terberat |
| Backup | WAL archiving berkelanjutan + basebackup harian ke penyimpanan luar server |
| Uji restore | Bulanan, terjadwal. Backup yang belum pernah dipulihkan bukan backup. |

> Catatan PgBouncer mode `transaction`: prepared statement tidak didukung. Tambahkan `pgbouncer=true` pada connection string Prisma. Ini harus diuji di staging sebelum produksi — gejalanya muncul sebagai galat sporadis di bawah beban, bukan saat pengujian ringan.

**Indeks yang diperlukan** (di luar yang sudah ada di skema):

| Tabel | Indeks | Alasan |
|---|---|---|
| `Product` | `(storeId, status, createdAt DESC)` | Kueri katalog utama |
| `Product` | `(categoryId, status)` | Filter kategori |
| `Product` | GIN `to_tsvector(title)` | Pencarian teks (lihat catatan) |
| `Order` | `(storeId, status, createdAt DESC)` | Dashboard penjual |
| `Order` | `(buyerId, createdAt DESC)` | Riwayat pesanan pembeli |
| `ProductVariant` | `(productId, stock)` | Pemeriksaan stok |
| `EmailOtp` | `(email, expiresAt)` | Verifikasi OTP |
| `Store` | `(status, expiresAt)` | Cron expiry |

**Catatan pencarian:** `where.title = { contains: search, mode: 'insensitive' }` pada [server/api/products/index.get.ts](server/api/products/index.get.ts) diterjemahkan menjadi `ILIKE '%…%'`, yang **tidak dapat memakai indeks B-tree** dan memaksa pemindaian seluruh tabel. Pada katalog marketplace, ini akan menjadi kueri paling lambat di aplikasi. Ganti dengan pencarian teks penuh PostgreSQL (`tsvector` + indeks GIN), atau indeks trigram `pg_trgm` bila pencocokan sebagian tetap dibutuhkan.

### 4.5 Redis

Satu instance Redis melayani beberapa keperluan, dipisahkan dengan awalan kunci:

| Keperluan | Awalan | Catatan |
|---|---|---|
| Rate limiting | `rl:` | Menggantikan fallback dalam memori |
| Cache respons API | `cache:` | Katalog, kategori, ongkir |
| Cache ongkir Raja Ongkir | `ship:` | TTL 6 jam; tarif jarang berubah dan API pihak ketiga punya kuota |
| Kunci idempotensi | `idem:` | Callback Duitku (§8.5) |
| Antrean pekerjaan | `bull:` | Notifikasi WA/email, sinkronisasi tracking |
| Penanda anti-berulang | `once:` | Mencegah cron berjalan ganda lintas worker |

Redis diikat ke `127.0.0.1`, memakai password, dengan perintah berbahaya (`FLUSHALL`, `CONFIG`, `KEYS`) dinonaktifkan. `maxmemory-policy` disetel `allkeys-lru` untuk cache; bila antrean pekerjaan ditaruh di instance yang sama, pakai database Redis terpisah dengan kebijakan `noeviction` — pekerjaan yang tergusur berarti notifikasi yang hilang.

### 4.6 Pekerjaan Latar (Job Queue)

Saat ini notifikasi WhatsApp dikirim di dalam siklus permintaan. Bila Fonnte lambat atau mati, pengguna ikut menunggu, dan worker Node tertahan.

Pindahkan ke antrean (BullMQ di atas Redis), dengan proses worker terpisah dari PM2:

| Pekerjaan | Pemicu |
|---|---|
| Notifikasi WA & email | Perubahan status pesanan |
| Sinkronisasi tracking | Terjadwal, per pengiriman aktif |
| Expiry toko + peringatan H-7/H-3/H-1 | Cron harian |
| Rekonsiliasi counter kuota | Cron harian |
| Pembersihan media tak terkonfirmasi | Cron harian |
| Pembersihan OTP kedaluwarsa | Cron per jam |

Manfaat sampingan: percobaan ulang dengan *exponential backoff* saat layanan pihak ketiga bermasalah, dan permintaan pengguna tidak lagi bergantung pada ketersediaan Fonnte.

---

## 5. Strategi Caching

Empat lapis, dari yang termurah:

| Lapis | Isi | TTL | Invalidasi |
|---|---|---|---|
| Cloudflare | Aset statis, gambar produk | 1 tahun (ber-hash) | Nama berkas ber-hash |
| Cloudflare | Respons katalog publik | 60 detik + SWR 300 detik | Purge lewat API saat produk berubah |
| Redis | Kueri katalog, kategori, ongkir | 60 detik – 6 jam | Hapus kunci saat mutasi |
| Nuxt/Nitro | Halaman statis (FAQ, kebijakan, panduan ukuran) | Prerender saat build | Deploy ulang |

Halaman yang sepenuhnya statis — [pages/faq.vue](pages/faq.vue), [pages/privasi.vue](pages/privasi.vue), [pages/syarat-ketentuan.vue](pages/syarat-ketentuan.vue), [pages/kebijakan-pengembalian.vue](pages/kebijakan-pengembalian.vue), [pages/panduan-ukuran.vue](pages/panduan-ukuran.vue), [pages/tentang-kami.vue](pages/tentang-kami.vue) — seharusnya diprerender dan disajikan Nginx tanpa menyentuh Node sama sekali.

**Yang tidak boleh di-cache:** apa pun yang bergantung pada sesi (pesanan, profil, dashboard penjual), ketersediaan stok flash sale, dan seluruh respons dengan header `Set-Cookie`. Kesalahan cache pada respons bersesi berarti data satu pengguna tersaji ke pengguna lain — kegagalan keamanan, bukan sekadar bug.

**Countdown flash sale** harus tetap disinkronkan ke waktu server (sudah tercatat di PRD e-commerce). Waktu server tidak boleh diambil dari respons ter-cache.

---

## 6. Penyajian Media

Sekarang seluruh gambar melewati Node lewat `/api/s3-image/`. Setiap gambar adalah satu permintaan yang menempati worker Node — pemborosan terbesar dan termudah dihilangkan.

**Target:** Node tidak menyajikan berkas media sama sekali.

| Urutan prioritas | Pendekatan |
|---|---|
| 1 | Cloudflare men-cache `/api/s3-image/*` dengan TTL panjang. Perubahan konfigurasi saja; origin hanya terkena permintaan pertama. |
| 2 | Nginx `proxy_pass` + `proxy_cache` langsung ke S3, melewati Node sepenuhnya |
| 3 | Bucket publik + CDN di depannya, bila media memang tidak rahasia |

Pendekatan 1 dan 2 mempertahankan bucket tetap privat. Header `Cache-Control: public, max-age=31536000, immutable` yang sudah ada di proxy sudah benar dan akan dimanfaatkan kedua pendekatan.

Unggah video lewat *presigned URL* (PRD multi-toko §7.4) berarti video **tidak pernah melewati Node** baik saat unggah maupun saat disajikan. Batas body Vercel tidak lagi relevan di VPS, tetapi pertimbangan memori tetap berlaku: mengalirkan 200 MB lewat proses aplikasi adalah pemborosan sumber daya yang tidak perlu.

**Optimasi gambar** (mengurangi bandwidth dan memperbaiki LCP):

- Bangkitkan varian WebP/AVIF saat unggah, lewat antrean pekerjaan
- Bangkitkan thumbnail (300px, 800px) untuk listing; jangan kirim gambar penuh ke grid katalog
- `loading="lazy"` + `srcset` di komponen katalog

---

## 7. Optimasi Frontend

| Area | Tindakan |
|---|---|
| Font | Geist + Inter Tight dimuat dari Google Fonts di [nuxt.config.ts](nuxt.config.ts) — satu permintaan pemblokir render ke domain pihak ketiga. Self-host dengan `font-display: swap`, hanya bobot yang dipakai. |
| Ukuran bundel | Audit dengan `nuxi analyze`; targetkan JS awal < 200 KB terkompresi |
| Pemecahan kode | Rute admin dan dashboard penjual dimuat malas; pembeli tidak perlu mengunduhnya |
| Ikon | Pastikan `@nuxt/ui` hanya memuat ikon yang dipakai, bukan seluruh set |
| Hidrasi | Komponen non-interaktif (kartu produk, footer) dirender server tanpa hidrasi |
| Gambar | `<NuxtImg>` dengan `srcset` dan lazy loading |
| Prefetch | Prefetch tautan produk saat kursor/sentuhan mendekat |

---

## 8. Keamanan

### 8.1 Pengerasan Server

| Area | Tindakan |
|---|---|
| Firewall | UFW: hanya 22, 80, 443 terbuka. PostgreSQL dan Redis **tidak boleh** terjangkau dari internet. |
| SSH | Autentikasi kunci saja, login root dimatikan, port non-standar, fail2ban |
| Pembaruan | `unattended-upgrades` untuk patch keamanan |
| Pengguna | Aplikasi berjalan sebagai pengguna tanpa hak istimewa |
| Isolasi | Docker Compose atau systemd dengan `ProtectSystem=strict`, `NoNewPrivileges` |
| Rahasia | Berkas `.env` dengan izin `600`, di luar direktori aplikasi. **`.env` yang ada sekarang berisi kredensial produksi — pastikan tidak pernah masuk ke Git dan rotasi seluruh kunci yang pernah tersentuh repositori.** |
| Audit | `auditd` untuk berkas sensitif |

### 8.2 Kebersihan Rahasia

Migrasi ke VPS adalah momen yang tepat untuk merotasi seluruh kredensial: kunci Duitku, token Fonnte, kunci S3, `SESSION_SECRET`, password SMTP, kunci Raja Ongkir. Nilai yang pernah ada di lingkungan Vercel, di transkrip CI, atau di riwayat repositori harus dianggap terekspos.

`SESSION_SECRET` khususnya: merotasinya membatalkan seluruh sesi admin dan pembeli yang berjalan. Lakukan bersamaan dengan perbaikan §3.1, yang toh sudah membuat semua pengguna logout.

### 8.3 Content Security Policy

Belum ada CSP. Ini pertahanan utama terhadap XSS — relevan karena konten buatan penjual (nama toko, deskripsi produk) akan tampil di halaman publik setelah PRD multi-toko.

Kebijakan awal, disetel di Nginx:

```
default-src 'self';
script-src 'self' https://www.google.com https://www.gstatic.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
media-src 'self' https:;
connect-src 'self' https://www.google.com;
frame-src https://www.google.com https://app.duitku.com https://sandbox.duitku.com;
form-action 'self' https://app.duitku.com;
base-uri 'self';
object-src 'none';
frame-ancestors 'none';
```

Terapkan `Content-Security-Policy-Report-Only` terlebih dahulu, kumpulkan laporan pelanggaran, baru tegakkan. `'unsafe-inline'` pada `style-src` diperlukan Tailwind/Nuxt UI untuk saat ini; hilangkan dengan nonce bila memungkinkan.

### 8.4 Validasi Masukan

Saat ini validasi tersebar sebagai pemeriksaan manual di tiap handler (lihat [server/api/checkout/regular.post.ts](server/api/checkout/regular.post.ts)). Pendekatan ini mudah tertinggal saat endpoint bertambah — dan endpoint akan bertambah banyak dengan PRD multi-toko.

Adopsi validasi berbasis skema (Zod) di seluruh endpoint: satu skema per endpoint, ditegakkan sebelum logika apa pun berjalan, dengan tipe yang diturunkan dari skema sehingga handler tidak dapat mengakses field yang belum divalidasi.

Prioritas: seluruh endpoint tulis, terutama yang menerima jumlah uang, ID, atau berkas.

### 8.5 Idempotensi Callback Pembayaran

[server/api/payment/callback.post.ts](server/api/payment/callback.post.ts) menerima callback Duitku. Payment gateway **mengirim ulang** callback bila tidak menerima 200 — perilaku normal, bukan anomali.

Tanpa penjagaan idempotensi, callback ganda dapat menandai pesanan lunas dua kali, atau (setelah PRD multi-toko) memperpanjang masa langganan dua periode untuk satu pembayaran.

**Perbaikan:** kunci idempotensi di Redis berdasarkan referensi Duitku, dan perubahan status hanya dilakukan lewat pembaruan bersyarat (`updateMany where status = 'PENDING_PAYMENT'`) sehingga transisi hanya terjadi sekali.

Verifikasi tanda tangan callback wajib tetap ada — status pesanan tidak boleh berubah berdasarkan parameter redirect di browser, hanya berdasarkan callback tervalidasi dari sisi server.

### 8.6 Perlindungan Lapis Jaringan

| Ancaman | Penanganan |
|---|---|
| DDoS volumetrik | Cloudflare proxy; IP asal VPS tidak diumumkan |
| Serangan lapis aplikasi | Aturan WAF Cloudflare + rate limit Nginx |
| Bot pada endpoint auth | reCAPTCHA (sudah ada) + rate limit yang benar-benar berjalan (§3.2) |
| Bot pembeli flash sale | Rate limit per akun, bukan hanya per IP |
| Penyalahgunaan enumerasi | Respons galat seragam pada endpoint auth; jangan membocorkan apakah email terdaftar |

### 8.7 Perlindungan Data Pribadi

Basis data memuat nama, nomor telepon, email, dan alamat lengkap pembeli.

| Tindakan | Keterangan |
|---|---|
| Enkripsi diam | Disk terenkripsi di VPS; backup terenkripsi |
| Enkripsi transit | TLS ke klien; TLS ke PostgreSQL bila tidak satu host |
| Penyamaran di log | Nomor telepon, email, dan alamat tidak boleh masuk log aplikasi |
| Pembatasan akses | Kredensial basis data produksi tidak dipakai untuk kueri ad-hoc |
| Retensi | Kebijakan penghapusan data pesanan lama dan OTP |
| Isolasi multi-toko | Penjual tidak boleh melihat data pembeli di luar pesanan ke tokonya sendiri |

Poin terakhir menjadi penting setelah PRD multi-toko: penjual adalah **pihak luar** terhadap data pembeli, bukan orang dalam. Endpoint penjual hanya boleh mengembalikan data pembeli sejauh yang diperlukan untuk memenuhi pesanan.

---

## 9. Observabilitas

Tanpa pengamatan, laporan pertama tentang masalah produksi datang dari pengguna.

| Lapis | Alat | Yang diamati |
|---|---|---|
| Uptime | Probe eksternal (UptimeRobot/Betterstack) | Ketersediaan, dari luar jaringan |
| Metrik | Prometheus + Grafana | CPU, RAM, koneksi DB, ukuran pool, kedalaman antrean, tingkat galat, p95/p99 |
| Log | Pino (JSON) + Loki, atau syslog terpusat | Log terstruktur, ID permintaan, **tanpa data pribadi** |
| Galat | Sentry (self-host atau SaaS) | Pengecualian dengan jejak tumpukan |
| Kinerja DB | `pg_stat_statements` + Grafana | Kueri paling lambat dan paling sering |
| Pengalaman nyata | Web Vitals RUM | LCP, INP, CLS dari perangkat pengguna |

**Peringatan yang harus ada:**

| Kondisi | Ambang |
|---|---|
| Tingkat galat 5xx | > 1% selama 5 menit |
| p95 latensi | > 1 detik selama 5 menit |
| Pool koneksi DB | > 80% terpakai |
| Kedalaman antrean pekerjaan | > 1.000 pekerjaan |
| Ruang disk | < 20% tersisa |
| Sertifikat TLS | < 14 hari menuju kedaluwarsa |
| Backup | Backup harian gagal atau tidak berjalan |

Health check `/api/health` yang memeriksa konektivitas basis data dan Redis, dipakai PM2 dan probe eksternal. Health check yang hanya mengembalikan 200 tanpa memeriksa dependensi tidak memberi tahu apa pun.

---

## 10. Uji Beban

Target di §2 harus diverifikasi, bukan diasumsikan. Uji dijalankan di staging dengan spesifikasi setara produksi dan data sintetis berskala realistis (ribuan produk, ratusan toko).

| Skenario | Profil |
|---|---|
| Telusur katalog | 5.000 pengguna virtual, baca-berat, pertumbuhan bertahap |
| Puncak flash sale | 3.000 pengguna menyerbu satu produk stok terbatas dalam 10 detik |
| Checkout bersamaan | 500 checkout/menit, verifikasi **tidak ada oversell** (§3.3) |
| Unggah media | 100 unggahan bersamaan, verifikasi kuota tetap tegak |
| Uji rendam | Beban sedang selama 12 jam, cari kebocoran memori |
| Uji patah | Naikkan beban sampai gagal; catat titik patah dan penyebabnya |

Alat: k6. Skenario disimpan di repositori dan dijalankan sebelum setiap rilis besar.

Kriteria lulus yang paling penting: **uji flash sale harus berakhir dengan jumlah pesanan persis sama dengan stok tersedia.** Satu pesanan berlebih berarti cacat §3.3 belum benar-benar tertutup.

---

## 11. Spesifikasi & Perkiraan Kapasitas

Titik awal untuk 5.000 pengguna bersamaan. Angka final ditentukan hasil uji beban, bukan perkiraan ini.

| Komponen | Spesifikasi awal |
|---|---|
| VPS aplikasi | 8 vCPU, 16 GB RAM, NVMe 200 GB |
| VPS basis data | 4 vCPU, 16 GB RAM, NVMe 200 GB (terpisah dari aplikasi) |
| Redis | Satu host dengan aplikasi pada awalnya; pisahkan bila beban meningkat |
| Bandwidth | Estimasi dari ukuran media × tampilan halaman; Cloudflare menyerap sebagian besar |

**Mengapa basis data dipisahkan:** aplikasi dan PostgreSQL bersaing memperebutkan RAM dan I/O. Ketika satu proses Node bocor memori, ia tidak boleh membawa serta basis data. Pemisahan ini juga memungkinkan penskalaan horizontal lapis aplikasi nanti.

**Jalur penskalaan bila satu VPS tidak cukup:** tambah node aplikasi di belakang load balancer (aplikasi sudah tanpa keadaan lokal bila §3.6 dituntaskan) → tambah replika baca PostgreSQL untuk kueri katalog → pisahkan Redis ke host sendiri.

---

## 12. Roadmap

### Fase 0 — Perbaikan Kritis (3 hari) — **kerjakan segera, tanpa menunggu migrasi**
- [ ] Tandatangani sesi pembeli dengan HMAC (§3.1)
- [ ] `await checkRateLimit` di empat pemanggil + aturan lint (§3.2)
- [ ] Checkout atomik dengan `updateMany` bersyarat + `CHECK (stock >= 0)` (§3.3)
- [ ] Rotasi seluruh rahasia, verifikasi `.env` tidak ada di Git (§8.2)
- [ ] Uji: sesi palsu ditolak, rate limit mengembalikan 429, checkout bersamaan tidak oversell

### Fase 1 — Fondasi Infrastruktur (1 minggu)
- [ ] Penyediaan VPS, pengerasan server, firewall, SSH, fail2ban (§8.1)
- [ ] PostgreSQL + PgBouncer, setelan memori, backup + **uji restore**
- [ ] Redis dengan password, terikat lokal
- [ ] Nginx: TLS, kompresi, rate limit, header keamanan
- [ ] PM2 cluster, graceful shutdown, deploy zero-downtime
- [ ] Cloudflare di depan, IP asal disembunyikan

### Fase 2 — Kinerja Basis Data & API (1 minggu)
- [ ] Paginasi kursor + `select` seperlunya pada endpoint katalog (§3.5)
- [ ] Pencarian teks penuh menggantikan `ILIKE` (§4.4)
- [ ] Seluruh indeks pada §4.4
- [ ] `pg_stat_statements` aktif, tiga kueri terlambat diperbaiki
- [ ] Caching Redis untuk katalog, kategori, ongkir

### Fase 3 — Media & Frontend (1 minggu)
- [ ] Media disajikan lewat Cloudflare/Nginx, bukan Node (§6)
- [ ] Alirkan respons proxy alih-alih menampungnya di memori (§3.4)
- [ ] Varian WebP/AVIF + thumbnail lewat antrean
- [ ] Self-host font, audit bundel, pemecahan kode
- [ ] Prerender halaman statis

### Fase 4 — Antrean & Ketahanan (1 minggu)
- [ ] BullMQ + proses worker terpisah (§4.6)
- [ ] Notifikasi WA/email dipindah ke antrean dengan percobaan ulang
- [ ] Seluruh cron dipindah ke antrean terjadwal
- [ ] Idempotensi callback pembayaran (§8.5)
- [ ] Circuit breaker untuk Duitku, Fonnte, Raja Ongkir

### Fase 5 — Keamanan & Observabilitas (1 minggu)
- [ ] Validasi Zod di seluruh endpoint tulis (§8.4)
- [ ] CSP mode laporan → tegakkan (§8.3)
- [ ] Prometheus + Grafana + dasbor
- [ ] Log terstruktur dengan penyamaran data pribadi
- [ ] Sentry + peringatan (§9)
- [ ] `/api/health` yang memeriksa dependensi

### Fase 6 — Validasi (3 hari)
- [ ] Suite k6 lengkap (§10)
- [ ] Uji patah, catat titik patah
- [ ] Uji rendam 12 jam
- [ ] Setel ulang berdasarkan temuan
- [ ] Uji pemulihan bencana: bangun ulang dari backup, ukur RTO

---

## 13. Keputusan Arsitektur

| Keputusan | Alasan |
|---|---|
| Vercel untuk staging, VPS untuk produksi | Vercel memudahkan pratinjau per-branch; VPS memberi kendali kinerja dan biaya yang dapat diprediksi pada beban tinggi |
| PgBouncer menggantikan Prisma Accelerate | Accelerate dirancang untuk serverless. Di VPS, pooling lokal lebih cepat dan tanpa biaya per permintaan. Kode existing sudah memilih klien dari skema URL — tanpa perubahan kode. |
| Redis wajib, bukan opsional | Fallback dalam memori tidak benar di mode cluster (§3.6). Diam-diam turun ke fallback yang salah lebih berbahaya daripada gagal start. |
| Cloudflare di depan Nginx | Mitigasi DDoS dan CDN global tidak praktis dibangun sendiri |
| Basis data di VPS terpisah | Mencegah aplikasi dan basis data berebut sumber daya; membuka jalan penskalaan horizontal |
| Antrean pekerjaan, bukan pemanggilan dalam permintaan | Fonnte dan Duitku lambat atau mati sesekali; pengguna tidak boleh ikut menunggu |
| Media tidak lewat Node | Setiap permintaan gambar menempati worker aplikasi — pemborosan terbesar yang paling mudah dihilangkan |
| Data melewati kuota tidak dihapus otomatis | Konsisten dengan PRD multi-toko §7.3 |
| Perbaikan keamanan mendahului pekerjaan skala | Menambah kapasitas pada aplikasi yang bisa ditembus hanya memperbesar dampak penembusan |

---

## 14. Di Luar Cakupan

- Kubernetes / orkestrasi multi-node — berlebihan pada skala ini; tinjau ulang bila satu node aplikasi tidak lagi cukup
- Replika baca PostgreSQL — tambahkan setelah uji beban menunjukkan primary menjadi hambatan
- Multi-region — tidak relevan untuk basis pengguna Indonesia
- Penskalaan otomatis — kapasitas tetap yang disetel dari uji beban sudah memadai sampai polanya terbukti tidak cukup
- Audit keamanan pihak ketiga / uji penetrasi — direkomendasikan setelah fitur multi-toko rilis, karena saat itu permukaan serangan berubah

---

## 15. Pertanyaan Terbuka

| Pertanyaan | Dampak |
|---|---|
| Penyedia VPS dan wilayahnya? | Memengaruhi latensi ke pengguna Indonesia dan opsi backup |
| Berapa anggaran infrastruktur bulanan? | Menentukan pemisahan basis data, Redis terkelola, dan tingkatan Cloudflare |
| Siapa yang bertanggung jawab operasional (on-call)? | Menentukan kedalaman otomasi dan kebijakan peringatan |
| Apakah `.env` produksi pernah masuk riwayat Git? | Bila ya, seluruh rahasia harus dianggap bocor dan dirotasi segera |
| Berapa lama toleransi downtime saat migrasi? | Menentukan strategi cutover: pemadaman terjadwal atau replikasi berjalan |
| Apakah 5.000 pengguna bersamaan adalah target nyata atau sasaran ambisi? | Memengaruhi spesifikasi awal; kapasitas berlebih adalah biaya yang terbuang |
