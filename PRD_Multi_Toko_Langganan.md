# PRD: MINTS — Multi-Toko & Paket Langganan Penjual

**Versi:** 1.0
**Tanggal:** 23 September 2026
**Status:** Draft
**Dokumen terkait:** `PRD_Ecommerce_Mints.md` (platform dasar), `PRD_Flash_Sale_App.md`

---

## 1. Ringkasan

Saat ini MINTS adalah **toko tunggal**: satu admin mengelola satu katalog, pembeli hanya berbelanja. PRD ini mengubahnya menjadi **marketplace multi-toko**: setiap pembeli yang sudah login dapat mengaktivasi toko sendiri, mengunggah produk, dan berjualan — dengan batasan yang ditentukan oleh paket langganannya.

Empat paket: **Free**, **Premium**, **Gold**, **Platinum**. Paket menentukan jumlah toko, masa aktif toko, jumlah produk, jumlah foto per produk, dan kuota video.

**Perubahan mendasar:** `Product`, `Order`, dan `FlashSaleConfig` yang sekarang milik platform akan menjadi milik sebuah toko. Ini bukan perubahan aditif — perlu migrasi data dan penyesuaian seluruh query katalog.

---

## 2. Tujuan & Metrik Sukses

| Tujuan | Metrik |
|---|---|
| Pembeli bisa jadi penjual tanpa proses manual | ≥ 50 toko teraktivasi dalam 60 hari pertama |
| Batasan paket ditegakkan secara teknis, bukan hanya di UI | 0 pelanggaran kuota lolos ke database (diuji lewat test) |
| Konversi Free → berbayar | ≥ 10% toko Free upgrade sebelum masa aktif habis |
| Biaya storage terkendali | Rata-rata penggunaan storage per toko Free ≤ 20 MB |
| Toko kedaluwarsa tidak merusak pengalaman pembeli | Produk toko kedaluwarsa hilang dari katalog publik dalam < 5 menit |

---

## 3. Persona

### A. Pembeli (existing)
Berbelanja di katalog lintas toko. Tidak terpengaruh perubahan ini selain melihat nama toko pada produk dan pesanan.

### B. Penjual (baru — pembeli yang aktivasi toko)
- Sudah punya akun (`Buyer`) dan login via OTP email atau Google
- Mengaktivasi toko: isi nama toko, slug, deskripsi, logo, alamat asal pengiriman
- Mengelola katalog tokonya sendiri lewat dashboard penjual (terpisah dari dashboard admin platform)
- Melihat sisa kuota produk, foto, video, dan sisa masa aktif toko
- Upgrade paket saat kuota atau masa aktif habis

### C. Admin Platform (existing, diperluas)
- Melihat seluruh toko, menangguhkan toko yang melanggar
- Mengatur definisi paket dan harga langganan
- Melihat pendapatan langganan

---

## 4. Definisi Paket Langganan

### 4.1 Matriks Batasan

| Batasan | Free | Premium | Gold | Platinum |
|---|---|---|---|---|
| Jumlah toko | 1 | 3 | 10 | Tidak terbatas |
| Masa aktif toko | 30 hari | 30 hari/siklus | 30 hari/siklus | 30 hari/siklus |
| Produk per toko | 3 | 50 | 500 | Tidak terbatas |
| Foto per produk | 3 | 8 | 15 | 20 |
| Video per produk | 1 | 1 | 3 | 5 |
| Ukuran maks. foto | 2 MB | 5 MB | 5 MB | 10 MB |
| Ukuran maks. video | 15 MB | 50 MB | 100 MB | 200 MB |
| Durasi maks. video | 30 detik | 60 detik | 120 detik | 300 detik |
| Total storage per toko | 50 MB | 1 GB | 10 GB | 50 GB |
| Flash sale sendiri | ✗ | ✓ (1 sesi aktif) | ✓ (5 sesi) | ✓ (tak terbatas) |
| Varian ukuran per produk | 3 | 10 | Tak terbatas | Tak terbatas |
| Chat pembeli | ✓ | ✓ | ✓ | ✓ |
| Laporan penjualan | Ringkas | Lengkap | Lengkap + ekspor | Lengkap + ekspor + API |
| Domain kustom | ✗ | ✗ | ✗ | ✓ |
| Komisi platform per transaksi | 5% | 3% | 2% | 1% |
| Badge verifikasi di katalog | ✗ | ✗ | ✓ | ✓ |
| Prioritas urutan pencarian | Terendah | Normal | Tinggi | Tertinggi |

