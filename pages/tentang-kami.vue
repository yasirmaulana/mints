<template>
  <div class="min-h-screen antialiased" style="background:#f5f5f2;font-family:'Inter Tight',system-ui,sans-serif;color:#090b0c">

    <!-- Header -->
    <header class="fixed left-0 right-0 z-50 px-4 py-4 md:px-8 transition-colors duration-300" style="background:rgba(245,245,242,0.9);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.06)">
      <div class="relative flex h-10 items-center max-w-6xl mx-auto">
        <NuxtLink to="/" class="flex items-center font-black text-xl tracking-tighter" style="font-family:'Inter Tight',sans-serif;color:#090b0c;letter-spacing:-0.04em">MINTS</NuxtLink>

        <nav class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-md md:flex" style="border-color:rgba(9,11,12,0.08);background:rgba(255,255,255,0.7)">
          <NuxtLink to="/" class="rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)" @mouseover="$event.currentTarget.style.background='rgba(0,0,0,0.05)'" @mouseleave="$event.currentTarget.style.background='transparent'">Beranda</NuxtLink>
          <NuxtLink to="/koleksi" class="rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)" @mouseover="$event.currentTarget.style.background='rgba(0,0,0,0.05)'" @mouseleave="$event.currentTarget.style.background='transparent'">Koleksi</NuxtLink>
          <NuxtLink to="/track" class="rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)" @mouseover="$event.currentTarget.style.background='rgba(0,0,0,0.05)'" @mouseleave="$event.currentTarget.style.background='transparent'">Lacak Paket</NuxtLink>
          <NuxtLink to="/tentang-kami" class="rounded-full px-4 py-2 text-sm font-medium transition-colors" style="background:rgba(9,11,12,0.07);color:#090b0c">Tentang</NuxtLink>
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

    <!-- Hero -->
    <section class="relative overflow-hidden flex flex-col items-center justify-end px-5 md:px-12" style="background:#090b0c;min-height:60vh;padding-top:120px;padding-bottom:80px">
      <div class="absolute inset-0 z-0 opacity-30" style="background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.4%22/%3E%3C/svg%3E');background-size:200px" />
      <div class="relative z-10 max-w-4xl mx-auto text-center">
        <div class="mb-5 inline-flex items-center gap-2 rounded-full py-1.5 pl-5 pr-2 text-sm" style="background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.7);backdrop-filter:blur(8px)">
          Berdiri sejak 2021
          <span class="flex h-6 w-6 items-center justify-center rounded-full text-xs" style="background:#fabc3f;color:#090b0c">✦</span>
        </div>
        <h1 class="text-[3rem] font-normal leading-[0.94] tracking-tight text-white sm:text-[4.5rem] md:text-[6rem]">
          Tentang<br><em style="font-style:italic;opacity:0.6">Kami</em>
        </h1>
        <p class="mt-6 text-base leading-relaxed max-w-xl mx-auto" style="color:rgba(255,255,255,0.5)">
          Modest Fashion Premium — Elegan. Syar'i. Dibuat Sepenuh Hati.
        </p>
      </div>
    </section>

    <!-- Story -->
    <section class="px-5 py-24 md:px-12" style="background:#f5f5f2">
      <div class="mx-auto max-w-5xl">
        <div class="grid gap-16 md:grid-cols-2 md:gap-24 items-start">
          <div>
            <div class="mb-5 flex items-center gap-3">
              <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
              <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Kisah Kami</span>
            </div>
            <h2 class="text-[2.2rem] font-normal leading-tight tracking-tight md:text-[3rem]">
              Lahir dari<br><em style="font-style:italic;opacity:0.5">sebuah komitmen</em>
            </h2>
          </div>
          <div class="space-y-6 pt-2 md:pt-16">
            <p class="text-base leading-[1.8]" style="color:rgba(9,11,12,0.7)">
              Mints adalah wujud dari komitmen kami untuk menghadirkan busana muslim yang tidak hanya santun, namun juga merepresentasikan gaya hidup modern dan elegan.
            </p>
            <p class="text-base leading-[1.8]" style="color:rgba(9,11,12,0.7)">
              Mints selalu berusaha menjembatani kebutuhan akan pakaian yang <em>modest</em> (tertutup) dengan tren fesyen kontemporer. Kami percaya bahwa setiap wanita berhak tampil percaya diri, anggun, dan nyaman dalam setiap balutan kain.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Divider stat strip -->
    <div class="px-5 md:px-12" style="background:#f5f5f2">
      <div class="mx-auto max-w-5xl border-t border-b py-10 grid grid-cols-3 text-center gap-4" style="border-color:rgba(9,11,12,0.1)">
        <div>
          <p class="text-[2.5rem] font-normal tracking-tight leading-none tabular-nums">2021</p>
          <p class="mt-2 text-[10px] uppercase tracking-[0.14em]" style="color:rgba(9,11,12,0.45)">Tahun Berdiri</p>
        </div>
        <div>
          <p class="text-[2.5rem] font-normal tracking-tight leading-none">100%</p>
          <p class="mt-2 text-[10px] uppercase tracking-[0.14em]" style="color:rgba(9,11,12,0.45)">Syar'i & Halal</p>
        </div>
        <div>
          <p class="text-[2.5rem] font-normal tracking-tight leading-none">🇮🇩</p>
          <p class="mt-2 text-[10px] uppercase tracking-[0.14em]" style="color:rgba(9,11,12,0.45)">Produk Lokal</p>
        </div>
      </div>
    </div>

    <!-- Filosofi -->
    <section class="px-5 py-24 md:px-12" style="background:#f5f5f2">
      <div class="mx-auto max-w-5xl">
        <div class="mb-12 flex items-center gap-3">
          <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
          <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Filosofi Kami</span>
        </div>
        <div class="grid gap-6 sm:grid-cols-3">
          <div class="rounded-3xl p-8" style="background:white">
            <div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-6" style="background:#090b0c">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <h3 class="text-lg font-normal tracking-tight mb-3">Material Berkualitas</h3>
            <p class="text-sm leading-[1.8]" style="color:rgba(9,11,12,0.55)">Material berkualitas tinggi, siluet yang terstruktur, dan palet warna yang membumi adalah DNA dari setiap koleksi kami.</p>
          </div>
          <div class="rounded-3xl p-8" style="background:white">
            <div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-6" style="background:#090b0c">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </div>
            <h3 class="text-lg font-normal tracking-tight mb-3">Teknik Penuh Cinta</h3>
            <p class="text-sm leading-[1.8]" style="color:rgba(9,11,12,0.55)">Kami secara teliti memadukan teknik jahitan klasik dengan sentuhan modern untuk menciptakan karya yang timeless.</p>
          </div>
          <div class="rounded-3xl p-8" style="background:#fabc3f">
            <div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-6" style="background:#090b0c">
              <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <h3 class="text-lg font-normal tracking-tight mb-3">Untuk Setiap Wanita</h3>
            <p class="text-sm leading-[1.8]" style="color:rgba(9,11,12,0.65)">Kami percaya bahwa setiap wanita berhak tampil percaya diri, anggun, dan nyaman dalam setiap balutan kain.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Misi -->
    <section class="px-5 py-24 md:px-12" style="background:#090b0c">
      <div class="mx-auto max-w-5xl">
        <div class="mb-5 flex items-center gap-3">
          <div class="h-px w-5" style="background:rgba(255,255,255,0.4)" />
          <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(255,255,255,0.4)">Misi Kami</span>
        </div>
        <h2 class="text-[2rem] font-normal leading-[1.1] tracking-tight text-white mb-8 max-w-2xl md:text-[3rem]">
          Memberdayakan wanita muslim di seluruh Indonesia.
        </h2>
        <div class="grid gap-8 md:grid-cols-2 max-w-3xl">
          <p class="text-base leading-[1.8]" style="color:rgba(255,255,255,0.5)">
            Melalui desain yang inovatif, fungsional, dan berkualitas tinggi, kami hadir untuk setiap momen — dari keseharian hingga hari istimewa.
          </p>
          <p class="text-base leading-[1.8]" style="color:rgba(255,255,255,0.5)">
            Kami berkomitmen untuk terus berinovasi dan tumbuh bersama komunitas Mints, mendengarkan setiap kebutuhan, dan menyempurnakannya di setiap koleksi baru.
          </p>
        </div>
        <div class="mt-14">
          <NuxtLink to="/koleksi" class="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-normal transition-opacity hover:opacity-85" style="background:white;color:#090b0c">
            Lihat Koleksi Kami
            <span class="flex h-5 w-5 items-center justify-center rounded-full text-xs" style="background:#090b0c;color:white">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>

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

    <ClientOnly>
      <ChatWidget />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Tentang Kami — Mints' })

const { isLoggedIn, fetchMe } = useAuth()
const { itemCount } = useCart()

onMounted(() => fetchMe())
</script>
