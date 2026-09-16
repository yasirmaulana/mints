export default defineEventHandler((event) => {
  deleteCookie(event, 'buyer_session', { path: '/' })
  deleteCookie(event, 'buyer_auth', { path: '/' })
  return { success: true }
})
