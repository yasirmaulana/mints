<template>
  <div class="min-h-screen antialiased pb-16 md:pb-0" style="background:#f5f5f2;color:#090b0c;font-family:'Inter Tight',system-ui,sans-serif">

    <!-- Header sticky: logo + search + aksi -->
    <header class="sticky top-0 z-50" style="background:rgba(245,245,242,0.95);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.08)">
      <!-- Link atas (desktop) -->
      <div class="hidden md:block px-8">
        <div class="mx-auto flex max-w-6xl items-center justify-between py-1.5 text-xs" style="color:rgba(9,11,12,0.55)">
          <div class="flex gap-5">
            <NuxtLink to="/koleksi" class="hover:text-[#090b0c]">Koleksi</NuxtLink>
            <NuxtLink to="/flash_sale" class="hover:text-[#090b0c]">Flash Sale</NuxtLink>
            <NuxtLink to="/tentang-kami" class="hover:text-[#090b0c]">Tentang Kami</NuxtLink>
            <NuxtLink to="/faq" class="hover:text-[#090b0c]">Bantuan</NuxtLink>
          </div>
          <div class="flex gap-5">
            <template v-if="isLoggedIn">
              <NuxtLink to="/account/orders" class="hover:text-[#090b0c]">Pesanan Saya</NuxtLink>
              <NuxtLink to="/account" class="hover:text-[#090b0c]">Akun</NuxtLink>
            </template>
            <NuxtLink v-else to="/login" class="hover:text-[#090b0c]">Masuk / Daftar</NuxtLink>
          </div>
        </div>
      </div>

      <div class="px-4 py-3 md:px-8">
        <div class="mx-auto flex max-w-6xl items-center gap-3 md:gap-8">
          <NuxtLink to="/" class="shrink-0 text-xl font-black" style="letter-spacing:-0.04em">MINTS</NuxtLink>

          <form class="relative flex-1" @submit.prevent="scrollTo('produk')">
            <input
              v-model="search"
              type="search"
              placeholder="Cari gamis, abaya, hijab..."
              class="h-10 w-full rounded-full border bg-white pl-4 pr-12 text-sm focus:outline-none"
              style="border-color:rgba(9,11,12,0.15);color:#090b0c"
            />
            <button type="submit" class="absolute right-1 top-1 flex h-8 w-9 items-center justify-center rounded-full" style="background:#090b0c;color:white" aria-label="Cari">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </button>
          </form>

          <NuxtLink to="/cart" class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full" aria-label="Keranjang">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/></svg>
            <span v-if="itemCount > 0" class="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold" style="background:#fabc3f;color:#090b0c">{{ itemCount }}</span>
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="px-3 md:px-8">
      <div class="mx-auto max-w-6xl">

        <!-- Banner: carousel utama + 2 banner samping -->
        <section class="mt-3 grid gap-2 lg:grid-cols-[2fr_1fr]">
          <div class="relative overflow-hidden rounded-xl" style="background:#090b0c" @mouseenter="pauseCarousel = true" @mouseleave="pauseCarousel = false">
            <div ref="carouselEl" class="flex snap-x snap-mandatory overflow-x-auto scroll-smooth no-scrollbar" @scroll.passive="onCarouselScroll">
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
              </template>
              <!-- Fallback bila admin belum mengunggah banner -->
              <div v-else class="flex aspect-[2.2/1] w-full shrink-0 flex-col items-start justify-center px-6 sm:aspect-[2.5/1] md:px-12">
                <span class="mb-2 text-xs uppercase tracking-[0.16rem]" style="color:#fabc3f">Modest Fashion Premium</span>
                <h1 class="text-2xl font-normal leading-tight text-white md:text-5xl">Elegan. <em style="opacity:.7">Syar'i.</em><br>Dibuat Sepenuh Hati.</h1>
                <a href="#produk" class="mt-4 rounded-full bg-white px-5 py-2 text-sm" style="color:#090b0c">Belanja Sekarang</a>
              </div>
            </div>
            <div v-if="mainBanners.length > 1" class="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
              <button
                v-for="(b, i) in mainBanners" :key="b.id"
                class="h-1.5 rounded-full transition-all"
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
          <h2 class="mb-3 text-sm font-bold uppercase tracking-wider" style="color:rgba(9,11,12,0.6)">Kategori</h2>
          <!-- 2 baris × 5 kolom terlihat (10 kategori); sisanya digeser horizontal (swipe / tombol panah di desktop) -->
          <div v-if="categories?.length" class="relative">
            <div ref="catEl" class="no-scrollbar grid snap-x snap-mandatory grid-flow-col grid-rows-2 gap-y-2 overflow-x-auto" style="grid-auto-columns:20%" @scroll.passive="updateCatArrows">
              <button
                v-for="cat in categories" :key="cat.id"
                class="mx-1 flex snap-start flex-col items-center gap-1.5 rounded-xl border px-1 py-2.5 transition-colors hover:bg-black/[0.03]"
                :style="`border-color:${activeCategory === cat.id ? '#090b0c' : 'rgba(9,11,12,0.12)'}`"
                @click="activeCategory = activeCategory === cat.id ? null : cat.id; scrollTo('produk')"
              >
                <span class="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full md:h-16 md:w-16" style="background:#f5f5f2">
                  <img v-if="cat.imageUrl" :src="cat.imageUrl" :alt="cat.name" class="h-full w-full object-cover" />
                  <span v-else class="text-lg font-bold" style="color:rgba(9,11,12,0.4)">{{ cat.name.charAt(0) }}</span>
                </span>
                <span class="line-clamp-2 text-center text-[11px] leading-tight md:text-xs" :style="activeCategory === cat.id ? 'font-weight:700' : ''">{{ cat.name }}</span>
              </button>
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
          <div class="sticky top-[57px] z-30 -mx-3 flex flex-wrap items-center justify-between gap-2 px-3 py-2 md:top-[89px] md:mx-0 md:px-0" style="background:#f5f5f2">
            <h2 class="text-sm font-bold uppercase tracking-wider" style="color:rgba(9,11,12,0.6)">
              {{ search ? `Hasil "${search}"` : activeCategory ? (categories?.find(c => c.id === activeCategory)?.name ?? 'Produk') : 'Untuk Kamu' }}
            </h2>
            <div class="flex gap-1 rounded-full p-1" style="background:rgba(9,11,12,0.08)">
              <button
                v-for="f in typeFilters" :key="f.value"
                class="rounded-full px-3 py-1 text-xs transition-all"
                :style="activeType === f.value ? 'background:#090b0c;color:white' : 'color:rgba(9,11,12,0.6)'"
                @click="activeType = f.value"
              >{{ f.label }}</button>
            </div>
          </div>

          <div v-if="pending" class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <div v-for="i in 10" :key="i" class="aspect-[3/4] animate-pulse rounded-xl" style="background:rgba(9,11,12,0.06)" />
          </div>

          <div v-else-if="!filteredProducts.length" class="rounded-xl bg-white py-20 text-center">
            <p class="text-lg" style="color:rgba(9,11,12,0.5)">Tidak ada produk ditemukan</p>
            <button class="mt-3 text-sm underline underline-offset-4" style="color:rgba(9,11,12,0.5)" @click="search = ''; activeCategory = null; activeType = 'ALL'">Reset filter</button>
          </div>

          <div v-else class="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <NuxtLink
              v-for="product in visibleProducts" :key="product.id"
              :to="`/products/${product.id}`"
              class="group flex flex-col overflow-hidden rounded-xl bg-white transition-shadow hover:shadow-lg"
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

          <div v-if="filteredProducts.length > visibleCount" class="mt-4 text-center">
            <button class="rounded-full border bg-white px-10 py-2.5 text-sm" style="border-color:rgba(9,11,12,0.15)" @click="visibleCount += PAGE_SIZE">Lihat Lainnya</button>
          </div>
        </section>
      </div>
    </main>

    <!-- Collection banner -->
    <section class="overflow-hidden px-5 py-5 md:px-12" style="background:#f5f5f2">
      <div class="mx-auto max-w-6xl overflow-hidden rounded-3xl relative" style="background:#090b0c;min-height:280px">
        <div class="px-10 py-14 relative z-10 flex flex-col items-start justify-center h-full">
          <div class="mb-4 flex items-center gap-3">
            <div class="h-px w-5" style="background:rgba(255,255,255,0.3)" />
            <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(255,255,255,0.4)">Koleksi Terbaru</span>
          </div>
          <h3 class="text-[2.5rem] font-normal leading-[0.94] tracking-tight text-white md:text-[3.5rem]">
            Lebaran<br><em style="font-style:italic;color:rgba(255,255,255,0.55)">Collection 2026</em>
          </h3>
          <p class="mt-4 text-sm" style="color:rgba(255,255,255,0.5)">Kemurnian dalam Balutan Kesederhanaan</p>
          <NuxtLink to="/koleksi" class="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-normal transition-opacity hover:opacity-85" style="background:white;color:#090b0c">
            Eksplor Koleksi
            <span class="flex h-5 w-5 items-center justify-center rounded-full text-xs" style="background:#090b0c;color:white">→</span>
          </NuxtLink>
        </div>
        <!-- Decorative circle -->
        <div class="absolute -right-20 -bottom-20 w-80 h-80 rounded-full opacity-5" style="background:#fabc3f" />
        <div class="absolute right-20 top-10 w-32 h-32 rounded-full opacity-5" style="background:#fabc3f" />
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
              <li><NuxtLink to="/koleksi" class="transition-colors hover:text-[#090b0c]">Koleksi</NuxtLink></li>
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

    <!-- Bottom nav (mobile) -->
    <nav class="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t bg-white md:hidden" style="border-color:rgba(9,11,12,0.1);padding-bottom:env(safe-area-inset-bottom)">
      <NuxtLink v-for="n in bottomNav" :key="n.to" :to="n.to" class="relative flex flex-col items-center gap-0.5 py-2 text-[10px]" :style="`color:${n.to === '/' ? '#090b0c' : 'rgba(9,11,12,0.55)'}`">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="n.icon" />
        {{ n.label }}
        <span v-if="n.to === '/cart' && itemCount > 0" class="absolute right-[22%] top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold" style="background:#fabc3f;color:#090b0c">{{ itemCount }}</span>
      </NuxtLink>
    </nav>

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
const { itemCount } = useCart()
const { isLoggedIn, fetchMe } = useAuth()

