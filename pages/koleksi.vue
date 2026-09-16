<template>
  <div class="min-h-screen antialiased" style="background:#f5f5f2;font-family:'Inter Tight',system-ui,sans-serif;color:#090b0c">

    <!-- Header (sama dengan homepage) -->
    <header class="fixed left-0 right-0 z-50 px-4 py-4 md:px-8 transition-colors duration-300" style="background:rgba(245,245,242,0.9);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.06)">
      <div class="relative flex h-10 items-center max-w-6xl mx-auto">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center font-black text-xl tracking-tighter" style="font-family:'Inter Tight',sans-serif;color:#090b0c;letter-spacing:-0.04em">MINTS</NuxtLink>

        <!-- Center pill nav -->
        <nav class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-md md:flex" style="border-color:rgba(9,11,12,0.08);background:rgba(255,255,255,0.7)">
          <NuxtLink to="/" class="rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)" @mouseover="$event.currentTarget.style.background='rgba(0,0,0,0.05)'" @mouseleave="$event.currentTarget.style.background='transparent'">Beranda</NuxtLink>
          <NuxtLink to="/#produk" class="rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)" @mouseover="$event.currentTarget.style.background='rgba(0,0,0,0.05)'" @mouseleave="$event.currentTarget.style.background='transparent'">Belanja</NuxtLink>
          <NuxtLink to="/koleksi" class="rounded-full px-4 py-2 text-sm font-medium transition-colors" style="background:rgba(9,11,12,0.07);color:#090b0c">Koleksi</NuxtLink>
          <NuxtLink to="/track" class="rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)" @mouseover="$event.currentTarget.style.background='rgba(0,0,0,0.05)'" @mouseleave="$event.currentTarget.style.background='transparent'">Lacak Paket</NuxtLink>
        </nav>

        <!-- Right -->
        <div class="ml-auto flex items-center gap-2">
          <template v-if="isLoggedIn">
            <NuxtLink to="/account/orders" class="hidden sm:block rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)">Pesanan</NuxtLink>
            <NuxtLink to="/account" class="hidden sm:block rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)">Akun</NuxtLink>
          </template>
          <NuxtLink v-else to="/login" class="hidden sm:block rounded-full px-5 py-2.5 text-sm font-normal transition-opacity hover:opacity-85" style="background:#090b0c;color:white">Masuk</NuxtLink>
          <NuxtLink to="/cart" class="relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-normal transition-opacity hover:opacity-85" style="background:#090b0c;color:white">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/></svg>
            Keranjang
            <span v-if="itemCount > 0" class="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1" style="background:#fabc3f;color:#090b0c">{{ itemCount }}</span>
          </NuxtLink>
        </div>
      </div>
    </header>

    <div class="mx-auto max-w-6xl px-5 pb-24 md:px-10" style="padding-top:88px">

      <!-- Page title -->
      <div class="mb-8 pt-2">
        <h1 class="text-[2.2rem] font-normal tracking-tight leading-tight md:text-[3rem]">Koleksi</h1>
        <p class="mt-1 text-sm" style="color:rgba(9,11,12,0.45)">{{ totalCount }} produk tersedia</p>
      </div>

      <div class="flex gap-8">

        <!-- ── Sidebar ── -->
        <aside class="hidden lg:block w-56 flex-shrink-0 space-y-8">

          <!-- Search -->
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style="color:rgba(9,11,12,0.45)">Cari</p>
            <div class="relative">
              <input
                v-model="search"
                type="text"
                placeholder="Cari produk..."
                class="w-full rounded-none border-0 border-b py-2 pr-8 text-sm bg-transparent focus:outline-none placeholder:text-sm"
                style="border-color:rgba(9,11,12,0.2);color:#090b0c"
              />
              <svg class="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4" style="color:rgba(9,11,12,0.4)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>
          </div>

          <!-- Kategori -->
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style="color:rgba(9,11,12,0.45)">Kategori</p>
            <div class="space-y-1">
              <button
                class="w-full flex items-center gap-2.5 py-1.5 text-sm text-left transition-colors group"
                @click="activeCategory = null"
              >
                <span
                  class="w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors"
                  :style="activeCategory === null
                    ? 'border-color:#090b0c;background:#090b0c'
                    : 'border-color:rgba(9,11,12,0.3)'"
                >
                  <span v-if="activeCategory === null" class="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <span class="font-medium" :style="activeCategory === null ? 'color:#090b0c' : 'color:rgba(9,11,12,0.65)'">Lihat Semua</span>
                <span class="ml-auto text-xs tabular-nums" style="color:rgba(9,11,12,0.35)">{{ totalCount }}</span>
              </button>
              <button
                v-for="cat in categories"
                :key="cat.id"
                class="w-full flex items-center gap-2.5 py-1.5 text-sm text-left transition-colors"
                @click="activeCategory = activeCategory === cat.id ? null : cat.id"
              >
                <span
                  class="w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors"
                  :style="activeCategory === cat.id
                    ? 'border-color:#090b0c;background:#090b0c'
                    : 'border-color:rgba(9,11,12,0.3)'"
                >
                  <span v-if="activeCategory === cat.id" class="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <span :style="activeCategory === cat.id ? 'color:#090b0c;font-weight:500' : 'color:rgba(9,11,12,0.65)'">{{ cat.name }}</span>
                <span class="ml-auto text-xs tabular-nums" style="color:rgba(9,11,12,0.35)">{{ cat._count?.products ?? 0 }}</span>
              </button>
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
              <span v-if="activeCategory || priceMin || priceMax" class="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
            </button>

            <!-- Mobile search -->
            <div class="relative flex-1 lg:hidden">
              <input v-model="search" type="text" placeholder="Cari produk..." class="w-full rounded-full border py-2 pl-4 pr-9 text-sm focus:outline-none" style="border-color:rgba(9,11,12,0.15);background:white" />
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color:rgba(9,11,12,0.35)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>

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
          <div v-if="activeCategory || priceMin || priceMax || search" class="flex flex-wrap gap-2 mb-5">
            <button v-if="activeCategory" class="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs border transition-colors hover:bg-black/5" style="border-color:rgba(9,11,12,0.2)" @click="activeCategory = null">
              {{ categories?.find(c => c.id === activeCategory)?.name }}
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
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

          <!-- Search mobile -->
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style="color:rgba(9,11,12,0.45)">Cari</p>
            <div class="relative">
              <input v-model="search" type="text" placeholder="Cari produk..." class="w-full rounded-full border py-2 pl-4 pr-9 text-sm focus:outline-none" style="border-color:rgba(9,11,12,0.2)" />
              <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style="color:rgba(9,11,12,0.35)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </div>
          </div>

          <!-- Kategori mobile -->
          <div>
            <p class="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style="color:rgba(9,11,12,0.45)">Kategori</p>
            <div class="space-y-1">
              <button class="w-full flex items-center gap-2.5 py-1.5 text-sm text-left" @click="activeCategory = null">
                <span class="w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center" :style="activeCategory === null ? 'border-color:#090b0c;background:#090b0c' : 'border-color:rgba(9,11,12,0.3)'">
                  <span v-if="activeCategory === null" class="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <span :class="activeCategory === null ? 'font-medium' : ''">Lihat Semua</span>
                <span class="ml-auto text-xs" style="color:rgba(9,11,12,0.35)">{{ totalCount }}</span>
              </button>
              <button v-for="cat in categories" :key="cat.id" class="w-full flex items-center gap-2.5 py-1.5 text-sm text-left" @click="activeCategory = activeCategory === cat.id ? null : cat.id">
                <span class="w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center" :style="activeCategory === cat.id ? 'border-color:#090b0c;background:#090b0c' : 'border-color:rgba(9,11,12,0.3)'">
                  <span v-if="activeCategory === cat.id" class="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <span :class="activeCategory === cat.id ? 'font-medium' : ''">{{ cat.name }}</span>
                <span class="ml-auto text-xs" style="color:rgba(9,11,12,0.35)">{{ cat._count?.products ?? 0 }}</span>
              </button>
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
useHead({ title: 'Koleksi — Mints' })