> Nilai di atas adalah **default yang disimpan di database**, bukan hardcode. Admin dapat mengubahnya lewat tabel `Plan` tanpa deploy ulang. Perubahan batasan berlaku untuk pengecekan berikutnya, tidak menghapus data yang sudah melebihi kuota (lihat §7.3).

### 4.2 Perilaku Masa Aktif (Expiry)

Berlaku untuk semua paket, termasuk Free.

| Fase | Kondisi | Perilaku |
|---|---|---|
| `ACTIVE` | `expiresAt` > sekarang | Normal |
| Peringatan | ≤ 7 hari menuju `expiresAt` | Banner di dashboard penjual + notifikasi WA/email pada H-7, H-3, H-1 |
| `EXPIRED` | `expiresAt` terlewat | Toko & produknya **hilang dari katalog publik**. Penjual masih bisa login, melihat data, dan memperpanjang. Tidak bisa menambah/mengubah produk. |
| Masa tenggang data | 90 hari setelah `EXPIRED` | Data toko disimpan utuh. Perpanjangan mengembalikan semuanya. |
| Setelah 90 hari | — | Media di S3 dihapus, record toko ditandai `ARCHIVED`. Data order tetap disimpan (kewajiban pembukuan). |

**Pesanan yang sedang berjalan tidak terpengaruh expiry.** Order dengan status selain `DELIVERED`, `CANCELLED`, atau `REFUNDED` tetap dapat diproses penjual meski tokonya `EXPIRED` — penjual wajib menuntaskan kewajibannya ke pembeli.

### 4.3 Status Toko

```
DRAFT → PENDING_REVIEW → ACTIVE ⇄ EXPIRED → ARCHIVED
                ↓            ↓
            REJECTED     SUSPENDED (oleh admin)
```

- `DRAFT` — penjual mengisi form, belum submit
- `PENDING_REVIEW` — menunggu verifikasi admin (dapat dimatikan lewat setelan platform `store.auto_approve`)
- `ACTIVE` — tampil di katalog
- `SUSPENDED` — ditangguhkan admin karena pelanggaran; produk hilang dari katalog, penjual diberi tahu alasannya
- `EXPIRED` / `ARCHIVED` — lihat §4.2

---

## 5. Skema Database

### 5.1 Model Baru

```prisma
enum PlanTier {
  FREE
  PREMIUM
  GOLD
  PLATINUM
}

enum StoreStatus {
  DRAFT
  PENDING_REVIEW
  ACTIVE
  REJECTED
  SUSPENDED
  EXPIRED
  ARCHIVED
}

enum SubscriptionStatus {
  PENDING_PAYMENT
  ACTIVE
  EXPIRED
  CANCELLED
}

/// Definisi paket — diubah admin tanpa deploy. Batasan `null` = tidak terbatas.
model Plan {
  id                 String   @id @default(uuid())
  tier               PlanTier @unique
  name               String
  priceMonthly       Int      // Rupiah; 0 untuk FREE
  durationDays       Int      @default(30)
  maxStores          Int?
  maxProducts        Int?
  maxImagesPerProduct Int?
  maxVideosPerProduct Int?
  maxImageSizeMb     Int?
  maxVideoSizeMb     Int?
  maxVideoDurationSec Int?
  maxStorageMb       Int?
  maxVariantsPerProduct Int?
  maxFlashSaleSessions Int?
  commissionPercent  Decimal  @db.Decimal(5, 2)
  hasCustomDomain    Boolean  @default(false)
  hasVerifiedBadge   Boolean  @default(false)
  searchPriority     Int      @default(0)
  isActive           Boolean  @default(true)
  stores             Store[]
  subscriptions      Subscription[]
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model Store {
  id            String      @id @default(uuid())
  ownerId       String
  owner         Buyer       @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  name          String
  slug          String      @unique
  description   String?
  logoUrl       String?
  bannerUrl     String?
  phone         String
  address       String?
  cityId        String?     // Raja Ongkir origin — dipakai kalkulasi ongkir per toko
  cityName      String?
  status        StoreStatus @default(DRAFT)
  rejectReason  String?
  planId        String
  plan          Plan        @relation(fields: [planId], references: [id])
  expiresAt     DateTime
  // Counter terdenormalisasi — sumber kebenaran untuk pengecekan kuota (lihat §7.2)
  productCount  Int         @default(0)
  storageUsedKb Int         @default(0)
  products      Product[]
  orders        Order[]
  flashSales    FlashSaleConfig[]
  media         StoreMedia[]
  subscriptions Subscription[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  @@index([ownerId])
  @@index([status, expiresAt])
}

/// Catatan setiap file yang diunggah — dipakai untuk menghitung kuota storage
/// dan menghapus objek S3 saat produk/toko dihapus.
model StoreMedia {
  id         String   @id @default(uuid())
  storeId    String
  store      Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  productId  String?
  product    Product? @relation(fields: [productId], references: [id], onDelete: Cascade)
  kind       String   // "IMAGE" | "VIDEO"
  s3Key      String   @unique
  url        String
  sizeKb     Int
  durationSec Int?
  mimeType   String
  createdAt  DateTime @default(now())

  @@index([storeId])
  @@index([productId])
}

model Subscription {
  id            String             @id @default(uuid())
  storeId       String
  store         Store              @relation(fields: [storeId], references: [id], onDelete: Cascade)
  planId        String
  plan          Plan               @relation(fields: [planId], references: [id])
  status        SubscriptionStatus @default(PENDING_PAYMENT)
  amount        Int
  periodStart   DateTime
  periodEnd     DateTime
  duitkuReference String?          @unique
  paymentUrl    String?
  paidAt        DateTime?
  rawCallback   Json?
  createdAt     DateTime           @default(now())
  updatedAt     DateTime           @updatedAt

  @@index([storeId])
}
```

