<template>
  <div class="min-h-screen antialiased pb-16 md:pb-0" style="background:#f5f5f2;color:#090b0c;font-family:'Inter Tight',system-ui,sans-serif">

    <HomeHeader v-model="search" @submit="scrollTo('produk')" />

    <main class="px-3 md:px-8">
      <div class="mx-auto max-w-6xl">

        <!-- Banner: carousel utama + 2 banner samping -->
        <section class="mt-3 grid gap-2 lg:grid-cols-[2fr_1fr]">
          <div class="relative overflow-hidden rounded-xl" style="background:#090b0c" @mouseenter="pauseCarousel = true" @mouseleave="pauseCarousel = false">
            <div ref="carouselEl" class="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth no-scrollbar" @scroll.passive="onCarouselScroll">
              <template v-if="mainBanners.length">
                <component
                  :is="b.linkUrl ? (b.linkUrl.startsWith('/') ? NuxtLink : 'a') : 'div'"
                  v-for="b in mainBanners"
                  :key="b.id"
                  v-bind="b.linkUrl ? (b.linkUrl.startsWith('/') ? { to: b.linkUrl } : { href: b.linkUrl, rel: 'noopener' }) : {}"
                  class="block w-full shrink-0 snap-start"
                >
                  <img :src="b.imageUrl" :alt="b.title" class="aspect-[2.2/1] w-full object-cover sm:aspect-[2.5/1]" />
                </component>
                <!-- Banner samping: di desktop tampil terpisah di kanan, di mobile ikut jadi slide -->
                <component
                  :is="b.linkUrl ? (b.linkUrl.startsWith('/') ? NuxtLink : 'a') : 'div'"
                  v-for="b in sideBanners"
                  :key="`m-${b.id}`"
                  v-bind="b.linkUrl ? (b.linkUrl.startsWith('/') ? { to: b.linkUrl } : { href: b.linkUrl, rel: 'noopener' }) : {}"
                  class="block w-full shrink-0 snap-start lg:hidden"
                >
                  <img :src="b.imageUrl" :alt="b.title" class="aspect-[2.2/1] w-full object-cover sm:aspect-[2.5/1]" />
                </component>
              </template>
              <!-- Fallback bila admin belum mengunggah banner -->
              <div v-else class="flex aspect-[2.2/1] w-full shrink-0 flex-col items-start justify-center px-6 sm:aspect-[2.5/1] md:px-12">
                <span class="mb-2 text-xs uppercase tracking-[0.16rem]" style="color:#fabc3f">Modest Fashion Premium</span>
                <h1 class="text-2xl font-normal leading-tight text-white md:text-5xl">Elegan. <em style="opacity:.7">Syar'i.</em><br>Dibuat Sepenuh Hati.</h1>
                <a href="#produk" class="mt-4 rounded-full bg-white px-5 py-2 text-sm" style="color:#090b0c">Belanja Sekarang</a>
              </div>
            </div>
            <div v-if="mainBanners.length + sideBanners.length > 1" class="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              <button
                v-for="(b, i) in [...mainBanners, ...sideBanners]" :key="b.id"
                class="h-1.5 rounded-full transition-all"
                :class="i >= mainBanners.length ? 'lg:hidden' : ''"
                :style="`width:${i === bannerIndex ? 18 : 6}px;background:${i === bannerIndex ? 'white' : 'rgba(255,255,255,.5)'}`"
                :aria-label="`Banner ${i + 1}`"
                @click="goToBanner(i)"
              />
            </div>
          </div>

          <div v-if="sideBanners.length" class="hidden gap-2 lg:grid lg:grid-rows-2">
            <component
              :is="b.linkUrl ? (b.linkUrl.startsWith('/') ? NuxtLink : 'a') : 'div'"
              v-for="b in sideBanners.slice(0, 2)"
              :key="b.id"
              v-bind="b.linkUrl ? (b.linkUrl.startsWith('/') ? { to: b.linkUrl } : { href: b.linkUrl, rel: 'noopener' }) : {}"
              class="block overflow-hidden rounded-xl"
            >
              <img :src="b.imageUrl" :alt="b.title" class="h-full w-full object-cover" />
            </component>
          </div>
        </section>

        <!-- Kategori: ikon geser horizontal -->
        <section id="kategori" class="mt-3 rounded-xl bg-white p-4">
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-sm font-bold uppercase tracking-wider" style="color:rgba(9,11,12,0.6)">Kategori</h2>
            <NuxtLink to="/kategori" class="text-sm" style="color:rgba(9,11,12,0.6)">Lihat Semua ›</NuxtLink>
          </div>
          <!-- 2 baris; 3 kolom terlihat di mobile, 5 di desktop; sisanya digeser horizontal (swipe / tombol panah di desktop) -->
          <div v-if="categories?.length" class="relative">
            <div ref="catEl" class="no-scrollbar grid snap-x snap-mandatory grid-flow-col grid-rows-2 auto-cols-[33.333%] gap-y-2 overflow-x-auto md:auto-cols-[20%]" @scroll.passive="updateCatArrows">
              <NuxtLink
                v-for="cat in categories" :key="cat.id"
                :to="`/kategori/${cat.slug}`"
                class="mx-1 flex snap-start flex-col items-center gap-1.5 rounded-xl border px-1 py-2.5 transition-colors hover:bg-black/[0.03]"
                style="border-color:rgba(9,11,12,0.12)"
              >
                <span class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full md:h-16 md:w-16" style="background:#f5f5f2">
                  <img v-if="cat.imageUrl" :src="cat.imageUrl" :alt="cat.name" class="h-full w-full object-cover" />
                  <span v-else class="text-lg font-bold" style="color:rgba(9,11,12,0.4)">{{ cat.name.charAt(0) }}</span>
                </span>
                <span class="line-clamp-2 text-center text-[11px] leading-tight md:text-xs">{{ cat.name }}</span>
              </NuxtLink>
            </div>
            <!-- Tanda bisa digeser (desktop) -->
            <button
              v-show="catCanPrev" class="absolute -left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-md md:flex"
              style="border-color:rgba(9,11,12,0.12)" aria-label="Kategori sebelumnya" @click="scrollCats(-1)"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button
              v-show="catCanNext" class="absolute -right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border bg-white shadow-md md:flex"
              style="border-color:rgba(9,11,12,0.12)" aria-label="Kategori berikutnya" @click="scrollCats(1)"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
          <div v-else class="flex gap-4">
            <div v-for="i in 6" :key="i" class="h-14 w-14 shrink-0 animate-pulse rounded-full" style="background:rgba(9,11,12,0.06)" />
          </div>
        </section>

        <!-- Flash Sale -->
        <section v-if="flashProducts.length" class="mt-3 overflow-hidden rounded-xl bg-white">
          <div class="flex items-center justify-between px-4 py-3" style="border-bottom:1px solid rgba(9,11,12,0.06)">
            <div class="flex items-center gap-3">
              <h2 class="text-base font-black uppercase tracking-tight md:text-lg" style="color:#ef4444">⚡ Flash Sale</h2>
              <div v-if="countdown" class="flex items-center gap-1 text-xs font-bold tabular-nums">
                <span v-for="(c, i) in countdown" :key="i" class="rounded px-1.5 py-0.5" style="background:#090b0c;color:white">{{ c }}</span>
              </div>
            </div>
            <NuxtLink to="/flash_sale" class="text-sm" style="color:rgba(9,11,12,0.6)">Lihat Semua ›</NuxtLink>
          </div>
          <div class="no-scrollbar flex gap-2 overflow-x-auto p-3">
            <NuxtLink v-for="p in flashProducts" :key="p.id" :to="`/products/${p.id}`" class="w-[130px] shrink-0 md:w-[160px]">
              <div class="relative aspect-square overflow-hidden rounded-lg" style="background:rgba(9,11,12,0.05)">
                <img :src="p.imageUrl" :alt="p.title" class="h-full w-full object-cover" />
                <span v-if="discountPct(p)" class="absolute right-0 top-0 rounded-bl-lg px-1.5 py-1 text-[11px] font-bold" style="background:#fabc3f;color:#090b0c">-{{ discountPct(p) }}%</span>
              </div>
              <p class="mt-1.5 text-sm font-semibold tabular-nums" style="color:#ef4444">Rp&nbsp;{{ formatPrice(p.price) }}</p>
              <p v-if="p.status === 'SOLD_OUT'" class="text-[11px]" style="color:rgba(9,11,12,0.5)">Habis</p>
            </NuxtLink>
          </div>
        </section>

        <!-- Produk -->
        <section id="produk" class="mt-3 scroll-mt-24">
          <h2 class="py-3 text-center text-base font-bold uppercase tracking-wider md:text-lg" style="color:#090b0c">
            {{ search ? `Hasil "${search}"` : 'Rekomendasi' }}
          </h2>

          <div v-if="pending" class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <div v-for="i in 10" :key="i" class="aspect-[3/4] animate-pulse rounded-xl" style="background:rgba(9,11,12,0.06)" />
          </div>

          <div v-else-if="!filteredProducts.length" class="rounded-xl bg-white py-20 text-center">
            <p class="text-lg" style="color:rgba(9,11,12,0.5)">Tidak ada produk ditemukan</p>
            <button class="mt-3 text-sm underline underline-offset-4" style="color:rgba(9,11,12,0.5)" @click="search = ''">Reset pencarian</button>
          </div>

          <div v-else class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <NuxtLink
              v-for="(product, i) in visibleProducts" :key="product.id"
              :to="`/products/${product.id}`"
              class="group flex-col overflow-hidden rounded-xl bg-white transition-shadow hover:shadow-lg"
              :class="rowClass(i)"
            >
              <div class="relative aspect-square overflow-hidden" style="background:rgba(9,11,12,0.05)">
                <img
                  :src="product.imageUrl" :alt="product.title" loading="lazy"
                  class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  @error="(e) => ((e.target as HTMLImageElement).style.opacity = '0')"
                />
                <div v-if="product.status === 'SOLD_OUT'" class="absolute inset-0 flex items-center justify-center" style="background:rgba(9,11,12,0.55)">
                  <span class="rounded-full px-3 py-1 text-xs uppercase tracking-widest" style="background:rgba(255,255,255,0.2);color:white">Habis</span>
                </div>
                <span v-if="discountPct(product)" class="absolute right-0 top-0 rounded-bl-lg px-1.5 py-1 text-[11px] font-bold" style="background:#fabc3f;color:#090b0c">-{{ discountPct(product) }}%</span>
                <div class="absolute left-0 top-2 flex flex-col gap-1">
                  <span v-if="product.sessionId" class="rounded-r px-1.5 py-0.5 text-[10px] font-bold" style="background:#ef4444;color:white">Flash Sale</span>
                  <span v-if="product.productType === 'PRE_ORDER'" class="rounded-r px-1.5 py-0.5 text-[10px]" style="background:#090b0c;color:white">Pre-Order</span>
                  <span v-if="isNew(product)" class="rounded-r px-1.5 py-0.5 text-[10px]" style="background:#fabc3f;color:#090b0c">Baru</span>
                </div>
              </div>
              <div class="flex flex-1 flex-col gap-1 p-2.5">
                <p class="line-clamp-2 min-h-[2.5rem] text-sm leading-snug">{{ product.title }}</p>
                <div class="mt-auto flex items-baseline gap-1.5">
                  <p class="text-base font-bold tabular-nums">Rp&nbsp;{{ formatPrice(product.price) }}</p>
                  <p v-if="product.originalPrice" class="text-[11px] line-through tabular-nums" style="color:rgba(9,11,12,0.4)">{{ formatPrice(product.originalPrice) }}</p>
                </div>
                <p v-if="product.store?.name" class="truncate text-[11px]" style="color:rgba(9,11,12,0.5)">
                  {{ product.store.name }}<template v-if="product.store.cityName"> · {{ product.store.cityName }}</template>
                </p>
              </div>
            </NuxtLink>
          </div>

          <!-- Produk lainnya hanya untuk pengguna yang sudah login -->
          <div v-if="filteredProducts.length > 0 && (!isLoggedIn || filteredProducts.length > visibleCount)" class="mt-5 text-center">
            <button
              v-if="isLoggedIn"
              class="rounded-full px-10 py-3 text-sm font-normal transition-opacity hover:opacity-85"
              style="background:#090b0c;color:white"
              @click="visibleCount += MAX_PRODUCTS"
            >Lihat Lainnya</button>
            <NuxtLink
              v-else
              to="/login?redirect=/"
              class="inline-block rounded-full px-10 py-3 text-sm font-normal transition-opacity hover:opacity-85"
              style="background:#090b0c;color:white"
            >Masuk untuk Lihat Lainnya</NuxtLink>
          </div>
        </section>
      </div>
    </main>

    <!-- Direktori kategori & subkategori -->
    <section v-if="categories?.length" class="px-5 pt-10 md:px-12" style="background:#f5f5f2">
      <div class="mx-auto max-w-6xl border-t pt-8" style="border-color:rgba(9,11,12,0.1)">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-sm font-bold" style="color:#090b0c">Kategori</h2>
          <NuxtLink to="/kategori" class="text-xs hover:underline" style="color:rgba(9,11,12,0.6)">Semua Kategori ›</NuxtLink>
        </div>
        <div class="columns-2 gap-8 md:columns-3 lg:columns-5">
          <div v-for="cat in categoriesByName" :key="cat.id" class="mb-5 break-inside-avoid">
            <NuxtLink :to="`/kategori/${cat.slug}`" class="mb-1.5 block text-xs font-bold uppercase tracking-wide hover:underline">{{ cat.name }}</NuxtLink>
            <p class="text-xs leading-[1.7]" style="color:rgba(9,11,12,0.6)">
              <template v-for="(sub, i) in cat.children" :key="sub.id">
                <NuxtLink :to="`/kategori/${sub.slug}`" class="hover:text-[#090b0c] hover:underline">{{ sub.name }}</NuxtLink><span v-if="i < cat.children.length - 1" style="color:#fabc3f"> | </span>
              </template>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="overflow-hidden px-5 pt-20 pb-10 md:px-12" style="background:#f5f5f2">
      <div class="mx-auto max-w-6xl">
        <div class="mb-16 grid gap-10 sm:grid-cols-3">
          <div>
            <p class="font-black text-xl tracking-tighter mb-3" style="font-family:'Inter Tight',sans-serif;letter-spacing:-0.04em">MINTS</p>
            <p class="text-sm leading-6" style="color:rgba(9,11,12,0.5)">Elegan. Syar'i.<br>Dibuat Sepenuh Hati.</p>
          </div>
          <div>
            <p class="mb-4 text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.4)">Belanja</p>
            <ul class="space-y-3 text-sm" style="color:rgba(9,11,12,0.6)">
              <li><NuxtLink to="/account/orders" class="transition-colors hover:text-[#090b0c]">Pesanan Saya</NuxtLink></li>
              <li><NuxtLink to="/flash_sale" class="transition-colors hover:text-[#090b0c]">Flash Sale</NuxtLink></li>
              <li><NuxtLink to="/cart" class="transition-colors hover:text-[#090b0c]">Keranjang</NuxtLink></li>
            </ul>
          </div>
          <div>
            <p class="mb-4 text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.4)">Perusahaan</p>
            <ul class="space-y-3 text-sm" style="color:rgba(9,11,12,0.6)">
              <li><NuxtLink to="/tentang-kami" class="transition-colors hover:text-[#090b0c]">Tentang Kami</NuxtLink></li>
              <li><NuxtLink to="/panduan-ukuran" class="transition-colors hover:text-[#090b0c]">Panduan Ukuran</NuxtLink></li>
              <li><NuxtLink to="/kebijakan-pengembalian" class="transition-colors hover:text-[#090b0c]">Kebijakan Pengembalian</NuxtLink></li>
              <li><NuxtLink to="/faq" class="transition-colors hover:text-[#090b0c]">FAQ</NuxtLink></li>
            </ul>
          </div>
        </div>

        <div class="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style="border-color:rgba(9,11,12,0.1)">
          <p class="text-xs" style="color:rgba(9,11,12,0.4)">© 2026 Mints. Semua hak dilindungi.</p>
          <p class="text-xs" style="color:rgba(9,11,12,0.3)">Powered by <a href="https://otomatisin.web.id" target="_blank" rel="noopener" style="color:rgba(9,11,12,0.5);text-decoration:underline;text-underline-offset:3px">Otomatisin</a></p>
          <div class="flex gap-4 text-xs" style="color:rgba(9,11,12,0.4)">
            <NuxtLink to="/privasi" class="hover:text-[#090b0c] transition-colors">Privasi</NuxtLink>
            <NuxtLink to="/syarat-ketentuan" class="hover:text-[#090b0c] transition-colors">Syarat & Ketentuan</NuxtLink>
          </div>
        </div>
      </div>
    </footer>

    <MobileBottomNav />

    <!-- Chat widget -->
    <ClientOnly>
      <ChatWidget />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'MINTS — Modest Fashion Premium',
  description: "Koleksi pakaian muslimah premium. Elegan. Syar'i. Dibuat Sepenuh Hati."
})

