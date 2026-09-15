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
            <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Bantuan</span>
          </div>
          <h1 class="text-[2.5rem] font-normal leading-tight tracking-tight md:text-[4rem]">
            Pertanyaan yang<br><em style="font-style:italic;opacity:0.5">Sering Diajukan</em>
          </h1>
          <p class="mt-4 text-sm max-w-md leading-relaxed" style="color:rgba(9,11,12,0.55)">
            Temukan jawaban untuk pertanyaan umum tentang produk, pengiriman, dan layanan kami.
          </p>
        </div>
      </div>

      <!-- FAQ list -->
      <section class="px-5 py-16 md:px-12">
        <div class="mx-auto max-w-3xl">
          <div class="space-y-3">
            <div
              v-for="(item, i) in faqs"
              :key="i"
              class="rounded-3xl overflow-hidden transition-all"
              style="background:white"
            >
              <button
                class="w-full flex items-center justify-between gap-4 px-8 py-6 text-left"
                @click="toggle(i)"
              >
                <span class="text-sm font-semibold leading-snug pr-2">{{ item.q }}</span>
                <span
                  class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200"
                  :style="open === i ? 'background:#090b0c;transform:rotate(45deg)' : 'background:#f5f5f2'"
                >
                  <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" :style="open === i ? 'color:white' : 'color:#090b0c'"><path d="M12 5v14M5 12h14"/></svg>
                </span>
              </button>
              <div
                v-show="open === i"
                class="px-8 pb-6"
              >
                <div class="h-px mb-5" style="background:rgba(9,11,12,0.06)" />
                <p class="text-sm leading-[1.9]" style="color:rgba(9,11,12,0.65)" v-html="item.a" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="px-5 pb-24 md:px-12">
        <div class="mx-auto max-w-5xl">
          <div class="rounded-3xl px-10 py-14 text-center" style="background:#090b0c">
            <p class="text-xs uppercase tracking-widest mb-3" style="color:rgba(255,255,255,0.4)">Masih ada pertanyaan?</p>
            <h2 class="text-2xl font-normal tracking-tight text-white mb-6 md:text-3xl">Kami siap membantu Anda.</h2>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-normal transition-opacity hover:opacity-85" style="background:white;color:#090b0c">
              Hubungi via WhatsApp
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
useHead({ title: 'FAQ — Mints' })

const { isLoggedIn, fetchMe } = useAuth()
const { itemCount } = useCart()
const open = ref<number | null>(0)

onMounted(() => fetchMe())

function toggle(i: number) {
  open.value = open.value === i ? null : i
}

const faqs = [
  {
    q: 'Berapa lama waktu pengiriman?',
    a: 'Untuk area <strong>Jabodetabek</strong>, estimasi pengiriman adalah <strong>2–3 hari kerja</strong>. Untuk <strong>luar Jabodetabek</strong>, estimasi pengiriman adalah <strong>3–7 hari kerja</strong> tergantung lokasi tujuan dan kurir yang dipilih. Pesanan yang dikonfirmasi sebelum pukul 14.00 WIB diproses di hari yang sama.',
  },
  {
    q: 'Apakah bisa melakukan penukaran barang?',
    a: 'Ya, kami menerima penukaran ukuran maupun produk cacat dalam <strong>maksimal 7 hari kalender</strong> sejak pesanan diterima. Syaratnya: pakaian belum pernah dipakai, label merek masih utuh, dan tidak dipermak. Hubungi Customer Service via WhatsApp untuk memulai proses retur. Lihat <NuxtLink to="/kebijakan-pengembalian" style="text-decoration:underline;text-underline-offset:3px">Kebijakan Pengembalian</NuxtLink> untuk detail lengkap.',
  },
  {
    q: 'Metode pembayaran apa saja yang diterima?',
    a: 'Kami menerima berbagai metode pembayaran melalui <strong>Duitku</strong>, termasuk: Virtual Account, transfer bank, <strong>QRIS</strong>, dompet digital (e-wallet), dan kartu kredit/debit.',
  },
  {
    q: 'Bagaimana cara merawat pakaian Mints?',
    a: 'Instruksi perawatan tertera di label dalam setiap pakaian. Secara umum: cuci dengan <strong>mesin cuci mode lembut</strong> atau tangan, hindari <strong>cairan pemutih</strong>, dan setrika dengan suhu rendah atau gunakan <em>steamer</em> untuk menjaga kualitas bahan tetap optimal.',
  },
]
</script>