### 5.2 Perubahan Model Existing

| Model | Perubahan |
|---|---|
| `Buyer` | `+ stores Store[]` |
| `Product` | `+ storeId String` (**wajib**, bukan opsional), `+ store Store`, `+ videoUrl String?`, `+ media StoreMedia[]`, `@@index([storeId])` |
| `Order` | `+ storeId String`, `+ store Store`, `+ commissionAmount Int?`, `+ payoutStatus String @default("PENDING")`, `@@index([storeId])` |
| `FlashSaleConfig` | `+ storeId String?` (`null` = flash sale milik platform, untuk kompatibilitas data lama) |
| `ChatSession` | `+ storeId String?` — chat diarahkan ke penjual pemilik produk, bukan ke admin platform |

### 5.3 Catatan Migrasi

`Product.storeId` wajib, sedangkan data produk existing tidak punya toko. Urutan migrasi:

1. Buat tabel `Plan`, seed 4 paket
2. Buat tabel `Store`, `StoreMedia`, `Subscription`
3. Buat satu **toko resmi platform** (`slug: "mints"`, tier `PLATINUM`, `expiresAt` jauh di masa depan) yang dimiliki akun sistem
4. Tambah `storeId` sebagai *nullable* pada `Product`, `Order`, `FlashSaleConfig`
5. Backfill: seluruh produk & order existing → toko resmi platform
6. Ubah `Product.storeId` dan `Order.storeId` menjadi `NOT NULL`

> Langkah 6 tidak boleh dijalankan sebelum langkah 5 terverifikasi (`SELECT count(*) FROM "Product" WHERE "storeId" IS NULL` harus 0). Migrasi ini menyentuh data produksi — jalankan di staging dulu dan ambil backup sebelum eksekusi.

---

## 6. Alur Pengguna

### 6.1 Aktivasi Toko

```
[Buyer login] → /account → tombol "Buka Toko"
   → Form: nama toko, slug (auto-generate + cek ketersediaan), deskripsi,
           nomor HP toko, alamat + kota asal pengiriman, logo
   → Pilih paket (Free langsung aktif; berbayar → checkout Duitku)
   → Validasi server: kuota `maxStores` pemilik belum terlampaui
   → Status PENDING_REVIEW (atau ACTIVE bila auto-approve aktif)
   → expiresAt = now + plan.durationDays
   → Notifikasi email + WA: "Tokomu aktif sampai {tanggal}"
```

**Validasi slug:** 3–40 karakter, `[a-z0-9-]`, tidak diawali/diakhiri tanda hubung, tidak termasuk daftar kata terlarang (`admin`, `api`, `account`, `checkout`, `cart`, `login`, `mints`, dll.) karena slug akan dipakai sebagai rute publik `/toko/{slug}`.

### 6.2 Upload Produk dengan Penegakan Kuota

