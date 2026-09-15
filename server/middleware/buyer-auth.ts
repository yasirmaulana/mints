export default defineEventHandler((event) => {
  if (event.path.startsWith('/api/buyer/')) {
    const buyerId = getCookie(event, 'buyer_session')
    if (!buyerId) {
      throw createError({ statusCode: 401, statusMessage: 'Login diperlukan' })
    }
  }
})
