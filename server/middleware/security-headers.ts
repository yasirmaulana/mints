// Header keamanan untuk semua respons (halaman SSR maupun API).
// Sengaja TIDAK memasang CSP penuh (script-src/connect-src/...): situs memuat reCAPTCHA, Google Fonts,
// dan pixel analitik (Meta/GTM/TikTok) yang ID-nya diatur admin, jadi CSP ketat butuh daftar sumber yang
// diuji di browser. Yang dipasang di sini aman tanpa mengubah perilaku situs.
const isProd = process.env.NODE_ENV === 'production'

export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    // Cegah situs lain membingkai halaman kita (clickjacking di admin/checkout).
    'Content-Security-Policy': "frame-ancestors 'self'; base-uri 'self'; object-src 'none'",
    'X-Frame-Options': 'SAMEORIGIN', // untuk browser lama yang belum mengenal frame-ancestors
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    // includeSubDomains/preload sengaja tidak dipakai: memaksa HTTPS di subdomain lain yang belum siap bisa memutus akses.
    ...(isProd ? { 'Strict-Transport-Security': 'max-age=31536000' } : {})
  })
})
