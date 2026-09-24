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

            <!-- Dikelompokkan per toko — keranjang lintas toko, PRD §9/§11 Fase 5 -->
            <div v-for="g in groupedByStore" :key="g.storeId || 'null'" class="space-y-3">
              <p class="text-xs font-normal px-1" style="color:rgba(9,11,12,0.45)">{{ g.storeName || 'MINTS' }}</p>
              <div
                v-for="item in g.items"
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
                  <!-- Stok warning -->
                  <p
                    v-if="item.variantId && stockMap[item.variantId] !== undefined && item.qty >= stockMap[item.variantId]"
                    class="text-[10px] mb-1 text-right"
                    style="color:rgb(220,38,38)"
                  >Stok tersisa {{ stockMap[item.variantId] }}</p>
                  <!-- Qty -->
                  <div class="flex items-center rounded-full overflow-hidden" style="background:rgba(9,11,12,0.06)">
                    <button
                      class="w-8 h-8 flex items-center justify-center text-lg leading-none transition-colors hover:bg-black/10"
                      style="color:#090b0c"
                      @click="updateQty(item.productId, item.variantId, item.qty - 1)"
                    >−</button>
                    <span class="w-7 text-center text-sm tabular-nums font-normal">{{ item.qty }}</span>
                    <button
                      class="w-8 h-8 flex items-center justify-center text-lg leading-none transition-colors hover:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed"
                      style="color:#090b0c"
                      :disabled="item.variantId ? item.qty >= (stockMap[item.variantId] ?? Infinity) : false"
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
          </div>

          <!-- Summary -->
          <div class="space-y-4">
            <div class="flex items-center gap-3 mb-6">
              <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
              <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Ringkasan</span>
            </div>

            <div class="rounded-3xl p-6 space-y-5" style="background:white">
              <div class="space-y-3">
                <div class="flex justify-between text-sm">
                  <span style="color:rgba(9,11,12,0.5)">Subtotal ({{ itemCount }} item)</span>
                  <span class="tabular-nums font-normal">Rp&nbsp;{{ formatPrice(subtotal) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span style="color:rgba(9,11,12,0.5)">Ongkir</span>
                  <span style="color:rgba(9,11,12,0.35)">dihitung saat checkout</span>
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
              <p class="text-xs leading-5" style="color:rgba(9,11,12,0.65)">Punya kode voucher? Masukkan saat checkout untuk mendapat potongan harga.</p>
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
const { cartItems, itemCount, subtotal, groupedByStore, removeItem, updateQty } = useCart()
function formatPrice(n: number) { return n.toLocaleString('id-ID') }

const stockMap = ref<Record<string, number>>({})

async function fetchStock() {
  const ids = cartItems.value.map(i => i.variantId).filter(Boolean) as string[]
  if (!ids.length) return
  const data = await $fetch<Record<string, number>>('/api/products/stock', {
    query: { variantIds: ids.join(',') }
  })
  stockMap.value = data

  // Auto-cap qty jika melebihi stok
  for (const item of cartItems.value) {
    if (item.variantId && data[item.variantId] !== undefined && item.qty > data[item.variantId]) {
      updateQty(item.productId, item.variantId, data[item.variantId])
    }
  }
}

onMounted(fetchStock)
watch(cartItems, fetchStock, { deep: false })
</script>
