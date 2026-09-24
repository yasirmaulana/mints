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
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-normal tracking-tight">Voucher Toko</h2>
        <button class="rounded-full px-5 py-2.5 text-sm font-normal" style="background:#090b0c;color:white" @click="openForm()">
          + Tambah Voucher
        </button>
      </div>

      <div v-if="errorMsg" class="rounded-2xl px-4 py-3 mb-5 text-sm" style="background:#fde8e8;color:#991b1b">{{ errorMsg }}</div>

      <div v-if="loading" class="py-10 text-center text-sm" style="color:rgba(9,11,12,0.5)">Memuat…</div>
      <div v-else-if="!vouchers.length" class="py-10 text-center text-sm" style="color:rgba(9,11,12,0.5)">Belum ada voucher.</div>
      <div v-else class="space-y-3">
        <div v-for="v in vouchers" :key="v.id" class="rounded-3xl p-5 flex items-center justify-between gap-4" style="background:white">
          <div>
            <div class="flex items-center gap-2">
              <p class="text-sm font-normal tracking-wide">{{ v.code }}</p>
              <span class="rounded-full px-2.5 py-0.5 text-xs" :style="v.isActive ? 'background:rgba(34,197,94,0.12);color:rgb(22,163,74)' : 'background:rgba(9,11,12,0.05);color:rgba(9,11,12,0.4)'">
                {{ v.isActive ? 'Aktif' : 'Nonaktif' }}
              </span>
            </div>
            <p class="text-sm mt-1" style="color:rgba(9,11,12,0.55)">Potongan Rp {{ Number(v.discountAmount).toLocaleString('id-ID') }}</p>
            <p class="text-xs mt-1" style="color:rgba(9,11,12,0.4)">
              Min. belanja Rp {{ Number(v.minPurchase).toLocaleString('id-ID') }}
              · Kuota {{ v.quota ?? 'tanpa batas' }} (terpakai {{ v.usedCount }})
              <template v-if="v.expiresAt"> · Exp {{ formatDate(v.expiresAt) }}</template>
            </p>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <button class="text-xs transition-opacity hover:opacity-60" style="color:#090b0c" @click="openForm(v)">Edit</button>
            <button class="text-xs transition-opacity hover:opacity-60" style="color:#991b1b" @click="remove(v.id)">Hapus</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Form Voucher -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 py-6 overflow-y-auto">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]" @click="showModal = false" />
      <div class="relative rounded-3xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" style="background:white">
        <h2 class="text-lg font-normal mb-4">{{ editingVoucher ? 'Edit Voucher' : 'Tambah Voucher' }}</h2>
        <form class="space-y-4" @submit.prevent="save">
          <div>
            <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Kode Voucher *</label>
            <input v-model="form.code" type="text" placeholder="DISKON50" :disabled="!!editingVoucher" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none uppercase disabled:opacity-50" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12)" required />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Potongan (Rp) *</label>
              <input v-model="form.discountAmount" type="number" placeholder="50000" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12)" required />
            </div>
            <div>
              <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Min. Pembelian (Rp)</label>
              <input v-model="form.minPurchase" type="number" placeholder="0" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12)" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Kuota <span class="text-xs" style="color:rgba(9,11,12,0.4)">kosongkan = tanpa batas</span></label>
              <input v-model="form.quota" type="number" placeholder="100" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12)" />
            </div>
            <div>
              <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Berlaku Sampai</label>
              <input v-model="form.expiresAt" type="date" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12)" />
            </div>
          </div>
          <label class="flex items-center gap-2 text-sm">
            <input v-model="form.isActive" type="checkbox" />
            Aktif
          </label>
          <div class="flex gap-3 pt-2">
            <button type="button" class="flex-1 rounded-full py-3 text-sm font-normal" style="background:#f5f5f2;color:#090b0c" @click="showModal = false">Batal</button>
            <button type="submit" :disabled="saving" class="flex-1 rounded-full py-3 text-sm font-normal transition-opacity hover:opacity-85 disabled:opacity-40" style="background:#090b0c;color:white">
              {{ saving ? 'Menyimpan…' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'buyer' })
useSeoMeta({ title: 'Kelola Voucher Toko — MINTS' })

const route = useRoute()
const storeId = String(route.query.store || '')
if (!storeId) await navigateTo('/toko/dashboard')

const vouchers = ref<any[]>([])
const loading = ref(true)
const errorMsg = ref('')

async function loadVouchers() {
  loading.value = true
  try {
    vouchers.value = await $fetch(`/api/store/${storeId}/vouchers`, { headers: useRequestHeaders(['cookie']) })
  } finally {
    loading.value = false
  }
}
await loadVouchers()

const showModal = ref(false)
const saving = ref(false)
const editingVoucher = ref<any>(null)
const form = reactive({
  code: '', discountAmount: '', minPurchase: '', quota: '', expiresAt: '', isActive: true
})

function openForm(voucher?: any) {
  errorMsg.value = ''
  editingVoucher.value = voucher || null
  form.code = voucher?.code || ''
  form.discountAmount = voucher?.discountAmount ? String(voucher.discountAmount) : ''
  form.minPurchase = voucher?.minPurchase ? String(voucher.minPurchase) : ''
  form.quota = voucher?.quota != null ? String(voucher.quota) : ''
  form.expiresAt = voucher?.expiresAt ? new Date(voucher.expiresAt).toISOString().slice(0, 10) : ''
  form.isActive = voucher?.isActive ?? true
  showModal.value = true
}

async function save() {
  errorMsg.value = ''
  saving.value = true
  try {
    const body = {
      code: form.code,
      discountAmount: Number(form.discountAmount),
      minPurchase: form.minPurchase ? Number(form.minPurchase) : 0,
      quota: form.quota ? Number(form.quota) : null,
      expiresAt: form.expiresAt || null,
      isActive: form.isActive
    }
    if (editingVoucher.value) {
      await $fetch(`/api/store/${storeId}/vouchers/${editingVoucher.value.id}`, { method: 'PATCH', body })
    } else {
      await $fetch(`/api/store/${storeId}/vouchers`, { method: 'POST', body })
    }
    showModal.value = false
    await loadVouchers()
  } catch (e: any) {
    errorMsg.value = e?.data?.statusMessage || 'Gagal menyimpan voucher'
  } finally {
    saving.value = false
  }
}

async function remove(id: string) {
  if (!confirm('Hapus voucher ini?')) return
  await $fetch(`/api/store/${storeId}/vouchers/${id}`, { method: 'DELETE' })
  await loadVouchers()
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
