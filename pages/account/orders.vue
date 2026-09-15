<template>
  <div class="min-h-screen antialiased" style="background:#f5f5f2;color:#090b0c;font-family:'Inter Tight',system-ui,sans-serif">

    <!-- Navbar -->
    <header class="sticky top-0 z-40 px-5 py-4 md:px-12" style="background:rgba(245,245,242,0.88);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.06)">
      <div class="relative flex h-10 items-center max-w-5xl mx-auto">
        <NuxtLink to="/" class="flex items-center gap-2 text-sm transition-opacity hover:opacity-60" style="color:#090b0c">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Beranda
        </NuxtLink>
        <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2 font-black text-xl tracking-tighter" style="font-family:'Inter Tight',sans-serif;color:#090b0c;letter-spacing:-0.04em">MINTS</NuxtLink>
        <button class="ml-auto text-sm transition-opacity hover:opacity-60" style="color:rgba(9,11,12,0.55)" @click="logout('/')">Keluar</button>
      </div>
    </header>

    <main class="mx-auto max-w-3xl px-5 py-10 md:px-12">
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-3">
          <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
          <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Akun Saya</span>
        </div>
        <h2 class="text-[2rem] font-normal leading-tight tracking-tight">Pesanan Saya</h2>
      </div>

      <!-- Nav pills -->
      <div class="flex rounded-full p-1 mb-6" style="background:rgba(9,11,12,0.08)">
        <NuxtLink to="/account" class="flex-1 text-center rounded-full py-2 text-sm font-normal" style="color:rgba(9,11,12,0.6)">Profil</NuxtLink>
        <NuxtLink to="/account/orders" class="flex-1 text-center rounded-full py-2 text-sm font-normal" style="background:#090b0c;color:white">Pesanan</NuxtLink>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 overflow-x-auto pb-2 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="shrink-0 rounded-full px-4 py-2 text-xs font-normal transition-all"
          :style="activeTab === tab.key ? 'background:#090b0c;color:white' : 'background:white;color:#090b0c'"
          @click="activeTab = tab.key"
        >{{ tab.label }}</button>
      </div>

      <!-- Loading -->
      <div v-if="pending" class="flex flex-col items-center justify-center py-20 gap-3">
        <div class="w-6 h-6 rounded-full border-2 animate-spin" style="border-color:rgba(9,11,12,0.15);border-top-color:#090b0c" />
        <p class="text-sm" style="color:rgba(9,11,12,0.4)">Memuat pesanan…</p>
      </div>

      <!-- Empty -->
      <div v-else-if="!orders.length" class="text-center py-24">
        <p class="text-5xl font-normal">○</p>
        <p class="mt-4 text-sm" style="color:rgba(9,11,12,0.5)">Belum ada pesanan di kategori ini.</p>
        <NuxtLink to="/" class="mt-5 inline-block rounded-full px-7 py-3 text-sm font-normal" style="background:#090b0c;color:white">Belanja Sekarang</NuxtLink>
      </div>

      <!-- Orders -->
      <div v-else class="space-y-4">
        <div v-for="order in orders" :key="order.id" class="rounded-3xl p-5" style="background:white">
          <div class="flex gap-4">
            <div class="w-20 h-20 rounded-2xl overflow-hidden shrink-0" style="background:rgba(9,11,12,0.05)">
              <img :src="order.product.imageUrl" :alt="order.product.title" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-normal leading-snug truncate">{{ order.product.title }}</p>
              <p class="text-xs mt-1 tabular-nums" style="color:rgba(9,11,12,0.4)">#{{ order.id.slice(0, 8).toUpperCase() }}</p>
              <span class="inline-block mt-2 text-xs px-3 py-1 rounded-full font-normal" :style="statusStyle(order.status)">{{ statusLabel(order.status) }}</span>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t flex flex-wrap items-center justify-between gap-3" style="border-color:rgba(9,11,12,0.08)">
            <p class="text-sm font-normal tabular-nums">Rp&nbsp;{{ formatPrice(Number(order.product.price) + (order.shippingCost || 0)) }}</p>
            <div class="flex gap-2">
              <a
                v-if="order.status === 'PENDING_PAYMENT' && order.payment?.paymentUrl"
                :href="order.payment.paymentUrl"
                class="rounded-full px-4 py-2 text-xs font-normal transition-opacity hover:opacity-85"
                style="background:#090b0c;color:white"
              >Bayar</a>
              <NuxtLink
                v-if="order.shipment?.trackingNo"
                :to="`/track?no=${order.shipment.trackingNo}&courier=${order.shipment.courier}`"
                class="rounded-full px-4 py-2 text-xs font-normal border transition-opacity hover:opacity-70"
                style="border-color:rgba(9,11,12,0.2);color:#090b0c"
              >Lacak</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'buyer' })
useSeoMeta({ title: 'Pesanan Saya — MINTS' })

const { logout } = useAuth()

const tabs = [
  { key: 'all', label: 'Semua' },
  { key: 'pending_payment', label: 'Belum Bayar' },
  { key: 'processing', label: 'Sedang Dikemas' },
  { key: 'shipping', label: 'Dikirim' },
  { key: 'completed', label: 'Selesai' },
  { key: 'cancelled', label: 'Dibatalkan' },
  { key: 'returned', label: 'Pengembalian' }
]
const activeTab = ref('all')

const { data: orders, pending, refresh } = useFetch<any[]>(() => `/api/buyer/orders?status=${activeTab.value === 'all' ? '' : activeTab.value}`)

watch(activeTab, () => refresh())

function statusLabel(status: string) {
  const map: Record<string, string> = {
    PENDING_PAYMENT: 'Belum Bayar', PAID: 'Dibayar', IN_PRODUCTION: 'Diproses',
    READY_TO_SHIP: 'Siap Kirim', SHIPPED: 'Dikirim', DELIVERED: 'Selesai',
    CANCELLED: 'Dibatalkan', REFUNDED: 'Pengembalian'
  }
  return map[status] || status
}

function statusStyle(status: string) {
  const map: Record<string, string> = {
    PENDING_PAYMENT: 'background:rgba(250,188,63,0.18);color:#090b0c',
    PAID: 'background:rgba(34,197,94,0.12);color:rgb(22,163,74)',
    IN_PRODUCTION: 'background:rgba(59,130,246,0.12);color:rgb(37,99,235)',
    READY_TO_SHIP: 'background:rgba(99,102,241,0.12);color:rgb(67,56,202)',
    SHIPPED: 'background:rgba(99,102,241,0.12);color:rgb(67,56,202)',
    DELIVERED: 'background:rgba(34,197,94,0.12);color:rgb(22,163,74)',
    CANCELLED: 'background:rgba(239,68,68,0.1);color:rgb(185,28,28)',
    REFUNDED: 'background:rgba(9,11,12,0.06);color:rgba(9,11,12,0.55)'
  }
  return map[status] || 'background:rgba(9,11,12,0.06);color:rgba(9,11,12,0.5)'
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(n)
}
</script>
