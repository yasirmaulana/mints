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
  // buyer_session is httpOnly; buyer_auth is the JS-readable login flag
  const authFlag = useCookie('buyer_auth')
  const isLoggedIn = computed(() => !!authFlag.value && !!user.value)

  async function fetchMe() {
    if (!authFlag.value) {
      user.value = null
      return
    }
    try {
      user.value = await $fetch<Buyer>('/api/auth/me')
    } catch {
      user.value = null
      authFlag.value = null
    }
  }

  async function logout(redirectTo: string = '/login') {
    await $fetch('/api/auth/logout', { method: 'POST' })
    authFlag.value = null
    user.value = null
    navigateTo(redirectTo)
  }

  return { user, isLoggedIn, fetchMe, logout }
}
