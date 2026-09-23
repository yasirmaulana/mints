// Validasi slug toko — PRD_Multi_Toko_Langganan.md §6.1.
// Slug dipakai sebagai rute publik /toko/{slug}, jadi tidak boleh menabrak rute aplikasi.

const RESERVED_SLUGS = new Set([
  'admin', 'api', 'account', 'checkout', 'cart', 'login', 'logout', 'register',
  'mints', 'orders', 'track', 'faq', 'privasi', 'syarat-ketentuan',
  'kebijakan-pengembalian', 'panduan-ukuran', 'tentang-kami', 'flash-sale',
  'koleksi', 'products', 'toko', 'store', 'stores', 'plans', 'subscription',
  'assets', '_nuxt', 'favicon', 'sitemap', 'robots',
  'aktivasi', 'dashboard', 'produk', 'pesanan'
])

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

export function validateStoreSlug(slug: string): { ok: true } | { ok: false; message: string } {
  if (slug.length < 3 || slug.length > 40) {
    return { ok: false, message: 'Slug toko harus 3–40 karakter' }
  }
  if (!SLUG_PATTERN.test(slug)) {
    return { ok: false, message: 'Slug hanya boleh huruf kecil, angka, dan tanda hubung (tidak di awal/akhir)' }
  }
  if (RESERVED_SLUGS.has(slug)) {
    return { ok: false, message: 'Slug ini tidak dapat digunakan' }
  }
  return { ok: true }
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
}
