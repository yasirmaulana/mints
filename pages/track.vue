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
          <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Pengiriman</span>
        </div>
        <h2 class="text-[2rem] font-normal leading-tight tracking-tight">Lacak Paket</h2>
      </div>

      <!-- Search form -->
      <div class="rounded-3xl p-5 space-y-4" style="background:white">
        <div class="flex flex-col sm:flex-row gap-3">
          <input
            v-model="trackingNo"
            type="text"
            placeholder="Nomor resi..."
            class="flex-1 rounded-2xl px-4 py-3 text-sm focus:outline-none"
            style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12);color:#090b0c"
            @keydown.enter="doTrack"
          />
          <select
            v-model="courier"
            class="rounded-2xl px-4 py-3 text-sm focus:outline-none"
            style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12);color:#090b0c"
          >
            <option value="jne">JNE</option>
            <option value="jnt">J&T</option>
            <option value="sicepat">SiCepat</option>
            <option value="pos">POS</option>
            <option value="tiki">TIKI</option>
          </select>
          <button
            class="rounded-full px-6 py-3 text-sm font-normal transition-opacity hover:opacity-85"
            :style="trackingNo.trim() ? 'background:#090b0c;color:white' : 'background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed'"
            :disabled="!trackingNo.trim() || loading"
            @click="doTrack"
          >{{ loading ? 'Mencari…' : 'Lacak' }}</button>
        </div>
      </div>

      <!-- Error -->
      <div v-if="error" class="mt-5 rounded-2xl p-4 text-sm" style="background:rgba(239,68,68,0.08);color:rgb(185,28,28)">{{ error }}</div>

      <!-- Result -->
      <template v-if="result">
        <!-- Summary -->
        <div class="mt-6 rounded-3xl p-5" style="background:white">
          <div class="flex items-start justify-between gap-3 mb-4">
            <div>
              <p class="text-lg font-normal tracking-tight">{{ result.waybill_number }}</p>
              <p class="text-sm mt-1" style="color:rgba(9,11,12,0.45)">{{ result.summary?.courier_name }} · {{ result.summary?.service_name }}</p>
            </div>
            <span class="text-xs px-3 py-1 rounded-full font-normal shrink-0" style="background:#fabc3f;color:#090b0c">{{ result.delivery_status?.status || 'N/A' }}</span>
          </div>
          <div class="grid grid-cols-2 gap-4 pt-4 text-sm" style="border-top:1px solid rgba(9,11,12,0.08)">
            <div>
              <p class="text-xs uppercase tracking-[0.1rem] mb-1" style="color:rgba(9,11,12,0.35)">Pengirim</p>
              <p class="font-normal">{{ result.shipper?.name || '-' }}</p>
              <p class="text-xs mt-0.5" style="color:rgba(9,11,12,0.4)">{{ result.origin?.city_name }}</p>
            </div>
            <div>
              <p class="text-xs uppercase tracking-[0.1rem] mb-1" style="color:rgba(9,11,12,0.35)">Penerima</p>
              <p class="font-normal">{{ result.receiver?.name || '-' }}</p>
              <p class="text-xs mt-0.5" style="color:rgba(9,11,12,0.4)">{{ result.destination?.city_name }}</p>
            </div>
          </div>
        </div>

        <!-- History -->
        <div v-if="result.manifest?.length" class="mt-6">
          <div class="flex items-center gap-3 mb-5">
            <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
            <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Riwayat Pengiriman</span>
          </div>
          <div class="relative space-y-6">
            <div class="absolute left-3 top-2 bottom-2 w-px" style="background:rgba(9,11,12,0.12)" />
            <div v-for="(event, i) in result.manifest" :key="i" class="flex gap-4 relative">
              <div
                class="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center z-10"
                :style="i === 0 ? 'background:#090b0c' : 'background:#f5f5f2;border:1px solid rgba(9,11,12,0.15)'"
              >
                <span class="w-2 h-2 rounded-full" :style="i === 0 ? 'background:white' : 'background:rgba(9,11,12,0.3)'" />
              </div>
              <div class="flex-1 pt-0.5">
                <p class="text-sm font-normal">{{ event.manifest_description }}</p>
                <p class="text-xs mt-1" style="color:rgba(9,11,12,0.4)">{{ event.manifest_city }} · {{ event.manifest_date }} {{ event.manifest_time }}</p>
              </div>
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
useSeoMeta({ title: 'Lacak Paket — MINTS' })

const route = useRoute()
const trackingNo = ref(String(route.query.no || ''))
const courier = ref(String(route.query.courier || 'jne'))
const loading = ref(false)
const result = ref<any>(null)
const error = ref('')

async function doTrack() {
  if (!trackingNo.value.trim()) return
  loading.value = true
  error.value = ''
  result.value = null
  try {
    result.value = await $fetch('/api/track', { query: { no: trackingNo.value.trim(), courier: courier.value } })
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Data pengiriman tidak ditemukan'
  } finally {
    loading.value = false
  }
}

if (trackingNo.value) doTrack()
</script>
