# Progress Implementasi — Multi Toko & Langganan

Acuan: `PRD_Multi_Toko_Langganan.md`. Scope PRD ini besar (6 fase, migrasi skema, payment, video).
Sesi ini mengerjakan **Fase 1: Fondasi Multi-Toko** secara utuh dan bisa dipakai — skema, migrasi
data aman, penegakan kuota, endpoint aktivasi, dan halaman toko publik dasar. **Fase 1 backend +
frontend selesai.** Fase 2–6 dicatat sebagai pending di bawah.

Legenda: ✅ selesai · 🔧 sedang dikerjakan · ⬜ belum dikerjakan

## Fase 1 — Fondasi Multi-Toko

### Skema & Data
- ✅ Skema Prisma: enum `PlanTier`/`StoreStatus`/`SubscriptionStatus`, model `Plan`/`Store`/`StoreMedia`/`Subscription`, kolom tambahan di `Product`/`Order`/`FlashSaleConfig`/`ChatSession` (semua additive, diverifikasi via `prisma migrate diff` sebelum `db push`)
- ✅ Seed 4 paket (FREE/PREMIUM/GOLD/PLATINUM) — `prisma/seed-plans.js` (harga masih placeholder, lihat PRD §14)
- ✅ Backfill data lama ke toko resmi platform (slug `mints`) — `prisma/migrate-backfill-store.js`, terverifikasi 0 Product/Order tanpa `storeId`

### Backend — util inti
- ✅ `server/utils/plan-limits.ts` — satu sumber kebenaran kuota (getStoreContext, assertCanCreateStore, assertCanAddProduct, assertVariantCount, assertMediaAllowed, assertCanCreateFlashSale, buildQuotaSummary)
- ✅ `server/utils/slug.ts` — validasi & generate slug toko

### Backend — endpoint toko (pemilik)
- ✅ `GET /api/plans` — daftar paket publik
- ✅ `POST /api/store` — aktivasi toko (Fase 1: hanya paket FREE, paket berbayar ditolak eksplisit sampai Fase 4/payment ada)
- ✅ `GET /api/store/mine` — daftar toko milik buyer + ringkasan kuota
- ✅ `GET /api/store/[id]` — detail toko + kuota
- ✅ `GET /api/store/[id]/quota` — ringkasan kuota (dipisah dari detail untuk polling ringan di dashboard)
- ✅ `PATCH /api/store/[id]` — edit profil toko (slug sengaja tidak bisa diubah)
- ✅ `GET/POST /api/store/[id]/products` — listing & tambah produk milik toko (enforce assertCanAddProduct/assertMediaAllowed/assertVariantCount)
- ✅ `PATCH/DELETE /api/store/[id]/products/[pid]`

### Backend — endpoint publik
- ✅ `GET /api/stores/[slug]` — profil toko publik (404 untuk status non-ACTIVE, PRD §6.4)
- ✅ `GET /api/stores/[slug]/products` — katalog produk toko, dipaginasi (max 50/halaman)
- ✅ `GET /api/stores` — direktori toko aktif, dipaginasi, diurutkan by searchPriority paket

### Frontend
- ✅ `/account` — kartu "Toko Saya" + tombol "Buka Toko" / "Kelola Toko"
- ✅ `/toko/aktivasi` — form aktivasi toko (paket FREE)
- ✅ `/toko/dashboard` — ringkasan kuota, status, link ke produk & halaman publik
- ✅ `/toko/produk` — kelola produk toko (tambah dengan upload foto, hapus)
- ✅ `/toko/[slug]` — halaman toko publik (SSR via useFetch, JSON-LD, 404 untuk toko non-ACTIVE)

## Fase 2 — Dashboard Penjual & Kuota

- ✅ CRUD produk milik toko dengan penegakan kuota (sudah ada dari Fase 1: `assertCanAddProduct`/`assertMediaAllowed`/`assertVariantCount`)
- ✅ Indikator sisa kuota di UI — progress bar produk & storage di `/toko/dashboard` (merah ≥90%, kuning ≥70%)
- ✅ Manajemen pesanan per toko — `GET /api/store/[id]/orders`, `PATCH /api/store/[id]/orders/[oid]/status` (status terbatas: IN_PRODUCTION/READY_TO_SHIP/DELIVERED), `POST /api/store/[id]/orders/[oid]/shipment` (input resi + notifikasi WA), halaman `/toko/pesanan`
- ✅ Katalog publik difilter ke toko `ACTIVE` — `GET /api/products` dan `GET /api/products/[id]` menolak (404) produk dari toko non-ACTIVE
- ✅ Halaman toko `/toko/[slug]` — sudah dibangun di Fase 1 (SSR, katalog berpaginasi, profil, 404 non-aktif)
- ✅ SEO halaman toko — meta tag & JSON-LD sudah di Fase 1; ditambah `GET /api/sitemap-stores.xml` (sitemap toko ACTIVE)

