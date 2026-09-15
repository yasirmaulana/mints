export default defineEventHandler((event) => {
  deleteCookie(event, 'buyer_session', { path: '/' })
  return { success: true }
})
