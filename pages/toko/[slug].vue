<template>
  <div class="min-h-screen antialiased" style="background:#f5f5f2;color:#090b0c;font-family:'Inter Tight',system-ui,sans-serif">
    <header class="sticky top-0 z-40 px-5 py-4 md:px-12" style="background:rgba(245,245,242,0.88);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.06)">
      <div class="relative flex h-10 items-center max-w-5xl mx-auto">
        <NuxtLink to="/" class="flex items-center gap-2 text-sm transition-opacity hover:opacity-60" style="color:#090b0c">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          MINTS
        </NuxtLink>
        <NuxtLink to="/cart" class="ml-auto relative flex items-center justify-center w-10 h-10 transition-opacity hover:opacity-60" style="color:#090b0c" aria-label="Keranjang">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6L4 3H2"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>
          <span v-if="itemCount" class="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[10px] leading-none" style="background:#090b0c;color:white">{{ itemCount }}</span>
        </NuxtLink>
      </div>
    </header>

    <template v-if="store">
      <main class="mx-auto max-w-5xl px-5 py-8 md:px-12">
        <div class="flex items-center gap-4 mb-8">
          <img v-if="store.logoUrl" :src="store.logoUrl" :alt="store.name" class="w-16 h-16 rounded-full object-cover" style="background:white" />
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl font-normal tracking-tight">{{ store.name }}</h1>
              <span v-if="store.plan?.hasVerifiedBadge" class="text-xs rounded-full px-2 py-0.5" style="background:#e0f2fe;color:#0369a1">Terverifikasi</span>
            </div>
            <p v-if="store.cityName" class="text-sm" style="color:rgba(9,11,12,0.5)">{{ store.cityName }}</p>
          </div>
        </div>

        <div v-if="store.bannerUrl || store.description" class="rounded-3xl p-6 mb-10" style="background:white">
          <h2 class="text-xs font-normal tracking-widest uppercase mb-4" style="color:rgba(9,11,12,0.45)">Tentang Toko</h2>
          <div class="grid gap-6 md:grid-cols-2">
            <div v-if="store.bannerUrl" class="rounded-2xl overflow-hidden aspect-[4/3]" style="background:rgba(9,11,12,0.05)">
              <img :src="store.bannerUrl" :alt="store.name" class="w-full h-full object-cover" />
            </div>
            <div v-if="store.description" class="text-sm whitespace-pre-line max-h-64 overflow-y-auto pr-2" style="color:rgba(9,11,12,0.65)">{{ store.description }}</div>
          </div>
        </div>

        <div class="grid gap-6 md:grid-cols-[200px_1fr]">
          <!-- Sidebar kategori -->
          <aside>
            <h3 class="text-sm font-normal mb-3 flex items-center gap-2" style="color:rgba(9,11,12,0.6)">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              Kategori
            </h3>
            <div class="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              <button
                class="text-left text-sm rounded-full md:rounded-xl px-3 py-1.5 whitespace-nowrap transition-opacity hover:opacity-80"
                :style="!categoryId ? 'background:#090b0c;color:white' : 'background:white;color:#090b0c'"
                @click="selectCategory('')"
              >Semua Produk</button>
              <button
                v-for="c in categories"
                :key="c.id"
                class="text-left text-sm rounded-full md:rounded-xl px-3 py-1.5 whitespace-nowrap transition-opacity hover:opacity-80"
                :style="categoryId === c.id ? 'background:#090b0c;color:white' : 'background:white;color:#090b0c'"
                @click="selectCategory(c.id)"
              >{{ c.name }}</button>
            </div>
          </aside>

          <!-- Katalog -->
          <div>
            <div class="flex items-center justify-between gap-3 flex-wrap mb-4">
              <h2 class="text-lg font-normal">Produk</h2>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs" style="color:rgba(9,11,12,0.45)">Urutkan</span>
                <button
                  v-for="opt in sortOptions"
                  :key="opt.value"
                  class="text-xs rounded-full px-3 py-1.5 transition-opacity hover:opacity-80"
                  :style="sort === opt.value ? 'background:#090b0c;color:white' : 'background:white;color:#090b0c'"
                  @click="setSort(opt.value)"
                >{{ opt.label }}</button>
              </div>
            </div>

            <div v-if="productsPending" class="py-10 text-center text-sm" style="color:rgba(9,11,12,0.5)">Memuat produk…</div>
            <div v-else-if="!products.length" class="py-10 text-center text-sm" style="color:rgba(9,11,12,0.5)">Belum ada produk.</div>
            <template v-else>
              <div class="grid grid-cols-2 gap-4 lg:grid-cols-3">
                <NuxtLink v-for="p in products" :key="p.id" :to="`/products/${p.id}`" class="rounded-3xl overflow-hidden transition-opacity hover:opacity-90" style="background:white">
                  <img :src="p.imageUrl" :alt="p.title" class="w-full aspect-square object-cover" />
                  <div class="p-4">
                    <p class="text-sm font-normal truncate">{{ p.title }}</p>
                    <p class="text-sm mt-1" style="color:rgba(9,11,12,0.55)">Rp {{ Number(p.price).toLocaleString('id-ID') }}</p>
                  </div>
                </NuxtLink>
              </div>

              <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-8">
                <button
                  class="rounded-full w-8 h-8 text-sm transition-opacity hover:opacity-80 disabled:opacity-30"
                  style="background:white;color:#090b0c"
                  :disabled="page <= 1"
                  @click="page--"
                >‹</button>
                <span class="text-xs" style="color:rgba(9,11,12,0.5)">{{ page }} / {{ totalPages }}</span>
                <button
                  class="rounded-full w-8 h-8 text-sm transition-opacity hover:opacity-80 disabled:opacity-30"
                  style="background:white;color:#090b0c"
                  :disabled="page >= totalPages"
                  @click="page++"
                >›</button>
              </div>
            </template>
          </div>
        </div>
      </main>
    </template>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = String(route.params.slug)
