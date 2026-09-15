# PRD: MINTS — Platform E-Commerce & Flash Sale

**Versi:** 1.0  
**Tanggal:** 15 September 2026  
**Status:** Draft  

---

## 1. Ringkasan Produk

**MINTS** adalah platform e-commerce modest fashion premium yang menggabungkan dua mode penjualan: **toko reguler** (katalog permanen, keranjang, checkout) dan **flash sale** (koleksi terbatas terjadwal, atomic checkout). Tagline: *"Elegan. Syar'i. Dibuat Sepenuh Hati."*

Target pengguna adalah muslimah Indonesia yang mencari busana syar'i berkualitas premium — Gamis, Abaya, Tunik, Khimar, dan Aksesoris — dengan pengalaman belanja yang mudah dan komunikasi via WhatsApp.

Platform ini dikembangkan dari aplikasi flash sale yang sudah berjalan. Seluruh alur flash sale existing **dipertahankan penuh** — semua fitur baru bersifat additive tanpa breaking change.

---

## 2. Tujuan & Sukses Metrik

| Tujuan | Metrik |
|---|---|
| Pembeli bisa belanja kapan saja, bukan hanya saat flash sale | Konversi dari produk reguler ≥ 15% dalam 30 hari pertama |
| Kurangi friksi checkout | Waktu checkout < 60 detik dari pilih produk |
| Admin mengelola semua channel dari satu dashboard | Zero context-switch: pesanan, stok, chat, pengiriman dalam satu tampilan |
| Pengiriman tertracking | 80% pesanan ter-update tracking otomatis dalam 24 jam setelah dikirim |
| Free shipping terkomunikasikan | Tampilkan progress menuju gratis ongkir (threshold: min. Rp 500.000) di keranjang |

---

## 3. User Persona

### A. Pembeli (Buyer)
- Muslimah Indonesia, mencari busana syar'i premium
- Mengakses storefront publik
- Bisa belanja produk reguler atau ikut flash sale koleksi terbatas (Lebaran, Ramadan, New Arrival)
- Butuh panduan ukuran sebelum membeli; sering bertanya via WhatsApp atau chat
- Melacak status pengiriman dari halaman pesanan

### B. Penjual / Admin
- Mengelola katalog produk (reguler + flash sale, termasuk Pre-Order)
- Memproses pesanan: konfirmasi pembayaran, input nomor resi, notifikasi WA
- Membalas pertanyaan pembeli (ukuran, stok, estimasi produksi Pre-Order) dari dashboard
- Melihat laporan penjualan per kategori dan per koleksi

---

## 4. Arsitektur & Tech Stack

Melanjutkan stack yang ada (Nuxt 3 + Prisma + PostgreSQL), tidak mengganti.

| Layer | Teknologi | Keterangan |
|---|---|---|
| Framework | Nuxt 3 (Vue 3 + Nitro) | Existing |
| Database | PostgreSQL (Supabase) | Existing |
| ORM | Prisma 5 + Accelerate | Existing |
| UI | Nuxt UI + Tailwind CSS | Existing |
| Auth | Cookie session (`admin_session`) | Existing |
| Storage | S3-compatible (Cloudeka) | Existing |
| WhatsApp | Fonnte API | Existing, extend untuk chat |
| Payment | **Duitku** (Payment Gateway) | **Baru** — otomatisasi pembayaran |
| Pengiriman | Raja Ongkir API | **Baru** — kalkulasi ongkir + tracking |
| Realtime | Nuxt SSE / Nitro | **Baru** — notifikasi chat & pesanan |

> Mints.id menggunakan **Duitku** sebagai payment gateway. Duitku mendukung Virtual Account (BCA, BNI, BRI, Mandiri, Permata), QRIS, OVO, GoPay, DANA, ShopeePay, dan Alfamart/Indomaret.

---

## 5. Fitur & Modul

### 5.1 Modul Katalog Produk