Catatan: "tombol chat" pada checklist PRD belum dikerjakan — fitur chat existing (`ChatSession`) belum dihubungkan ke halaman toko publik; perlu keputusan produk (chat per-toko vs. platform) sebelum diimplementasi.

## Fase 3 — Upload Video & Kuota Storage

- ✅ `server/utils/s3.ts` — `presignVideoUpload` (presigned PUT, 10 menit, key `stores/{storeId}/{productId}/{uuid}.{ext}`), `headS3Object` (verifikasi ukuran asli, tidak percaya klien), `deleteS3Object`
- ✅ `POST /api/store/[id]/media/presign` — cek kuota (tipe/jumlah/ukuran perkiraan/durasi/storage) sebelum menerbitkan URL
- ✅ `POST /api/store/[id]/media/confirm` — verifikasi ulang via `HeadObjectCommand`, tolak & hapus objek S3 jika kuota terlampaui, catat `StoreMedia` + update `Product.videoUrl` + `Store.storageUsedKb` dalam transaksi
- ✅ `DELETE /api/store/[id]/media/[mid]` — hapus objek S3 + kembalikan kuota storage
- ✅ `GET /api/s3-image/[...path]` — tambah prefix `stores/` ke allowlist
- ✅ Penghapusan produk (`DELETE /api/store/[id]/products/[pid]`) kini menghapus objek S3 foto & video terkait dan mengembalikan `storageUsedKb`
- ✅ Cron pembersih objek presigned yang tak pernah dikonfirmasi — `POST /api/cron/cleanup-media`, proteksi header `Authorization: Bearer <CRON_SECRET>`, hapus objek `stores/*` berumur >24 jam tanpa `StoreMedia.s3Key` yang cocok
- ✅ Frontend `/toko/produk` — upload video per produk (baca durasi via elemen `<video>` di browser, presign → PUT langsung ke S3 → confirm)

Catatan: kedua endpoint cron kini terdaftar di `vercel.json` (`crons`), dipicu GET oleh Vercel Cron dan tetap bisa dipanggil manual via POST — keduanya diproteksi header `Authorization: Bearer <CRON_SECRET>`. Durasi video hanya divalidasi dari nilai yang dilaporkan browser (tidak diverifikasi ulang server, butuh ffmpeg) — keterbatasan yang memang diterima PRD untuk fase ini.

## Fase 4 — Paket Berbayar & Langganan

- ✅ `POST /api/store/[id]/subscribe` — buat langganan (upgrade/perpanjang) ke paket berbayar; `planId` dipilih klien tapi status toko **tidak** berubah di sini — hanya membuat `Subscription PENDING_PAYMENT` + transaksi Duitku (§10: planId tidak pernah dipercaya langsung dari input untuk mengaktifkan)
  - Downgrade/ganti paket ditolak via `assertPlanChangeAllowed` bila pemakaian toko saat ini (jumlah produk, storage) melebihi batas paket tujuan (§6.3)
  - Perhitungan periode: perpanjang sebelum kedaluwarsa menambah durasi ke `expiresAt` yang ada; setelah kedaluwarsa dihitung dari tanggal pembayaran
  - Menolak membuat langganan baru bila masih ada `PENDING_PAYMENT` yang belum selesai/kedaluwarsa
- ✅ `POST /api/subscription/callback` — satu-satunya tempat `Subscription`/`Store.status`/`Store.planId`/`Store.expiresAt` berubah jadi aktif; signature Duitku diverifikasi (pola sama dengan `server/api/payment/callback.post.ts`), notifikasi WA saat aktif
- ✅ `GET /api/store/[id]` — sertakan riwayat `subscriptions` (20 terakhir) untuk halaman langganan
- ✅ Cron harian `GET|POST /api/cron/store-expiry` — tandai toko lewat `expiresAt` sebagai `EXPIRED`, kirim notifikasi WA H-7/H-3/H-1 (`waTemplate` key `store_expiry_reminder` + fallback)
- ✅ Mode read-only untuk toko `EXPIRED` — sudah otomatis tertegakkan lewat `getStoreContext()` default (`requireActive: true`) di seluruh endpoint tulis (produk, media, status pesanan, resi); tidak perlu perubahan tambahan
- ✅ Frontend `/toko/langganan` — daftar paket, tombol pilih/perpanjang → redirect ke `paymentUrl` Duitku, riwayat langganan; tautan dari kartu "Paket" di `/toko/dashboard`

