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
      <h2 class="text-2xl font-normal tracking-tight mb-6">Pesanan Toko</h2>

      <div v-if="errorMsg" class="rounded-2xl px-4 py-3 mb-5 text-sm" style="background:#fde8e8;color:#991b1b">{{ errorMsg }}</div>
      <div v-if="loading" class="py-10 text-center text-sm" style="color:rgba(9,11,12,0.5)">Memuat…</div>
      <div v-else-if="!orders.length" class="py-10 text-center text-sm" style="color:rgba(9,11,12,0.5)">Belum ada pesanan.</div>

      <div v-else class="space-y-4">
        <div v-for="o in orders" :key="o.id" class="rounded-3xl p-5 flex gap-4" style="background:white">
          <img :src="o.product.imageUrl" :alt="o.product.title" class="w-16 h-16 rounded-2xl object-cover shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-normal truncate">{{ o.product.title }} × {{ o.qty }}</p>
            <p class="text-xs mt-1" style="color:rgba(9,11,12,0.5)">{{ o.buyerName }} · {{ o.buyerPhone }}</p>
            <p class="text-xs mt-1" style="color:rgba(9,11,12,0.5)">Status: {{ o.status }}</p>
            <p v-if="o.shipment" class="text-xs mt-1" style="color:rgba(9,11,12,0.5)">Resi: {{ o.shipment.courier }} — {{ o.shipment.trackingNo }}</p>

            <div class="flex flex-wrap gap-2 mt-3">
              <select v-model="statusDraft[o.id]" class="rounded-full px-3 py-1.5 text-xs" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12)">
                <option v-for="s in SELLER_STATUSES" :key="s" :value="s">{{ s }}</option>
              </select>
              <button class="rounded-full px-3 py-1.5 text-xs font-normal" style="background:#090b0c;color:white" @click="updateStatus(o.id)">Update Status</button>
            </div>

            <div class="flex flex-wrap gap-2 mt-2">
              <input v-model="shipDraft[o.id].courier" placeholder="Kurir" class="rounded-full px-3 py-1.5 text-xs w-24" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12)" />
              <input v-model="shipDraft[o.id].trackingNo" placeholder="No. Resi" class="rounded-full px-3 py-1.5 text-xs w-32" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12)" />
              <button class="rounded-full px-3 py-1.5 text-xs font-normal" style="background:white;color:#090b0c;border:1px solid rgba(9,11,12,0.15)" @click="submitShipment(o.id)">Simpan Resi</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'buyer' })
useSeoMeta({ title: 'Pesanan Toko — MINTS' })

const SELLER_STATUSES = ['IN_PRODUCTION', 'READY_TO_SHIP', 'DELIVERED']

const route = useRoute()
const storeId = String(route.query.store || '')
if (!storeId) await navigateTo('/toko/dashboard')

const orders = ref<any[]>([])
const loading = ref(true)
const errorMsg = ref('')
const statusDraft = reactive<Record<string, string>>({})
const shipDraft = reactive<Record<string, { courier: string; trackingNo: string }>>({})

async function loadOrders() {
  loading.value = true
  try {
    orders.value = await $fetch(`/api/store/${storeId}/orders`, { headers: useRequestHeaders(['cookie']) })
    for (const o of orders.value) {
      statusDraft[o.id] = o.status
      shipDraft[o.id] = { courier: o.shipment?.courier || '', trackingNo: o.shipment?.trackingNo || '' }
    }
  } finally {
    loading.value = false
  }
}
await loadOrders()

async function updateStatus(orderId: string) {
  errorMsg.value = ''
  try {
    await $fetch(`/api/store/${storeId}/orders/${orderId}/status`, { method: 'PATCH', body: { status: statusDraft[orderId] } })
    await loadOrders()
  } catch (e: any) {
    errorMsg.value = e?.data?.statusMessage || 'Gagal memperbarui status'
  }
}

async function submitShipment(orderId: string) {
  errorMsg.value = ''
  const draft = shipDraft[orderId]
  if (!draft.courier || !draft.trackingNo) {
    errorMsg.value = 'Kurir dan nomor resi wajib diisi'
    return
  }
  try {
    await $fetch(`/api/store/${storeId}/orders/${orderId}/shipment`, { method: 'POST', body: draft })
    await loadOrders()
  } catch (e: any) {
    errorMsg.value = e?.data?.statusMessage || 'Gagal menyimpan resi'
  }
}
</script>
