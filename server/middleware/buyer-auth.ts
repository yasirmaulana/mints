export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/buyer/')) {
    // Verifikasi tanda tangan token, bukan sekadar cek cookie ada — cookie mentah bisa dipalsukan.
    if (!(await getBuyerId(event))) {
      throw createError({ statusCode: 401, statusMessage: 'Login diperlukan' })
    }
  }
})
