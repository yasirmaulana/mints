export default defineNuxtRouteMiddleware((to) => {
  // buyer_session is httpOnly so JS can't read it; buyer_auth is the JS-readable login flag
  const authFlag = useCookie('buyer_auth')
  if (!authFlag.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
