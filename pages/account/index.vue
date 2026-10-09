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

    <main class="mx-auto max-w-2xl px-5 py-10 md:px-12">
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-3">
          <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
          <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Akun Saya</span>
        </div>
        <h2 class="text-[2rem] font-normal leading-tight tracking-tight">Profil</h2>
      </div>

      <!-- Nav pills -->
      <div class="flex rounded-full p-1 mb-8" style="background:rgba(9,11,12,0.08)">
        <NuxtLink to="/account" class="flex-1 text-center rounded-full py-2 text-sm font-normal" style="background:#090b0c;color:white">Profil</NuxtLink>
        <NuxtLink to="/account/orders" class="flex-1 text-center rounded-full py-2 text-sm font-normal" style="color:rgba(9,11,12,0.6)">Pesanan</NuxtLink>
      </div>

      <!-- Toko Saya -->
      <div class="rounded-3xl p-6 md:p-8 mb-6" style="background:white">
        <div class="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p class="text-sm font-normal mb-1">Toko Saya</p>
            <p class="text-sm" style="color:rgba(9,11,12,0.55)">
              <span v-if="loadingStores">Memuat…</span>
              <span v-else-if="!myStores.length">Anda belum punya toko. Aktifkan sekarang, gratis.</span>
              <span v-else>{{ myStores.length }} toko aktif</span>
            </p>
          </div>
          <NuxtLink
            :to="myStores.length ? '/toko/dashboard' : '/toko/aktivasi'"
            class="rounded-full px-5 py-2.5 text-sm font-normal"
            style="background:#090b0c;color:white"
          >{{ myStores.length ? 'Kelola Toko' : 'Buka Toko' }}</NuxtLink>
        </div>
        <div v-if="myStores.length" class="mt-4 flex flex-wrap gap-2">
          <NuxtLink
            v-for="s in myStores"
            :key="s.id"
            :to="`/toko/dashboard?store=${s.id}`"
            class="rounded-full px-4 py-2 text-xs font-normal"
            style="background:#f5f5f2;color:#090b0c"
          >{{ s.name }} — {{ s.plan.name }}</NuxtLink>
        </div>
      </div>

      <div class="rounded-3xl p-6 md:p-8 space-y-6" style="background:white">
        <!-- Profile form -->
        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Nama Lengkap</label>
            <input v-model="profile.name" type="text" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
          </div>
          <div>
            <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Email</label>
            <input :value="profile.email" type="email" readonly placeholder="Belum ada email" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12);color:rgba(9,11,12,0.6)" />
            <button type="button" class="text-xs mt-2 underline underline-offset-4" style="color:rgba(9,11,12,0.55)" @click="emailPanel = !emailPanel">{{ profile.email ? 'Ubah email' : 'Tambah email' }}</button>
            <div v-if="emailPanel" class="mt-3 space-y-2">
              <input v-model="emailForm.email" type="email" placeholder="Email baru" :disabled="emailForm.sent" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none disabled:opacity-60" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
              <div v-if="emailForm.sent" class="flex gap-2">
                <input v-model="emailForm.code" type="text" inputmode="numeric" maxlength="6" placeholder="Kode 6 digit" class="flex-1 min-w-0 rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12);color:#090b0c" @keydown.enter.prevent="verifyEmailChange" />
                <button type="button" class="rounded-full px-5 py-2.5 text-sm font-normal disabled:opacity-40" style="background:#090b0c;color:white" :disabled="emailForm.loading || emailForm.code.length < 6" @click="verifyEmailChange">{{ emailForm.loading ? 'Memeriksa…' : 'Verifikasi' }}</button>
              </div>
              <button v-else type="button" class="rounded-full px-5 py-2.5 text-sm font-normal disabled:opacity-40" style="background:#090b0c;color:white" :disabled="emailForm.loading || !emailForm.email.trim()" @click="requestEmailChange">{{ emailForm.loading ? 'Mengirim…' : 'Kirim kode' }}</button>
              <p v-if="emailMessage" class="text-xs" :style="emailMessage.type === 'success' ? 'color:rgb(22,163,74)' : 'color:#991b1b'">{{ emailMessage.text }}</p>
            </div>
          </div>
          <div>
            <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Nomor HP</label>
            <input v-model="profile.phone" type="tel" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
          </div>
          <div>
            <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Tanggal Lahir</label>
            <input v-model="profile.birthDate" type="date" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
          </div>
          <div class="sm:col-span-2">
            <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Jenis Kelamin</label>
            <div class="flex gap-3">
              <button
                type="button"
                class="px-5 py-2.5 rounded-full text-sm font-normal transition-all"
                :style="profile.gender === 'M' ? 'background:#090b0c;color:white' : 'background:#f5f5f2;color:#090b0c'"
                @click="profile.gender = 'M'"
              >Laki-laki</button>
              <button
                type="button"
                class="px-5 py-2.5 rounded-full text-sm font-normal transition-all"
                :style="profile.gender === 'F' ? 'background:#090b0c;color:white' : 'background:#f5f5f2;color:#090b0c'"
                @click="profile.gender = 'F'"
              >Perempuan</button>
            </div>
          </div>
        </div>

        <button
          class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity"
          :style="profileChanged ? 'background:#090b0c;color:white' : 'background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed'"
          :disabled="!profileChanged || savingProfile"
          @click="saveProfile"
        >{{ savingProfile ? 'Menyimpan…' : 'Simpan Profil' }}</button>

        <div v-if="profileMessage" class="rounded-2xl p-4 text-sm" :style="profileMessage.type === 'success' ? 'background:rgba(34,197,94,0.1);color:rgb(22,163,74)' : 'background:rgba(239,68,68,0.08);color:rgb(185,28,28)'">{{ profileMessage.text }}</div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'buyer' })