const { isLoggedIn, fetchMe } = useAuth()
const { itemCount } = useCart()

onMounted(() => fetchMe())

const { data: products, pending } = await useFetch('/api/products')
const { data: categories } = await useFetch('/api/categories')

// Filters
const search = ref('')
const activeCategory = ref<string | null>(null)
const priceMin = ref<number | null>(null)
const priceMax = ref<number | null>(null)
const sortBy = ref('newest')
const mobileFilter = ref(false)

// Pagination
const perPage = 12
const currentPage = ref(1)

// Reset page on filter change
watch([search, activeCategory, priceMin, priceMax, sortBy], () => { currentPage.value = 1 })

const totalCount = computed(() => products.value?.length ?? 0)

const filteredProducts = computed(() => {
  let list = [...(products.value ?? [])]

  if (activeCategory.value) list = list.filter(p => p.categoryId === activeCategory.value)
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase()
    list = list.filter(p => p.title.toLowerCase().includes(q) || p.category?.name?.toLowerCase().includes(q))
  }
  if (priceMin.value) list = list.filter(p => Number(p.price) >= priceMin.value!)
  if (priceMax.value) list = list.filter(p => Number(p.price) <= priceMax.value!)

  // Sort
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
  activeCategory.value = null
  priceMin.value = null
  priceMax.value = null
  sortBy.value = 'newest'
}

function scrollToTop() {
  if (process.client) window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Sync ?kategori query param
const route = useRoute()
onMounted(() => {
  if (route.query.kategori) activeCategory.value = String(route.query.kategori)
})
</script>
