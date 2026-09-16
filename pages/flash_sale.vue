<template>
  <div class="min-h-screen antialiased" style="background:#f5f5f2;font-family:'Inter Tight',system-ui,sans-serif;color:#090b0c">

    <!-- Header -->
    <header class="fixed left-0 right-0 z-50 px-4 py-4 md:px-8" style="background:rgba(245,245,242,0.9);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.06)">
      <div class="relative flex h-10 items-center max-w-6xl mx-auto">
        <NuxtLink to="/" class="flex items-center font-black text-xl tracking-tighter" style="font-family:'Inter Tight',sans-serif;color:#090b0c;letter-spacing:-0.04em">MINTS</NuxtLink>

        <nav class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-md md:flex" style="border-color:rgba(9,11,12,0.08);background:rgba(255,255,255,0.7)">
          <NuxtLink to="/" class="rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)" @mouseover="$event.currentTarget.style.background='rgba(0,0,0,0.05)'" @mouseleave="$event.currentTarget.style.background='transparent'">Beranda</NuxtLink>
          <NuxtLink to="/koleksi" class="rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)" @mouseover="$event.currentTarget.style.background='rgba(0,0,0,0.05)'" @mouseleave="$event.currentTarget.style.background='transparent'">Koleksi</NuxtLink>
          <NuxtLink to="/track" class="rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)" @mouseover="$event.currentTarget.style.background='rgba(0,0,0,0.05)'" @mouseleave="$event.currentTarget.style.background='transparent'">Lacak Paket</NuxtLink>
          <span class="rounded-full px-4 py-2 text-sm font-medium" style="background:rgba(9,11,12,0.07);color:#090b0c">
            <ClientOnly>
              <template v-if="selectedSession">
                <span class="flex items-center gap-2">
                  <span v-if="selectedSession.isRunning" class="w-1.5 h-1.5 rounded-full animate-pulse" style="background:#fabc3f" />
                  <span class="text-xs font-normal uppercase tracking-widest" style="color:rgba(9,11,12,0.5)">{{ selectedSession.isRunning ? 'Berakhir dalam' : 'Dimulai dalam' }}</span>
                  <span class="font-mono font-bold tabular-nums">{{ sessionCountdown }}</span>
                </span>
              </template>
              <template v-else>Flash Sale</template>
            </ClientOnly>
          </span>
        </nav>

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

    <!-- Session tabs -->
    <div style="padding-top:74px">
      <div class="px-4 py-4 md:px-8" style="background:#f5f5f2;border-bottom:1px solid rgba(9,11,12,0.08)">
        <div class="max-w-6xl mx-auto">
          <div v-if="!sessions?.length" class="text-sm py-1" style="color:rgba(9,11,12,0.4)">
            Tidak ada sesi aktif
          </div>
          <div v-else class="flex items-center gap-2 overflow-x-auto pb-0.5" style="scrollbar-width:none">
            <button
              v-for="session in sessions"
              :key="session.id"
              class="flex-shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-normal transition-all"
              :style="selectedSessionId === session.id
                ? 'background:#090b0c;color:white'
                : 'background:rgba(9,11,12,0.06);color:rgba(9,11,12,0.7)'"
              @click="selectSession(session.id)"
            >
              <span class="font-mono font-bold">{{ formatTime(session.startTime) }}</span>
              <span class="text-xs opacity-70">
                <template v-if="session.isRunning">● Live</template>
                <ClientOnly v-else>{{ sessionDayLabel(session.startTime) }}</ClientOnly>
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Session info strip -->
      <div v-if="selectedSession" class="px-4 py-5 md:px-8" style="background:white;border-bottom:1px solid rgba(9,11,12,0.06)">
        <div class="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span v-if="selectedSession.isRunning" class="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider" style="background:#fabc3f;color:#090b0c">
                <span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                Sedang Berlangsung
              </span>
              <span v-else class="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider" style="background:rgba(9,11,12,0.07);color:rgba(9,11,12,0.6)">Akan Datang</span>
            </div>
            <h2 class="text-base font-semibold tracking-tight">{{ selectedSession.title }}</h2>
            <p class="text-xs mt-0.5" style="color:rgba(9,11,12,0.45)">{{ formatDateTime(selectedSession.startTime) }} – {{ formatTime(selectedSession.endTime) }}</p>
          </div>
          <div class="text-right flex-shrink-0">
            <p class="text-2xl font-bold tabular-nums tracking-tight">{{ availableCount }}</p>
            <p class="text-xs" style="color:rgba(9,11,12,0.45)">Produk tersedia</p>
          </div>
        </div>
      </div>

      <!-- Products -->
      <div class="max-w-6xl mx-auto px-4 py-10 md:px-8">
        <div v-if="productsPending" class="flex justify-center py-24">
          <div class="w-6 h-6 rounded-full border-2 animate-spin" style="border-color:rgba(9,11,12,0.15);border-top-color:#090b0c" />
        </div>
        <div v-else-if="!products?.length" class="text-center py-24">
          <p class="text-sm" style="color:rgba(9,11,12,0.4)">Belum ada produk di sesi ini</p>
        </div>
        <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <div
            v-for="product in products"
            :key="product.id"
            class="group rounded-3xl overflow-hidden flex flex-col"
            style="background:white"
          >
            <div class="relative aspect-square overflow-hidden" style="background:#f5f5f2">
              <img
                :src="product.imageUrl"
                :alt="product.title"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                @error="(e) => ((e.target as HTMLImageElement).src = '/placeholder.svg')"
              />
              <div
                v-if="product.status === 'SOLD_OUT'"
                class="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
                style="background:rgba(9,11,12,0.6);backdrop-filter:blur(2px)"
              >
                <span class="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest" style="background:#090b0c;color:white">Sold Out</span>
                <span v-if="(soldPhones[product.id] ?? product.maskedPhone)" class="text-xs font-mono" style="color:rgba(255,255,255,0.6)">
                  {{ soldPhones[product.id] ?? product.maskedPhone }}
                </span>
              </div>
            </div>
            <div class="p-4 flex flex-col gap-3 flex-1">
              <div>
                <p class="text-sm font-semibold leading-snug line-clamp-2 mb-1">{{ product.title }}</p>
                <p class="text-base font-bold tabular-nums" style="color:#090b0c">Rp {{ formatPrice(product.price) }}</p>
              </div>
              <div class="flex gap-2 mt-auto">
                <button
                  class="flex-1 rounded-full py-2 text-xs font-semibold transition-opacity hover:opacity-75"
                  style="background:rgba(9,11,12,0.07);color:#090b0c"
                  @click="openDetail(product)"
                >Detail</button>
                <button
                  v-if="selectedSession?.isRunning && product.status === 'AVAILABLE'"
                  class="flex-1 rounded-full py-2 text-xs font-semibold transition-opacity hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed"
                  style="background:#090b0c;color:white"
                  :disabled="instantBuyingId === product.id"
                  @click="openCheckout(product)"
                >
                  <span v-if="instantBuyingId === product.id" class="inline-flex items-center justify-center">
                    <span class="w-3.5 h-3.5 rounded-full border-2 animate-spin" style="border-color:rgba(255,255,255,0.3);border-top-color:white" />
                  </span>
                  <span v-else>Beli</span>
                </button>
                <button
                  v-else-if="selectedSession?.isRunning && product.status === 'SOLD_OUT'"
                  class="flex-1 rounded-full py-2 text-xs font-semibold opacity-40 cursor-not-allowed"
                  style="background:rgba(9,11,12,0.07);color:#090b0c"
                  disabled
                >Sold Out</button>
              </div>
            </div>
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
          <div class="flex gap-4 text-xs" style="color:rgba(9,11,12,0.4)">
            <NuxtLink to="/privasi" class="hover:text-[#090b0c] transition-colors">Privasi</NuxtLink>
            <NuxtLink to="/syarat-ketentuan" class="hover:text-[#090b0c] transition-colors">Syarat & Ketentuan</NuxtLink>
          </div>
        </div>
      </div>
    </footer>

    <!-- Detail Modal -->
    <Transition name="modal">
      <div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 py-6">
        <div class="absolute inset-0" style="background:rgba(9,11,12,0.5);backdrop-filter:blur(4px)" @click="showDetailModal = false" />
        <div class="relative w-full max-w-md overflow-hidden flex flex-col rounded-3xl" style="background:white;max-height:90vh">
          <div class="relative shrink-0" style="background:#f5f5f2">
            <img
              :src="detailGallery[detailActiveImg] ?? detailProduct?.imageUrl"
              :alt="detailProduct?.title"
              class="w-full h-64 object-cover cursor-zoom-in"
              @click="lightboxSrc = detailGallery[detailActiveImg] ?? detailProduct?.imageUrl ?? null"
            />
            <template v-if="detailGallery.length > 1">
              <button
                class="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-opacity hover:opacity-85"
                style="background:rgba(9,11,12,0.6);color:white"
                @click="detailActiveImg = (detailActiveImg - 1 + detailGallery.length) % detailGallery.length"
              >‹</button>
              <button
                class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-opacity hover:opacity-85"
                style="background:rgba(9,11,12,0.6);color:white"
                @click="detailActiveImg = (detailActiveImg + 1) % detailGallery.length"
              >›</button>
              <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                <button
                  v-for="(_, i) in detailGallery" :key="i"
                  class="w-1.5 h-1.5 rounded-full transition-colors"
                  :style="i === detailActiveImg ? 'background:white' : 'background:rgba(255,255,255,0.4)'"
                  @click="detailActiveImg = i"
                />
              </div>
            </template>
          </div>
          <div v-if="detailGallery.length > 1" class="flex gap-2 px-5 pt-4 overflow-x-auto shrink-0">
            <button
              v-for="(img, i) in detailGallery" :key="i"
              class="shrink-0 w-14 h-14 rounded-2xl overflow-hidden border-2 transition-colors"
              :style="i === detailActiveImg ? 'border-color:#090b0c' : 'border-color:transparent'"
              @click="detailActiveImg = i"
            >
              <img :src="img" class="w-full h-full object-cover" />
            </button>
          </div>
          <div class="p-5 overflow-y-auto flex-1">
            <h2 class="text-base font-semibold tracking-tight mb-1">{{ detailProduct?.title }}</h2>
            <p class="text-xl font-bold tabular-nums mb-4">Rp {{ formatPrice(detailProduct?.price) }}</p>
            <p v-if="detailProduct?.description" class="text-sm leading-relaxed mb-5 whitespace-pre-line" style="color:rgba(9,11,12,0.6)">{{ detailProduct.description }}</p>
            <div class="flex gap-3">
              <button
                class="flex-1 rounded-full py-3 text-sm font-semibold transition-opacity hover:opacity-75"
                style="background:rgba(9,11,12,0.07);color:#090b0c"
                @click="showDetailModal = false"
              >Tutup</button>
              <button
                v-if="selectedSession?.isRunning && detailProduct?.status === 'AVAILABLE'"
                class="flex-1 rounded-full py-3 text-sm font-semibold transition-opacity hover:opacity-85"
                style="background:#090b0c;color:white"
                @click="() => { showDetailModal = false; openCheckout(detailProduct!) }"
              >Beli Sekarang</button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Lightbox -->
    <ClientOnly>
      <Transition name="lightbox">
        <div
          v-if="lightboxSrc"
          class="fixed inset-0 z-[60] flex items-center justify-center"
          style="background:rgba(9,11,12,0.92)"
          @click="lightboxSrc = null"
        >
          <button class="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center" style="background:rgba(255,255,255,0.1);color:white" @click.stop="lightboxSrc = null">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <img :src="lightboxSrc" class="max-w-full max-h-full object-contain p-4" @click.stop />
        </div>
      </Transition>
    </ClientOnly>

    <!-- Checkout Modal -->
    <Transition name="modal">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 py-6">
        <div class="absolute inset-0" style="background:rgba(9,11,12,0.5);backdrop-filter:blur(4px)" @click="showModal = false" />
        <div class="relative w-full max-w-md rounded-3xl overflow-y-auto p-6" style="background:white;max-height:90vh">
          <div class="flex items-center gap-4 rounded-2xl p-4 mb-6" style="background:#f5f5f2">
            <img :src="selectedProduct?.imageUrl" :alt="selectedProduct?.title" class="w-14 h-14 rounded-2xl object-cover flex-shrink-0" />
            <div class="min-w-0">
              <p class="text-sm font-semibold leading-tight line-clamp-2">{{ selectedProduct?.title }}</p>
              <p class="text-base font-bold tabular-nums mt-0.5">Rp {{ formatPrice(selectedProduct?.price) }}</p>
            </div>
          </div>
          <h2 class="text-base font-semibold tracking-tight mb-5">Data Pembeli</h2>
          <form class="space-y-4" @submit.prevent="submitCheckout">
            <div>
              <label class="block text-xs font-medium mb-1.5" style="color:rgba(9,11,12,0.6)">Nama Lengkap <span style="color:#dc2626">*</span></label>
              <input
                v-model="form.buyerName"
                type="text"
                placeholder="Masukkan nama lengkap"
                required
                class="w-full rounded-2xl px-4 py-3 text-sm outline-none transition-colors"
                style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.1);color:#090b0c"
                @focus="($event.target as HTMLInputElement).style.borderColor='rgba(9,11,12,0.4)'"
                @blur="($event.target as HTMLInputElement).style.borderColor='rgba(9,11,12,0.1)'"
              />
            </div>
            <div>
              <label class="block text-xs font-medium mb-1.5" style="color:rgba(9,11,12,0.6)">Nomor HP / WhatsApp <span style="color:#dc2626">*</span></label>
              <input
                v-model="form.buyerPhone"
                type="tel"
                placeholder="08xx atau 628xx"
                required
                class="w-full rounded-2xl px-4 py-3 text-sm outline-none transition-colors"
                style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.1);color:#090b0c"
                @focus="($event.target as HTMLInputElement).style.borderColor='rgba(9,11,12,0.4)'"
                @blur="($event.target as HTMLInputElement).style.borderColor='rgba(9,11,12,0.1)'"
              />
              <p class="text-xs mt-1.5" style="color:rgba(9,11,12,0.4)">Format: 08xxxxxx atau 628xxxxxx</p>
            </div>
            <div class="flex gap-3 pt-2">
              <button
                type="button"
                class="flex-1 rounded-full py-3 text-sm font-semibold transition-opacity hover:opacity-75"
                style="background:rgba(9,11,12,0.07);color:#090b0c"
                @click="showModal = false"
              >Batal</button>
              <button
                type="submit"
                class="flex-1 rounded-full py-3 text-sm font-semibold transition-opacity hover:opacity-85 disabled:opacity-50 disabled:cursor-not-allowed"
                style="background:#090b0c;color:white"
                :disabled="submitting"
              >
                <span v-if="submitting" class="inline-flex items-center justify-center">
                  <span class="w-4 h-4 rounded-full border-2 animate-spin" style="border-color:rgba(255,255,255,0.3);border-top-color:white" />
                </span>
                <span v-else>Beli Sekarang</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="toast.visible" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-full max-w-sm px-4">
        <div
          class="rounded-2xl px-4 py-3.5 flex items-center gap-3 text-sm font-medium"
          :style="toast.type === 'success'
            ? 'background:#090b0c;color:white'
            : 'background:#dc2626;color:white'"
        >
          <span class="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold" :style="toast.type === 'success' ? 'background:#fabc3f;color:#090b0c' : 'background:rgba(255,255,255,0.2);color:white'">
            {{ toast.type === 'success' ? '✓' : '✕' }}
          </span>
          <div class="min-w-0">
            <p class="font-semibold text-sm">{{ toast.title }}</p>
            <p v-if="toast.description" class="text-xs mt-0.5 opacity-75">{{ toast.description }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Sold toast -->
    <ClientOnly>
      <Transition name="sold-toast">
        <div
          v-if="soldToast"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 text-sm px-4 py-3.5 rounded-2xl max-w-xs w-full pointer-events-none"
          style="background:#090b0c;color:white"
        >
          <span class="w-6 h-6 rounded-xl flex items-center justify-center flex-shrink-0 text-xs" style="background:#fabc3f;color:#090b0c">🔥</span>
          <div class="min-w-0">
            <p class="text-[11px] font-normal mb-0.5" style="color:rgba(255,255,255,0.5)">Baru saja terjual!</p>
            <p class="font-semibold text-sm truncate"><span style="color:#fabc3f">{{ soldToast.title }}</span> · {{ soldToast.maskedPhone }}</p>
          </div>
        </div>
      </Transition>
    </ClientOnly>

    <ClientOnly>
      <ChatWidget />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
interface Session {
  id: string
  title: string
  startTime: string
  endTime: string
  isActive: boolean
  isRunning: boolean
  _count: { products: number }
}
interface Product {
  id: string
  title: string
  description?: string | null
  price: number | string
  imageUrl: string
  images: string[]
  status: 'AVAILABLE' | 'SOLD_OUT'
  sessionId: string | null
  maskedPhone?: string | null
}

useHead({ title: 'Flash Sale — Mints' })

const { isLoggedIn, fetchMe } = useAuth()
const { itemCount } = useCart()

onMounted(() => fetchMe())

const { data: sessions, refresh: refreshSessions } = await useFetch<Session[]>('/api/flash-sale/config')

const selectedSessionId = ref<string | null>(null)

watchEffect(() => {
  if (!sessions.value?.length || selectedSessionId.value) return
  const running = sessions.value.find(s => s.isRunning)
  selectedSessionId.value = running?.id ?? sessions.value[0]?.id ?? null
})

const selectedSession = computed(() => sessions.value?.find(s => s.id === selectedSessionId.value) ?? null)

function selectSession(id: string) {
  selectedSessionId.value = id
}

const { data: products, pending: productsPending, refresh: refreshProducts } = await useFetch<Product[]>(
  () => selectedSessionId.value ? `/api/products?sessionId=${selectedSessionId.value}` : '/api/products',
  { watch: [selectedSessionId] }
)

const availableCount = computed(() => products.value?.filter(p => p.status === 'AVAILABLE').length ?? 0)

const now = ref(0)
onMounted(() => {
  now.value = Date.now()
  const tick = setInterval(() => {
    now.value = Date.now()
    if (now.value % 60000 < 1000) refreshSessions()
  }, 1000)

  const poll = setInterval(async () => {
    if (!selectedSession.value?.isRunning || !selectedSessionId.value) return
    try {
      const statuses = await $fetch<{ id: string; status: 'AVAILABLE' | 'SOLD_OUT' }[]>(
        `/api/products/status?sessionId=${selectedSessionId.value}`
      )
      if (!products.value) return
      for (const s of statuses) {
        const p = products.value.find(p => p.id === s.id)
        if (p && p.status !== s.status) p.status = s.status
      }
    } catch {}
  }, 5000)

  const soldNotif = setInterval(() => {
    const sold = (products.value ?? []).filter(p => p.status === 'SOLD_OUT' && (soldPhones.value[p.id] ?? p.maskedPhone))
    if (!sold.length) return
    soldToastIdx.value = (soldToastIdx.value + 1) % sold.length
    soldToastVisible.value = true
    setTimeout(() => { soldToastVisible.value = false }, 4000)
  }, 5000)

  onUnmounted(() => { clearInterval(tick); clearInterval(poll); clearInterval(soldNotif) })
})

const sessionCountdown = computed(() => {
  const s = selectedSession.value
  if (!s) return ''
  const target = s.isRunning ? new Date(s.endTime).getTime() : new Date(s.startTime).getTime()
  const diff = Math.max(0, target - now.value)
  const h = Math.floor(diff / 3600000).toString().padStart(2, '0')
  const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0')
  const sec = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0')
  return `${h}:${m}:${sec}`
})

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
}
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
}
function formatPrice(price?: number | string) {
  return Number(price || 0).toLocaleString('id-ID')
}
function sessionDayLabel(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (d.toDateString() === today.toDateString()) return 'Hari ini'
  if (d.toDateString() === tomorrow.toDateString()) return 'Besok'
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
}

