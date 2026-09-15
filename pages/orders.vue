<template>
  <div class="min-h-screen antialiased" style="background:#f5f5f2;color:#090b0c;font-family:'Inter Tight',system-ui,sans-serif">

    <!-- Navbar -->
    <header class="sticky top-0 z-40 px-5 py-4 md:px-12" style="background:rgba(245,245,242,0.88);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.06)">
      <div class="relative flex h-10 items-center max-w-3xl mx-auto">
        <NuxtLink to="/" class="flex items-center gap-2 text-sm transition-opacity hover:opacity-60" style="color:#090b0c">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Beranda
        </NuxtLink>
        <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2 font-black text-xl tracking-tighter" style="font-family:'Inter Tight',sans-serif;color:#090b0c;letter-spacing:-0.04em">MINTS</NuxtLink>
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-5 py-10 md:px-12">
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-3">
          <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
          <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Pembeli</span>
        </div>
        <h2 class="text-[2rem] font-normal leading-tight tracking-tight">Pesanan Saya</h2>
      </div>

      <!-- Phone lookup -->
      <div v-if="!phoneVerified" class="max-w-md space-y-5">
        <p class="text-sm leading-6" style="color:rgba(9,11,12,0.55)">Masukkan nomor HP yang kamu gunakan saat checkout untuk melihat status pesanan.</p>
        <div class="space-y-3">
          <input
            v-model="phoneInput"
            type="tel"
            placeholder="08xxxxxxxxxx"
            class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none"
            style="background:white;border:1px solid rgba(9,11,12,0.12);color:#090b0c"
            @keydown.enter="lookupOrders"
          />
          <button
            class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity"
            :style="phoneInput.trim() ? 'background:#090b0c;color:white' : 'background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed'"
            :disabled="!phoneInput.trim() || loading"
            @click="lookupOrders"
          >{{ loading ? 'Mencari…' : 'Cari Pesanan' }}</button>
        </div>
      </div>

      <!-- Orders list -->
      <template v-else>
        <button class="text-sm mb-6 underline underline-offset-4" style="color:rgba(9,11,12,0.45)" @click="phoneVerified = false; orders = []">Ganti nomor HP</button>

        <div v-if="!orders.length" class="text-center py-24">
          <p class="text-5xl font-normal">○</p>
          <p class="mt-4 text-sm" style="color:rgba(9,11,12,0.5)">Tidak ada pesanan ditemukan untuk nomor ini.</p>
        </div>

        <div v-else class="space-y-4">
          <div
            v-for="order in orders"
            :key="order.id"
            class="rounded-3xl p-5"
            style="background:white"
          >
            <div class="flex gap-4">
              <div class="w-20 h-20 rounded-2xl overflow-hidden shrink-0" style="background:rgba(9,11,12,0.05)">
                <img :src="order.product.imageUrl" :alt="order.product.title" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-normal leading-snug truncate">{{ order.product.title }}</p>
                <p class="text-xs mt-1 tabular-nums" style="color:rgba(9,11,12,0.4)">#{{ order.id.slice(0, 8).toUpperCase() }}</p>
                <div class="flex flex-wrap gap-2 mt-2">
                  <span class="text-xs px-3 py-1 rounded-full font-normal" :style="statusStyle(order.status)">{{ statusLabel(order.status) }}</span>
                  <span v-if="order.payment?.status === 'paid'" class="text-xs px-3 py-1 rounded-full font-normal" style="background:rgba(34,197,94,0.12);color:rgb(22,163,74)">Lunas</span>
                </div>
              </div>
            </div>

            <!-- Shipment info -->
            <div v-if="order.shipment?.trackingNo" class="mt-4 pt-4 flex items-center justify-between text-xs" style="border-top:1px solid rgba(9,11,12,0.08);color:rgba(9,11,12,0.45)">
              <span><strong style="color:#090b0c">{{ order.shipment.courier?.toUpperCase() }}</strong> · Resi {{ order.shipment.trackingNo }}</span>
              <NuxtLink
                :to="`/track?no=${order.shipment.trackingNo}&courier=${order.shipment.courier}`"
                class="rounded-full px-3 py-1 text-xs font-normal transition-opacity hover:opacity-85"
                style="background:#090b0c;color:white"
              >Lacak</NuxtLink>
            </div>

            <!-- Pay button -->
            <div v-if="order.status === 'PENDING_PAYMENT' && order.payment?.paymentUrl" class="mt-4">
              <a :href="order.payment.paymentUrl" class="block w-full text-center rounded-full py-3 text-sm font-normal" style="background:#090b0c;color:white">Bayar Sekarang</a>
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
useSeoMeta({ title: 'Pesanan Saya — MINTS' })

const phoneInput = ref('')
const phoneVerified = ref(false)
const loading = ref(false)
const orders = ref<any[]>([])

async function lookupOrders() {
  if (!phoneInput.value.trim()) return
  loading.value = true
  try {
    orders.value = await $fetch<any[]>('/api/orders', { query: { phone: phoneInput.value.trim() } })
    phoneVerified.value = true
  } catch {
    orders.value = []
    phoneVerified.value = true
  } finally {
    loading.value = false
  }
}

function statusLabel(status: string) {
  const map: Record<string, string> = {
    PENDING_PAYMENT: 'Menunggu Bayar', PAID: 'Dibayar', IN_PRODUCTION: 'Diproses',
    READY_TO_SHIP: 'Siap Kirim', CANCELLED: 'Dibatalkan', REFUNDED: 'Dikembalikan'
  }
  return map[status] || status
}

function statusStyle(status: string) {
  const map: Record<string, string> = {
    PENDING_PAYMENT: 'background:rgba(250,188,63,0.18);color:#090b0c',
    PAID: 'background:rgba(34,197,94,0.12);color:rgb(22,163,74)',
    IN_PRODUCTION: 'background:rgba(59,130,246,0.12);color:rgb(37,99,235)',
    READY_TO_SHIP: 'background:rgba(99,102,241,0.12);color:rgb(67,56,202)',
    CANCELLED: 'background:rgba(239,68,68,0.1);color:rgb(185,28,28)',
    REFUNDED: 'background:rgba(9,11,12,0.06);color:rgba(9,11,12,0.55)'
  }
  return map[status] || 'background:rgba(9,11,12,0.06);color:rgba(9,11,12,0.5)'
}
</script>
