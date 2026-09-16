<template>
  <div class="min-h-screen antialiased" style="background:#f5f5f2;color:#090b0c;font-family:'Inter Tight',system-ui,sans-serif">

    <!-- Navbar -->
    <header class="fixed left-0 right-0 z-50 px-4 py-4 md:px-8 transition-colors duration-300" :style="scrolled ? 'background:rgba(245,245,242,0.9);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.06)' : 'background:transparent'">
      <div class="relative flex h-10 items-center max-w-6xl mx-auto">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center font-black text-xl tracking-tighter transition-colors duration-300" :style="`font-family:'Inter Tight',sans-serif;letter-spacing:-0.04em;color:${scrolled ? '#090b0c' : 'white'}`">MINTS</NuxtLink>

        <!-- Center pill nav (desktop only) -->
        <nav class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-md md:flex" style="border-color:rgba(9,11,12,0.08);background:rgba(255,255,255,0.7)">
          <a href="#" class="rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)" @mouseover="$event.currentTarget.style.background='rgba(0,0,0,0.05)'" @mouseleave="$event.currentTarget.style.background='transparent'">Beranda</a>
          <a href="#produk" class="rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)" @mouseover="$event.currentTarget.style.background='rgba(0,0,0,0.05)'" @mouseleave="$event.currentTarget.style.background='transparent'">Belanja</a>
          <NuxtLink to="/koleksi" class="rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)" @mouseover="$event.currentTarget.style.background='rgba(0,0,0,0.05)'" @mouseleave="$event.currentTarget.style.background='transparent'">Koleksi</NuxtLink>
          <NuxtLink to="/track" class="rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)" @mouseover="$event.currentTarget.style.background='rgba(0,0,0,0.05)'" @mouseleave="$event.currentTarget.style.background='transparent'">Lacak Paket</NuxtLink>
        </nav>

        <!-- Right -->
        <div class="ml-auto flex items-center gap-2">
          <template v-if="isLoggedIn">
            <NuxtLink to="/account/orders" class="hidden sm:block rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)">Pesanan</NuxtLink>
            <NuxtLink to="/account" class="hidden sm:block rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)">Akun</NuxtLink>
          </template>
          <NuxtLink v-else to="/login" class="hidden sm:block rounded-full px-5 py-2.5 text-sm font-normal transition-opacity hover:opacity-85" style="background:#090b0c;color:white">Masuk</NuxtLink>
          <!-- Cart button -->
          <NuxtLink to="/cart" class="relative flex items-center gap-2 rounded-full px-3 py-2.5 text-sm font-normal transition-opacity hover:opacity-85 sm:px-5" style="background:#090b0c;color:white">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/></svg>
            <span class="hidden sm:inline">Keranjang</span>
            <span v-if="itemCount > 0" class="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1" style="background:#fabc3f;color:#090b0c">{{ itemCount }}</span>
          </NuxtLink>
          <!-- Hamburger (mobile only) -->
          <button class="flex items-center justify-center w-9 h-9 rounded-full transition-colors" :style="`display:${windowWidth >= 768 ? 'none' : 'flex'};${scrolled ? 'background:rgba(9,11,12,0.06)' : 'background:rgba(255,255,255,0.15)'}`" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Menu">
            <svg v-if="!mobileMenuOpen" class="w-4 h-4" :style="scrolled ? 'color:#090b0c' : 'color:white'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            <svg v-else class="w-4 h-4" :style="scrolled ? 'color:#090b0c' : 'color:white'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu drawer -->
      <Transition name="slide-down">
        <div v-if="mobileMenuOpen" class="md:hidden mt-3 rounded-2xl p-4 flex flex-col gap-1" style="background:rgba(255,255,255,0.96);backdrop-filter:blur(16px);border:1px solid rgba(9,11,12,0.08)">
          <a href="#" class="rounded-xl px-4 py-3 text-sm font-normal transition-colors" style="color:#090b0c" @click="mobileMenuOpen = false">Beranda</a>
          <a href="#produk" class="rounded-xl px-4 py-3 text-sm font-normal transition-colors" style="color:#090b0c" @click="mobileMenuOpen = false">Belanja</a>
          <NuxtLink to="/koleksi" class="rounded-xl px-4 py-3 text-sm font-normal transition-colors" style="color:#090b0c" @click="mobileMenuOpen = false">Koleksi</NuxtLink>
          <NuxtLink to="/track" class="rounded-xl px-4 py-3 text-sm font-normal transition-colors" style="color:#090b0c" @click="mobileMenuOpen = false">Lacak Paket</NuxtLink>
          <div class="my-1 border-t" style="border-color:rgba(9,11,12,0.08)" />
          <template v-if="isLoggedIn">
            <NuxtLink to="/account/orders" class="rounded-xl px-4 py-3 text-sm font-normal" style="color:#090b0c" @click="mobileMenuOpen = false">Pesanan Saya</NuxtLink>
            <NuxtLink to="/account" class="rounded-xl px-4 py-3 text-sm font-normal" style="color:#090b0c" @click="mobileMenuOpen = false">Akun</NuxtLink>
          </template>
          <NuxtLink v-else to="/login" class="mt-1 rounded-xl px-4 py-3 text-sm font-normal text-center transition-opacity hover:opacity-85" style="background:#090b0c;color:white" @click="mobileMenuOpen = false">Masuk</NuxtLink>
        </div>
      </Transition>
    </header>

    <!-- Hero -->
    <section class="relative min-h-screen overflow-hidden" style="background:#090b0c">
      <!-- Video background -->
      <video
        class="absolute inset-0 w-full h-full object-cover z-0"
        src="/uploads/hero_video.mp4"
        autoplay
        loop
        muted
        playsinline

      />

      <div class="absolute inset-0 z-[1]" style="background:linear-gradient(to bottom,rgba(0,0,0,.55) 0%,rgba(0,0,0,.1) 50%,rgba(0,0,0,.6) 100%)" />

      <div class="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 pb-20 pt-32 text-center">
        <!-- Eyebrow -->
        <div class="mb-6 flex items-center gap-2 rounded-full py-1.5 pl-6 pr-2 text-sm font-normal" style="background:rgba(255,255,255,0.12);color:white;backdrop-filter:blur(8px)">
          Modest Fashion Premium
          <span class="flex h-6 w-6 items-center justify-center rounded-full text-xs" style="background:#fabc3f;color:#090b0c">✦</span>
        </div>

        <!-- Headline -->
        <h1 class="text-[3.5rem] font-normal leading-[0.94] tracking-tight text-white sm:text-[5.5rem] md:text-[7rem]" style="max-width:900px">
          Elegan.<br>
          <em class="not-italic" style="font-style:italic;opacity:0.75">Syar'i.</em><br>
          Dibuat Sepenuh Hati.
        </h1>

        <!-- CTA -->
        <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href="#produk" class="rounded-full px-7 py-3.5 text-sm font-normal transition-opacity hover:opacity-85" style="background:white;color:#090b0c">
            Belanja Sekarang
          </a>
          <a href="#kategori" class="rounded-full px-7 py-3.5 text-sm font-normal transition-colors" style="background:rgba(255,255,255,0.12);color:white;backdrop-filter:blur(8px)" @mouseover="$event.currentTarget.style.background='rgba(255,255,255,0.2)'" @mouseleave="$event.currentTarget.style.background='rgba(255,255,255,0.12)'">
            Lihat Kategori
          </a>
        </div>


      </div>
    </section>

    <!-- Trust strip -->
    <section style="background:#f5f5f2;border-bottom:1px solid rgba(9,11,12,0.1)" class="overflow-hidden px-5 py-8 md:px-12">
      <div class="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x" style="--tw-divide-opacity:1;divide-color:rgba(9,11,12,0.12)">
        <div v-for="s in stats" :key="s.label" class="flex flex-col items-center justify-center text-center px-6 py-4 sm:py-2 gap-1">
          <p class="text-xs font-bold uppercase tracking-widest" style="color:#090b0c;letter-spacing:0.12em">{{ s.label }}</p>
          <p class="text-sm" style="color:rgba(9,11,12,0.5)">{{ s.sub }}</p>
        </div>
      </div>
    </section>

    <!-- Kategori -->
    <section id="kategori" style="background:#f5f5f2" class="overflow-hidden px-5 py-20 md:px-12">
      <div class="mx-auto max-w-5xl">
        <!-- Section label -->
        <div class="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div class="mb-4 flex items-center gap-3">
              <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
              <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Kategori</span>
            </div>
            <h2 class="text-[2.5rem] font-normal leading-[0.94] tracking-tight md:text-[3.5rem]">
              Temukan<br><em style="font-style:italic;opacity:0.6">koleksi favoritmu</em>
            </h2>
          </div>
          <p class="max-w-xs text-sm leading-6" style="color:rgba(9,11,12,0.55);text-align:right">
            Dari gamis hingga abaya — semua dirancang untuk kenyamanan sehari-hari.
          </p>
        </div>

        <div v-if="categories?.length" class="flex flex-wrap gap-2">
          <button
            class="rounded-full px-5 py-2.5 text-sm font-normal transition-all duration-200 flex items-center gap-2"
            :style="activeCategory === null
              ? 'background:#090b0c;color:white'
              : 'background:white;color:#090b0c;border:1px solid rgba(9,11,12,0.12)'"
            @click="activeCategory = null; scrollTo('produk')"
          >
            Semua
            <span class="text-xs tabular-nums" :style="activeCategory === null ? 'color:rgba(255,255,255,0.5)' : 'color:rgba(9,11,12,0.35)'">{{ products?.length ?? 0 }}</span>
          </button>
          <button
            v-for="cat in categories"
            :key="cat.id"
            class="rounded-full px-5 py-2.5 text-sm font-normal transition-all duration-200 flex items-center gap-2"
            :style="activeCategory === cat.id
              ? 'background:#090b0c;color:white'
              : 'background:white;color:#090b0c;border:1px solid rgba(9,11,12,0.12)'"
            @click="activeCategory = activeCategory === cat.id ? null : cat.id; scrollTo('produk')"
          >
            {{ cat.name }}
            <span class="text-xs tabular-nums" :style="activeCategory === cat.id ? 'color:rgba(255,255,255,0.5)' : 'color:rgba(9,11,12,0.35)'">{{ cat._count?.products ?? 0 }}</span>
          </button>
        </div>
        <div v-else class="flex flex-wrap gap-2">
          <div v-for="i in 5" :key="i" class="h-10 w-28 rounded-full animate-pulse" style="background:rgba(9,11,12,0.06)" />
        </div>
      </div>
    </section>

    <!-- Products -->
    <section id="produk" style="background:#f5f5f2" class="overflow-hidden px-5 pb-24 md:px-12">
      <div class="mx-auto max-w-5xl">
        <!-- Header -->
        <div class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div class="mb-3 flex items-center gap-3">
              <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
              <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">
                {{ activeCategory ? (categories?.find(c => c.id === activeCategory)?.name ?? 'Produk') : 'Semua Produk' }}
              </span>
            </div>
            <h2 class="text-[2rem] font-normal leading-tight tracking-tight md:text-[2.5rem]">
              {{ search ? `Hasil "${search}"` : 'Koleksi Terkini' }}
            </h2>
          </div>
          <!-- Search + type filter -->
          <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div class="relative flex-1 sm:flex-none sm:w-[180px]">
              <input
                v-model="search"
                type="text"
                placeholder="Cari produk..."
                class="h-9 rounded-full border pl-9 pr-4 text-sm focus:outline-none"
                style="border-color:rgba(9,11,12,0.15);background:white;color:#090b0c;min-width:0;width:100%;max-width:180px"
              />
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style="color:rgba(9,11,12,0.4)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>
            <div class="flex gap-1 rounded-full p-1" style="background:rgba(9,11,12,0.08)">
              <button
                v-for="f in typeFilters"
                :key="f.value"
                class="rounded-full px-3 py-1 text-xs font-normal transition-all"
                :style="activeType === f.value ? 'background:#090b0c;color:white' : 'color:rgba(9,11,12,0.6)'"
                @click="activeType = f.value"
              >{{ f.label }}</button>
            </div>
          </div>
        </div>

        <!-- Loading skeleton -->
        <div v-if="pending" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div v-for="i in 8" :key="i" class="rounded-3xl aspect-[3/4] animate-pulse" style="background:rgba(9,11,12,0.06)" />
        </div>

        <!-- Empty -->
        <div v-else-if="!filteredProducts.length" class="py-24 text-center">
          <p class="text-4xl mb-3">○</p>
          <p class="text-lg font-normal tracking-tight" style="color:rgba(9,11,12,0.5)">Tidak ada produk ditemukan</p>
          <button class="mt-4 text-sm underline underline-offset-4" style="color:rgba(9,11,12,0.5)" @click="search = ''; activeCategory = null; activeType = 'ALL'">Reset filter</button>
        </div>

        <!-- Grid -->
        <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="group cursor-pointer"
            @click="navigateTo(`/products/${product.id}`)"
          >
            <!-- Image -->
            <div class="relative overflow-hidden rounded-3xl aspect-[3/4]" style="background:rgba(9,11,12,0.05)">
              <img
                :src="product.imageUrl"
                :alt="product.title"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                @error="(e) => ((e.target as HTMLImageElement).style.opacity = '0')"
              />
              <!-- Sold out -->
              <div v-if="product.status === 'SOLD_OUT'" class="absolute inset-0 flex items-center justify-center" style="background:rgba(9,11,12,0.55)">
                <span class="rounded-full px-4 py-1.5 text-xs font-normal tracking-widest uppercase" style="background:rgba(255,255,255,0.15);color:white;backdrop-filter:blur(8px)">Habis</span>
              </div>
              <!-- Badges -->
              <div class="absolute top-3 left-3 flex flex-col gap-1.5">
                <span v-if="product.productType === 'PRE_ORDER'" class="rounded-full px-3 py-1 text-[10px] font-normal tracking-wide" style="background:rgba(9,11,12,0.75);color:white;backdrop-filter:blur(8px)">Pre-Order</span>
                <span v-if="isNew(product)" class="rounded-full px-3 py-1 text-[10px] font-normal tracking-wide" style="background:#fabc3f;color:#090b0c">Baru</span>
              </div>
            </div>

            <!-- Info -->
            <div class="mt-3 px-1">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <p class="text-sm font-normal leading-snug tracking-tight truncate">{{ product.title }}</p>
                  <p v-if="product.category" class="mt-0.5 text-xs" style="color:rgba(9,11,12,0.45)">{{ product.category.name }}</p>
                </div>
                <p class="text-sm font-normal shrink-0 tabular-nums">Rp&nbsp;{{ formatPrice(product.price) }}</p>
              </div>
              <!-- Size chips -->
              <div v-if="product.variants?.length" class="mt-2 flex flex-wrap gap-1">
                <span
                  v-for="v in product.variants.slice(0, 5)" :key="v.id"
                  class="rounded-full px-2 py-0.5 text-[10px]"
                  :style="v.stock > 0
                    ? 'background:rgba(9,11,12,0.07);color:rgba(9,11,12,0.7)'
                    : 'background:rgba(9,11,12,0.03);color:rgba(9,11,12,0.25);text-decoration:line-through'"
                >{{ v.size }}</span>
                <span v-if="product.variants.length > 5" class="rounded-full px-2 py-0.5 text-[10px]" style="background:rgba(9,11,12,0.04);color:rgba(9,11,12,0.3)">+{{ product.variants.length - 5 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Collection banner -->
    <section class="overflow-hidden px-5 py-5 md:px-12" style="background:#f5f5f2">
      <div class="mx-auto max-w-5xl overflow-hidden rounded-3xl relative" style="background:#090b0c;min-height:280px">
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
      <div class="mx-auto max-w-5xl">
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
              <li><NuxtLink to="/track" class="transition-colors hover:text-[#090b0c]">Lacak Paket</NuxtLink></li>
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

const { itemCount } = useCart()
const { isLoggedIn, fetchMe } = useAuth()

onMounted(() => {
  fetchMe()
})

interface Category { id: string; name: string; slug: string; _count: { products: number } }
interface ProductVariant { id: string; size: string; stock: number }
interface Product {
  id: string; title: string; price: number; imageUrl: string; status: string
  productType: string; categoryId: string | null; createdAt: string
  category: { id: string; name: string; slug: string } | null
  variants: ProductVariant[]
}

const { data: categories } = await useFetch<Category[]>('/api/categories')
const { data: products, pending } = await useFetch<Product[]>('/api/products')

const search = ref('')
const activeCategory = ref<string | null>(null)
const activeType = ref('ALL')
const scrolled = ref(false)
const mobileMenuOpen = ref(false)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)


const freeShippingMin = useRuntimeConfig().public.freeShippingMin
const freeShippingLabel = `Min. Rp ${parseInt(String(freeShippingMin)).toLocaleString('id-ID')}`

const stats = computed(() => [
  { label: 'Gratis Ongkir ' + freeShippingLabel, sub: 'Berlaku untuk pengiriman seluruh Indonesia' },
  { label: 'Kualitas Premium', sub: "Bahan eksklusif yang nyaman & syar'i" },
  { label: 'Pembayaran Aman', sub: 'Transaksi aman didukung Duitku' }
])

const typeFilters = [
  { value: 'ALL', label: 'Semua' },
  { value: 'REGULAR', label: 'Tersedia' },
  { value: 'PRE_ORDER', label: 'Pre-Order' }
]

const filteredProducts = computed(() => {
  let list = products.value ?? []
  if (activeCategory.value) list = list.filter(p => p.categoryId === activeCategory.value)
  if (activeType.value !== 'ALL') list = list.filter(p => p.productType === activeType.value)
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(p => p.title.toLowerCase().includes(q))
  }
  return list
})

function isNew(product: Product) {
  return Date.now() - new Date(product.createdAt).getTime() < 14 * 24 * 60 * 60 * 1000
}

function formatPrice(price: number | string) {
  return Number(price).toLocaleString('id-ID')
}

function scrollTo(id: string) {
  if (process.client) {
    nextTick(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }
}

onMounted(() => {
  const scrollHandler = () => { scrolled.value = window.scrollY > 60 }
  const resizeHandler = () => { windowWidth.value = window.innerWidth }
  window.addEventListener('scroll', scrollHandler, { passive: true })
  window.addEventListener('resize', resizeHandler, { passive: true })
  onUnmounted(() => {
    window.removeEventListener('scroll', scrollHandler)
    window.removeEventListener('resize', resizeHandler)
  })
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