const showDetailModal = ref(false)
const detailProduct = ref<Product | null>(null)
const detailActiveImg = ref(0)
const lightboxSrc = ref<string | null>(null)
const detailGallery = computed(() => {
  if (!detailProduct.value) return []
  return [detailProduct.value.imageUrl, ...(detailProduct.value.images ?? [])].filter(Boolean)
})

function openDetail(product: Product) {
  detailProduct.value = product
  detailActiveImg.value = 0
  showDetailModal.value = true
}

const showModal = ref(false)
const submitting = ref(false)
const instantBuyingId = ref<string | null>(null)
const selectedProduct = ref<Product | null>(null)
const form = reactive({ buyerName: '', buyerPhone: '' })
const soldPhones = ref<Record<string, string>>({})
const soldToastIdx = ref(0)
const soldToastVisible = ref(false)
const soldToast = computed(() => {
  if (!soldToastVisible.value) return null
  const sold = (products.value ?? []).filter(p => p.status === 'SOLD_OUT' && (soldPhones.value[p.id] ?? p.maskedPhone))
  if (!sold.length) return null
  const p = sold[soldToastIdx.value % sold.length]
  return { title: p.title, maskedPhone: soldPhones.value[p.id] ?? p.maskedPhone }
})

function maskPhone(phone: string) {
  return phone.length > 3 ? phone.slice(0, -3) + 'xxx' : 'xxx'
}

