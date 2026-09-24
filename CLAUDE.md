# MINTS — Panduan untuk Claude Code

E-commerce multi-toko (Nuxt 3 + Prisma/PostgreSQL). Awalnya flash-sale platform tunggal, sekarang mendukung banyak toko independen dengan paket langganan. Baca `PRD_Multi_Toko_Langganan.md` dan `PRD_Ecommerce_Mints.md` untuk konteks produk lengkap; file ini untuk konvensi kerja sehari-hari.

## Stack & perintah
- Nuxt 3 (Vue 3 `<script setup>`), Nitro server routes di `server/api/`, deploy preset `vercel`.
- Prisma + PostgreSQL. **Pakai `npx prisma db push`, BUKAN `prisma migrate dev`** — tidak ada folder migrations di project ini.
- `npm run dev`, `npm run build` (jalankan `prisma generate` dulu), `npm run db:studio`.
- Setelah `npx nuxt build`, hapus `.nuxt` (`rm -rf .nuxt`) sebelum `npm run dev` lagi — build production menimpa cache dev dan memicu error resolusi alias (`#app-manifest`) di Vite.

## Arsitektur inti
- **Multi-toko**: satu `Buyer` bisa memiliki banyak `Store` (`Store.ownerId`). Toko diidentifikasi via `slug` (halaman publik) atau `id` (endpoint pemilik toko `server/api/store/[id]/...`).
- **Otorisasi toko**: SELALU pakai `getStoreContext(event, storeId, opts)` dari `server/utils/plan-limits.ts` di setiap endpoint milik-toko. Fungsi ini: cek sesi via `requireBuyerSession`, load store+plan, tolak 404 kalau bukan pemilik (bukan 403 — jangan konfirmasi keberadaan toko orang lain), tolak 403 kalau status bukan `ACTIVE` (kecuali `requireActive: false`).
- **Batasan paket (plan limits)**: satu sumber kebenaran ada di `server/utils/plan-limits.ts` — jangan baca angka batasan (`maxProducts`, dll.) langsung dari model `Plan` atau hardcode di tempat lain.
- **Cart**: sepenuhnya client-side, `composables/useCart.ts`, disimpan di `localStorage` (key `mints-cart`, TTL 7 hari). Tidak ada model `Cart` di DB. `groupedByStore` mengelompokkan item per `storeId` untuk checkout lintas toko.
  - **Penting**: `useCart()` membaca `localStorage` di dalam `onMounted`, BUKAN langsung saat setup — supaya tidak terjadi hydration mismatch (render SSR pertama vs client harus sama).
- **Checkout** (`server/api/checkout/regular.post.ts`): satu `Order` dibuat per item cart, dalam satu `prisma.$transaction`, dua tahap: Pass 1 buat semua Order + validasi stok; Pass 2 tempel data ongkir & voucher (`shippingCost`, `voucherCode`, `discountAmount`) hanya ke Order pertama tiap toko — supaya tidak dobel-hitung saat Order dijumlahkan per toko.
- **Voucher**: nominal tetap (Rupiah), per toko (bukan global), kode unik per `(storeId, code)`, diinput manual pembeli saat checkout. Validasi voucher HARUS diulang server-side di dalam transaksi checkout — jangan percaya nilai diskon dari client. Endpoint: `server/api/store/[id]/vouchers/*` (CRUD milik toko), `server/api/vouchers/validate.post.ts` (publik, preview sebelum submit).
- **Pembayaran (Duitku)**: endpoint `/v2/inquiry` dipanggil dari `server/api/payment/create-transaction.post.ts`, satu transaksi Duitku (`duitkuReference`) bisa dibagi ke banyak `Payment` (satu per Order/toko) untuk checkout lintas toko. Untuk VA (BCA/Mandiri/BRI/BNI/KlikPay) dan ShopeePay QRIS, tampilkan nomor VA/QR code di halaman sendiri (`pages/account/pembayaran.vue`, generate QR lokal pakai lib `qrcode` — jangan pakai gambar QR dari domain luar). OVO/DANA tetap redirect ke `paymentUrl` karena butuh otorisasi di app pihak ketiga, tidak bisa dihindari. Webhook: `server/api/payment/callback.post.ts` (verifikasi signature MD5, update banyak Payment/Order sekaligus by `duitkuReference`).
- **Auth**: buyer pakai cookie session (`server/utils/buyer-auth.ts`, `requireBuyerSession`), bukan `nuxt-auth-utils` session untuk sisi pembeli. Admin platform pakai basic auth terpisah (`server/utils/auth.ts`, middleware `admin.ts`). Login pembeli: email OTP + Google reCAPTCHA v3 (bukan Cloudflare Turnstile lagi).

## Konvensi desain (area toko & publik)
Tidak ada component library/layout bersama untuk `/toko/*` — setiap halaman styling manual, ikuti pola persis dari halaman sejenis (mis. `pages/toko/produk.vue`) saat bikin halaman baru:
- Background `#f5f5f2`, teks `#090b0c`, font `'Inter Tight'`.
- Card putih `rounded-3xl`, input `rounded-2xl`, tombol `rounded-full`.
- Warna positif/diskon: hijau `rgb(22,163,74)` / `rgba(34,197,94,...)`.
- Modal: overlay manual `fixed inset-0` + backdrop blur, bukan dari library.
- Navigasi antar halaman toko pakai `NuxtLink` manual dengan query `?store=<id>` untuk konteks toko aktif — bukan route param atau state global.
- Fetch dari halaman ke endpoint milik-toko: `$fetch(url, { headers: useRequestHeaders(['cookie']) })` untuk SSR-aware auth.

## Hal yang gampang salah
- Jangan pakai `prisma migrate dev` — repo ini tidak punya folder migrations, selalu `db push`.
- Data yang dihitung ulang di client (diskon voucher, ongkir, subtotal) harus divalidasi ulang di server sebelum disimpan — terutama di dalam transaksi checkout.
- Hindari baca `localStorage`/`window` langsung di `setup()` composable yang dipakai lintas halaman — pindahkan ke `onMounted` untuk cegah hydration mismatch.
- File template `.vue` di project ini kadang mengandung karakter non-breaking space (` `, misal di `Rp&nbsp;500.000`) — kalau `Edit` tool gagal match padahal teks terlihat identik, cek kemungkinan NBSP tersembunyi.