const NuxtLink = resolveComponent('NuxtLink')

interface Category { id: string; name: string; slug: string; imageUrl: string | null; children: { id: string; name: string; slug: string }[]; _count: { products: number } }
interface ProductVariant { id: string; size: string; stock: number }
interface Product {
  id: string; title: string; price: number; originalPrice?: number | null; imageUrl: string; status: string
  productType: string; categoryId: string | null; createdAt: string; sessionId?: string | null
  category: { id: string; name: string; slug: string } | null
  store?: { id: string; name: string; cityName?: string | null } | null
  variants: ProductVariant[]
}
interface Banner { id: string; title: string; imageUrl: string; linkUrl: string | null; position: 'MAIN' | 'SIDE' }

const { data: categories } = await useFetch<Category[]>('/api/categories')
const { data: products, pending } = await useFetch<Product[]>('/api/products')
const { data: banners } = await useFetch<Banner[]>('/api/banners')

const mainBanners = computed(() => (banners.value ?? []).filter(b => b.position === 'MAIN'))
const sideBanners = computed(() => (banners.value ?? []).filter(b => b.position === 'SIDE'))

// Flash sale: sesi yang sedang berjalan + produknya
const { data: flash } = await useAsyncData('home-flash', async () => {
  const sessions = await <any[]>('/api/flash-sale/config')
  const running = sessions.find(s => s.isRunning)
  if (!running) return { endTime: null, products: [] as Product[] }
  const list = await <Product[]>('/api/products', { query: { sessionId: running.id } })
  return { endTime: running.endTime as string, products: list }
})
const flashProducts = computed(() => flash.value?.products ?? [])