```
[Penjual] Dashboard toko → "Tambah Produk"
   → UI menampilkan sisa kuota: "2 dari 3 produk terpakai · foto maks. 3 · video maks. 1"
   → Pilih file → validasi di browser (jumlah, ukuran, durasi video)
   → Submit
   → Server memvalidasi ULANG seluruh batasan (browser tidak dipercaya)
   → Simpan produk + catat setiap file di StoreMedia + perbarui counter toko
```

Validasi sisi server dijalankan dalam satu transaksi Prisma bersama penulisan produk, sehingga dua permintaan bersamaan tidak dapat sama-sama lolos pengecekan kuota.

### 6.3 Perpanjangan & Upgrade

```
[Penjual] Banner "Toko berakhir dalam 3 hari" → /toko/langganan
   → Pilih: perpanjang paket sama / upgrade
   → Buat Subscription (PENDING_PAYMENT) → Duitku
   → Callback Duitku → Subscription ACTIVE
   → Store.expiresAt diperpanjang, Store.planId diperbarui, status → ACTIVE
```

**Aturan perhitungan periode:** perpanjangan sebelum kedaluwarsa menambah durasi ke `expiresAt` yang ada (tidak hangus). Perpanjangan setelah kedaluwarsa dihitung dari tanggal pembayaran.

**Downgrade** hanya berlaku pada awal periode berikutnya, dan ditolak bila penggunaan saat ini melebihi batas paket tujuan — penjual diminta menghapus kelebihannya lebih dulu.

### 6.4 Halaman Toko Publik

Setiap toko yang berstatus `ACTIVE` memiliki halaman etalase sendiri di `/toko/{slug}` — alamat yang dapat dibagikan penjual ke media sosial, WhatsApp, atau bio Instagram tanpa mengarahkan pembeli ke katalog seluruh marketplace.

**Isi halaman:**

| Bagian | Konten |
|---|---|
| Header | Banner, logo, nama toko, badge verifikasi (Gold/Platinum), lokasi kota |
| Ringkasan | Jumlah produk, tanggal bergabung, rata-rata rating toko, jumlah pesanan selesai |
| Aksi | Tombol "Chat Penjual" (membuka `ChatSession` dengan `storeId` terisi) |
| Katalog toko | Grid produk milik toko ini saja, dengan filter kategori, ukuran, harga, dan pencarian dalam toko |
| Flash sale toko | Bila toko punya sesi aktif (Premium ke atas), tampil di atas katalog dengan countdown |
| Kebijakan | Info pengiriman dari kota asal toko, estimasi proses, kebijakan retur toko |
| Footer | Tautan kembali ke katalog marketplace |

**Aturan tampil:**

- Hanya toko `ACTIVE` yang dapat diakses publik. Toko `EXPIRED`, `SUSPENDED`, `PENDING_REVIEW`, `DRAFT`, `REJECTED`, dan `ARCHIVED` mengembalikan **404**, bukan 403 — status komersial sebuah toko bukan informasi yang perlu dibocorkan ke publik.
- Pemilik toko yang sedang login melihat halamannya sendiri meski berstatus `EXPIRED`, disertai banner "Toko ini tidak terlihat oleh pembeli. Perpanjang untuk mengaktifkan kembali."
- Produk yang habis tetap tampil dengan penanda `SOLD_OUT`, tidak disembunyikan — ini membantu pembeli menilai keragaman katalog.

**SEO:** halaman toko adalah pintu masuk organik utama bagi penjual, jadi ia harus dirender di server (SSR) dan bukan hanya di browser.

- Meta `title`: `{nama toko} — MINTS`
- Meta `description`: dari deskripsi toko, dipotong 160 karakter
- Open Graph: banner toko sebagai `og:image`, untuk pratinjau saat dibagikan di WhatsApp
- Data terstruktur JSON-LD tipe `Store` beserta `ItemList` produk
- URL kanonik; produk ter-index lewat `/products/{id}`, bukan duplikat di bawah slug toko
- Toko `ACTIVE` masuk `sitemap.xml`; toko non-aktif dikeluarkan saat sitemap dibangun ulang

**Keamanan konten:** nama toko, deskripsi, dan nama produk adalah **konten buatan pengguna** yang tampil di halaman publik. Seluruhnya harus di-escape saat render dan tidak boleh disisipkan sebagai HTML mentah. Ini alasan utama CSP di `PRD_Produksi_VPS.md` §8.3 diperlukan sebelum fitur multi-toko rilis.

