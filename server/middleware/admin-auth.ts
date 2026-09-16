export default defineEventHandler(async (event) => {
  const path = getRequestURL(event).pathname

  // Proteksi semua /api/admin/* kecuali login
  if (!path.startsWith('/api/admin/') || path === '/api/admin/login') return

  await requireAdminSession(event)
})