useSeoMeta({ title: 'Akun Saya — MINTS' })

const { user, fetchMe, logout } = useAuth()

const myStores = ref<any[]>([])
const loadingStores = ref(true)
try {
  myStores.value = await $fetch('/api/store/mine', { headers: useRequestHeaders(['cookie']) })
} catch {
  // gagal memuat toko tidak boleh menghalangi halaman akun tetap terbuka
} finally {
  loadingStores.value = false
}

const profile = reactive({ name: '', email: '', phone: '', gender: '', birthDate: '' })
const originalProfile = reactive({ name: '', email: '', phone: '', gender: '', birthDate: '' })
const savingProfile = ref(false)
const profileMessage = ref<{ type: string; text: string } | null>(null)

const profileChanged = computed(() => {
  return profile.name !== originalProfile.name ||
    profile.phone !== originalProfile.phone ||
    profile.gender !== originalProfile.gender ||
    profile.birthDate !== originalProfile.birthDate
})

onMounted(async () => {
  await fetchMe()
  if (user.value) {
    Object.assign(profile, user.value)
    Object.assign(originalProfile, user.value)
  }
})

async function saveProfile() {
  savingProfile.value = true
  profileMessage.value = null
  try {
    await $fetch('/api/buyer/profile', {
      method: 'PATCH',
      body: {
        name: profile.name,
        phone: profile.phone,
        gender: profile.gender,
        birthDate: profile.birthDate
      }
    })
    await fetchMe()
    Object.assign(originalProfile, profile)
    profileMessage.value = { type: 'success', text: 'Profil berhasil diperbarui' }
  } catch (err: any) {
    profileMessage.value = { type: 'error', text: err?.data?.statusMessage || 'Gagal menyimpan profil' }
  } finally {
    savingProfile.value = false
  }
}

// ── Ganti/tambah email: kode dikirim ke email baru, email berubah hanya setelah diverifikasi ──
const emailPanel = ref(false)
const emailForm = reactive({ email: '', code: '', sent: false, loading: false })
const emailMessage = ref<{ type: string; text: string } | null>(null)

async function requestEmailChange() {
  emailForm.loading = true
  emailMessage.value = null
  try {
    await $fetch('/api/buyer/email/request', { method: 'POST', body: { email: emailForm.email } })
    emailForm.sent = true
    emailMessage.value = { type: 'success', text: `Kode dikirim ke ${emailForm.email.trim()}. Berlaku 10 menit.` }
  } catch (err: any) {
    emailMessage.value = { type: 'error', text: err?.data?.statusMessage || 'Gagal mengirim kode' }
  } finally {
    emailForm.loading = false
  }
}

async function verifyEmailChange() {
  if (emailForm.code.length < 6) return
  emailForm.loading = true
  emailMessage.value = null
  try {
    const res: any = await $fetch('/api/buyer/email/verify', { method: 'POST', body: { email: emailForm.email, code: emailForm.code } })
    profile.email = res.email
    originalProfile.email = res.email
    await fetchMe()
    Object.assign(emailForm, { email: '', code: '', sent: false })
    emailPanel.value = false
    profileMessage.value = { type: 'success', text: 'Email berhasil diperbarui' }
  } catch (err: any) {
    emailMessage.value = { type: 'error', text: err?.data?.statusMessage || 'Gagal memverifikasi kode' }
  } finally {
    emailForm.loading = false
  }
}
</script>
