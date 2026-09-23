<template>
  <div class="min-h-screen antialiased" style="background:#f5f5f2;color:#090b0c;font-family:'Inter Tight',system-ui,sans-serif">
    <header class="sticky top-0 z-40 px-5 py-4 md:px-12" style="background:rgba(245,245,242,0.88);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.06)">
      <div class="relative flex h-10 items-center max-w-4xl mx-auto">
        <NuxtLink :to="`/toko/dashboard?store=${storeId}`" class="flex items-center gap-2 text-sm transition-opacity hover:opacity-60" style="color:#090b0c">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Dashboard
        </NuxtLink>
        <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2 font-black text-xl tracking-tighter" style="color:#090b0c;letter-spacing:-0.04em">MINTS</NuxtLink>
      </div>
    </header>

    <div class="mx-auto max-w-4xl px-5 py-10 md:px-12">
      <h2 class="text-2xl font-normal tracking-tight mb-2">Langganan Toko</h2>
      <p v-if="store" class="text-sm mb-6" style="color:rgba(9,11,12,0.55)">
        Paket saat ini: <strong>{{ store.plan.name }}</strong> · {{ store.status }} · berakhir {{ formatDate(store.expiresAt) }}
      </p>

      <div v-if="errorMsg" class="rounded-2xl px-4 py-3 mb-5 text-sm" style="background:#fde8e8;color:#991b1b">{{ errorMsg }}</div>
      <div v-if="loading" class="py-10 text-center text-sm" style="color:rgba(9,11,12,0.5)">Memuat…</div>

      <div v-else class="grid gap-4 sm:grid-cols-2">
        <div v-for="p in plans" :key="p.id" class="rounded-3xl p-6" style="background:white" :style="p.tier === store?.plan.tier ? 'border:2px solid #090b0c' : ''">
          <p class="text-lg font-normal">{{ p.name }}</p>
          <p class="text-2xl font-normal mt-2">{{ p.priceMonthly > 0 ? `Rp ${p.priceMonthly.toLocaleString('id-ID')}` : 'Gratis' }}<span class="text-sm" style="color:rgba(9,11,12,0.5)"> / {{ p.durationDays }} hari</span></p>
          <ul class="text-xs mt-4 space-y-1" style="color:rgba(9,11,12,0.6)">
            <li>{{ p.maxProducts ?? 'Tanpa batas' }} produk</li>
            <li>{{ p.maxStorageMb ? `${p.maxStorageMb} MB` : 'Tanpa batas' }} penyimpanan</li>
            <li>Komisi {{ p.commissionPercent }}%</li>
          </ul>

          <button
            v-if="p.tier !== store?.plan.tier"
            class="w-full rounded-full px-5 py-2.5 text-sm font-normal mt-5 transition-opacity hover:opacity-80 disabled:opacity-50"
            style="background:#090b0c;color:white"
            :disabled="subscribing || p.priceMonthly <= 0"
            @click="subscribe(p.id)"
          >
            {{ subscribing === p.id ? 'Memproses…' : (p.priceMonthly > 0 ? 'Pilih Paket' : 'Hubungi admin') }}
          </button>
          <button
            v-else
            class="w-full rounded-full px-5 py-2.5 text-sm font-normal mt-5 transition-opacity hover:opacity-80 disabled:opacity-50"
            style="background:#f5f5f2;color:#090b0c"
            :disabled="subscribing || p.priceMonthly <= 0"
            @click="subscribe(p.id)"
          >
            {{ subscribing === p.id ? 'Memproses…' : (p.priceMonthly > 0 ? 'Perpanjang' : 'Paket aktif') }}
          </button>
        </div>
      </div>

      <h3 class="text-lg font-normal mt-10 mb-4">Riwayat Langganan</h3>
      <div v-if="!history.length" class="text-sm" style="color:rgba(9,11,12,0.5)">Belum ada riwayat.</div>
      <div v-else class="space-y-2">
        <div v-for="s in history" :key="s.id" class="rounded-2xl p-4 flex justify-between text-sm" style="background:white">
          <span>{{ s.plan.name }} — Rp {{ s.amount.toLocaleString('id-ID') }}</span>
          <span style="color:rgba(9,11,12,0.5)">{{ s.status }} · {{ formatDate(s.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'buyer' })
useSeoMeta({ title: 'Langganan Toko — MINTS' })

const route = useRoute()
const storeId = String(route.query.store || '')
if (!storeId) await navigateTo('/toko/dashboard')

const store = ref<any>(null)
const plans = ref<any[]>([])
const history = ref<any[]>([])
const loading = ref(true)
const errorMsg = ref('')
const subscribing = ref<string | null>(null)

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function load() {
  loading.value = true
  try {
    const [storeRes, plansRes] = await Promise.all([
      $fetch<any>(`/api/store/${storeId}`, { headers: useRequestHeaders(['cookie']) }),
      $fetch<any[]>('/api/plans')
    ])
    store.value = storeRes
    plans.value = plansRes
    history.value = storeRes.subscriptions || []
  } finally {
    loading.value = false
  }
}
await load()

async function subscribe(planId: string) {
  errorMsg.value = ''
  subscribing.value = planId
  try {
    const res: any = await $fetch(`/api/store/${storeId}/subscribe`, { method: 'POST', body: { planId } })
    if (res.paymentUrl) window.location.href = res.paymentUrl
  } catch (e: any) {
    errorMsg.value = e?.data?.statusMessage || 'Gagal membuat langganan'
  } finally {
    subscribing.value = null
  }
}
</script>