interface Category { id: string; name: string; slug: string; imageUrl: string | null; children: { id: string; name: string }[]; _count: { products: number } }
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

const search = ref('')
const activeCategory = ref<string | null>(null)
const activeType = ref('ALL')

const PAGE_SIZE = 20
const visibleCount = ref(PAGE_SIZE)

const bottomNav = [
  { to: '/', label: 'Beranda', icon: '<path d="M3 11l9-8 9 8v10a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1z"/>' },
  { to: '/koleksi', label: 'Koleksi', icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>' },
  { to: '/flash_sale', label: 'Flash Sale', icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>' },
  { to: '/cart', label: 'Keranjang', icon: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/>' },
  { to: '/account', label: 'Akun', icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>' }
]

const typeFilters = [
  { value: 'ALL', label: 'Semua' },
  { value: 'REGULAR', label: 'Tersedia' },
  { value: 'PRE_ORDER', label: 'Pre-Order' }
]

const filteredProducts = computed(() => {
  let list = products.value ?? []
  if (activeCategory.value) {
    const parent = categories.value?.find(c => c.id === activeCategory.value)
    const ids = new Set([activeCategory.value, ...(parent?.children.map(c => c.id) ?? [])])
    list = list.filter(p => p.categoryId && ids.has(p.categoryId))
  }
  if (activeType.value !== 'ALL') list = list.filter(p => p.productType === activeType.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(p => p.title.toLowerCase().includes(q))
  }
  return list
})
const visibleProducts = computed(() => filteredProducts.value.slice(0, visibleCount.value))
watch([search, activeCategory, activeType], () => { visibleCount.value = PAGE_SIZE })

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
  fetchMe()
  updateCatArrows()
  window.addEventListener('resize', updateCatArrows, { passive: true })
  now.value = Date.now()
  const tick = setInterval(() => { now.value = Date.now() }, 1000)
  const auto = setInterval(() => {
    const n = mainBanners.value.length
    if (n > 1 && !pauseCarousel.value) goToBanner((bannerIndex.value + 1) % n)
  }, 4500)
  onBeforeUnmount(() => { clearInterval(tick); clearInterval(auto); window.removeEventListener('resize', updateCatArrows) })
})
</script>

<style scoped>
.no-scrollbar { scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