Catatan: notifikasi email (H-7/H-3/H-1, aktivasi langganan) belum ditambahkan — hanya WA via Fonnte, mengikuti pola existing di endpoint checkout/shipment. `server/utils/mailer.ts` sudah ada bila ingin ditambah kemudian.

## Fase 5 — Checkout Lintas Toko

- ✅ Skema `Payment.duitkuReference` tidak lagi `@unique` (tetap `@@index`) — `Payment.orderId` tetap `@unique` (1:1 dengan Order tidak berubah). Satu transaksi Duitku kini bisa dibagi ke beberapa `Payment`, satu per Order/toko.
- ✅ Keranjang (`composables/useCart.ts`) menyimpan `storeId`/`storeName` per item (diisi dari API produk); `groupedByStore` computed mengelompokkan item per toko. Dipakai di `pages/cart.vue` (tampilan) dan `pages/checkout.vue` (langkah pengiriman).
- ✅ `GET /api/shipping/cost` menerima `storeId` opsional → origin RajaOngkir diambil dari `Store.cityId` toko tsb; tanpa `storeId` fallback ke `StoreSettings.shipping_origin_city_id` → env → default Surabaya (501)
- ✅ `POST /api/checkout/regular` dipecah per toko: satu `Order` per item (storeId diambil dari data produk di server, tidak dipercaya dari klien), ongkir dari `shippingByStore` ditempel di order pertama tiap toko (agar tidak dobel saat dijumlah), komisi (`commissionAmount`) dihitung per order dari `plan.commissionPercent` toko tsb
- ✅ `POST /api/payment/create-transaction` menerima `orderIds[]`, membuat **satu** transaksi Duitku (jumlah dari semua order) lalu `Payment.createMany` — satu Payment per order, berbagi `duitkuReference`
- ✅ `POST /api/payment/callback` mencari semua `Payment` dengan `duitkuReference` yang sama (`findMany`) dan memperbarui semua Order terkait sekaligus (sukses/gagal/pending), termasuk pemulihan stok per order saat gagal
- ✅ `pages/checkout.vue` — langkah pengiriman menampilkan satu blok kurir/layanan per toko (`shippingState` keyed per `storeId`), total ongkir dijumlah semua toko, `placeOrder()` mengirim `shippingByStore` dan `orderIds[]` ke API baru

Catatan: PRD §14 (siapa menanggung biaya saat gratis ongkir >Rp500rb — platform atau penjual) **belum diputuskan resmi oleh pengguna**. Implementasi saat ini mengasumsikan platform menanggung (komisi penjual tidak dikurangi saat ongkir gratis) — lihat komentar di `server/api/checkout/regular.post.ts`. Perlu konfirmasi eksplisit sebelum dianggap final.

## Belum dikerjakan / celah dari Fase 1–5 (per PRD §9, §11)

Dikumpulkan sebelum mulai Fase 6, supaya tidak terlewat.

- ⬜ **§9 `/products/[id]`** — "Tambah info penjual + tautan ke etalase toko" belum ada di UI. Data `store` sudah dikirim API dan dipakai untuk `storeId` cart, tapi halaman produk belum menampilkan nama toko/link ke `/toko/[slug]` untuk pembeli.
- ⬜ **Fase 2, §6.4** — Tombol chat penjual di halaman toko publik (`/toko/[slug]`) belum dikerjakan; `ChatSession` existing belum dihubungkan. Perlu keputusan produk (chat per-toko vs. platform, dicatat juga di Fase 2 di atas).
- ⬜ **Fase 3** — Durasi video hanya divalidasi dari nilai yang dilaporkan browser, tidak diverifikasi ulang di server (butuh ffmpeg). Diterima sebagai keterbatasan sementara.
- ⬜ **Fase 4** — Notifikasi **email** untuk H-7/H-3/H-1 expiry dan aktivasi langganan belum ada, baru WA (Fonnte). `server/utils/mailer.ts` sudah tersedia untuk pengembangan lanjutan.
- ⬜ **Fase 5, §14** — Belum ada keputusan resmi pengguna soal penanggung biaya gratis ongkir >Rp500rb (platform vs. penjual). Implementasi saat ini default: platform menanggung.
- ⬜ **Fase 5** — Ambang gratis-ongkir tidak konsisten antara frontend dan backend: `pages/checkout.vue` (`canStep2`, `finalShippingCost`) menggerbang berdasarkan **subtotal seluruh keranjang** (`subtotal >= freeShippingMin`), sedangkan `server/api/checkout/regular.post.ts` menghitung gratis ongkir per **subtotal per toko**. Untuk keranjang lintas toko dengan subtotal toko kecil tapi subtotal total besar, kedua sisi bisa memberi hasil ongkir berbeda — perlu diselaraskan (pilih salah satu: threshold per-toko konsisten di frontend, atau threshold total-keranjang konsisten di backend).
- ⬜ **Fase 5** — Bila satu toko punya lebih dari satu baris item di keranjang, ongkir hanya ditempel di Order pertama toko tsb (agar tidak dobel saat dijumlah); Order lain untuk toko yang sama akan punya `shippingCost: null`. Belum ada UI yang menjelaskan ini ke pembeli di halaman riwayat pesanan/struk — berpotensi terlihat "hilang" ongkirnya pada order kedua dst.
- ⬜ Dua temuan KRITIS dari `PRD_Produksi_VPS.md` (cookie `buyer_session` tidak ditandatangani, `checkRateLimit()` tanpa `await` di 4 tempat) masih belum diperbaiki — lihat bagian terpisah di bawah.

