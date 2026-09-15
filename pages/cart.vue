<template>
  <div class="min-h-screen antialiased" style="background:#f5f5f2;color:#090b0c;font-family:'Inter Tight',system-ui,sans-serif">

    <!-- Navbar -->
    <header class="sticky top-0 z-40 px-5 py-4 md:px-12" style="background:rgba(245,245,242,0.88);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.06)">
      <div class="relative flex h-10 items-center max-w-5xl mx-auto">
        <button class="flex items-center gap-2 text-sm transition-opacity hover:opacity-60" style="color:#090b0c" @click="$router.back()">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Lanjut Belanja
        </button>
        <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2 font-black text-xl tracking-tighter" style="font-family:'Inter Tight',sans-serif;color:#090b0c;letter-spacing:-0.04em">MINTS</NuxtLink>
        <p class="ml-auto text-sm font-normal tabular-nums" style="color:rgba(9,11,12,0.45)">{{ itemCount }} item</p>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-5 py-10 md:px-12">

      <!-- Empty -->
      <div v-if="!cartItems.length" class="flex flex-col items-center justify-center py-40 gap-5">
        <svg class="w-12 h-12" style="color:rgba(9,11,12,0.2)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/></svg>
        <div class="text-center">
          <p class="text-lg font-normal tracking-tight">Keranjangmu masih kosong</p>
          <p class="mt-1 text-sm" style="color:rgba(9,11,12,0.45)">Temukan produk yang kamu suka</p>
        </div>
        <NuxtLink to="/" class="rounded-full px-7 py-3 text-sm font-normal transition-opacity hover:opacity-85" style="background:#090b0c;color:white">Lihat Produk</NuxtLink>
      </div>

      <!-- Cart content -->
      <template v-else>
        <div class="grid gap-6 lg:grid-cols-[1fr_320px] lg:gap-10">

          <!-- Items -->
          <div class="space-y-3">
            <!-- Section label -->
            <div class="flex items-center gap-3 mb-6">
              <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
              <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Produk Dipilih</span>
            </div>

            <div
              v-for="item in cartItems"
              :key="`${item.productId}-${item.variantId}`"
              class="flex gap-4 rounded-3xl p-4"
              style="background:white"
            >
              <!-- Image -->
              <div class="shrink-0 w-20 h-20 rounded-2xl overflow-hidden" style="background:rgba(9,11,12,0.05)">
                <img :src="item.imageUrl" :alt="item.title" class="w-full h-full object-cover" />
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-normal leading-snug tracking-tight line-clamp-2">{{ item.title }}</p>
                <p v-if="item.size" class="mt-1 text-xs" style="color:rgba(9,11,12,0.45)">Ukuran: {{ item.size }}</p>
                <p class="mt-2 text-sm font-normal tabular-nums">Rp&nbsp;{{ formatPrice(item.price * item.qty) }}</p>
              </div>

              <!-- Controls -->
              <div class="flex flex-col items-end justify-between shrink-0">
                <!-- Qty -->
                <div class="flex items-center rounded-full overflow-hidden" style="background:rgba(9,11,12,0.06)">
                  <button
                    class="w-8 h-8 flex items-center justify-center text-lg leading-none transition-colors hover:bg-black/10"
                    style="color:#090b0c"
                    @click="updateQty(item.productId, item.variantId, item.qty - 1)"
                  >−</button>
                  <span class="w-7 text-center text-sm tabular-nums font-normal">{{ item.qty }}</span>
                  <button
                    class="w-8 h-8 flex items-center justify-center text-lg leading-none transition-colors hover:bg-black/10"
                    style="color:#090b0c"
                    @click="updateQty(item.productId, item.variantId, item.qty + 1)"
                  >+</button>
                </div>
                <!-- Remove -->
                <button
                  class="text-xs transition-opacity hover:opacity-100 opacity-40"
                  style="color:#090b0c"
                  @click="removeItem(item.productId, item.variantId)"
                >Hapus</button>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="space-y-4">
            <div class="flex items-center gap-3 mb-6">
              <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
              <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Ringkasan</span>
            </div>

            <div class="rounded-3xl p-6 space-y-5" style="background:white">
              <!-- Free shipping progress -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs" style="color:rgba(9,11,12,0.5)">Gratis ongkir</span>
                  <span class="text-xs font-normal" :style="freeShippingRemaining === 0 ? 'color:rgb(22,163,74)' : 'color:rgba(9,11,12,0.5)'">
                    {{ freeShippingRemaining === 0 ? 'Kamu dapat gratis ongkir!' : `kurang Rp ${formatPrice(freeShippingRemaining)}` }}
                  </span>
                </div>
                <div class="h-1.5 rounded-full overflow-hidden" style="background:rgba(9,11,12,0.08)">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :style="`width:${Math.min(freeShippingProgress * 100, 100)}%;background:${freeShippingRemaining === 0 ? 'rgb(22,163,74)' : '#090b0c'}`"
                  />
                </div>
              </div>

              <div class="border-t pt-4 space-y-3" style="border-color:rgba(9,11,12,0.08)">
                <div class="flex justify-between text-sm">
                  <span style="color:rgba(9,11,12,0.5)">Subtotal ({{ itemCount }} item)</span>
                  <span class="tabular-nums font-normal">Rp&nbsp;{{ formatPrice(subtotal) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span style="color:rgba(9,11,12,0.5)">Ongkir</span>
                  <span :style="freeShippingRemaining === 0 ? 'color:rgb(22,163,74)' : 'color:rgba(9,11,12,0.35)'">
                    {{ freeShippingRemaining === 0 ? 'GRATIS' : 'dihitung saat checkout' }}
                  </span>
                </div>
              </div>

              <div class="border-t pt-4 flex justify-between" style="border-color:rgba(9,11,12,0.08)">
                <span class="text-sm font-normal tracking-tight">Total</span>
                <span class="text-lg font-normal tabular-nums tracking-tight">Rp&nbsp;{{ formatPrice(subtotal) }}</span>
              </div>

              <NuxtLink
                to="/checkout"
                class="flex items-center justify-center gap-2 w-full rounded-full py-3.5 text-sm font-normal transition-opacity hover:opacity-85"
                style="background:#090b0c;color:white"
              >
                Lanjut ke Checkout
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </NuxtLink>
            </div>

            <!-- Promo note -->
            <div class="flex items-start gap-3 rounded-2xl px-4 py-3" style="background:rgba(250,188,63,0.12)">
              <svg class="w-4 h-4 shrink-0 mt-0.5" style="color:#090b0c" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <p class="text-xs leading-5" style="color:rgba(9,11,12,0.65)">Gratis ongkir ke seluruh Indonesia untuk pembelian min. <strong style="color:#090b0c">Rp&nbsp;500.000</strong></p>
            </div>
          </div>

        </div>
      </template>
    </main>

    <!-- Chat widget -->
    <ClientOnly>
      <ChatWidget />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Keranjang — MINTS' })
const { cartItems, itemCount, subtotal, freeShippingProgress, freeShippingRemaining, removeItem, updateQty } = useCart()
function formatPrice(n: number) { return n.toLocaleString('id-ID') }
</script>
