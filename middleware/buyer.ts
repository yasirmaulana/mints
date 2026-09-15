export default defineNuxtRouteMiddleware((to) => {
  const cookie = useCookie('buyer_session')
  if (!cookie.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
