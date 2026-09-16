<template>
  <div class="min-h-screen antialiased" style="background:#f5f5f2;color:#090b0c;font-family:'Inter Tight',system-ui,sans-serif">

    <!-- Navbar -->
    <header class="sticky top-0 z-40 px-5 py-4 md:px-12" style="background:rgba(245,245,242,0.88);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.06)">
      <div class="relative flex h-10 items-center justify-center max-w-5xl mx-auto">
        <NuxtLink to="/" class="font-black text-xl tracking-tighter" style="font-family:'Inter Tight',sans-serif;color:#090b0c;letter-spacing:-0.04em">MINTS</NuxtLink>
      </div>
    </header>

    <main class="mx-auto max-w-md px-5 py-14 md:px-12">
      <div class="text-center mb-10">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
          <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Akun</span>
          <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
        </div>
        <h2 class="text-[2rem] font-normal leading-tight tracking-tight">{{ isLogin ? 'Masuk' : 'Daftar' }}</h2>
      </div>

      <!-- Tabs -->
      <div class="flex rounded-full p-1 mb-8" style="background:rgba(9,11,12,0.08)">
        <button
          class="flex-1 rounded-full py-2 text-sm font-normal transition-all"
          :style="isLogin ? 'background:#090b0c;color:white' : 'color:rgba(9,11,12,0.6)'"
          @click="isLogin = true; error = ''"
        >Masuk</button>
        <button
          class="flex-1 rounded-full py-2 text-sm font-normal transition-all"
          :style="!isLogin ? 'background:#090b0c;color:white' : 'color:rgba(9,11,12,0.6)'"
          @click="isLogin = false; error = ''"
        >Daftar</button>
      </div>

      <!-- Login form -->
      <form v-if="isLogin" class="space-y-4" @submit.prevent="doLogin">
        <div>
          <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Nomor HP</label>
          <input v-model="form.phone" type="tel" placeholder="08xxxxxxxxxx" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:white;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
        </div>
        <div>
          <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Password</label>
          <input v-model="form.password" type="password" placeholder="Password" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:white;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
        </div>
        <button
          type="submit"
          class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity"
          :style="canLogin ? 'background:#090b0c;color:white' : 'background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed'"
          :disabled="!canLogin || loading"
        >{{ loading ? 'Memproses…' : 'Masuk' }}</button>
      </form>

      <!-- Register form -->
      <form v-else class="space-y-4" @submit.prevent="doRegister">
        <div>
          <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Nama Lengkap</label>
          <input v-model="form.name" type="text" placeholder="Nama kamu" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:white;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
        </div>
        <div>
          <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Email</label>
          <input v-model="form.email" type="email" placeholder="email@contoh.com" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:white;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
        </div>
        <div>
          <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Nomor HP</label>
          <input v-model="form.phone" type="tel" placeholder="08xxxxxxxxxx" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:white;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
        </div>
        <div>
          <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Password</label>
          <input v-model="form.password" type="password" placeholder="Min. 6 karakter" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:white;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
        </div>
        <button
          type="submit"
          class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity"
          :style="canRegister ? 'background:#090b0c;color:white' : 'background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed'"
          :disabled="!canRegister || loading"
        >{{ loading ? 'Memproses…' : 'Daftar' }}</button>
      </form>

      <div v-if="error" class="mt-4 rounded-2xl p-4 text-sm" style="background:rgba(239,68,68,0.08);color:rgb(185,28,28)">{{ error }}</div>
      <div v-if="success" class="mt-4 rounded-2xl p-4 text-sm" style="background:rgba(34,197,94,0.1);color:rgb(22,163,74)">{{ success }}</div>
    </main>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Akun — MINTS' })

const route = useRoute()
const redirect = computed(() => String(route.query.redirect || '/account'))
const isLogin = ref(true)
const loading = ref(false)
const error = ref('')
const success = ref('')

const form = reactive({ name: '', email: '', phone: '', password: '' })

const canLogin = computed(() => form.phone.trim() && form.password.trim().length >= 6)
const canRegister = computed(() => form.name.trim().length >= 2 && form.phone.trim() && form.password.trim().length >= 6)

async function doLogin() {
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: { phone: form.phone, password: form.password } })
    window.location.href = redirect.value
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Gagal masuk'
  } finally {
    loading.value = false
  }
}

async function doRegister() {
  loading.value = true
  error.value = ''
  success.value = ''
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { name: form.name, email: form.email, phone: form.phone, password: form.password }
    })
    success.value = 'Akun berhasil dibuat, mengalihkan…'
    window.location.href = redirect.value
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Gagal mendaftar'
  } finally {
    loading.value = false
  }
}
</script>