**Public:**
- Halaman listing produk per kategori: **Gamis**, **Abaya**, **Tunik**, **Khimar**, **Aksesoris**
- Filter: kategori, harga, ukuran, ketersediaan (tersedia / pre-order / sold out)
- Search produk
- Halaman detail produk: galeri foto, deskripsi bahan, pilihan ukuran (S/M/L/XL/XXL), panduan ukuran inline, stok per ukuran
- Badge produk: `NEW`, `SALE`, `Pre-Order`, `Terlaris`
- Lookbook / koleksi terkurasi (misalnya Lebaran Collection 2026)

**Admin:**
- CRUD produk dengan field: kategori, varian ukuran + stok per ukuran, berat (gram), bahan, tipe (`REGULAR` / `PRE_ORDER`)
- Untuk Pre-Order: estimasi tanggal produksi selesai
- Manajemen kategori
- Manajemen koleksi / lookbook

**Skema tambahan:**
```prisma
model Category {
  id       String    @id @default(uuid())
  name     String    @unique  // "Gamis", "Abaya", "Tunik", "Khimar", "Aksesoris"
  slug     String    @unique
  products Product[]
  createdAt DateTime @default(now())
}

model ProductVariant {
  id        String  @id @default(uuid())
  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  size      String  // "S", "M", "L", "XL", "XXL", "XXXL", "Free Size"
  stock     Int     @default(0)
  // ponytail: tambah colorId jika MINTS ekspansi ke varian warna
}
```

---

### 5.2 Pre-Order

Pre-Order adalah fitur krusial untuk brand fashion yang memproduksi by-demand.

- Produk dengan tipe `PRE_ORDER` tetap bisa dibeli meski stok fisik 0
- Tampilkan estimasi tanggal selesai produksi di halaman produk dan konfirmasi order
- Status order tambahan: `IN_PRODUCTION` (antara PAID dan siap kirim)
- Notif WA otomatis saat status berubah ke `IN_PRODUCTION` → `READY_TO_SHIP`
- Admin bisa update estimasi dan broadcast notif WA ke semua order pre-order aktif

**Alur Pre-Order:**
```
Beli Pre-Order → PENDING_PAYMENT → PAID → IN_PRODUCTION → READY_TO_SHIP → dikirim → DELIVERED
```

---

### 5.3 Modul Keranjang Belanja

- Keranjang **tanpa login** menggunakan `localStorage` + validasi stok server
- Persist 7 hari di browser
- Mini cart di header: jumlah item + total + progress bar menuju **gratis ongkir (min. Rp 500.000)**
- Halaman `/cart`: list item + ukuran yang dipilih, ubah qty, hapus, ringkasan harga, info gratis ongkir
- Produk flash sale tidak masuk keranjang — langsung ke modal checkout atomic (race condition prevention)

---

### 5.4 Modul Checkout

**Alur checkout reguler:**
```
[Keranjang] → [Data Pemesan + Alamat] → [Pilih Kurir] → [Pilih Pembayaran] → [Review] → [Konfirmasi]
```

**Form Data Pemesan:**
- Nama lengkap (required)
- Nomor HP / WhatsApp (required, validasi format Indonesia)
- Alamat pengiriman lengkap (jalan, kelurahan, kecamatan, kota, provinsi, kode pos)

**Gratis ongkir:**
- Jika total belanja ≥ Rp 500.000, ongkir otomatis menjadi Rp 0 (semua kurir)
- Jika < Rp 500.000, tampilkan kalkulasi ongkir dari Raja Ongkir

**Pilih Pembayaran (via Duitku):**
- Virtual Account: BCA, BNI, BRI, Mandiri, Permata
- QRIS
- E-wallet: OVO, GoPay, DANA, ShopeePay
- Over-the-counter: Alfamart, Indomaret
- Manual transfer (fallback existing — dipertahankan)

---

### 5.5 Modul Payment (Duitku Integration)

