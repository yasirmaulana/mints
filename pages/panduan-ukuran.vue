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
          <NuxtLink to="/tentang-kami" class="rounded-full px-4 py-2 text-sm transition-colors" style="color:rgba(9,11,12,0.7)" @mouseover="$event.currentTarget.style.background='rgba(0,0,0,0.05)'" @mouseleave="$event.currentTarget.style.background='transparent'">Tentang</NuxtLink>
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

    <!-- Page content -->
    <div style="padding-top:88px">

      <!-- Page title -->
      <div class="px-5 py-16 md:px-12" style="border-bottom:1px solid rgba(9,11,12,0.08)">
        <div class="mx-auto max-w-5xl">
          <div class="mb-4 flex items-center gap-3">
            <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
            <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Panduan</span>
          </div>
          <h1 class="text-[2.5rem] font-normal leading-tight tracking-tight md:text-[4rem]">
            Panduan<br><em style="font-style:italic;opacity:0.5">Ukuran</em>
          </h1>
          <p class="mt-4 text-sm max-w-md leading-relaxed" style="color:rgba(9,11,12,0.55)">
            Temukan ukuran yang tepat untuk kenyamanan maksimal. Ukuran bersifat perkiraan dan dapat sedikit berbeda tergantung desain serta karakter bahan.
          </p>
        </div>
      </div>

      <!-- Size table -->
      <section class="px-5 py-16 md:px-12">
        <div class="mx-auto max-w-5xl">
          <div class="mb-8 flex items-center gap-3">
            <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
            <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Tabel Ukuran (cm)</span>
          </div>

          <div class="overflow-x-auto rounded-3xl" style="background:white">
            <table class="w-full text-sm">
              <thead>
                <tr style="border-bottom:1px solid rgba(9,11,12,0.08)">
                  <th class="text-left px-6 py-4 font-semibold text-xs uppercase tracking-widest" style="color:rgba(9,11,12,0.4)">Ukuran</th>
                  <th class="text-left px-6 py-4 font-semibold text-xs uppercase tracking-widest" style="color:rgba(9,11,12,0.4)">Internasional</th>
                  <th class="text-left px-6 py-4 font-semibold text-xs uppercase tracking-widest" style="color:rgba(9,11,12,0.4)">Lingkar Dada</th>
                  <th class="text-left px-6 py-4 font-semibold text-xs uppercase tracking-widest" style="color:rgba(9,11,12,0.4)">Lingkar Pinggang</th>
                  <th class="text-left px-6 py-4 font-semibold text-xs uppercase tracking-widest" style="color:rgba(9,11,12,0.4)">Lingkar Pinggul</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, i) in sizes"
                  :key="row.size"
                  class="transition-colors"
                  :style="i < sizes.length - 1 ? 'border-bottom:1px solid rgba(9,11,12,0.06)' : ''"
                  @mouseover="hovered = i"
                  @mouseleave="hovered = null"
                >
                  <td class="px-6 py-4 transition-colors" :style="hovered === i ? 'background:rgba(9,11,12,0.02)' : ''">
                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold" style="background:#090b0c;color:white">{{ row.size }}</span>
                  </td>
                  <td class="px-6 py-4 text-sm tabular-nums" :style="hovered === i ? 'background:rgba(9,11,12,0.02)' : ''" style="color:rgba(9,11,12,0.5)">{{ row.intl }}</td>
                  <td class="px-6 py-4 text-sm font-medium tabular-nums" :style="hovered === i ? 'background:rgba(9,11,12,0.02)' : ''">{{ row.dada }}</td>
                  <td class="px-6 py-4 text-sm font-medium tabular-nums" :style="hovered === i ? 'background:rgba(9,11,12,0.02)' : ''">{{ row.pinggang }}</td>
                  <td class="px-6 py-4 text-sm font-medium tabular-nums" :style="hovered === i ? 'background:rgba(9,11,12,0.02)' : ''">{{ row.pinggul }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="mt-4 text-xs" style="color:rgba(9,11,12,0.4)">* Semua ukuran dalam sentimeter (cm)</p>
        </div>
      </section>

      <!-- Cara mengukur -->
      <section class="px-5 pb-20 md:px-12">
        <div class="mx-auto max-w-5xl">
          <div class="mb-8 flex items-center gap-3">
            <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
            <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Cara Mengukur</span>
          </div>

          <div class="grid gap-5 sm:grid-cols-3">
            <div v-for="tip in tips" :key="tip.title" class="rounded-3xl p-7" style="background:white">
              <div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-5 flex-shrink-0" style="background:#f5f5f2">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#090b0c" stroke-width="1.8" v-html="tip.icon" />
              </div>
              <h3 class="font-semibold text-sm mb-2">{{ tip.title }}</h3>
              <p class="text-sm leading-[1.8]" style="color:rgba(9,11,12,0.55)">{{ tip.desc }}</p>
            </div>
          </div>

          <!-- Note -->
          <div class="mt-6 rounded-2xl px-6 py-4 flex items-start gap-3" style="background:rgba(250,188,63,0.15);border:1px solid rgba(250,188,63,0.4)">
            <span class="text-base mt-0.5">💡</span>
            <p class="text-sm leading-relaxed" style="color:rgba(9,11,12,0.7)">
              Ukuran bersifat perkiraan dan dapat sedikit berbeda tergantung desain serta karakter bahan. Jika ukuran kamu berada di antara dua pilihan, kami sarankan untuk memilih ukuran yang lebih besar.
            </p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="px-5 pb-24 md:px-12">
        <div class="mx-auto max-w-5xl">
          <div class="rounded-3xl px-10 py-14 text-center" style="background:#090b0c">
            <p class="text-xs uppercase tracking-widest mb-3" style="color:rgba(255,255,255,0.4)">Sudah tahu ukuranmu?</p>
            <h2 class="text-2xl font-normal tracking-tight text-white mb-6 md:text-3xl">Temukan koleksi yang sempurna untukmu.</h2>
            <NuxtLink to="/koleksi" class="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-normal transition-opacity hover:opacity-85" style="background:white;color:#090b0c">
              Belanja Sekarang
              <span class="flex h-5 w-5 items-center justify-center rounded-full text-xs" style="background:#090b0c;color:white">→</span>
            </NuxtLink>
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
useHead({ title: 'Panduan Ukuran — Mints' })

const { isLoggedIn, fetchMe } = useAuth()
const { itemCount } = useCart()
const hovered = ref<number | null>(null)

onMounted(() => fetchMe())

const sizes = [
  { size: 'S',   intl: '36 / UK 8',  dada: '84 – 88 cm',   pinggang: '64 – 68 cm', pinggul: '88 – 92 cm'   },
  { size: 'M',   intl: '38 / UK 10', dada: '89 – 93 cm',   pinggang: '69 – 73 cm', pinggul: '93 – 97 cm'   },
  { size: 'L',   intl: '40 / UK 12', dada: '94 – 98 cm',   pinggang: '74 – 78 cm', pinggul: '98 – 102 cm'  },
  { size: 'XL',  intl: '42 / UK 14', dada: '99 – 104 cm',  pinggang: '81 – 86 cm', pinggul: '105 – 110 cm' },
]

const tips = [
  {
    title: 'Lingkar Dada',
    desc: 'Ukur di sekeliling bagian dada yang paling penuh (bust line), pastikan pita pengukur horizontal mengelilingi punggung.',
    icon: '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>'
  },
  {
    title: 'Lingkar Pinggang',
    desc: 'Ukur di sekeliling garis pinggang alami, biasanya bagian terkecil di atas pusar. Biarkan pita ukur sedikit longgar untuk ruang napas.',
    icon: '<circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/>'
  },
  {
    title: 'Lingkar Pinggul',
    desc: 'Berdirilah dengan kaki rapat, lalu ukur bagian terlebar di sekitar pinggul / area bokong.',
    icon: '<path d="M3 12h18M3 6h18M3 18h18"/>'
  },
]
</script>
