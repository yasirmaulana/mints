<template>
  <div class="min-h-screen antialiased" style="background:#f5f5f2;color:#090b0c;font-family:'Inter Tight',system-ui,sans-serif">

    <!-- Navbar -->
    <header class="sticky top-0 z-40 px-5 py-4 md:px-12" style="background:rgba(245,245,242,0.88);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.06)">
      <div class="relative flex h-10 items-center max-w-5xl mx-auto">
        <button class="flex items-center gap-2 text-sm transition-opacity hover:opacity-60" style="color:#090b0c" @click="$router.back()">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Kembali
        </button>

        <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2 font-black text-xl tracking-tighter" style="font-family:'Inter Tight',sans-serif;color:#090b0c;letter-spacing:-0.04em">MINTS</NuxtLink>

        <NuxtLink to="/cart" class="ml-auto relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-normal transition-opacity hover:opacity-85" style="background:#090b0c;color:white">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/></svg>
          Keranjang
          <span v-if="itemCount > 0" class="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1" style="background:#fabc3f;color:#090b0c">{{ itemCount }}</span>
        </NuxtLink>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="pending" class="flex flex-col items-center justify-center py-40 gap-4">
      <div class="w-8 h-8 rounded-full border-2 animate-spin" style="border-color:rgba(9,11,12,0.15);border-top-color:#090b0c" />
      <p class="text-sm" style="color:rgba(9,11,12,0.4)">Memuat produk…</p>
    </div>

    <!-- 404 -->
    <div v-else-if="!product" class="flex flex-col items-center justify-center py-40 gap-4">
      <p class="text-5xl font-normal tracking-tight">○</p>
      <p class="text-lg font-normal" style="color:rgba(9,11,12,0.5)">Produk tidak ditemukan</p>
      <NuxtLink to="/" class="mt-2 rounded-full px-6 py-2.5 text-sm font-normal transition-opacity hover:opacity-85" style="background:#090b0c;color:white">Kembali ke Beranda</NuxtLink>
    </div>

    <!-- Product detail -->
    <template v-else>
      <main class="mx-auto max-w-5xl px-5 py-10 md:px-12">
        <div class="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-14">

          <!-- Gallery -->
          <div class="space-y-3">
            <div
              class="relative overflow-hidden rounded-3xl aspect-[4/5] cursor-zoom-in"
              style="background:rgba(9,11,12,0.05)"
              @click="lightbox = gallery[activeImg]"
            >
              <img
                :src="gallery[activeImg]"
                :alt="product.title"
                class="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]"
              />
              <template v-if="gallery.length > 1">
                <button
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-lg"
                  style="background:rgba(255,255,255,0.85);color:#090b0c;backdrop-filter:blur(8px)"
                  @click.stop="activeImg = (activeImg - 1 + gallery.length) % gallery.length"
                >‹</button>
                <button
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-lg"
                  style="background:rgba(255,255,255,0.85);color:#090b0c;backdrop-filter:blur(8px)"
                  @click.stop="activeImg = (activeImg + 1) % gallery.length"
                >›</button>
              </template>
              <div v-if="product.status === 'SOLD_OUT'" class="absolute inset-0 flex items-center justify-center" style="background:rgba(9,11,12,0.5)">
                <span class="rounded-full px-5 py-2 text-sm font-normal tracking-widest uppercase" style="background:rgba(255,255,255,0.15);color:white;backdrop-filter:blur(8px)">Habis Terjual</span>
              </div>
            </div>

            <div v-if="gallery.length > 1" class="flex gap-2 overflow-x-auto pb-1">
              <button
                v-for="(img, i) in gallery"
                :key="i"
                class="shrink-0 w-16 h-16 rounded-2xl overflow-hidden transition-all"
                :style="i === activeImg ? 'outline:2px solid #090b0c;outline-offset:2px' : 'outline:2px solid transparent;opacity:0.55'"
                @click="activeImg = i"
              >
                <img :src="img" class="w-full h-full object-cover" />
              </button>
            </div>
          </div>

          <!-- Info -->
          <div class="flex flex-col gap-5">
            <!-- Badges -->
            <div class="flex flex-wrap items-center gap-2">
              <span v-if="product.productType === 'PRE_ORDER'" class="rounded-full px-3 py-1 text-xs font-normal tracking-wide" style="background:rgba(9,11,12,0.08);color:#090b0c">Pre-Order</span>
              <span v-if="product.category" class="rounded-full px-3 py-1 text-xs font-normal" style="background:rgba(9,11,12,0.05);color:rgba(9,11,12,0.5)">{{ product.category.name }}</span>
              <span
                class="rounded-full px-3 py-1 text-xs font-normal"
                :style="product.status === 'AVAILABLE' ? 'background:rgba(34,197,94,0.12);color:rgb(22,163,74)' : 'background:rgba(9,11,12,0.05);color:rgba(9,11,12,0.4)'"
              >{{ product.status === 'AVAILABLE' ? 'Tersedia' : 'Habis' }}</span>
            </div>

            <!-- Title & price -->
            <div class="border-b pb-5" style="border-color:rgba(9,11,12,0.1)">
              <h1 class="text-[2rem] font-normal leading-[1.1] tracking-tight md:text-[2.5rem]">{{ product.title }}</h1>
              <p class="mt-3 text-[1.75rem] font-normal tabular-nums tracking-tight">Rp&nbsp;{{ formatPrice(product.price) }}</p>
            </div>

            <!-- Pre-order notice -->
            <div v-if="product.productType === 'PRE_ORDER'" class="rounded-2xl p-4 border" style="background:rgba(250,188,63,0.1);border-color:rgba(250,188,63,0.3)">
              <p class="text-sm font-normal tracking-tight" style="color:#090b0c">Produk Pre-Order</p>
              <p class="mt-1 text-sm" style="color:rgba(9,11,12,0.6)">
                <template v-if="product.estimatedReadyDate">Estimasi selesai: <strong>{{ formatDate(product.estimatedReadyDate) }}</strong></template>
                <template v-else>Estimasi produksi dikonfirmasi setelah pemesanan.</template>
              </p>
            </div>

            <!-- Variants -->
            <div v-if="product.variants?.length" class="space-y-3">
              <div class="flex items-center justify-between">
                <p class="text-sm font-normal">Pilih Ukuran</p>
                <p v-if="selectedVariant" class="text-xs" style="color:rgba(9,11,12,0.45)">{{ selectedVariant.size }}</p>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="v in product.variants"
                  :key="v.id"
                  class="relative rounded-2xl px-5 py-2.5 text-sm font-normal transition-all"
                  :style="variantStyle(v)"
                  :disabled="v.stock === 0 && product.productType !== 'PRE_ORDER'"
                  @click="selectedVariant = v"
                >
                  {{ v.size }}
                  <span v-if="v.stock > 0 && v.stock <= 3" class="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-[9px] font-normal flex items-center justify-center px-1" style="background:#fabc3f;color:#090b0c">{{ v.stock }}</span>
                </button>
              </div>
              <p class="text-xs" style="color:rgba(9,11,12,0.4)">Angka kuning = sisa stok terbatas</p>
            </div>

            <!-- Material -->
            <div v-if="product.material" class="flex items-start gap-3 py-3 border-t" style="border-color:rgba(9,11,12,0.08)">
              <div class="h-px w-5 mt-2 shrink-0" style="background:rgba(9,11,12,0.3)" />
              <div>
                <p class="text-xs font-normal uppercase tracking-[0.12rem] mb-1" style="color:rgba(9,11,12,0.4)">Bahan</p>
                <p class="text-sm" style="color:rgba(9,11,12,0.7)">{{ product.material }}</p>
              </div>
            </div>

            <!-- Description -->
            <p v-if="product.description" class="text-sm leading-7 whitespace-pre-line" style="color:rgba(9,11,12,0.6)">{{ product.description }}</p>

            <!-- CTA -->
            <div class="flex gap-3 pt-2">
              <button
                class="flex-1 rounded-full py-3.5 text-sm font-normal transition-all"
                :style="ctaStyle"
                :disabled="ctaDisabled"
                @click="handleAddToCart"
              >
                <span v-if="addedToCart">✓ Ditambahkan ke Keranjang</span>
                <span v-else-if="product.status === 'SOLD_OUT'">Habis Terjual</span>
                <span v-else-if="product.variants?.length > 0 && !selectedVariant">Pilih Ukuran Dulu</span>
                <span v-else>Tambah ke Keranjang</span>
              </button>
              <NuxtLink
                v-if="itemCount > 0"
                to="/cart"
                class="shrink-0 rounded-full px-5 py-3.5 text-sm font-normal border transition-opacity hover:opacity-70"
                style="border-color:rgba(9,11,12,0.2);color:#090b0c"
              >Lihat Keranjang</NuxtLink>
            </div>

            <!-- Free shipping badge -->
            <div class="flex items-center gap-2 rounded-2xl px-4 py-3" style="background:rgba(9,11,12,0.04)">
              <svg class="w-4 h-4 shrink-0" style="color:rgba(9,11,12,0.5)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 10a2 2 0 002 2h8a2 2 0 002-2L19 8"/></svg>
              <p class="text-xs" style="color:rgba(9,11,12,0.5)">Gratis ongkir untuk pembelian min. <strong style="color:#090b0c">Rp&nbsp;500.000</strong></p>
            </div>
          </div>
        </div>
      </main>
    </template>

    <!-- Lightbox -->
    <ClientOnly>
      <Transition name="fade">
        <div v-if="lightbox" class="fixed inset-0 z-[60] flex items-center justify-center cursor-zoom-out" style="background:rgba(9,11,12,0.92);backdrop-filter:blur(16px)" @click="lightbox = null">
          <img :src="lightbox" class="max-w-full object-contain p-6" style="max-height:90vh" @click.stop />
          <button class="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-xl" style="background:rgba(255,255,255,0.12);color:white" @click="lightbox = null">×</button>
        </div>
      </Transition>
    </ClientOnly>

    <!-- Toast -->
    <Transition name="slide-up">
      <div v-if="toast.visible" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-[70] pointer-events-none">
        <div class="rounded-full px-5 py-3 text-sm font-normal shadow-xl" style="background:#090b0c;color:white">
          ✓ {{ toast.msg }}
        </div>
      </div>
    </Transition>

    <!-- Chat widget -->
    <ClientOnly>
      <ChatWidget v-if="product" :product-id="product.id" />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { addItem, itemCount } = useCart()

