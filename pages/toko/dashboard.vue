<template>
  <div class="min-h-screen antialiased" style="background:#f5f5f2;color:#090b0c;font-family:'Inter Tight',system-ui,sans-serif">
    <header class="sticky top-0 z-40 px-5 py-4 md:px-12" style="background:rgba(245,245,242,0.88);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.06)">
      <div class="relative flex h-10 items-center max-w-4xl mx-auto">
        <NuxtLink to="/account" class="flex items-center gap-2 text-sm transition-opacity hover:opacity-60" style="color:#090b0c">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Akun
        </NuxtLink>
        <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2 font-black text-xl tracking-tighter" style="color:#090b0c;letter-spacing:-0.04em">MINTS</NuxtLink>
      </div>
    </header>

    <div class="mx-auto max-w-4xl px-5 py-10 md:px-12">
      <div v-if="loading" class="py-20 text-center text-sm" style="color:rgba(9,11,12,0.5)">Memuat…</div>

      <template v-else-if="stores.length">
        <div class="flex items-center gap-2 mb-8 overflow-x-auto">
          <button v-for="s in stores" :key="s.id" @click="activeId = s.id"
            class="rounded-full px-4 py-2 text-sm font-normal whitespace-nowrap"
            :style="activeId === s.id ? 'background:#090b0c;color:white' : 'background:white;color:rgba(9,11,12,0.6)'"
          >{{ s.name }}</button>
          <NuxtLink v-if="canAddStore" to="/toko/aktivasi" class="rounded-full px-4 py-2 text-sm font-normal whitespace-nowrap" style="border:1px dashed rgba(9,11,12,0.25);color:rgba(9,11,12,0.5)">+ Toko baru</NuxtLink>
          <span v-else class="rounded-full px-4 py-2 text-sm font-normal whitespace-nowrap" style="border:1px dashed rgba(9,11,12,0.15);color:rgba(9,11,12,0.3)" title="Aktivasi toko baru saat ini hanya paket Free (maks. 1 toko). Upgrade untuk membuka lebih dari 1 toko.">+ Toko baru</span>
        </div>

        <!-- Profil toko: banner + deskripsi -->
        <div v-if="storeDetail" class="rounded-3xl overflow-hidden mb-8" style="background:white">
          <div class="relative aspect-[3/1] group" style="background:rgba(9,11,12,0.05)">
            <img v-if="storeDetail.bannerUrl" :src="storeDetail.bannerUrl" alt="Banner toko" class="w-full h-full object-cover" />
            <label class="absolute inset-0 flex items-center justify-center text-sm cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" style="background:rgba(9,11,12,0.45);color:white">
              {{ uploadingBanner ? 'Mengunggah…' : 'Ganti Banner' }}
              <input type="file" accept="image/*" class="hidden" :disabled="uploadingBanner" @change="uploadImage('banner', $event)" />
            </label>
          </div>
          <div class="p-6">
            <label class="block text-xs uppercase tracking-wide mb-2" style="color:rgba(9,11,12,0.45)">Deskripsi Toko</label>
            <textarea v-model="descriptionDraft" rows="3" maxlength="500" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12)" placeholder="Ceritakan tentang toko Anda…" />
            <div class="flex items-center justify-between mt-2">
              <span class="text-xs" style="color:rgba(9,11,12,0.4)">{{ descriptionDraft.length }}/500</span>
              <button
                class="rounded-full px-4 py-2 text-xs font-normal transition-opacity hover:opacity-85 disabled:opacity-40"
                style="background:#090b0c;color:white"
                :disabled="savingDescription || descriptionDraft === (storeDetail.description || '')"
                @click="saveDescription"
              >{{ savingDescription ? 'Menyimpan…' : 'Simpan Deskripsi' }}</button>
            </div>
            <p v-if="profileMsg" class="text-xs mt-2" :style="profileMsg.ok ? 'color:#16a34a' : 'color:#991b1b'">{{ profileMsg.text }}</p>
          </div>
        </div>

        <!-- Pengaturan Ongkir: kota asal untuk perhitungan ongkos kirim -->
        <div v-if="storeDetail" class="rounded-3xl p-6 mb-8" style="background:white">
          <label class="block text-xs uppercase tracking-wide mb-2" style="color:rgba(9,11,12,0.45)">Pengaturan Ongkir — Keluarhan/Kecamatan/Kota Asal</label>
          <div class="relative">
            <input
              v-model="citySearch"
              type="text"
              placeholder="Cari kota/kabupaten asal pengiriman..."
              class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none"
              style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12)"
              @input="searchCities"
              @focus="showCityDropdown = true"
            />
            <div v-if="showCityDropdown && cityResults.length" class="absolute z-10 w-full mt-2 shadow-lg max-h-56 overflow-y-auto rounded-2xl" style="background:white;border:1px solid rgba(9,11,12,0.1)">
              <button
                v-for="city in cityResults"
                :key="city.city_id"
                type="button"
                class="w-full text-left px-4 py-2.5 text-sm transition-colors"
                style="color:#090b0c"
                @mouseover="($event.currentTarget as HTMLElement).style.background='rgba(9,11,12,0.04)'"
                @mouseleave="($event.currentTarget as HTMLElement).style.background='transparent'"
                @click="selectCity(city)"
              >{{ city.label || `${city.type} ${city.city_name}, ${city.province}` }}</button>
            </div>
          </div>
          <p class="text-xs mt-2" style="color:rgba(9,11,12,0.5)">Kota asal saat ini: {{ storeDetail.cityName || '— belum diatur —' }}</p>
          <p v-if="shippingMsg" class="text-xs mt-2" :style="shippingMsg.ok ? 'color:#16a34a' : 'color:#991b1b'">{{ shippingMsg.text }}</p>
        </div>

        <div v-if="active" class="grid gap-4 md:grid-cols-3 mb-8">
          <NuxtLink :to="`/toko/langganan?store=${activeId}`" class="rounded-3xl p-6 block transition-opacity hover:opacity-80" style="background:white">
            <p class="text-xs uppercase tracking-wide mb-1" style="color:rgba(9,11,12,0.45)">Paket</p>
            <p class="text-lg font-normal">{{ active.plan.name }}</p>
            <p class="text-xs mt-1" style="color:rgba(9,11,12,0.45)">{{ active.status }} · {{ active.daysLeft }} hari lagi</p>
          </NuxtLink>
          <div class="rounded-3xl p-6" style="background:white">
            <p class="text-xs uppercase tracking-wide mb-1" style="color:rgba(9,11,12,0.45)">Produk</p>
            <p class="text-lg font-normal mb-2">{{ active.products.used }} / {{ active.products.max ?? '∞' }}</p>
            <div v-if="active.products.max" class="h-1.5 rounded-full overflow-hidden" style="background:rgba(9,11,12,0.08)">
              <div class="h-full rounded-full" :style="quotaBarStyle(active.products.used, active.products.max)" />
            </div>
          </div>
          <div class="rounded-3xl p-6" style="background:white">
            <p class="text-xs uppercase tracking-wide mb-1" style="color:rgba(9,11,12,0.45)">Storage</p>
            <p class="text-lg font-normal mb-2">{{ active.storageMb.used }} / {{ active.storageMb.max ?? '∞' }} MB</p>
            <div v-if="active.storageMb.max" class="h-1.5 rounded-full overflow-hidden" style="background:rgba(9,11,12,0.08)">
              <div class="h-full rounded-full" :style="quotaBarStyle(active.storageMb.used, active.storageMb.max)" />
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-normal">Produk Toko</h2>
          <div class="flex gap-2">
            <NuxtLink :to="`/toko/pesanan?store=${activeId}`" class="rounded-full px-5 py-2.5 text-sm font-normal" style="background:white;color:#090b0c">Pesanan</NuxtLink>
            <NuxtLink :to="`/toko/produk?store=${activeId}`" class="rounded-full px-5 py-2.5 text-sm font-normal" style="background:#090b0c;color:white">Kelola Produk</NuxtLink>
          </div>
        </div>
        <NuxtLink :to="`/toko/${active?.slug}`" target="_blank" class="text-sm transition-opacity hover:opacity-60" style="color:rgba(9,11,12,0.6)">Lihat halaman toko publik →</NuxtLink>
      </template>

      <div v-else class="py-20 text-center">
        <p class="text-sm mb-4" style="color:rgba(9,11,12,0.5)">Anda belum punya toko.</p>
        <NuxtLink to="/toko/aktivasi" class="rounded-full px-6 py-3 text-sm font-normal" style="background:#090b0c;color:white">Buka Toko</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'buyer' })
