// Endpoint /api/admin/* yang boleh diakses tanpa sesi admin: alur login OTP.
const PUBLIC_ADMIN_PATHS = new Set(['/api/admin/send-otp', '/api/admin/verify-otp'])

export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // Proteksi semua /api/admin/* kecuali alur login
  if (!path.startsWith('/api/admin/') || PUBLIC_ADMIN_PATHS.has(path)) return

  await requireAdminSession(event)
})