## Fase 6 — Admin Platform & Polish

- ✅ Tab admin baru di `pages/admin/index.vue`: **Toko** (daftar semua toko + filter status, aksi setujui/tolak/tangguhkan/aktifkan), **Paket** (lihat & edit kuota/harga/komisi/prioritas/badge tiap `Plan`), **Langganan** (daftar `Subscription` + ringkasan pendapatan)
- ✅ `GET /api/admin/stores`, `PATCH /api/admin/stores/[id]/status` — transisi status toko ditegakkan lewat whitelist (`PENDING_REVIEW→ACTIVE/REJECTED`, `ACTIVE→SUSPENDED/REJECTED`, dst); alasan **wajib** diisi untuk `REJECTED`/`SUSPENDED`, disimpan ke `Store.rejectReason` (field yang sama dipakai untuk kedua kasus, tidak ada kolom terpisah)
- ✅ `GET /api/admin/plans`, `PATCH /api/admin/plans/[id]` — admin bisa mengubah harga/kuota/komisi/`searchPriority`/`hasVerifiedBadge`/`isActive`; `tier` tidak bisa diubah (identitas paket tetap, referensi Store/Subscription tidak perlu migrasi). Jalur ini terpisah dari `POST /api/store/[id]/subscribe` (self-service pembeli) sesuai §10 — admin mengubah definisi paket, bukan `planId` toko individual secara langsung
- ✅ `GET /api/admin/subscriptions` — daftar langganan + laporan (`totalRevenue`, `paidCount`, `revenueByPlan`) dihitung dari `Subscription` yang `status: ACTIVE` atau punya `paidAt`
- ✅ Prioritas pencarian & badge verifikasi diterapkan di `GET /api/products` (`orderBy: [{store:{plan:{searchPriority:'desc'}}}, {createdAt:'desc'}]`, plus `store.plan.hasVerifiedBadge` disertakan) dan `GET /api/stores` (urutan diperbaiki dari `asc` jadi `desc` — sebelumnya searchPriority tinggi malah tampil belakangan)
- ✅ Cron rekonsiliasi counter — `GET|POST /api/cron/reconcile-counters` (proteksi `Authorization: Bearer <CRON_SECRET>`, sama seperti cron lain), menghitung ulang `Store.productCount`/`storageUsedKb` dari `Product`/`StoreMedia` dan memperbaiki toko yang menyimpang; terdaftar di `vercel.json` (harian, 02:00)

Catatan: badge verifikasi & tombol chat penjual di UI halaman produk/toko publik (item gap Fase 1–5 di atas) belum disentuh — di luar cakupan checklist §11 Fase 6 yang eksplisit disebut pengguna.

## Catatan terpisah — PRD_Produksi_VPS.md (belum masuk sesi ini)
Dua temuan KRITIS di dokumen produksi VPS **belum diperbaiki** dan relevan karena model kepemilikan
Store baru bergantung pada sesi buyer:
- Cookie `buyer_session` tidak ditandatangani (bisa dipalsukan oleh siapa pun yang tahu format UUID)
- `checkRateLimit()` dipanggil tanpa `await` di 4 tempat — proteksi rate limit tidak efektif

Rekomendasi: tangani sebelum toko/produk milik buyer dianggap aman di produksi.
