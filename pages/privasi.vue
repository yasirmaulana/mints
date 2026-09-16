<template>
  <div class="min-h-screen antialiased" style="background:#f5f5f2;font-family:'Inter Tight',system-ui,sans-serif;color:#090b0c">

    <!-- Header -->
    <header class="fixed left-0 right-0 z-50 px-4 py-4 md:px-8" style="background:rgba(245,245,242,0.9);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.06)">
      <div class="relative flex h-10 items-center max-w-6xl mx-auto">
        <NuxtLink to="/" class="flex items-center font-black text-xl tracking-tighter" style="font-family:'Inter Tight',sans-serif;color:#090b0c;letter-spacing:-0.04em">MINTS</NuxtLink>

        <nav class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-md md:flex" style="border-color:rgba(9,11,12,0.08);background:rgba(255,255,255,0.7)">
          <NuxtLink to="/" class="rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)" @mouseover="$event.currentTarget.style.background='rgba(0,0,0,0.05)'" @mouseleave="$event.currentTarget.style.background='transparent'">Beranda</NuxtLink>
          <NuxtLink to="/koleksi" class="rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)" @mouseover="$event.currentTarget.style.background='rgba(0,0,0,0.05)'" @mouseleave="$event.currentTarget.style.background='transparent'">Koleksi</NuxtLink>
          <NuxtLink to="/flash_sale" class="rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)" @mouseover="$event.currentTarget.style.background='rgba(0,0,0,0.05)'" @mouseleave="$event.currentTarget.style.background='transparent'">Flash Sale</NuxtLink>
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
          <!-- Hamburger (mobile only) -->
          <button class="md:hidden flex items-center justify-center w-9 h-9 rounded-full" style="background:rgba(9,11,12,0.06)" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Menu">
            <svg v-if="!mobileMenuOpen" class="w-4 h-4" style="color:#090b0c" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            <svg v-else class="w-4 h-4" style="color:#090b0c" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu drawer -->
      <Transition name="slide-down">
        <div v-if="mobileMenuOpen" class="md:hidden mt-3 rounded-2xl p-4 flex flex-col gap-1" style="background:rgba(255,255,255,0.96);backdrop-filter:blur(16px);border:1px solid rgba(9,11,12,0.08)">
          <NuxtLink to="/" class="rounded-xl px-4 py-3 text-sm font-normal transition-colors" style="color:#090b0c" @click="mobileMenuOpen = false">Beranda</NuxtLink>
          <NuxtLink to="/koleksi" class="rounded-xl px-4 py-3 text-sm font-normal transition-colors" style="color:#090b0c" @click="mobileMenuOpen = false">Koleksi</NuxtLink>
          <NuxtLink to="/flash_sale" class="rounded-xl px-4 py-3 text-sm font-normal transition-colors" style="color:#090b0c" @click="mobileMenuOpen = false">Flash Sale</NuxtLink>
          <div class="my-1 border-t" style="border-color:rgba(9,11,12,0.08)" />
          <template v-if="isLoggedIn">
            <NuxtLink to="/account/orders" class="rounded-xl px-4 py-3 text-sm font-normal" style="color:#090b0c" @click="mobileMenuOpen = false">Pesanan Saya</NuxtLink>
            <NuxtLink to="/account" class="rounded-xl px-4 py-3 text-sm font-normal" style="color:#090b0c" @click="mobileMenuOpen = false">Akun</NuxtLink>
          </template>
          <NuxtLink v-else to="/login" class="mt-1 rounded-xl px-4 py-3 text-sm font-normal text-center transition-opacity hover:opacity-85" style="background:#090b0c;color:white" @click="mobileMenuOpen = false">Masuk</NuxtLink>
        </div>
      </Transition>
    </header>

    <!-- Page content -->
    <div style="padding-top:88px">

      <!-- Page title -->
      <div class="px-5 py-16 md:px-12" style="border-bottom:1px solid rgba(9,11,12,0.08)">
        <div class="mx-auto max-w-5xl">
          <div class="mb-4 flex items-center gap-3">
            <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
            <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Kebijakan</span>
          </div>
          <h1 class="text-[2.5rem] font-normal leading-tight tracking-tight md:text-[4rem]">
            Kebijakan<br><em style="font-style:italic;opacity:0.5">Privasi</em>
          </h1>
          <p class="mt-4 text-sm max-w-md leading-relaxed" style="color:rgba(9,11,12,0.55)">
            Mints sangat menghormati dan menjaga privasi pelanggan kami. Halaman ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.
          </p>
          <p class="mt-3 text-xs" style="color:rgba(9,11,12,0.35)">Pembaruan Terakhir: 1 April 2026</p>
        </div>
      </div>

      <!-- Sections -->
      <section class="px-5 py-16 md:px-12">
        <div class="mx-auto max-w-3xl space-y-4">
          <div v-for="(section, i) in sections" :key="i" class="rounded-3xl p-8" style="background:white">
            <div class="flex items-start gap-5 mb-5">
              <span class="flex-shrink-0 w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-bold" style="background:#090b0c;color:white">{{ i + 1 }}</span>
              <h2 class="text-base font-semibold tracking-tight pt-1">{{ section.title }}</h2>
            </div>
            <div class="pl-13">
              <p class="text-sm leading-[1.9]" style="color:rgba(9,11,12,0.65);padding-left:3.25rem" v-html="section.body" />
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="px-5 pb-24 md:px-12">
        <div class="mx-auto max-w-5xl">
          <div class="rounded-3xl px-10 py-14 text-center" style="background:#090b0c">
            <p class="text-xs uppercase tracking-widest mb-3" style="color:rgba(255,255,255,0.4)">Ada pertanyaan terkait privasi?</p>
            <h2 class="text-2xl font-normal tracking-tight text-white mb-6 md:text-3xl">Hubungi kami kapan saja.</h2>
            <a href="mailto:hello@mints.id" class="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-normal transition-opacity hover:opacity-85" style="background:white;color:#090b0c">
              hello@mints.id
              <span class="flex h-5 w-5 items-center justify-center rounded-full text-xs" style="background:#090b0c;color:white">→</span>
            </a>
          </div>
        </div>
      </section>

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
            <NuxtLink to="/privasi" class="hover:text-[#090b0c] transition-colors font-medium" style="color:#090b0c">Privasi</NuxtLink>
            <NuxtLink to="/syarat-ketentuan" class="hover:text-[#090b0c] transition-colors">Syarat & Ketentuan</NuxtLink>
          </div>
        </div>
      </div>
    </footer>

    <ClientOnly>
      <ChatWidget />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Kebijakan Privasi — Mints' })