const { itemCount } = useCart()

interface StoreProfile {
  id: string; name: string; slug: string; description: string | null
  logoUrl: string | null; bannerUrl: string | null; cityName: string | null
  status: string; createdAt: string
  plan: { tier: string; hasVerifiedBadge: boolean }
}

const { data: store, error: storeError } = await useFetch<StoreProfile>(`/api/stores/${slug}`)

if (storeError.value) {
  throw createError({ statusCode: 404, statusMessage: 'Toko tidak ditemukan' })
}

const categoryId = ref('')
const sort = ref('terbaru')
const page = ref(1)
const PAGE_SIZE = 12

const sortOptions = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'terlaris', label: 'Terlaris' },
  { value: 'harga_asc', label: 'Harga ↑' },
  { value: 'harga_desc', label: 'Harga ↓' }
]

function selectCategory(id: string) {
  categoryId.value = id
  page.value = 1
}
function setSort(value: string) {
  sort.value = value
  page.value = 1
}

const { data: categories } = await useFetch<any[]>(`/api/stores/${slug}/categories`)

const { data: productsData, pending: productsPending } = await useFetch<{ products: any[]; total: number }>(
  () => `/api/stores/${slug}/products`,
  {
    query: computed(() => ({ page: page.value, pageSize: PAGE_SIZE, sort: sort.value, categoryId: categoryId.value || undefined })),
    immediate: !!store.value,
    watch: [page, sort, categoryId]
  }
)
const products = computed(() => productsData.value?.products || [])
const totalPages = computed(() => Math.max(1, Math.ceil((productsData.value?.total || 0) / PAGE_SIZE)))

useSeoMeta({
  title: computed(() => store.value ? `${store.value.name} — MINTS` : 'Toko — MINTS'),
  description: computed(() => store.value?.description || undefined),
  ogTitle: computed(() => store.value?.name),
  ogDescription: computed(() => store.value?.description || undefined),
  ogImage: computed(() => store.value?.logoUrl || undefined)
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: computed(() => store.value ? JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: store.value.name,
      description: store.value.description || undefined,
      image: store.value.logoUrl || undefined,
      address: store.value.cityName ? { '@type': 'PostalAddress', addressLocality: store.value.cityName } : undefined
    }) : '{}')
  }]
})
</script>
