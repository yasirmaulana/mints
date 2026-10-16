// State chat global: panel terbuka/tertutup dan toko tujuan (dari tombol "Chat Penjual").
export function useChat() {
  const open = useState('chat-open', () => false)
  const pendingStoreId = useState<string | null>('chat-pending-store', () => null)
  const { isLoggedIn, fetchMe } = useAuth()
  const route = useRoute()

  /** Buka panel chat; bila `storeId` diberikan, langsung masuk ke percakapan dengan toko itu. */
  async function openChat(storeId?: string) {
    if (!isLoggedIn.value) await fetchMe()
    if (!isLoggedIn.value) {
      return navigateTo(`/login?redirect=${encodeURIComponent(route.fullPath)}`)
    }
    pendingStoreId.value = storeId ?? null
    open.value = true
  }

  return { open, pendingStoreId, openChat }
}
