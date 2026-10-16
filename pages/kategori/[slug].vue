<template>
  <div class="min-h-screen antialiased pb-16 md:pb-0" style="background:#f5f5f2;font-family:'Inter Tight',system-ui,sans-serif;color:#090b0c">

    <!-- Header sama dengan beranda -->
    <HomeHeader v-model="search" />

    <div v-if="!parent" class="py-40 text-center">
      <p class="text-lg" style="color:rgba(9,11,12,0.5)">Kategori tidak ditemukan</p>
      <NuxtLink to="/" class="mt-3 inline-block text-sm underline underline-offset-4" style="color:rgba(9,11,12,0.5)">Kembali ke beranda</NuxtLink>
    </div>

    <div v-else class="mx-auto max-w-6xl px-5 pb-24 pt-5 md:px-10">

      <!-- Breadcrumb + judul -->
      <nav class="mb-4 flex flex-wrap items-center gap-1.5 text-xs" style="color:rgba(9,11,12,0.5)">
        <NuxtLink to="/" class="hover:text-[#090b0c]">Beranda</NuxtLink>
        <span>›</span>
        <NuxtLink v-if="activeSub" :to="`/kategori/${parent.slug}`" class="hover:text-[#090b0c]">{{ parent.name }}</NuxtLink>
        <span v-else style="color:#090b0c">{{ parent.name }}</span>
        <template v-if="activeSub"><span>›</span><span style="color:#090b0c">{{ activeSub.name }}</span></template>
      </nav>
      <div class="mb-8">
        <h1 class="text-[2rem] font-normal tracking-tight leading-tight md:text-[2.6rem]">{{ activeSub?.name ?? parent.name }}</h1>
        <p class="mt-1 text-sm" style="color:rgba(9,11,12,0.45)">{{ totalCount }} produk tersedia</p>
      </div>

      <div class="flex gap-8">

        <!-- ── Sidebar ── -->
        <aside class="hidden lg:block w-56 flex-shrink-0 space-y-8">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style="color:rgba(9,11,12,0.45)">Subkategori</p>
            <div class="space-y-1">
              <NuxtLink :to="`/kategori/${parent.slug}`" class="w-full flex items-center gap-2.5 py-1.5 text-sm text-left transition-colors">
                <span class="w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center" :style="!activeSub ? 'border-color:#090b0c;background:#090b0c' : 'border-color:rgba(9,11,12,0.3)'">
                  <span v-if="!activeSub" class="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <span :style="!activeSub ? 'color:#090b0c;font-weight:500' : 'color:rgba(9,11,12,0.65)'">Semua {{ parent.name }}</span>
                <span class="ml-auto text-xs tabular-nums" style="color:rgba(9,11,12,0.35)">{{ parent._count?.products ?? 0 }}</span>
              </NuxtLink>
              <NuxtLink v-for="sub in parent.children" :key="sub.id" :to="`/kategori/${sub.slug}`" class="w-full flex items-center gap-2.5 py-1.5 text-sm text-left transition-colors">
                <span class="w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center" :style="activeSub?.id === sub.id ? 'border-color:#090b0c;background:#090b0c' : 'border-color:rgba(9,11,12,0.3)'">
                  <span v-if="activeSub?.id === sub.id" class="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <span :style="activeSub?.id === sub.id ? 'color:#090b0c;font-weight:500' : 'color:rgba(9,11,12,0.65)'">{{ sub.name }}</span>
                <span class="ml-auto text-xs tabular-nums" style="color:rgba(9,11,12,0.35)">{{ sub._count?.products ?? 0 }}</span>
              </NuxtLink>
            </div>
          </div>

          <!-- Harga -->
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style="color:rgba(9,11,12,0.45)">Harga</p>
            <div class="flex items-center gap-2">
              <div class="flex-1">
                <span class="text-xs" style="color:rgba(9,11,12,0.45)">Rp</span>
                <input
                  v-model.number="priceMin"
                  type="number"
                  placeholder="Min"
                  class="w-full border-0 border-b py-1.5 text-sm bg-transparent focus:outline-none mt-0.5"
                  style="border-color:rgba(9,11,12,0.2)"
                />
              </div>
              <span class="text-xs mb-1" style="color:rgba(9,11,12,0.3)">–</span>
              <div class="flex-1">
                <span class="text-xs" style="color:rgba(9,11,12,0.45)">Rp</span>
                <input
                  v-model.number="priceMax"
                  type="number"
                  placeholder="Max"
                  class="w-full border-0 border-b py-1.5 text-sm bg-transparent focus:outline-none mt-0.5"
                  style="border-color:rgba(9,11,12,0.2)"
                />
              </div>
            </div>
          </div>
        </aside>

        <!-- ── Main content ── -->
        <div class="flex-1 min-w-0">

          <!-- Toolbar: mobile filter + sort -->
          <div class="flex items-center justify-between mb-5 gap-3">

            <!-- Mobile filter trigger -->
            <button
              class="lg:hidden flex items-center gap-2 text-sm rounded-full px-4 py-2 border transition-colors"
              style="border-color:rgba(9,11,12,0.15);background:white"
              @click="mobileFilter = true"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
              Filter
              <span v-if="activeSub || priceMin || priceMax" class="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
            </button>

            <!-- Sort -->
            <div class="flex items-center gap-2 ml-auto">
              <span class="text-xs uppercase tracking-widest hidden sm:block" style="color:rgba(9,11,12,0.45)">Urutkan:</span>
              <select
                v-model="sortBy"
                class="text-sm font-medium bg-transparent border-0 focus:outline-none cursor-pointer appearance-none pr-5"
                style="color:#090b0c;background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23090b0c%22 stroke-width=%222%22%3E%3Cpolyline points=%226 9 12 15 18 9%22/%3E%3C/svg%3E');background-repeat:no-repeat;background-position:right 0 center"
              >
                <option value="newest">Terbaru</option>
                <option value="price_asc">Harga Terendah</option>
                <option value="price_desc">Harga Tertinggi</option>
                <option value="name_asc">Nama A–Z</option>
              </select>
            </div>
          </div>

          <!-- Active filters chips -->
          <div v-if="activeSub || priceMin || priceMax || search" class="flex flex-wrap gap-2 mb-5">
            <NuxtLink v-if="activeSub" :to="`/kategori/${parent.slug}`" class="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs border transition-colors hover:bg-black/5" style="border-color:rgba(9,11,12,0.2)">
              {{ activeSub.name }}
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </NuxtLink>
            <button v-if="priceMin" class="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs border transition-colors hover:bg-black/5" style="border-color:rgba(9,11,12,0.2)" @click="priceMin = null">
              Min Rp {{ formatPrice(priceMin) }}
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
            <button v-if="priceMax" class="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs border transition-colors hover:bg-black/5" style="border-color:rgba(9,11,12,0.2)" @click="priceMax = null">
              Max Rp {{ formatPrice(priceMax) }}
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
            <button v-if="search" class="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs border transition-colors hover:bg-black/5" style="border-color:rgba(9,11,12,0.2)" @click="search = ''">
              "{{ search }}"
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <!-- Result count -->
          <p class="text-xs mb-5 hidden sm:block" style="color:rgba(9,11,12,0.4)">
            Menampilkan {{ paginatedProducts.length ? ((currentPage - 1) * perPage + 1) : 0 }}–{{ Math.min(currentPage * perPage, filteredProducts.length) }} dari {{ filteredProducts.length }} hasil
          </p>

          <!-- Loading skeleton -->
          <div v-if="pending" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <div v-for="i in perPage" :key="i" class="rounded-2xl animate-pulse" style="background:rgba(9,11,12,0.06);aspect-ratio:3/4" />
          </div>

          <!-- Empty -->
          <div v-else-if="!filteredProducts.length" class="py-32 text-center">
            <p class="text-3xl mb-3" style="color:rgba(9,11,12,0.2)">○</p>
            <p class="text-base font-normal" style="color:rgba(9,11,12,0.45)">Tidak ada produk ditemukan</p>
            <button class="mt-3 text-sm underline underline-offset-4" style="color:rgba(9,11,12,0.45)" @click="resetFilters">Reset filter</button>
          </div>

          <!-- Product grid -->
          <div v-else class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            <div
              v-for="product in paginatedProducts"
              :key="product.id"
              class="group cursor-pointer"
              @click="navigateTo(`/products/${product.id}`)"
            >
              <!-- Image -->
              <div class="relative overflow-hidden rounded-2xl aspect-[3/4]" style="background:rgba(9,11,12,0.05)">
                <img
                  :src="product.imageUrl"
                  :alt="product.title"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  @error="(e) => ((e.target as HTMLImageElement).style.opacity = '0')"
                />
                <!-- Sold out overlay -->
                <div v-if="product.status === 'SOLD_OUT'" class="absolute inset-0 flex items-center justify-center" style="background:rgba(9,11,12,0.45)">
                  <span class="rounded-full px-3 py-1 text-[10px] uppercase tracking-widest font-normal" style="background:rgba(255,255,255,0.15);color:white;backdrop-filter:blur(8px)">Habis</span>
                </div>
                <!-- Badges -->
                <div class="absolute top-2.5 left-2.5 flex flex-col gap-1">
                  <span v-if="product.productType === 'PRE_ORDER'" class="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style="background:#090b0c;color:white">Pre-Order</span>
                  <span v-if="isNew(product)" class="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style="background:#fabc3f;color:#090b0c">Baru</span>
                  <span v-if="product.sessionId" class="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style="background:#ef4444;color:white">Flash Sale</span>
                </div>
              </div>

              <!-- Info -->
              <div class="mt-3 text-center">
                <p class="text-[10px] uppercase tracking-widest mb-1" style="color:rgba(9,11,12,0.4)">{{ product.category?.name ?? '' }}</p>
                <p class="text-sm font-normal leading-snug tracking-tight">{{ product.title }}</p>
                <div class="mt-1.5 flex items-center justify-center gap-2">
                  <p class="text-sm font-medium tabular-nums">Rp {{ formatPrice(product.price) }}</p>
                  <p v-if="product.originalPrice" class="text-[11px] line-through tabular-nums" style="color:rgba(9,11,12,0.4)">Rp {{ formatPrice(product.originalPrice) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-12 flex items-center justify-center gap-1.5">
            <button
              class="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
              style="border:1px solid rgba(9,11,12,0.15)"
              :disabled="currentPage === 1"
              @click="currentPage--; scrollToTop()"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <template v-for="p in pageNumbers" :key="p">
              <span v-if="p === '...'" class="w-8 h-8 flex items-center justify-center text-xs" style="color:rgba(9,11,12,0.3)">…</span>
              <button
                v-else
                class="w-8 h-8 rounded-full text-sm transition-colors"
                :style="currentPage === p
                  ? 'background:#090b0c;color:white'
                  : 'border:1px solid rgba(9,11,12,0.15);color:rgba(9,11,12,0.7)'"
                @click="currentPage = p; scrollToTop()"
              >{{ p }}</button>
            </template>
            <button
              class="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30"
              style="border:1px solid rgba(9,11,12,0.15)"
              :disabled="currentPage === totalPages"
              @click="currentPage++; scrollToTop()"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="overflow-hidden px-5 pt-20 pb-10 md:px-12" style="background:#f5f5f2;border-top:1px solid rgba(9,11,12,0.08)">
      <div class="mx-auto max-w-5xl">
        <div class="grid gap-12 sm:grid-cols-3 mb-12">
          <div>
            <p class="font-black text-xl tracking-tighter mb-3" style="font-family:'Inter Tight',sans-serif;letter-spacing:-0.04em">MINTS</p>
            <p class="text-sm leading-6" style="color:rgba(9,11,12,0.5)">Elegan. Syar'i.<br>Dibuat Sepenuh Hati.</p>
          </div>
          <div>
            <p class="mb-4 text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.4)">Belanja</p>
            <ul class="space-y-3 text-sm" style="color:rgba(9,11,12,0.6)">
              <li><NuxtLink to="/flash_sale" class="transition-colors hover:text-[#090b0c]">Flash Sale</NuxtLink></li>
              <li><NuxtLink to="/account/orders" class="transition-colors hover:text-[#090b0c]">Pesanan Saya</NuxtLink></li>
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

    <!-- Mobile filter drawer -->
    <!-- Mobile filter drawer -->
    <Teleport to="body">
      <div v-if="mobileFilter" class="fixed inset-0 z-50 flex lg:hidden">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="mobileFilter = false" />
        <div class="relative ml-auto w-72 h-full bg-white shadow-2xl overflow-y-auto p-6 space-y-8">
          <div class="flex items-center justify-between">
            <p class="font-semibold text-sm">Filter</p>
            <button class="p-1 rounded-full hover:bg-gray-100" @click="mobileFilter = false">
              <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>


          <!-- Subkategori mobile -->
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style="color:rgba(9,11,12,0.45)">Subkategori</p>
            <div class="space-y-1" @click="mobileFilter = false">
              <NuxtLink :to="`/kategori/${parent.slug}`" class="w-full flex items-center gap-2.5 py-1.5 text-sm text-left transition-colors">
                <span class="w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center" :style="!activeSub ? 'border-color:#090b0c;background:#090b0c' : 'border-color:rgba(9,11,12,0.3)'">
                  <span v-if="!activeSub" class="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <span :style="!activeSub ? 'color:#090b0c;font-weight:500' : 'color:rgba(9,11,12,0.65)'">Semua {{ parent.name }}</span>
                <span class="ml-auto text-xs tabular-nums" style="color:rgba(9,11,12,0.35)">{{ parent._count?.products ?? 0 }}</span>
              </NuxtLink>
              <NuxtLink v-for="sub in parent.children" :key="sub.id" :to="`/kategori/${sub.slug}`" class="w-full flex items-center gap-2.5 py-1.5 text-sm text-left transition-colors">
                <span class="w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center" :style="activeSub?.id === sub.id ? 'border-color:#090b0c;background:#090b0c' : 'border-color:rgba(9,11,12,0.3)'">
                  <span v-if="activeSub?.id === sub.id" class="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <span :style="activeSub?.id === sub.id ? 'color:#090b0c;font-weight:500' : 'color:rgba(9,11,12,0.65)'">{{ sub.name }}</span>
                <span class="ml-auto text-xs tabular-nums" style="color:rgba(9,11,12,0.35)">{{ sub._count?.products ?? 0 }}</span>
              </NuxtLink>
            </div>
          </div>


          <!-- Harga mobile -->
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style="color:rgba(9,11,12,0.45)">Harga</p>
            <div class="flex items-center gap-2">
              <input v-model.number="priceMin" type="number" placeholder="Min" class="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none" style="border-color:rgba(9,11,12,0.2)" />
              <span class="text-xs" style="color:rgba(9,11,12,0.3)">–</span>
              <input v-model.number="priceMax" type="number" placeholder="Max" class="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none" style="border-color:rgba(9,11,12,0.2)" />
            </div>
          </div>

          <button class="w-full rounded-full py-3 text-sm font-medium transition-opacity hover:opacity-85" style="background:#090b0c;color:white" @click="mobileFilter = false">
            Tampilkan Hasil
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params.slug))