// ?q= datang dari pencarian di halaman lain (mis. Semua Kategori)
const search = ref(String(useRoute().query.q ?? ''))
const { isLoggedIn } = useAuth()

// 5 baris per breakpoint: 2 kolom (10) → 3 (15) → 4 (20) → 5 (25 produk)
const MAX_PRODUCTS = 25
const visibleCount = ref(MAX_PRODUCTS)
function rowClass(i: number) {
  if (visibleCount.value > MAX_PRODUCTS) return 'flex' // sudah diperluas: tampilkan semua
  if (i < 10) return 'flex'
  if (i < 15) return 'hidden sm:flex'
  if (i < 20) return 'hidden md:flex'
  return 'hidden lg:flex'
}

const filteredProducts = computed(() => {
  let list = products.value ?? []
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(p => p.title.toLowerCase().includes(q))
  }
  return list
})
const visibleProducts = computed(() => filteredProducts.value.slice(0, visibleCount.value))
watch(search, () => { visibleCount.value = MAX_PRODUCTS })

function isNew(product: Product) {
  return Date.now() - new Date(product.createdAt).getTime() < 14 * 24 * 60 * 60 * 1000
}

function discountPct(p: Product) {
  const orig = Number(p.originalPrice ?? 0)
  const price = Number(p.price)
  return orig > price ? Math.round((1 - price / orig) * 100) : 0
}