**Performa:** halaman toko adalah rute publik dengan potensi trafik tinggi (penjual membagikannya secara aktif). Ia memakai paginasi kursor dan cache yang sama dengan katalog utama — lihat `PRD_Produksi_VPS.md` §3.5 dan §5. Cache toko di-*purge* saat produk atau profil toko berubah.

---

## 7. Aturan Teknis Penegakan Batasan

### 7.1 Satu Sumber Kebenaran

Seluruh pengecekan batasan melewati satu modul `server/utils/plan-limits.ts`. Tidak ada endpoint yang membaca angka batasan langsung dari `Plan` atau dari konstanta. Ini mencegah batasan yang tegak di satu endpoint tetapi bocor di endpoint lain.

Fungsi inti:

| Fungsi | Tugas |
|---|---|
| `getStoreContext(event, storeId)` | Memuat toko + paket, memastikan pemanggil adalah pemiliknya, menolak toko non-`ACTIVE` |
| `assertCanAddProduct(ctx)` | Bandingkan `productCount` dengan `maxProducts` |
| `assertMediaAllowed(ctx, files)` | Cek jumlah foto/video per produk, ukuran per file, durasi video, dan sisa `maxStorageMb` |
| `assertCanCreateStore(buyerId, planId)` | Cek `maxStores` |
| `assertCanCreateFlashSale(ctx)` | Cek `maxFlashSaleSessions` |

Batasan bernilai `null` berarti tidak terbatas.

### 7.2 Counter Terdenormalisasi

`Store.productCount` dan `Store.storageUsedKb` diperbarui dalam transaksi yang sama dengan pembuatan/penghapusan produk dan media. Menghitung ulang dengan `COUNT(*)` setiap kali upload akan menjadi lambat saat katalog membesar, dan rawan balapan (*race*) antar dua permintaan bersamaan.

Sebagai jaring pengaman, sebuah cron harian merekonsiliasi counter dengan hitungan sesungguhnya dan mencatat selisih yang ditemukan.

### 7.3 Data yang Melampaui Kuota Setelah Downgrade atau Perubahan Paket

Jika batasan paket diturunkan admin, atau toko turun ke Free setelah kedaluwarsa, data yang sudah ada **tidak dihapus**. Toko masuk mode *read-only* untuk penambahan: penjual tidak bisa menambah produk/media baru sampai penggunaannya kembali di bawah batas. Menghapus data pengguna secara otomatis karena perubahan harga adalah kehilangan data yang tidak dapat dipulihkan — ini tidak dilakukan.

### 7.4 Batasan Upload File

| Aspek | Aturan |
|---|---|
| MIME foto | `image/jpeg`, `image/png`, `image/webp` (GIF dihapus — ukuran tidak efisien untuk katalog) |
| MIME video | `video/mp4`, `video/quicktime`, `video/webm` |
| Verifikasi tipe | Diperiksa dari **magic bytes** isi file, bukan hanya header `Content-Type` yang dikirim klien |
| Nama file | Dinormalisasi; komponen path dibuang (perilaku existing di `server/utils/s3.ts` dipertahankan) |
| Kunci S3 | `stores/{storeId}/{productId}/{uuid}.{ext}` — memudahkan penghapusan massal per toko |
| Rate limit | Maks. 20 upload per penjual per 5 menit (memakai `server/utils/rate-limit.ts` existing) |

**Kendala upload video:** aplikasi berjalan di Vercel, yang membatasi body permintaan serverless sekitar 4,5 MB. Video 15–200 MB **tidak dapat** melewati endpoint Nitro seperti upload foto sekarang. Video harus diunggah **langsung dari browser ke S3** memakai *presigned URL*:

```
POST /api/store/media/presign   → server validasi kuota, terbitkan presigned PUT + mediaId
[browser] PUT langsung ke S3
POST /api/store/media/confirm   → server verifikasi objek ada + ukurannya sesuai,
                                   baru catat StoreMedia & perbarui counter
```

Ukuran final diverifikasi ulang lewat `HeadObject` di langkah `confirm`; ukuran yang dilaporkan browser tidak dipercaya. Presigned URL kedaluwarsa dalam 10 menit. Objek yang di-presign tapi tidak pernah dikonfirmasi dibersihkan cron harian.

Durasi video tidak dapat diverifikasi di server tanpa ffmpeg (tidak tersedia di runtime Vercel). Untuk tahap awal, durasi divalidasi di browser dan batas **ukuran file** menjadi penegak utama kuota. Bila penyalahgunaan muncul, tambahkan pemrosesan video eksternal.