const { isLoggedIn, fetchMe } = useAuth()
const { itemCount } = useCart()
const mobileMenuOpen = ref(false)

onMounted(() => fetchMe())

const sections = [
  {
    title: 'Informasi yang Kami Kumpulkan',
    body: 'Saat Anda membuat akun, melakukan pemesanan, atau berlangganan newsletter kami, kami mungkin meminta informasi seperti <strong>nama, alamat email, alamat pengiriman, nomor telepon,</strong> dan detail pembayaran. Kami juga dapat mengumpulkan informasi dasar perangkat melalui cookies.',
  },
  {
    title: 'Penggunaan Informasi',
    body: 'Informasi yang kami kumpulkan digunakan untuk <strong>memproses pesanan</strong> Anda, mengatur pengiriman, berkomunikasi dengan Anda tentang status pesanan, dan — jika Anda setuju — mengirimkan promosi terbaru mengenai Mints.',
  },
  {
    title: 'Keamanan Data',
    body: 'Kami menggunakan langkah-langkah keamanan standar industri untuk melindungi data pribadi dan finansial Anda. Informasi pembayaran diproses oleh <strong>pihak ketiga yang terenkripsi</strong> dan mematuhi standar keamanan yang berlaku.',
  },
  {
    title: 'Keterbukaan Data',
    body: 'Kami <strong>tidak menjual atau menyewakan</strong> informasi pribadi Anda kepada pihak ketiga. Kami hanya membagikan data kepada pihak yang membantu kami dalam mengoperasikan situs web dan melayani transaksi Anda, seperti mitra logistik.',
  },
]
</script>
