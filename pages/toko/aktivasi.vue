<template>
  <div class="min-h-screen antialiased" style="background:#f5f5f2;color:#090b0c;font-family:'Inter Tight',system-ui,sans-serif">
    <header class="sticky top-0 z-40 px-5 py-4 md:px-12" style="background:rgba(245,245,242,0.88);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.06)">
      <div class="relative flex h-10 items-center max-w-2xl mx-auto">
        <NuxtLink to="/account" class="flex items-center gap-2 text-sm transition-opacity hover:opacity-60" style="color:#090b0c">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Akun
        </NuxtLink>
        <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2 font-black text-xl tracking-tighter" style="color:#090b0c;letter-spacing:-0.04em">MINTS</NuxtLink>
      </div>
    </header>

    <div class="mx-auto max-w-2xl px-5 py-10 md:px-12">
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-3">
          <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
          <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Aktivasi Toko</span>
        </div>
        <h2 class="text-2xl font-normal tracking-tight">Buka toko gratis</h2>
        <p class="text-sm mt-2" style="color:rgba(9,11,12,0.55)">Paket Free: 1 toko, 3 produk, 3 foto/produk. Upgrade tersedia setelahnya.</p>
      </div>

      <div v-if="errorMsg" class="rounded-2xl px-4 py-3 mb-5 text-sm" style="background:#fde8e8;color:#991b1b">{{ errorMsg }}</div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Nama Toko</label>
          <input v-model="form.name" type="text" placeholder="Contoh: Toko Bunga Aisyah" maxlength="80"
            class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:white;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
        </div>
        <div>
          <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Alamat Toko (mints.id/toko/…)</label>
          <input v-model="form.slug" type="text" placeholder="dibuat otomatis dari nama jika kosong"
            class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:white;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
        </div>
        <div>
          <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Nomor WhatsApp Toko</label>
          <input v-model="form.phone" type="text" placeholder="08xxxxxxxxxx"
            class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:white;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
        </div>
        <div>
          <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Deskripsi Toko</label>
          <textarea v-model="form.description" rows="3" maxlength="500" placeholder="Ceritakan tentang toko Anda"
            class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none" style="background:white;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
        </div>
      </div>

      <button
        :disabled="submitting || !form.name || !form.phone"
        class="w-full rounded-full py-3.5 text-sm font-normal mt-8 transition-opacity hover:opacity-85 disabled:opacity-40"
        style="background:#090b0c;color:white"
        @click="submit"
      >{{ submitting ? 'Memproses…' : 'Aktifkan Toko' }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'buyer' })
useSeoMeta({ title: 'Aktivasi Toko — MINTS' })

const router = useRouter()
const form = reactive({ name: '', slug: '', phone: '', description: '' })
const submitting = ref(false)
const errorMsg = ref('')

async function submit() {
  submitting.value = true
  errorMsg.value = ''
  try {
    await $fetch('/api/store', { method: 'POST', body: form })
    router.push('/toko/dashboard')
  } catch (e: any) {
    errorMsg.value = e?.data?.statusMessage || 'Gagal mengaktifkan toko'
  } finally {
    submitting.value = false
  }
}
</script>