const { data: categories } = await useFetch<any[]>('/api/categories')
const { data: products, pending } = await useFetch<any[]>('/api/products')

// slug bisa milik induk atau subkategori (link dari direktori kategori)
const resolved = computed(() => {
  for (const p of categories.value ?? []) {
    if (p.slug === slug.value) return { parent: p, sub: null as any }
    const sub = p.children.find((c: any) => c.slug === slug.value)
    if (sub) return { parent: p, sub }
  }
  return null
})
const parent = computed(() => resolved.value?.parent)
const activeSub = computed(() => resolved.value?.sub ?? null)

if (!resolved.value) {
  throw createError({ statusCode: 404, statusMessage: 'Kategori tidak ditemukan', fatal: true })
}

useHead({ title: computed(() => `${activeSub.value?.name ?? parent.value?.name ?? 'Kategori'} — Mints`) })

// Filters
const search = ref('')
const priceMin = ref<number | null>(null)
const priceMax = ref<number | null>(null)
const sortBy = ref('newest')
const mobileFilter = ref(false)

// Pagination
const perPage = 12
const currentPage = ref(1)
watch([search, slug, priceMin, priceMax, sortBy], () => { currentPage.value = 1 })

// Produk dalam kategori ini (induk → semua subkategorinya)
const categoryProducts = computed(() => {
  if (!resolved.value) return []
  const ids = new Set<string>(activeSub.value ? [activeSub.value.id] : [parent.value.id, ...parent.value.children.map((c: any) => c.id)])
  return (products.value ?? []).filter(p => p.categoryId && ids.has(p.categoryId))
})
const totalCount = computed(() => categoryProducts.value.length)

