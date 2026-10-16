<template>
  <div class="min-h-screen antialiased pb-16 md:pb-0" style="background:#f5f5f2;font-family:'Inter Tight',system-ui,sans-serif;color:#090b0c">

    <HomeHeader v-model="search" @submit="navigateTo({ path: '/', query: { q: search.trim() || undefined } })" />

    <div class="mx-auto max-w-6xl px-3 pb-20 pt-5 md:px-8">
      <!-- Breadcrumb -->
      <nav class="mb-4 flex items-center gap-1.5 px-2 text-xs" style="color:rgba(9,11,12,0.5)">
        <NuxtLink to="/" class="hover:text-[#090b0c]">Beranda</NuxtLink>
        <span>›</span>
        <span style="color:#090b0c">Semua Kategori</span>
      </nav>

      <div class="rounded-xl bg-white px-4 py-6 md:px-8">
        <!-- Grid ikon kategori -->
        <div class="grid grid-cols-3 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
          <NuxtLink v-for="cat in sorted" :key="cat.id" :to="`/kategori/${cat.slug}`" class="group flex flex-col items-center gap-2 px-1">
            <span class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full transition-transform group-hover:scale-105 md:h-24 md:w-24" style="background:#f5f5f2">
              <img v-if="cat.imageUrl" :src="cat.imageUrl" :alt="cat.name" loading="lazy" class="h-full w-full object-cover" />
              <span v-else class="text-2xl font-bold" style="color:rgba(9,11,12,0.35)">{{ cat.name.charAt(0) }}</span>
            </span>
            <span class="line-clamp-2 text-center text-xs leading-tight">{{ cat.name }}</span>
          </NuxtLink>
        </div>

        <!-- Indeks huruf A–Z -->
        <div class="no-scrollbar mt-10 flex justify-between gap-1 overflow-x-auto pb-2 text-xs font-semibold">
          <component
            :is="letters.has(l) ? 'a' : 'span'"
            v-for="l in ALPHABET" :key="l"
            :href="letters.has(l) ? `#huruf-${l}` : undefined"
            class="px-1.5"
            :style="letters.has(l) ? 'color:#090b0c' : 'color:rgba(9,11,12,0.25)'"
            @click.prevent="letters.has(l) && jumpTo(l)"
          >{{ l }}</component>
        </div>

        <!-- Daftar per huruf -->
        <section v-for="[letter, cats] in grouped" :key="letter" :id="`huruf-${letter}`" class="scroll-mt-28 pt-8">
          <h2 class="border-b pb-3 text-2xl font-bold" style="border-color:rgba(9,11,12,0.1)">{{ letter }}</h2>
          <div v-for="cat in cats" :key="cat.id" class="pt-5">
            <NuxtLink :to="`/kategori/${cat.slug}`" class="text-sm font-bold uppercase tracking-wide hover:underline">{{ cat.name }}</NuxtLink>
            <ul class="mt-2.5 grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs md:grid-cols-4" style="color:rgba(9,11,12,0.6)">
              <li v-for="sub in cat.children" :key="sub.id">
                <NuxtLink :to="`/kategori/${sub.slug}`" class="hover:text-[#090b0c] hover:underline">{{ sub.name }}</NuxtLink>
              </li>
            </ul>
          </div>
        </section>
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

    <MobileBottomNav />

    <ClientOnly>
      <ChatWidget />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Semua Kategori — Mints' })

interface Cat { id: string; name: string; slug: string; imageUrl: string | null; children: { id: string; name: string; slug: string }[] }

const { data: categories } = await useFetch<Cat[]>('/api/categories')
const search = ref('')

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const sorted = computed(() => [...(categories.value ?? [])].sort((a, b) => a.name.localeCompare(b.name, 'id')))

// kategori dikelompokkan per huruf awal nama induk
const grouped = computed(() => {
  const map = new Map<string, Cat[]>()
  for (const c of sorted.value) {
    const l = c.name.charAt(0).toUpperCase()
    map.set(l, [...(map.get(l) ?? []), c])
  }
  return [...map.entries()]
})
const letters = computed(() => new Set(grouped.value.map(([l]) => l)))

function jumpTo(l: string) {
  document.getElementById(`huruf-${l}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<style scoped>
.no-scrollbar { scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
