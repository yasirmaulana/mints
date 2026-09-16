export default defineEventHandler((event) => {
  deleteCookie(event, 'admin_session', { path: '/' })
  deleteCookie(event, 'admin_auth', { path: '/' })
  return { success: true }
})