useSeoMeta({ title: 'Dashboard Toko — MINTS' })

const route = useRoute()
const stores = ref<any[]>([])
const activeId = ref<string>(String(route.query.store || ''))
const loading = ref(true)

const active = computed(() => stores.value.find(s => s.id === activeId.value) || stores.value[0])
const canAddStore = computed(() => {
  const max = active.value?.plan?.maxStores
  return max === null || max === undefined || stores.value.length < max
})

function quotaBarStyle(used: number, max: number) {
  const pct = Math.min(100, Math.round((used / max) * 100))
  const color = pct >= 90 ? '#dc2626' : pct >= 70 ? '#f59e0b' : '#090b0c'
  return `width:${pct}%;background:${color}`
}

try {
  stores.value = await $fetch('/api/store/mine', { headers: useRequestHeaders(['cookie']) })
  if (!activeId.value && stores.value.length) activeId.value = stores.value[0].id
} finally {
  loading.value = false
}

// `stores` (dari /api/store/mine) cuma ringkasan kuota, tanpa description/bannerUrl/logoUrl —
// ambil detail penuh toko aktif secara terpisah untuk form profil toko.
const storeDetail = ref<any>(null)
const descriptionDraft = ref('')
const savingDescription = ref(false)
const uploadingBanner = ref(false)
const profileMsg = ref<{ ok: boolean; text: string } | null>(null)