**Server-side flow:**
1. POST `/api/payment/create-transaction` — buat Duitku payment request, dapat `paymentUrl`
2. Redirect atau embed Duitku payment page
3. Duitku callback → POST `/api/payment/callback` — update status order
4. Fallback: admin upload bukti transfer manual (existing flow dipertahankan)

**Status mapping:**
| Duitku Status | Order Status Internal |
|---|---|
| `00` (Success) | `PAID` |
| `01` (Process) | `PENDING_PAYMENT` |
| `02` (Failed) | `CANCELLED` |

**Skema:**
```prisma
model Payment {
  id              String    @id @default(uuid())
  orderId         String    @unique
  order           Order     @relation(fields: [orderId], references: [id])
  duitkuReference String    @unique // format: "MINTS-{orderId-prefix}"
  paymentUrl      String?
  paymentMethod   String?   // "BC" (BCA VA), "BT" (BNI VA), "OV" (OVO), dll.
  status          String    @default("pending")
  paidAt          DateTime?
  expiredAt       DateTime?
  rawCallback     Json?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

---

### 5.6 Modul Tracking Pengiriman

**Input nomor resi oleh admin:**
- Admin input nomor resi + kurir di dashboard pesanan
- Auto-fetch tracking via Raja Ongkir
- Update status secara on-demand (saat buyer buka halaman track) atau periodic

**Status pengiriman:**
```
WAITING_PICKUP → PICKED_UP → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED → RETURNED
```

**Halaman tracking pembeli:**
- `/track?orderId={id}` — bisa diakses via link di notifikasi WA
- Timeline visual setiap checkpoint kurir
- Estimasi tiba

**Notifikasi WA otomatis:**
- Saat admin input resi → *"Pesananmu sedang dalam perjalanan 🚚 No. resi: {resi} ({kurir})"*
- Saat `DELIVERED` → *"Pesananmu sudah sampai! Semoga cocok dan nyaman ya 🤍 Boleh kasih ulasan?"*

**Skema:**
```prisma
model Shipment {
  id           String    @id @default(uuid())
  orderId      String    @unique
  order        Order     @relation(fields: [orderId], references: [id])
  courier      String    // "jne", "jnt", "sicepat", "pos"
  trackingNo   String
  status       String    @default("WAITING_PICKUP")
  lastChecked  DateTime?
  rawTracking  Json?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

---

### 5.7 Modul Chat Pembeli ↔ Admin

**Tujuan:** Pembeli bisa tanya ukuran, stok, estimasi produksi Pre-Order, atau konfirmasi pesanan langsung dari web — bukan hanya via WA eksternal.

**Implementasi:**
- Chat berbasis Server-Sent Events (SSE) Nitro — tanpa library tambahan
- Tombol "Chat" di halaman produk dan halaman pesanan
- Tidak butuh login pembeli — identitas dari nama + nomor HP yang diinput saat pertama buka chat
- Admin membalas dari tab "Chat" di dashboard
- Badge unread count di tab Chat

**Konteks umum pertanyaan di MINTS:**
- "Ukuran M untuk tinggi badan berapa ya?"
- "Stok Gamis Kaftan ukuran L masih ada?"
- "Pre-order koleksi ini estimasi kapan?"
- "Saya sudah transfer, ini buktinya"

**Skema:**
```prisma
model ChatSession {
  id          String        @id @default(uuid())
  buyerPhone  String
  buyerName   String
  productId   String?
  orderId     String?
  isRead      Boolean       @default(false)
  messages    ChatMessage[]
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model ChatMessage {
  id        String      @id @default(uuid())
  sessionId String
  session   ChatSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  sender    String      // "buyer" | "admin"
  body      String
  createdAt DateTime    @default(now())
}
```

> Jika volume chat tinggi: upgrade ke Supabase Realtime atau Ably. Untuk MVP, SSE Nitro cukup.

---

### 5.8 Modul Flash Sale (Existing + Enhancement)

Alur flash sale existing **tidak berubah**. Enhancement:

| Fitur | Status |
|---|---|
| Atomic checkout (Prisma transaction) | Existing — tidak berubah |
| Sesi terjadwal + countdown timer | Existing |
| Banner image per sesi | **Baru** |
| Sync countdown ke server time (cegah manipulasi client) | **Baru** |
| Waiting list + notif WA saat ada cancel | **Baru** |
| Integrasi Duitku untuk flash sale (opsional, di samping manual transfer) | **Baru** |

Flash sale MINTS relevan untuk: Lebaran Drop, Ramadan Edition, Anniversary Sale, New Arrival terbatas.

---

### 5.9 Modul Ulasan Produk

- Hanya pembeli dengan status `PAID` + `DELIVERED` yang bisa isi ulasan
- Rating bintang 1–5 + teks + foto (opsional)
- Link ulasan via WA otomatis setelah `DELIVERED`
- Admin bisa sembunyikan ulasan yang tidak pantas
- Tampilkan rating rata-rata dan jumlah ulasan di halaman produk

**Skema:**
```prisma
model Review {
  id        String   @id @default(uuid())
  productId String
  orderId   String   @unique
  buyerName String
  rating    Int      // 1-5
  body      String?
  imageUrl  String?
  isVisible Boolean  @default(true)
  createdAt DateTime @default(now())
}
```

---

### 5.10 Dashboard Admin — Enhancements

| Tab | Perubahan |
|---|---|
| Dashboard | Tambah metric: GMV harian/mingguan, kategori terlaris, tingkat konversi |
| Pesanan | Filter: status pengiriman, metode bayar, tipe produk (reguler/pre-order); tombol input resi |
| Produk | Field baru: kategori, stok per ukuran, bahan, tipe (REGULAR/PRE_ORDER), estimasi produksi |
| Flash Sale | Tetap sama + banner image upload |
| Chat | **Baru** — inbox chat, unread badge, reply |
| Pengiriman | **Baru** — daftar pesanan perlu input resi, tracking status |
| Pengaturan | Tambah: Duitku keys, Raja Ongkir key, alamat toko (kota asal), threshold gratis ongkir |

---

## 6. Kebijakan Toko (dari mints.id)

| Kebijakan | Detail |
|---|---|
| Gratis ongkir | Min. pembelian Rp 500.000 ke seluruh Indonesia |
| Pengembalian | Ada kebijakan retur (detail di halaman Kebijakan Pengembalian) |
| Panduan ukuran | Tersedia per kategori produk |
| Dukungan pembeli | WhatsApp + chat web |

Semua kebijakan ini ditampilkan di footer storefront dan halaman checkout.

---

## 7. Alur Kerja Lengkap

### Alur E-Commerce Reguler

```
[Buyer] Browse Katalog (Gamis / Abaya / Tunik / Khimar / Aksesoris)
    → Pilih Produk → Lihat Detail → Pilih Ukuran → Tambah Keranjang
    → (opsional) Chat ke Admin: tanya ukuran / stok / bahan
    → Checkout: isi data + alamat + kurir + metode bayar
    → Duitku payment → Order status PAID
    → Admin: input nomor resi
    → WA: "Pesananmu dikirim, resi: {resi}"
    → Status DELIVERED
    → WA: "Pesananmu sampai! Boleh kasih ulasan? 🤍"
```

### Alur Pre-Order

```
[Buyer] Beli produk Pre-Order → PENDING_PAYMENT → bayar → PAID
    → Admin konfirmasi → status IN_PRODUCTION
    → WA: "Pesananmu sedang diproduksi, estimasi selesai: {tanggal}"
    → Produksi selesai → READY_TO_SHIP → Admin input resi → dikirim
```

### Alur Flash Sale (Existing + Enhanced)

```
[Buyer] Countdown aktif → Flash Sale mulai
    → Klik "Beli Sekarang" → Modal: nama + HP
    → Atomic checkout (Prisma transaction)
    → PENDING_PAYMENT → pilih bayar (Duitku atau manual transfer)
    → Jika sold out: daftar Waiting List
    → Notif WA jika ada yang cancel
```

---

## 8. Spesifikasi API Routes Baru

### Public Endpoints

| Method | Path | Deskripsi |
|---|---|---|
| GET | `/api/products` | List produk (filter: kategori, ukuran, harga, tipe) |
| GET | `/api/products/:id` | Detail produk + varian + stok + ulasan |
| GET | `/api/categories` | List kategori aktif |
| POST | `/api/cart/sync` | Validasi stok item keranjang di server |
| POST | `/api/checkout/regular` | Buat order dari keranjang |
| POST | `/api/payment/create-transaction` | Buat Duitku payment request |
| POST | `/api/payment/callback` | Duitku callback → update order status |
| GET | `/api/shipping/cost` | Kalkulasi ongkir Raja Ongkir |
| GET | `/api/orders/:id/track` | Status tracking pengiriman |
| POST | `/api/chat/start` | Mulai sesi chat |
| GET | `/api/chat/:sessionId/messages` | Ambil pesan (SSE stream) |
| POST | `/api/chat/:sessionId/messages` | Kirim pesan dari pembeli |

### Admin Endpoints (Baru)

| Method | Path | Deskripsi |
|---|---|---|
| GET | `/api/admin/chat` | List semua sesi chat + unread count |
| POST | `/api/admin/chat/:sessionId/reply` | Balas chat |
| POST | `/api/admin/orders/:id/shipment` | Input nomor resi + kurir |
| GET | `/api/admin/shipment/pending` | Pesanan butuh input resi |
| GET/POST | `/api/admin/categories` | CRUD kategori |
| DELETE | `/api/admin/categories/:id` | Hapus kategori |
| GET/PUT | `/api/admin/settings` | Konfigurasi toko |

---

## 9. Skema Database Lengkap (Delta)

### Model Baru

| Model | Field Kunci | Relasi |
|---|---|---|
| `Category` | id, name (Gamis/Abaya/dll.), slug | ← Product[] |
| `ProductVariant` | id, size, stock | → Product |
| `Payment` | duitkuReference, paymentUrl, paymentMethod, status, paidAt | → Order (1:1) |
| `Shipment` | courier, trackingNo, status, rawTracking | → Order (1:1) |
| `Review` | rating, body, imageUrl, isVisible, buyerName | → Product, → Order |
| `ChatSession` | buyerPhone, buyerName, isRead | ← ChatMessage[] |
| `ChatMessage` | sender ("buyer"/"admin"), body | → ChatSession |
| `WaitingList` | buyerPhone, buyerName, notified | → Product |
| `StoreSettings` | key (PK), value | — |

### Field Tambahan pada Model Existing

| Model | Field Baru |
|---|---|
| `Product` | categoryId, weight (gram), material (bahan), productType (REGULAR/PRE_ORDER), estimatedReadyDate, variants[], reviews[], waitingList[] |
| `Order` | address, cityId, courierCode, courierService, shippingCost, payment?, shipment? |
| `OrderType` enum | tambah `REGULAR` di samping FLASH_SALE dan OFFLINE |
| `OrderStatus` enum | tambah `IN_PRODUCTION`, `READY_TO_SHIP`, `REFUNDED` |

---

## 10. Konfigurasi Environment Baru

```env
# Existing
DATABASE_URL=
NUXT_FONNTE_TOKEN=
NUXT_S3_ENDPOINT=
NUXT_S3_BUCKET=
NUXT_S3_ACCESS_KEY=
NUXT_S3_SECRET_KEY=

# Payment — Duitku
NUXT_DUITKU_MERCHANT_CODE=
NUXT_DUITKU_API_KEY=
NUXT_DUITKU_IS_PRODUCTION=false
NUXT_DUITKU_CALLBACK_URL=https://mints.id/api/payment/callback
NUXT_DUITKU_RETURN_URL=https://mints.id/orders

# Shipping — Raja Ongkir
NUXT_RAJAONGKIR_API_KEY=
NUXT_RAJAONGKIR_BASE_URL=https://api.rajaongkir.com/starter
NUXT_STORE_CITY_ID=        # Raja Ongkir city ID kota asal toko
NUXT_FREE_SHIPPING_MIN=500000  # threshold gratis ongkir dalam Rupiah
```

---

## 11. Roadmap Implementasi

### Fase 1 — Katalog & Keranjang (2 minggu)
- [ ] Migrasi DB: Category, ProductVariant, field baru di Product (material, productType, estimatedReadyDate)
- [ ] Admin: CRUD kategori, update form produk (kategori, ukuran + stok per ukuran, bahan, tipe Pre-Order)
- [ ] Public: halaman listing per kategori (Gamis, Abaya, Tunik, Khimar, Aksesoris)
- [ ] Public: halaman detail produk (galeri, pilih ukuran, stok indicator, panduan ukuran, badge Pre-Order)
- [ ] Keranjang: `useCart` composable (localStorage), mini cart header dengan progress gratis ongkir

### Fase 2 — Checkout & Payment Duitku (2 minggu)
- [ ] Migrasi DB: Payment model, field alamat/kurir di Order
- [ ] Integrasi Raja Ongkir: kalkulasi ongkir, city picker autocomplete, logic gratis ongkir Rp 500K
- [ ] Checkout form multi-step
- [ ] Integrasi Duitku: create transaction, redirect ke payment page
- [ ] Webhook/callback handler Duitku → update order status otomatis

### Fase 3 — Pre-Order (1 minggu)
- [ ] Status order baru: IN_PRODUCTION, READY_TO_SHIP
- [ ] Admin: update estimasi Pre-Order, broadcast notif WA ke semua order pre-order aktif
- [ ] Public: tampilkan estimasi produksi di halaman produk dan konfirmasi order

### Fase 4 — Pengiriman & Tracking (1 minggu)
- [ ] Migrasi DB: Shipment model
- [ ] Admin: form input nomor resi, auto-notif WA
- [ ] Integrasi tracking Raja Ongkir, halaman `/track` publik

### Fase 5 — Chat (1 minggu)
- [ ] Migrasi DB: ChatSession, ChatMessage
- [ ] SSE endpoint Nitro untuk realtime messages
- [ ] Widget chat di halaman produk + pesanan
- [ ] Tab Chat di dashboard admin

### Fase 6 — Ulasan, Waiting List & Polish (1 minggu)
- [ ] Migrasi DB: Review, WaitingList
- [ ] Link ulasan via WA setelah DELIVERED, form ulasan publik
- [ ] Waiting list flash sale + notif WA saat ada cancel
- [ ] SEO: meta tags, OG image, sitemap
- [ ] Dashboard admin: metric GMV, kategori terlaris, konversi

---

## 12. Keputusan Arsitektur & Catatan

| Keputusan | Alasan |
|---|---|
| Duitku sebagai payment gateway | Mints.id sudah menggunakan Duitku. Lokal Indonesia, support semua metode populer, tidak perlu migrasi merchant account. |
| Keranjang di localStorage, bukan DB | Tidak butuh login buyer. Trade-off: keranjang hilang saat ganti device. Acceptable untuk target segmen. |
| Flash sale tetap atomic checkout tanpa keranjang | Race condition prevention. Tidak berubah dari existing. |
| Chat via SSE bukan WebSocket | Nitro native, deploy lancar di Vercel/edge. Upgrade ke Supabase Realtime jika volume tinggi. |
| Gratis ongkir hardcoded Rp 500.000 default | Sesuai kebijakan mints.id. Nilai bisa dikonfigurasi via `StoreSettings`. |
| Tidak ada akun buyer | Simplifikasi UX. Riwayat pesanan via link atau nomor HP. Bisa ditambah di iterasi berikutnya. |
| Pre-Order sebagai product type, bukan model terpisah | Lebih sederhana; semua logika order tetap satu alur, hanya tambah status. |
