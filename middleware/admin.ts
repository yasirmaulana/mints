export default defineNuxtRouteMiddleware((to) => {
  // admin_session is httpOnly; admin_auth is the JS-readable login flag
  const authFlag = useCookie('admin_auth')
  if (!authFlag.value && to.path.startsWith('/admin') && to.path !== '/admin/login') {
    return navigateTo('/admin/login')
  }
})
