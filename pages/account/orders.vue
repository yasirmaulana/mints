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
              <button
                class="rounded-full px-4 py-2 text-xs font-normal border transition-opacity hover:opacity-70"
                style="border-color:rgba(9,11,12,0.2);color:#090b0c"
                @click="openDetail(order)"
              >Detail</button>
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

    <!-- Modal Detail Pesanan -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedOrder" class="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4" @click.self="selectedOrder = null">
          <div class="absolute inset-0" style="background:rgba(0,0,0,0.45);backdrop-filter:blur(4px)" @click="selectedOrder = null" />
          <div
            class="relative w-full md:max-w-lg overflow-y-auto"
            style="background:white;border-radius:2rem 2rem 0 0;max-height:92dvh;padding:1.75rem 1.5rem 2.5rem"
            @click.stop
          >
            <!-- Handle bar -->
            <div class="mx-auto mb-5 w-10 h-1 rounded-full md:hidden" style="background:rgba(9,11,12,0.12)" />

            <!-- Header -->
            <div class="flex items-start justify-between mb-6">
              <div>
                <p class="text-xs font-normal uppercase tracking-[0.14rem] mb-1" style="color:rgba(9,11,12,0.4)">Detail Pesanan</p>
                <p class="text-sm font-normal tabular-nums" style="color:rgba(9,11,12,0.5)">#{{ selectedOrder.id.slice(0, 8).toUpperCase() }}</p>
              </div>
              <button class="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:opacity-60" style="background:rgba(9,11,12,0.06)" @click="selectedOrder = null">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <!-- Status badge -->
            <div class="mb-6">
              <span class="inline-block text-sm px-4 py-1.5 rounded-full font-normal" :style="statusStyle(selectedOrder.status)">{{ statusLabel(selectedOrder.status) }}</span>
            </div>

            <!-- Produk -->
            <section class="mb-5">
              <p class="text-xs font-normal uppercase tracking-[0.12rem] mb-3" style="color:rgba(9,11,12,0.4)">Produk</p>
              <div class="flex gap-3 rounded-2xl p-3" style="background:rgba(9,11,12,0.03);border:1px solid rgba(9,11,12,0.06)">
                <div class="w-16 h-16 rounded-xl overflow-hidden shrink-0" style="background:rgba(9,11,12,0.05)">
                  <img :src="selectedOrder.product.imageUrl" :alt="selectedOrder.product.title" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-normal leading-snug">{{ selectedOrder.product.title }}</p>
                  <p v-if="selectedOrder.variantId" class="text-xs mt-1" style="color:rgba(9,11,12,0.5)">Ukuran: {{ selectedOrder.variantId }}</p>
                  <p class="text-sm font-normal mt-1.5 tabular-nums">Rp&nbsp;{{ formatPrice(Number(selectedOrder.product.price)) }}</p>
                </div>
              </div>
            </section>

            <!-- Rincian Biaya -->
            <section class="mb-5">
              <p class="text-xs font-normal uppercase tracking-[0.12rem] mb-3" style="color:rgba(9,11,12,0.4)">Rincian Biaya</p>
              <div class="rounded-2xl overflow-hidden" style="border:1px solid rgba(9,11,12,0.06)">
                <div class="flex justify-between px-4 py-3" style="border-bottom:1px solid rgba(9,11,12,0.06)">
                  <span class="text-sm" style="color:rgba(9,11,12,0.6)">Harga produk</span>
                  <span class="text-sm tabular-nums">Rp&nbsp;{{ formatPrice(Number(selectedOrder.product.price)) }}</span>
                </div>
                <div class="flex justify-between px-4 py-3" style="border-bottom:1px solid rgba(9,11,12,0.06)">
                  <span class="text-sm" style="color:rgba(9,11,12,0.6)">Ongkos kirim</span>
                  <span class="text-sm tabular-nums">{{ selectedOrder.shippingCost === 0 ? 'Gratis' : `Rp ${formatPrice(selectedOrder.shippingCost || 0)}` }}</span>
                </div>
                <div class="flex justify-between px-4 py-3">
                  <span class="text-sm font-normal">Total</span>
                  <span class="text-sm font-normal tabular-nums">Rp&nbsp;{{ formatPrice(Number(selectedOrder.product.price) + (selectedOrder.shippingCost || 0)) }}</span>
                </div>
              </div>
            </section>

            <!-- Info Pembayaran -->
            <section class="mb-5">
              <p class="text-xs font-normal uppercase tracking-[0.12rem] mb-3" style="color:rgba(9,11,12,0.4)">Pembayaran</p>
              <div class="rounded-2xl overflow-hidden" style="border:1px solid rgba(9,11,12,0.06)">
                <div class="flex justify-between px-4 py-3" style="border-bottom:1px solid rgba(9,11,12,0.06)">
                  <span class="text-sm" style="color:rgba(9,11,12,0.6)">Metode</span>
                  <span class="text-sm">{{ paymentMethodLabel(selectedOrder.payment?.paymentMethod) }}</span>
                </div>

                <!-- Rekening tujuan (Transfer Bank Manual) -->
                <template v-if="selectedOrder.payment?.paymentMethod === 'FT' && paymentConfig?.bankAccounts?.length">
                  <div class="px-4 py-3" style="border-bottom:1px solid rgba(9,11,12,0.06)">
                    <p class="text-xs mb-3" style="color:rgba(9,11,12,0.5)">Transfer ke rekening berikut:</p>
                    <div class="space-y-2">
                      <div
                        v-for="acc in paymentConfig.bankAccounts"
                        :key="acc.accountNumber"
                        class="rounded-xl p-3"
                        style="background:rgba(9,11,12,0.03);border:1px solid rgba(9,11,12,0.06)"
                      >
                        <p class="text-xs font-normal uppercase tracking-wide mb-1" style="color:rgba(9,11,12,0.45)">{{ acc.bank }}</p>
                        <div class="flex items-center justify-between gap-2">
                          <div>
                            <p class="text-sm font-normal tabular-nums tracking-wider">{{ acc.accountNumber }}</p>
                            <p class="text-xs mt-0.5" style="color:rgba(9,11,12,0.5)">{{ acc.accountName }}</p>
                          </div>
                          <button
                            class="shrink-0 rounded-full px-3 py-1.5 text-xs font-normal transition-all"
                            style="background:#090b0c;color:white"
                            @click="copyToClipboard(acc.accountNumber)"
                          >Salin</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- VA Number (untuk VA/transfer online) -->
                <template v-if="selectedOrder.payment?.vaNumber">
                  <div class="px-4 py-3" style="border-bottom:1px solid rgba(9,11,12,0.06)">
                    <p class="text-xs mb-2" style="color:rgba(9,11,12,0.5)">Nomor Virtual Account</p>
                    <div class="flex items-center justify-between gap-2 rounded-xl px-4 py-3" style="background:rgba(9,11,12,0.04)">
                      <span class="text-base font-normal tabular-nums tracking-widest">{{ selectedOrder.payment.vaNumber }}</span>
                      <button
                        class="shrink-0 rounded-full px-3 py-1.5 text-xs font-normal transition-all"
                        :style="copiedVa ? 'background:rgba(34,197,94,0.12);color:rgb(22,163,74)' : 'background:#090b0c;color:white'"
                        @click="copyVa(selectedOrder.payment.vaNumber)"
                      >{{ copiedVa ? 'Tersalin!' : 'Salin' }}</button>
                    </div>
                  </div>
                </template>

                <!-- Payment URL jika masih pending -->
                <template v-if="selectedOrder.status === 'PENDING_PAYMENT' && selectedOrder.payment?.paymentUrl">
                  <div class="px-4 py-3" style="border-bottom:1px solid rgba(9,11,12,0.06)">
                    <a
                      :href="selectedOrder.payment.paymentUrl"
                      class="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-normal transition-opacity hover:opacity-85"
                      style="background:#090b0c;color:white"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                      Lanjutkan Pembayaran
                    </a>
                  </div>
                </template>

                <div class="flex justify-between px-4 py-3" style="border-bottom:1px solid rgba(9,11,12,0.06)" v-if="selectedOrder.payment?.expiredAt && selectedOrder.status === 'PENDING_PAYMENT'">
                  <span class="text-sm" style="color:rgba(9,11,12,0.6)">Batas bayar</span>
                  <span class="text-sm tabular-nums">{{ formatDate(selectedOrder.payment.expiredAt) }}</span>
                </div>
                <div class="flex justify-between px-4 py-3" v-if="selectedOrder.payment?.paidAt">
                  <span class="text-sm" style="color:rgba(9,11,12,0.6)">Dibayar</span>
                  <span class="text-sm tabular-nums">{{ formatDate(selectedOrder.payment.paidAt) }}</span>
                </div>
                <div class="flex justify-between px-4 py-3" v-if="!selectedOrder.payment">
                  <span class="text-sm" style="color:rgba(9,11,12,0.6)">Status</span>
                  <span class="text-sm" style="color:rgba(9,11,12,0.4)">Menunggu pembayaran dibuat</span>
                </div>
              </div>
            </section>

            <!-- Pengiriman -->
            <section class="mb-5">
              <p class="text-xs font-normal uppercase tracking-[0.12rem] mb-3" style="color:rgba(9,11,12,0.4)">Pengiriman</p>
              <div class="rounded-2xl overflow-hidden" style="border:1px solid rgba(9,11,12,0.06)">
                <div class="flex justify-between px-4 py-3" style="border-bottom:1px solid rgba(9,11,12,0.06)">
                  <span class="text-sm" style="color:rgba(9,11,12,0.6)">Tujuan</span>
                  <span class="text-sm text-right max-w-[60%]">{{ selectedOrder.cityName }}</span>
                </div>
                <div class="flex justify-between px-4 py-3" :style="selectedOrder.shipment ? 'border-bottom:1px solid rgba(9,11,12,0.06)' : ''">
                  <span class="text-sm" style="color:rgba(9,11,12,0.6)">Kurir</span>
                  <span class="text-sm uppercase">{{ selectedOrder.courierCode || '—' }} {{ selectedOrder.courierService ? `· ${selectedOrder.courierService}` : '' }}</span>
                </div>
                <template v-if="selectedOrder.shipment">
                  <div class="flex justify-between items-center px-4 py-3" style="border-bottom:1px solid rgba(9,11,12,0.06)">
                    <span class="text-sm" style="color:rgba(9,11,12,0.6)">No. Resi</span>
                    <div class="flex items-center gap-2">
                      <span class="text-sm tabular-nums">{{ selectedOrder.shipment.trackingNo }}</span>
                      <button
                        class="shrink-0 rounded-full px-3 py-1 text-xs font-normal transition-all"
                        :style="copiedResi ? 'background:rgba(34,197,94,0.12);color:rgb(22,163,74)' : 'background:rgba(9,11,12,0.06);color:#090b0c'"
                        @click="copyResi(selectedOrder.shipment.trackingNo)"
                      >{{ copiedResi ? 'Tersalin!' : 'Salin' }}</button>
                    </div>
                  </div>
                  <div class="px-4 py-3">
                    <NuxtLink
                      :to="`/track?no=${selectedOrder.shipment.trackingNo}&courier=${selectedOrder.shipment.courier}`"
                      class="flex items-center justify-center gap-2 w-full rounded-xl py-3 text-sm font-normal border transition-opacity hover:opacity-70"
                      style="border-color:rgba(9,11,12,0.15);color:#090b0c"
                    >
                      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 17H5a2 2 0 01-2-2V7a2 2 0 012-2h11l3 3v4M13 17h6m0 0l-3-3m3 3l-3 3"/></svg>
                      Lacak Paket
                    </NuxtLink>
                  </div>
                </template>
                <div v-else class="px-4 py-3">
                  <span class="text-sm" style="color:rgba(9,11,12,0.4)">Resi belum tersedia</span>
                </div>
              </div>
            </section>

            <!-- Tanggal -->
            <div class="flex justify-between px-1">
              <span class="text-xs" style="color:rgba(9,11,12,0.35)">Dipesan</span>
              <span class="text-xs tabular-nums" style="color:rgba(9,11,12,0.35)">{{ formatDate(selectedOrder.createdAt) }}</span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
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
const { data: paymentConfig } = useFetch<{ gatewayEnabled: boolean; bankAccounts: { bank: string; accountName: string; accountNumber: string }[] }>('/api/payment/settings')