async function loadStoreDetail() {
  if (!activeId.value) return
  storeDetail.value = await $fetch(`/api/store/${activeId.value}`, { headers: useRequestHeaders(['cookie']) })
  descriptionDraft.value = storeDetail.value?.description || ''
}
await loadStoreDetail()
watch(activeId, loadStoreDetail)

async function saveDescription() {
  savingDescription.value = true
  profileMsg.value = null
  try {
    await $fetch(`/api/store/${activeId.value}`, { method: 'PATCH', body: { description: descriptionDraft.value } })
    await loadStoreDetail()
    profileMsg.value = { ok: true, text: 'Deskripsi tersimpan' }
  } catch (e: any) {
    profileMsg.value = { ok: false, text: e?.data?.statusMessage || 'Gagal menyimpan deskripsi' }
  } finally {
    savingDescription.value = false
  }
}

// ── Pengaturan Ongkir: kota asal ──
const citySearch = ref('')
const cityResults = ref<any[]>([])
const showCityDropdown = ref(false)
const shippingMsg = ref<{ ok: boolean; text: string } | null>(null)
let citySearchTimer: ReturnType<typeof setTimeout> | null = null

function searchCities() {
  if (citySearchTimer) clearTimeout(citySearchTimer)
  citySearchTimer = setTimeout(async () => {
    if (!citySearch.value.trim()) { cityResults.value = []; return }
    cityResults.value = await $fetch('/api/shipping/cities', { query: { search: citySearch.value } })
  }, 300)
}

async function selectCity(city: any) {
  showCityDropdown.value = false
  citySearch.value = ''
  cityResults.value = []
  shippingMsg.value = null
  const cityName = city.label || `${city.type} ${city.city_name}`
  try {
    await $fetch(`/api/store/${activeId.value}`, { method: 'PATCH', body: { cityId: city.city_id, cityName } })
    await loadStoreDetail()
    shippingMsg.value = { ok: true, text: 'Kota asal tersimpan' }
  } catch (e: any) {
    shippingMsg.value = { ok: false, text: e?.data?.statusMessage || 'Gagal menyimpan kota asal' }
  }
}

async function uploadImage(kind: 'logo' | 'banner', e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploadingBanner.value = true
  profileMsg.value = null
  try {
    const fd = new FormData()
    fd.append('kind', kind)
    fd.append('image', file)
    await $fetch(`/api/store/${activeId.value}/image`, { method: 'POST', body: fd })
    await loadStoreDetail()
  } catch (err: any) {
    profileMsg.value = { ok: false, text: err?.data?.statusMessage || 'Gagal mengunggah gambar' }
  } finally {
    uploadingBanner.value = false
    ;(e.target as HTMLInputElement).value = ''
  }
}
</script>
