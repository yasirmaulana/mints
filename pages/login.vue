<template>
  <div class="min-h-screen antialiased" style="background:#f5f5f2;color:#090b0c;font-family:'Inter Tight',system-ui,sans-serif">

    <!-- Navbar -->
    <header class="sticky top-0 z-40 px-5 py-4 md:px-12" style="background:rgba(245,245,242,0.88);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.06)">
      <div class="relative flex h-10 items-center justify-center max-w-5xl mx-auto">
        <NuxtLink to="/" class="absolute left-0 flex items-center gap-1.5 text-sm" style="color:rgba(9,11,12,0.5)" aria-label="Kembali ke beranda">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Beranda
        </NuxtLink>
        <NuxtLink to="/" class="font-black text-xl tracking-tighter" style="font-family:'Inter Tight',sans-serif;color:#090b0c;letter-spacing:-0.04em">MINTS</NuxtLink>
      </div>
    </header>

    <main class="mx-auto max-w-md px-5 py-14 md:px-12">
      <div class="rounded-3xl p-8 shadow-sm" style="background:white">

        <!-- Step 1: Email -->
        <template v-if="step === 'email'">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold tracking-tight mb-1">Selamat datang</h2>
            <p class="text-sm" style="color:rgba(9,11,12,0.5)">Masuk atau daftar untuk melanjutkan</p>
          </div>

          <!-- Google OAuth (placeholder, siap disambungkan) -->
          <button
            type="button"
            class="w-full flex items-center justify-center gap-3 rounded-2xl py-3 mb-6 text-sm font-medium border transition-colors hover:bg-gray-50"
            style="border-color:rgba(9,11,12,0.15);color:#090b0c"
            @click="loginWithGoogle"
          >
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Masuk dengan Google
          </button>

          <div class="flex items-center gap-3 mb-6">
            <div class="flex-1 h-px" style="background:rgba(9,11,12,0.1)" />
            <span class="text-xs" style="color:rgba(9,11,12,0.4)">Atau lanjutkan dengan email</span>
            <div class="flex-1 h-px" style="background:rgba(9,11,12,0.1)" />
          </div>

          <form @submit.prevent="sendOtp" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2" style="color:rgba(9,11,12,0.6)">Alamat email</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2" style="color:rgba(9,11,12,0.35)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </span>
                <input
                  v-model="email"
                  type="email"
                  placeholder="kamu@contoh.com"
                  autocomplete="email"
                  class="w-full rounded-2xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.1);color:#090b0c;--tw-ring-color:rgba(9,11,12,0.2)"
                />
              </div>
            </div>

            <button
              type="submit"
              class="w-full rounded-full py-3.5 text-sm font-semibold transition-opacity"
              :style="canSend ? 'background:#4f46e5;color:white' : 'background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed'"
              :disabled="!canSend || loading"
            >{{ loading ? 'Mengirim…' : 'Kirim Kode Verifikasi' }}</button>
          </form>
        </template>

        <!-- Step 2: OTP -->
        <template v-else>
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold tracking-tight mb-1">Masukkan kode verifikasi</h2>
            <p class="text-sm" style="color:rgba(9,11,12,0.5)">Kami mengirim kode ke email kamu</p>
          </div>

          <!-- Success notice -->
          <div class="flex items-start gap-3 rounded-2xl p-4 mb-6" style="background:rgba(34,197,94,0.08);border-left:3px solid #22c55e">
            <svg width="18" height="18" class="mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
            <p class="text-sm" style="color:rgba(9,11,12,0.7)">Kode verifikasi telah dikirim ke <strong>{{ email }}</strong></p>
          </div>

          <form @submit.prevent="verifyOtp" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2" style="color:rgba(9,11,12,0.6)">Kode Verifikasi</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2" style="color:rgba(9,11,12,0.35)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2H3v16h5l3 3 3-3h7V2z"/><path d="M7.5 7.5h9M7.5 12h6"/></svg>
                </span>
                <input
                  v-model="code"
                  type="text"
                  inputmode="numeric"
                  placeholder="123456"
                  maxlength="6"
                  autocomplete="one-time-code"
                  class="w-full rounded-2xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2"
                  style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.1);color:#090b0c;letter-spacing:0.15em;font-weight:600"
                />
              </div>
              <p class="mt-1.5 text-xs" style="color:rgba(9,11,12,0.4)">Tidak ada di inbox? Periksa folder <strong>spam / junk</strong></p>
            </div>

            <button
              type="submit"
              class="w-full rounded-full py-3.5 text-sm font-semibold transition-opacity"
              :style="canVerify ? 'background:#4f46e5;color:white' : 'background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed'"
              :disabled="!canVerify || loading"
            >{{ loading ? 'Memverifikasi…' : 'Verifikasi Kode' }}</button>
          </form>

          <div class="flex justify-between items-center mt-4">
            <button type="button" class="text-sm font-medium" style="color:#4f46e5" @click="step = 'email'; code = ''; error = ''">
              Ganti email
            </button>
            <button
              type="button"
              class="text-sm"
              :style="resendCooldown > 0 ? 'color:rgba(9,11,12,0.4);cursor:not-allowed' : 'color:rgba(9,11,12,0.6)'"
              :disabled="resendCooldown > 0 || loading"
              @click="resend"
            >
              {{ resendCooldown > 0 ? `Kirim ulang (${resendCooldown}s)` : 'Kirim ulang kode' }}
            </button>
          </div>
        </template>

        <div v-if="error" class="mt-4 rounded-2xl p-3.5 text-sm" style="background:rgba(239,68,68,0.08);color:rgb(185,28,28)">{{ error }}</div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Masuk — MINTS' })

const route = useRoute()
const redirect = computed(() => String(route.query.redirect || '/account'))

const step = ref<'email' | 'otp'>('email')
const email = ref('')
const code = ref('')
const loading = ref(false)
const error = ref('')
const resendCooldown = ref(0)

let cooldownTimer: ReturnType<typeof setInterval> | null = null

const canSend = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()))

const { public: { recaptchaSiteKey } } = useRuntimeConfig()

function loadRecaptcha(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).grecaptcha) return resolve()
    const script = document.createElement('script')
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

async function getRecaptchaToken(): Promise<string> {
  await loadRecaptcha()
  return new Promise((resolve) => {
    (window as any).grecaptcha.ready(async () => {
      const token = await (window as any).grecaptcha.execute(recaptchaSiteKey, { action: 'send_otp' })
      resolve(token)
    })
  })
}
const canVerify = computed(() => code.value.trim().length === 6)

async function sendOtp() {
  loading.value = true
  error.value = ''
  try {
    const recaptchaToken = await getRecaptchaToken()
    await $fetch('/api/auth/send-otp', { method: 'POST', body: { email: email.value, recaptchaToken } })
    step.value = 'otp'
    startCooldown(60)
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Gagal mengirim kode'
  } finally {
    loading.value = false
  }
}

async function resend() {
  if (resendCooldown.value > 0) return
  await sendOtp()
}

async function verifyOtp() {
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/verify-otp', { method: 'POST', body: { email: email.value, code: code.value } })
    window.location.href = redirect.value
  } catch (err: any) {
    error.value = err?.data?.statusMessage || 'Kode tidak valid'
  } finally {
    loading.value = false
  }
}

function loginWithGoogle() {
  window.location.href = '/auth/google'
}

function startCooldown(seconds: number) {
  resendCooldown.value = seconds
  if (cooldownTimer) clearInterval(cooldownTimer)
  cooldownTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

onUnmounted(() => { if (cooldownTimer) clearInterval(cooldownTimer) })
</script>
