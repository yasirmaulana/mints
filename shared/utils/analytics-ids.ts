// Format ID pixel/container analitik. ID ini disisipkan ke dalam <script> di setiap halaman publik
// (plugins/analytics.client.ts), jadi hanya karakter yang memang dipakai ID asli yang boleh lolos —
// nilai bebas bisa keluar dari string JS dan menjalankan kode di browser semua pengunjung.
export type PixelType = 'meta' | 'gtm' | 'tiktok'

const PATTERNS: Record<PixelType, RegExp> = {
  meta: /^\d{5,20}$/,                 // Meta Pixel ID: angka
  gtm: /^GTM-[A-Z0-9]{4,12}$/,        // Google Tag Manager container: GTM-XXXXXXX
  tiktok: /^[A-Za-z0-9]{5,40}$/       // TikTok Pixel ID: alfanumerik
}

export function isPixelType(type: unknown): type is PixelType {
  return type === 'meta' || type === 'gtm' || type === 'tiktok'
}

/** ID yang dipakai plugin untuk tipe ini: containerId untuk GTM, pixelId untuk lainnya. */
export function isValidPixelId(type: PixelType, id: unknown): boolean {
  return typeof id === 'string' && PATTERNS[type].test(id)
}