---

## 8. Spesifikasi API

### 8.1 Endpoint Penjual (butuh sesi `buyer_session` + kepemilikan toko)

| Method | Path | Deskripsi |
|---|---|---|
| POST | `/api/store` | Aktivasi toko baru |
| GET | `/api/store/mine` | Daftar toko milik pengguna + ringkasan kuota |
| GET | `/api/store/:id` | Detail toko + penggunaan kuota |
| PATCH | `/api/store/:id` | Ubah profil toko |
| GET | `/api/store/:id/quota` | Sisa kuota (produk, media, storage, hari tersisa) |
| GET/POST | `/api/store/:id/products` | List & tambah produk (kuota ditegakkan) |
| PATCH/DELETE | `/api/store/:id/products/:pid` | Ubah / hapus produk (hapus juga objek S3-nya) |
| POST | `/api/store/:id/media/presign` | Terbitkan presigned URL upload |
| POST | `/api/store/:id/media/confirm` | Konfirmasi upload selesai |
| DELETE | `/api/store/:id/media/:mid` | Hapus media + perbarui counter |
| GET | `/api/store/:id/orders` | Pesanan masuk ke toko ini |
| PATCH | `/api/store/:id/orders/:oid/status` | Ubah status pesanan |
| POST | `/api/store/:id/orders/:oid/shipment` | Input nomor resi |
| GET | `/api/plans` | Daftar paket + harga (publik) |
| POST | `/api/store/:id/subscribe` | Buat langganan → Duitku |
| POST | `/api/subscription/callback` | Callback Duitku untuk langganan |

### 8.2 Endpoint Publik (perubahan)

| Method | Path | Perubahan |
|---|---|---|
| GET | `/api/products` | Tambah filter `storeId`/`storeSlug`; **hanya** produk dari toko `ACTIVE`; urutan memperhatikan `plan.searchPriority` |
| GET | `/api/products/:id` | Sertakan ringkasan toko (nama, slug, badge verifikasi) |
| GET | `/api/stores/:slug` | **Baru** — profil toko + ringkasan; 404 bila toko bukan `ACTIVE` (§6.4) |
| GET | `/api/stores/:slug/products` | **Baru** — katalog toko, paginasi kursor, filter kategori/ukuran/harga/pencarian |
| GET | `/api/stores` | **Baru** — direktori toko |
| POST | `/api/checkout/regular` | Keranjang lintas toko dipecah menjadi satu order per toko; ongkir dihitung per toko dari kota asal masing-masing |

### 8.3 Endpoint Admin Platform

| Method | Path | Deskripsi |
|---|---|---|
| GET | `/api/admin/stores` | Daftar toko + filter status & paket |
| PATCH | `/api/admin/stores/:id/status` | Setujui / tolak / tangguhkan |
| GET/PUT | `/api/admin/plans` | Ubah definisi & harga paket |
| GET | `/api/admin/subscriptions` | Riwayat pendapatan langganan |

---

## 9. Perubahan Halaman

| Halaman | Perubahan |
|---|---|
| `/account` | Tambah kartu "Toko Saya" + tombol "Buka Toko" |
| `/toko/aktivasi` | **Baru** — form aktivasi bertahap |
| `/toko/dashboard` | **Baru** — ringkasan: penjualan, sisa kuota, sisa masa aktif |
| `/toko/produk` | **Baru** — CRUD produk dengan indikator kuota |
| `/toko/pesanan` | **Baru** — pesanan masuk, input resi |
| `/toko/langganan` | **Baru** — paket aktif, riwayat, upgrade/perpanjang |
| `/toko/[slug]` | **Baru** — etalase publik toko: banner, profil, katalog toko, flash sale toko, chat penjual. SSR + JSON-LD (§6.4) |
| `/products/[id]` | Tambah info penjual + tautan ke etalase toko |
| `/cart` | Kelompokkan item per toko; ongkir per toko |
| `/checkout` | Satu pembayaran, beberapa order (satu per toko) |
| `/admin` | Tab baru: Toko, Paket, Langganan |

---

## 10. Keamanan

Multi-tenancy mengubah profil risiko aplikasi secara mendasar: kini pengguna yang tidak saling percaya berbagi satu database. Poin-poin berikut bukan opsional.