interface Variant { id: string; size: string; stock: number }
interface Product {
  id: string; title: string; price: number; imageUrl: string; images: string[]
  status: string; productType: string; material: string | null; description: string | null
  estimatedReadyDate: string | null
  category: { id: string; name: string; slug: string } | null
  variants: Variant[]
}

const { data: product, pending } = await useFetch<Product>(`/api/products/${route.params.id}`)
useSeoMeta({ title: computed(() => product.value ? `${product.value.title} — MINTS` : 'MINTS') })

const activeImg = ref(0)
const gallery = computed(() => product.value ? [product.value.imageUrl, ...(product.value.images ?? [])].filter(Boolean) : [])
const selectedVariant = ref<Variant | null>(null)
const lightbox = ref<string | null>(null)
const addedToCart = ref(false)
const toast = reactive({ visible: false, msg: '' })
let toastTimer: ReturnType<typeof setTimeout>

function variantStyle(v: Variant) {
  if (selectedVariant.value?.id === v.id) return 'background:#090b0c;color:white'
  if (v.stock === 0 && product.value?.productType !== 'PRE_ORDER') {
    return 'background:rgba(9,11,12,0.03);color:rgba(9,11,12,0.25);text-decoration:line-through;cursor:not-allowed'
  }
  return 'background:white;color:#090b0c'
}