watch(activeTab, () => refresh())

const selectedOrder = ref<any>(null)
const copiedVa = ref(false)
const copiedResi = ref(false)

function openDetail(order: any) {
  selectedOrder.value = order
  copiedVa.value = false
  copiedResi.value = false
}

async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text).catch(() => {})
}

async function copyVa(text: string) {
  await navigator.clipboard.writeText(text).catch(() => {})
  copiedVa.value = true
  setTimeout(() => { copiedVa.value = false }, 2000)
}

async function copyResi(text: string) {
  await navigator.clipboard.writeText(text).catch(() => {})
  copiedResi.value = true
  setTimeout(() => { copiedResi.value = false }, 2000)
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  VC: 'Virtual Account BCA',
  M2: 'Virtual Account Mandiri',
  BT: 'Virtual Account BRI',
  B1: 'Virtual Account BNI',
  OV: 'OVO',
  DA: 'DANA',
  SP: 'ShopeePay',
  I1: 'BCA KlikPay',
  FT: 'Transfer Bank Manual',
}

function paymentMethodLabel(code?: string | null) {
  if (!code) return '—'
  return PAYMENT_METHOD_LABELS[code] || code
}

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

function formatDate(d: string) {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(d))
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: translateY(100%);
}
@media (min-width: 768px) {
  .modal-enter-from > div:last-child,
  .modal-leave-to > div:last-child {
    transform: scale(0.96) translateY(8px);
  }
}
</style>