| Risiko | Penanganan |
|---|---|
| Penjual A mengubah produk penjual B | Setiap query penjual **wajib** menyertakan `storeId` dari konteks terverifikasi. `getStoreContext()` adalah satu-satunya pintu masuk; tidak ada handler yang mengambil `storeId` mentah dari body permintaan. |
| Penjual A membaca pesanan penjual B | Filter `storeId` pada seluruh query order penjual, termasuk endpoint detail |
| Kuota dilewati lewat permintaan bersamaan | Pengecekan kuota dan penulisan data berada dalam satu transaksi Prisma |
| Kuota dilewati dengan memanipulasi form | Validasi browser hanya untuk kenyamanan; server memvalidasi ulang seluruhnya |
| Upload file berbahaya | Verifikasi magic bytes, daftar MIME yang diizinkan, ekstensi dinormalisasi, objek S3 disajikan lewat proxy `/api/s3-image/` yang sudah ada (bucket tetap non-publik) dengan header `Content-Disposition: attachment` untuk tipe non-media |
| Presigned URL disalahgunakan untuk file besar | Presign menyertakan batas ukuran; `confirm` memverifikasi ukuran sebenarnya lewat `HeadObject` dan menghapus objek yang melanggar |
| Slug toko menabrak rute aplikasi | Daftar kata terlarang + pola slug ketat |
| XSS lewat nama/deskripsi toko di halaman publik | Konten buatan pengguna di-escape saat render, tidak pernah disisipkan sebagai HTML mentah; CSP aktif (§6.4) |
| Status komersial toko bocor ke publik | Toko non-`ACTIVE` mengembalikan 404, bukan 403 |
| Callback Duitku dipalsukan untuk mengaktifkan langganan gratis | Verifikasi signature callback (mekanisme existing di `server/utils/duitku.ts` dipakai ulang), dan status langganan hanya berubah berdasarkan data dari callback yang tervalidasi — bukan dari parameter redirect di browser |
| Penjual menaikkan paketnya sendiri | `planId` tidak pernah diambil dari input klien saat aktivasi berbayar; ditetapkan server setelah pembayaran terkonfirmasi |

**Catatan pemisahan wewenang:** dashboard penjual memakai sesi `buyer_session` yang sama dengan pembeli. Kepemilikan toko yang menentukan wewenang, bukan peran global. Admin platform tetap memakai `admin_session` terpisah — kedua sesi ini tidak boleh saling menggantikan.

---

## 11. Roadmap Implementasi

### Fase 1 — Fondasi Multi-Toko (2 minggu)
- [ ] Migrasi DB: `Plan`, `Store`, `StoreMedia`, `Subscription` + seed 4 paket
- [ ] Migrasi data: toko platform + backfill `storeId` pada produk/order existing (§5.3)
- [ ] `server/utils/plan-limits.ts` + `getStoreContext()`
- [ ] Endpoint aktivasi toko + halaman `/toko/aktivasi`
- [ ] Paket Free saja; belum ada pembayaran

### Fase 2 — Dashboard Penjual & Kuota (2 minggu)
- [ ] CRUD produk milik toko dengan penegakan kuota produk, foto, varian
- [ ] Indikator sisa kuota di UI
- [ ] Manajemen pesanan per toko + input resi
- [ ] Katalog publik difilter ke toko `ACTIVE`
- [ ] Halaman toko `/toko/[slug]` (§6.4): SSR, katalog toko berpaginasi, profil, tombol chat, 404 untuk toko non-aktif
- [ ] SEO halaman toko: meta tag, Open Graph, JSON-LD, sitemap toko `ACTIVE`

### Fase 3 — Upload Video & Kuota Storage (1 minggu)
- [ ] Alur presigned URL S3 (`presign` / `confirm`)
- [ ] Akuntansi `storageUsedKb`, penghapusan objek S3 saat produk/media dihapus
- [ ] Validasi durasi & ukuran di browser, verifikasi ukuran di server
- [ ] Cron pembersih objek yang tidak dikonfirmasi

### Fase 4 — Paket Berbayar & Langganan (2 minggu)
- [ ] Integrasi Duitku untuk langganan + callback
- [ ] Alur upgrade, perpanjangan, aturan periode (§6.3)
- [ ] Cron expiry harian + notifikasi H-7/H-3/H-1 (email + WA)
- [ ] Mode read-only untuk toko `EXPIRED`

### Fase 5 — Checkout Lintas Toko (1,5 minggu)
- [ ] Keranjang dikelompokkan per toko
- [ ] Ongkir per toko dari kota asal masing-masing
- [ ] Satu pembayaran → beberapa order
- [ ] Perhitungan komisi platform per order