const ctaDisabled = computed(() => {
  if (!product.value) return true
  return addedToCart.value || product.value.status === 'SOLD_OUT' || (product.value.variants?.length > 0 && !selectedVariant.value)
})

const ctaStyle = computed(() => {
  if (addedToCart.value) return 'background:rgba(34,197,94,0.15);color:rgb(22,163,74)'
  if (ctaDisabled.value) return 'background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.4);cursor:not-allowed'
  return 'background:#090b0c;color:white'
})

function showToast(msg: string) {
  clearTimeout(toastTimer)
  Object.assign(toast, { visible: true, msg })
  toastTimer = setTimeout(() => { toast.visible = false }, 2500)
}

function handleAddToCart() {
  if (!product.value) return
  addItem({
    productId: product.value.id,
    title: product.value.title,
    imageUrl: product.value.imageUrl,
    price: Number(product.value.price),
    variantId: selectedVariant.value?.id ?? null,
    size: selectedVariant.value?.size ?? null
  })
  addedToCart.value = true
  showToast('Produk ditambahkan ke keranjang')
  setTimeout(() => { addedToCart.value = false }, 2500)
}

function formatPrice(price: number | string) { return Number(price).toLocaleString('id-ID') }
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease }
.fade-enter-from, .fade-leave-to { opacity: 0 }

.slide-up-enter-active, .slide-up-leave-active { transition: all 0.25s ease }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px) }
</style>