function formatPrice(price: number | string) {
  return Number(price).toLocaleString('id-ID')
}

// Urutan sesuai kategori.md / abjad untuk direktori; `categories` sendiri terurut menurut jumlah produk
const categoriesByName = computed(() => [...(categories.value ?? [])].sort((a, b) => a.name.localeCompare(b.name)))

function scrollTo(id: string) {
  if (import.meta.client) {
    nextTick(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
}

// Carousel banner: autoplay dan countdown hanya jalan di client (hindari hydration mismatch)
const carouselEl = ref<HTMLElement | null>(null)
const bannerIndex = ref(0)
const pauseCarousel = ref(false)

function onCarouselScroll() {
  const el = carouselEl.value
  if (el && el.clientWidth) bannerIndex.value = Math.round(el.scrollLeft / el.clientWidth)
}
function goToBanner(i: number) {
  carouselEl.value?.scrollTo({ left: i * carouselEl.value.clientWidth, behavior: 'smooth' })
}

// Slider kategori: tombol panah untuk desktop (mouse tidak bisa swipe)
const catEl = ref<HTMLElement | null>(null)
const catCanPrev = ref(false)
const catCanNext = ref(false)
function updateCatArrows() {
  const el = catEl.value
  if (!el) return
  catCanPrev.value = el.scrollLeft > 4
  catCanNext.value = el.scrollLeft + el.clientWidth < el.scrollWidth - 4
}
function scrollCats(dir: 1 | -1) {
  const el = catEl.value
  if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' })
}

const now = ref(0)
const countdown = computed(() => {
  if (!flash.value?.endTime || !now.value) return null
  const left = Math.max(0, new Date(flash.value.endTime).getTime() - now.value)
  const s = Math.floor(left / 1000)
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map(n => String(n).padStart(2, '0'))
})

onMounted(() => {
  updateCatArrows()
  window.addEventListener('resize', updateCatArrows, { passive: true })
  now.value = Date.now()
  const tick = setInterval(() => { now.value = Date.now() }, 1000)
  const auto = setInterval(() => {
    // hitung slide yang benar-benar tampil (slide samping tersembunyi di desktop)
    const n = [...(carouselEl.value?.children ?? [])].filter(c => (c as HTMLElement).offsetParent !== null).length
    if (n > 1 && !pauseCarousel.value) goToBanner((bannerIndex.value + 1) % n)
  }, 4500)
  onBeforeUnmount(() => { clearInterval(tick); clearInterval(auto); window.removeEventListener('resize', updateCatArrows) })
})
</script>

<style scoped>
.no-scrollbar { scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
