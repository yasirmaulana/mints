interface Buyer {
  id: string
  name: string
  email: string | null
  phone: string
  gender: string | null
  birthDate: string | null
}

export const useAuth = () => {
  const user = useState<Buyer | null>('buyer', () => null)
  const isLoggedIn = computed(() => !!useCookie('buyer_session').value && !!user.value)

  async function fetchMe() {
    if (!useCookie('buyer_session').value) {
      user.value = null
      return
    }
    try {
      user.value = await $fetch<Buyer>('/api/auth/me')
    } catch {
      user.value = null
      useCookie('buyer_session').value = null
    }
  }

  async function logout(redirectTo: string = '/login') {
    await $fetch('/api/auth/logout', { method: 'POST' })
    useCookie('buyer_session').value = null
    user.value = null
    navigateTo(redirectTo)
  }

  return { user, isLoggedIn, fetchMe, logout }
}
