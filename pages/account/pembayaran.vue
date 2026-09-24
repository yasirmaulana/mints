<template>
  <div class="min-h-screen antialiased" style="background:#f5f5f2;color:#090b0c;font-family:'Inter Tight',system-ui,sans-serif">
    <header class="sticky top-0 z-40 px-5 py-4 md:px-12" style="background:rgba(245,245,242,0.88);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.06)">
      <div class="relative flex h-10 items-center max-w-md mx-auto">
        <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2 font-black text-xl tracking-tighter" style="color:#090b0c;letter-spacing:-0.04em">MINTS</NuxtLink>
      </div>
    </header>

    <div class="mx-auto max-w-md px-5 py-10">
      <div v-if="status === 'paid'" class="rounded-3xl p-8 text-center space-y-3" style="background:white">
        <p class="text-3xl">✓</p>
        <p class="text-lg font-normal">Pembayaran Berhasil</p>
        <p class="text-sm" style="color:rgba(9,11,12,0.5)">Mengalihkan ke daftar pesanan…</p>
      </div>

      <div v-else class="rounded-3xl p-6 space-y-5" style="background:white">
        <div class="text-center">
          <p class="text-sm" style="color:rgba(9,11,12,0.5)">Total Pembayaran</p>
          <p class="text-2xl font-normal tracking-tight mt-1">Rp&nbsp;{{ formatPrice(amount) }}</p>
        </div>

        <!-- Virtual Account -->
        <div v-if="va" class="rounded-2xl p-5 space-y-3" style="background:#f5f5f2">
          <p class="text-xs" style="color:rgba(9,11,12,0.5)">{{ bankLabel }}</p>
          <div class="flex items-center justify-between gap-3">
            <p class="text-xl font-normal tracking-wide tabular-nums">{{ va }}</p>
            <button class="shrink-0 rounded-full px-4 py-2 text-xs font-normal" style="background:#090b0c;color:white" @click="copyVa">
              {{ copied ? 'Tersalin' : 'Salin' }}
            </button>
          </div>
        </div>

        <!-- QRIS -->
        <div v-if="qr" class="flex flex-col items-center gap-3">
          <canvas ref="qrCanvas" class="rounded-2xl" style="background:white;border:1px solid rgba(9,11,12,0.1)" />
          <p class="text-xs text-center" style="color:rgba(9,11,12,0.5)">Scan kode QR ini dengan aplikasi ShopeePay</p>
        </div>

        <p v-if="expiresLabel" class="text-xs text-center" style="color:rgba(9,11,12,0.4)">Bayar sebelum {{ expiresLabel }}</p>

        <button class="w-full rounded-full py-3 text-sm font-normal transition-opacity hover:opacity-85 disabled:opacity-50" style="background:#090b0c;color:white" :disabled="checking" @click="checkStatus">
          {{ checking ? 'Memeriksa…' : 'Cek Status Pembayaran' }}
        </button>
        <p v-if="checkMsg" class="text-xs text-center" style="color:rgba(9,11,12,0.5)">{{ checkMsg }}</p>

        <NuxtLink to="/account/orders" class="block text-center text-xs transition-opacity hover:opacity-60" style="color:rgba(9,11,12,0.5)">Lihat Pesanan Saya</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import QRCode from 'qrcode'

definePageMeta({ middleware: 'buyer' })
useSeoMeta({ title: 'Pembayaran — MINTS' })

const route = useRoute()
const router = useRouter()
const ref_ = String(route.query.ref || '')
if (!ref_) await navigateTo('/account/orders')

const method = String(route.query.method || '')
const va = String(route.query.va || '')
const qr = String(route.query.qr || '')
const amount = Number(route.query.amount || 0)
const expiredAt = String(route.query.expiredAt || '')

const BANK_LABELS: Record<string, string> = {
  VC: 'Virtual Account BCA', M2: 'Virtual Account Mandiri', BT: 'Virtual Account BRI',
  B1: 'Virtual Account BNI', I1: 'BCA KlikPay', SP: 'ShopeePay QRIS'
}
const bankLabel = BANK_LABELS[method] || 'Virtual Account'
const expiresLabel = expiredAt ? new Date(expiredAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : ''

const qrCanvas = ref<HTMLCanvasElement | null>(null)
onMounted(() => {
  if (qr && qrCanvas.value) QRCode.toCanvas(qrCanvas.value, qr, { width: 220 })
})

const copied = ref(false)
function copyVa() {
  navigator.clipboard.writeText(va)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function formatPrice(v: number) { return v.toLocaleString('id-ID') }

const status = ref('pending')
const checking = ref(false)
const checkMsg = ref('')

async function checkStatus() {
  checking.value = true
  checkMsg.value = ''
  try {
    const res = await $fetch<{ status: string }>('/api/payment/status', { query: { merchantOrderId: ref_ } })
    status.value = res.status
    if (res.status === 'paid') {
      setTimeout(() => router.push('/account/orders'), 2000)
    } else {
      checkMsg.value = 'Pembayaran belum diterima. Coba lagi setelah transfer.'
    }
  } catch {
    checkMsg.value = 'Gagal memeriksa status.'
  } finally {
    checking.value = false
  }
}

let poll: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  poll = setInterval(async () => {
    if (status.value === 'paid') return
    try {
      const res = await $fetch<{ status: string }>('/api/payment/status', { query: { merchantOrderId: ref_ } })
      if (res.status === 'paid') {
        status.value = 'paid'
        setTimeout(() => router.push('/account/orders'), 2000)
      }
    } catch {}
  }, 5000)
})
onUnmounted(() => { if (poll) clearInterval(poll) })
</script>
