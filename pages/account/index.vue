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

      <div class="rounded-3xl p-6 md:p-8 space-y-6" style="background:white">
        <!-- Profile form -->
        <div class="grid gap-5 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Nama Lengkap</label>
            <input v-model="profile.name" type="text" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
          </div>
          <div>
            <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Email</label>
            <input v-model="profile.email" type="email" placeholder="Opsional" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
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

        <div class="border-t pt-6" style="border-color:rgba(9,11,12,0.08)">
          <p class="text-sm font-normal mb-4">Ubah Password</p>
          <div class="grid gap-4 sm:grid-cols-2">
            <input v-model="password.current" type="password" placeholder="Password lama" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
            <input v-model="password.new" type="password" placeholder="Password baru" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
          </div>
          <button
            class="w-full mt-4 rounded-full py-3.5 text-sm font-normal transition-opacity"
            :style="canChangePassword ? 'background:#090b0c;color:white' : 'background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed'"
            :disabled="!canChangePassword || savingPassword"
            @click="savePassword"
          >{{ savingPassword ? 'Menyimpan…' : 'Ubah Password' }}</button>
          <div v-if="passwordMessage" class="mt-4 rounded-2xl p-4 text-sm" :style="passwordMessage.type === 'success' ? 'background:rgba(34,197,94,0.1);color:rgb(22,163,74)' : 'background:rgba(239,68,68,0.08);color:rgb(185,28,28)'">{{ passwordMessage.text }}</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'buyer' })
useSeoMeta({ title: 'Akun Saya — MINTS' })

const { user, fetchMe, logout } = useAuth()

const profile = reactive({ name: '', email: '', phone: '', gender: '', birthDate: '' })
const originalProfile = reactive({ name: '', email: '', phone: '', gender: '', birthDate: '' })
const savingProfile = ref(false)
const profileMessage = ref<{ type: string; text: string } | null>(null)

const password = reactive({ current: '', new: '' })
const savingPassword = ref(false)
const passwordMessage = ref<{ type: string; text: string } | null>(null)

const profileChanged = computed(() => {
  return profile.name !== originalProfile.name ||
    profile.email !== originalProfile.email ||
    profile.phone !== originalProfile.phone ||
    profile.gender !== originalProfile.gender ||
    profile.birthDate !== originalProfile.birthDate
})
const canChangePassword = computed(() => password.current.length >= 6 && password.new.length >= 6)

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
        email: profile.email,
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

async function savePassword() {
  savingPassword.value = true
  passwordMessage.value = null
  try {
    await $fetch('/api/buyer/password', {
      method: 'PATCH',
      body: { currentPassword: password.current, newPassword: password.new }
    })
    password.current = ''
    password.new = ''
    passwordMessage.value = { type: 'success', text: 'Password berhasil diubah' }
  } catch (err: any) {
    passwordMessage.value = { type: 'error', text: err?.data?.statusMessage || 'Gagal mengubah password' }
  } finally {
    savingPassword.value = false
  }
}
</script>