### Fase 6 — Admin Platform & Polish (1 minggu)
- [ ] Tab admin: Toko, Paket, Langganan
- [ ] Penangguhan toko + alasannya
- [ ] Prioritas pencarian berdasarkan paket, badge verifikasi
- [ ] Cron rekonsiliasi counter
- [ ] Laporan pendapatan langganan

---

## 12. Keputusan Arsitektur

| Keputusan | Alasan |
|---|---|
| `Store` terpisah dari `Buyer`, bukan flag `isSeller` | Satu pengguna bisa punya banyak toko. Flag tidak dapat merepresentasikan ini. |
| Batasan paket di tabel `Plan`, bukan konstanta kode | Harga dan kuota adalah keputusan bisnis yang berubah lebih sering daripada siklus rilis. |
| Counter terdenormalisasi + cron rekonsiliasi | `COUNT(*)` per upload lambat dan rawan balapan; counter dalam transaksi benar dan cepat, cron menangkap penyimpangan. |
| Upload video lewat presigned URL, bukan endpoint Nitro | Batas body Vercel ±4,5 MB membuat upload video via server mustahil. |
| Durasi video divalidasi di browser saja untuk tahap awal | ffmpeg tidak tersedia di runtime Vercel. Batas ukuran file adalah penegak yang sesungguhnya. Tambahkan pemrosesan eksternal bila muncul penyalahgunaan. |
| Data melebihi kuota tidak dihapus otomatis | Menghapus data pengguna karena perubahan harga tidak dapat dipulihkan dan merusak kepercayaan. |
| Order dipecah per toko | Setiap toko punya kota asal, ongkir, resi, dan komisi sendiri. Satu order lintas toko tidak dapat merepresentasikan ini. |
| Dashboard penjual memakai `buyer_session`, bukan sesi baru | Penjual adalah pembeli. Menambah sistem sesi ketiga berarti menambah permukaan serangan tanpa manfaat. |
| Pesanan berjalan tetap dapat diproses meski toko `EXPIRED` | Kewajiban ke pembeli tidak ikut kedaluwarsa bersama langganan. |
| Flash sale milik toko, `storeId` nullable | Menjaga kompatibilitas sesi flash sale platform yang sudah ada. |
| Halaman toko memakai slug, bukan UUID | Slug dapat dibagikan penjual ke media sosial dan terbaca manusia; UUID tidak. Konsekuensinya slug harus unik dan tidak menabrak rute aplikasi. |
| Toko non-aktif mengembalikan 404, bukan 403 | 403 mengonfirmasi bahwa toko itu ada tetapi bermasalah. Status komersial dan penangguhan bukan informasi publik. |
| Halaman toko dirender di server | Halaman toko adalah pintu masuk organik utama penjual. Render di browser saja membuatnya tidak terbaca crawler dan tidak menghasilkan pratinjau saat dibagikan di WhatsApp. |

---

## 13. Di Luar Cakupan (Iterasi Berikutnya)

- Pencairan dana otomatis ke rekening penjual (payout) — untuk sementara diproses manual oleh admin; `Order.payoutStatus` sudah disiapkan
- Domain kustom Platinum (perlu konfigurasi DNS & sertifikat)
- API publik untuk penjual Platinum
- Analitik penjual lanjutan (funnel, kohort)
- Sistem rating & ulasan tingkat toko (terpisah dari ulasan produk)
- Penyelesaian sengketa dan pengembalian dana antar penjual–pembeli

---

## 14. Pertanyaan Terbuka

| Pertanyaan | Dampak jika tidak dijawab |
|---|---|
| Berapa harga rupiah aktual tiap paket? | Fase 4 tidak bisa diselesaikan; nilai sementara dipakai di seeder |
| Apakah aktivasi toko perlu verifikasi identitas (KTP/NPWP)? | Memengaruhi alur `PENDING_REVIEW` dan kewajiban pajak |
| Siapa yang menanggung ongkir gratis Rp 500.000 di marketplace — platform atau penjual? | Memengaruhi perhitungan komisi dan checkout Fase 5 |
| Apakah toko Free boleh ikut flash sale platform? | Memengaruhi definisi batasan flash sale |
| Bagaimana perlakuan pesanan yang belum tuntas saat toko ditangguhkan admin? | Memengaruhi kebijakan `SUSPENDED` |