const toast = reactive({ visible: false, type: 'success', title: '', description: '' })
let toastTimer: ReturnType<typeof setTimeout>

function showToast(type: 'success' | 'error', title: string, description = '') {
  clearTimeout(toastTimer)
  Object.assign(toast, { visible: true, type, title, description })
  toastTimer = setTimeout(() => { toast.visible = false }, 4000)
}

function loadBuyerFromStorage() {
  if (process.client) {
    try {
      const saved = localStorage.getItem('flashsale-buyer')
      if (saved) {
        const data = JSON.parse(saved)
        if (data.buyerName) form.buyerName = data.buyerName
        if (data.buyerPhone) form.buyerPhone = data.buyerPhone
      }
    } catch {}
  }
}

function saveBuyerToStorage() {
  if (process.client) {
    localStorage.setItem('flashsale-buyer', JSON.stringify({
      buyerName: form.buyerName,
      buyerPhone: form.buyerPhone
    }))
  }
}

function openCheckout(product: Product) {
  selectedProduct.value = product
  loadBuyerFromStorage()
  if (form.buyerName && form.buyerPhone) {
    instantCheckout(product, form.buyerName, form.buyerPhone)
    return
  }
  showModal.value = true
}

async function instantCheckout(product: Product, buyerName: string, buyerPhone: string) {
  instantBuyingId.value = product.id
  try {
    await $fetch('/api/checkout', {
      method: 'POST',
      body: { productId: product.id, buyerName, buyerPhone }
    })
    soldPhones.value[product.id] = maskPhone(buyerPhone)
    if (products.value) {
      const p = products.value.find((p: Product) => p.id === product.id)
      if (p) p.status = 'SOLD_OUT'
    }
    showToast('success', 'Pesanan berhasil!', 'Admin akan segera menghubungi Anda via WhatsApp')
  } catch (err: any) {
    showToast('error', 'Gagal melakukan pembelian', err.data?.statusMessage)
  } finally {
    instantBuyingId.value = null
  }
}

async function submitCheckout() {
  if (!selectedProduct.value) return
  submitting.value = true
  try {
    const productId = selectedProduct.value.id
    const phone = form.buyerPhone
    await $fetch('/api/checkout', {
      method: 'POST',
      body: { productId, buyerName: form.buyerName, buyerPhone: phone }
    })
    saveBuyerToStorage()
    showModal.value = false
    soldPhones.value[productId] = maskPhone(phone)
    if (products.value) {
      const p = products.value.find((p: Product) => p.id === productId)
      if (p) p.status = 'SOLD_OUT'
    }
    showToast('success', 'Pesanan berhasil!', 'Admin akan segera menghubungi Anda via WhatsApp')
  } catch (err: any) {
    showToast('error', 'Gagal melakukan pembelian', err.data?.statusMessage)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

.lightbox-enter-active, .lightbox-leave-active { transition: opacity 0.2s ease; }
.lightbox-enter-from, .lightbox-leave-to { opacity: 0; }

.toast-enter-active, .toast-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px); }

.sold-toast-enter-active, .sold-toast-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.sold-toast-enter-from, .sold-toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(16px); }
</style>
