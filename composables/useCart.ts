const CART_KEY = 'mints-cart'
const CART_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export interface CartItem {
  productId: string
  storeId: string | null
  storeName: string | null
  title: string
  imageUrl: string
  price: number
  variantId: string | null
  size: string | null
  qty: number
  source?: 'REGULAR' | 'FLASH_SALE' | 'OFFLINE'
}

interface CartStore {
  items: CartItem[]
  savedAt: number
}

function readStorage(): CartItem[] {
  if (!process.client) return []
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const store: CartStore = JSON.parse(raw)
    if (Date.now() - store.savedAt > CART_TTL_MS) { localStorage.removeItem(CART_KEY); return [] }
    return store.items
  } catch { return [] }
}

function writeStorage(items: CartItem[]) {
  if (!process.client) return
  try { localStorage.setItem(CART_KEY, JSON.stringify({ items, savedAt: Date.now() })) } catch {}
}

const cartItems = ref<CartItem[]>([])
let hydrated = false

export function useCart() {
  // Baca localStorage setelah mount (bukan saat setup) — mencegah hydration mismatch,
  // karena render SSR pertama selalu menganggap cart kosong.
  if (process.client && !hydrated) {
    hydrated = true
    onMounted(() => { cartItems.value = readStorage() })
  }

  const itemCount = computed(() => cartItems.value.reduce((s, i) => s + i.qty, 0))
  const subtotal = computed(() => cartItems.value.reduce((s, i) => s + i.price * i.qty, 0))

  function addItem(item: Omit<CartItem, 'qty'>) {
    const existing = cartItems.value.find(
      i => i.productId === item.productId && i.variantId === item.variantId
    )
    if (existing) {
      existing.qty++
    } else {
      cartItems.value.push({ ...item, qty: 1 })
    }
    writeStorage(cartItems.value)
  }

  function removeItem(productId: string, variantId: string | null) {
    cartItems.value = cartItems.value.filter(
      i => !(i.productId === productId && i.variantId === variantId)
    )
    writeStorage(cartItems.value)
  }

  function updateQty(productId: string, variantId: string | null, qty: number) {
    const item = cartItems.value.find(
      i => i.productId === productId && i.variantId === variantId
    )
    if (!item) return
    if (qty <= 0) { removeItem(productId, variantId); return }
    item.qty = qty
    writeStorage(cartItems.value)
  }

  function clearCart() {
    cartItems.value = []
    if (process.client) localStorage.removeItem(CART_KEY)
  }

  // Kelompokkan keranjang per toko untuk checkout lintas toko — PRD §9/§11 Fase 5.
  // Item tanpa storeId (data lama) dikelompokkan di bawah key 'null'.
  const groupedByStore = computed(() => {
    const groups = new Map<string, { storeId: string | null; storeName: string | null; items: CartItem[]; subtotal: number }>()
    for (const item of cartItems.value) {
      const key = item.storeId || 'null'
      if (!groups.has(key)) groups.set(key, { storeId: item.storeId, storeName: item.storeName, items: [], subtotal: 0 })
      const g = groups.get(key)!
      g.items.push(item)
      g.subtotal += item.price * item.qty
    }
    return Array.from(groups.values())
  })

  return { cartItems, itemCount, subtotal, groupedByStore, addItem, removeItem, updateQty, clearCart }
}