const filteredProducts = computed(() => {
  let list = [...categoryProducts.value]
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    list = list.filter(p => p.title.toLowerCase().includes(q) || p.category?.name?.toLowerCase().includes(q))
  }
  if (priceMin.value) list = list.filter(p => Number(p.price) >= priceMin.value!)
  if (priceMax.value) list = list.filter(p => Number(p.price) <= priceMax.value!)

  if (sortBy.value === 'price_asc') list.sort((a, b) => Number(a.price) - Number(b.price))
  else if (sortBy.value === 'price_desc') list.sort((a, b) => Number(b.price) - Number(a.price))
  else if (sortBy.value === 'name_asc') list.sort((a, b) => a.title.localeCompare(b.title))
  else list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return list
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / perPage))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredProducts.value.slice(start, start + perPage)
})

const pageNumbers = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | string)[] = [1]
  if (cur > 3) pages.push('...')
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
  if (cur < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

function formatPrice(price: number | string) {
  return Number(price).toLocaleString('id-ID')
}

function isNew(product: any) {
  return Date.now() - new Date(product.createdAt).getTime() < 14 * 24 * 60 * 60 * 1000
}

function resetFilters() {
  search.value = ''
  priceMin.value = null
  priceMax.value = null
  sortBy.value = 'newest'
}

function scrollToTop() {
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
