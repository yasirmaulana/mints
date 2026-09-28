// Header keamanan untuk semua respons (halaman SSR maupun API).
//
// CSP yang MEMBLOKIR baru sebatas frame-ancestors/base-uri/object-src. Kebijakan lengkap
// (script-src/connect-src/...) dipasang dulu sebagai Report-Only: browser hanya melaporkan
// pelanggaran ke /api/csp-report tanpa memblokir apa pun. Situs memuat reCAPTCHA, Google Fonts,
// dan pixel analitik (Meta/GTM/TikTok) yang ID-nya diatur admin, jadi daftar sumber yang benar baru
// diketahui dari laporan. Setelah laporan bersih, pindahkan kebijakan ini ke header
// `Content-Security-Policy` (mode memblokir).
const isProd = process.env.NODE_ENV === 'production'

const REPORT_ONLY_POLICY = [
  "default-src 'self'",
  // 'unsafe-inline' sementara diperlukan: Nuxt menyisipkan skrip inline untuk state SSR dan
  // plugins/analytics.client.ts membuat <script> dengan innerHTML. Melindungi skrip inline butuh nonce.
  "script-src 'self' 'unsafe-inline' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://connect.facebook.net https://www.googletagmanager.com https://analytics.tiktok.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  // data:/blob: untuk QR pembayaran (dibuat lokal) dan preview gambar sebelum upload
  "img-src 'self' data: blob: https://www.facebook.com https://www.google-analytics.com https://www.googletagmanager.com",
  // Di dev, HMR Vite memakai websocket ke localhost — tanpa ini laporan dev penuh noise.
  `connect-src 'self' https://www.google.com https://www.google-analytics.com https://*.facebook.com https://analytics.tiktok.com${isProd ? '' : ' ws://localhost:* http://localhost:*'}`,
  'frame-src https://www.google.com/recaptcha/ https://www.googletagmanager.com',
  "media-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  'report-uri /api/csp-report'
].join('; ')

export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    // Cegah situs lain membingkai halaman kita (clickjacking di admin/checkout).
    'Content-Security-Policy': "frame-ancestors 'self'; base-uri 'self'; object-src 'none'",
    // Dievaluasi terpisah dari header di atas; tidak memblokir, hanya melapor.
    'Content-Security-Policy-Report-Only': REPORT_ONLY_POLICY,
    'X-Frame-Options': 'SAMEORIGIN', // untuk browser lama yang belum mengenal frame-ancestors
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    // includeSubDomains/preload sengaja tidak dipakai: memaksa HTTPS di subdomain lain yang belum siap bisa memutus akses.
    ...(isProd ? { 'Strict-Transport-Security': 'max-age=31536000' } : {})
  })
})
