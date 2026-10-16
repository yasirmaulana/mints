<template>
  <div class="min-h-screen bg-gray-50 font-body flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-sm">
      <!-- Logo/Brand -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 bg-brand-400 rounded-2xl shadow-xs mb-4">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L4.09 12.11A1 1 0 004 13h7l-1 9 9.91-11.11A1 1 0 0020 10h-7l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Login Admin</h1>
        <p class="text-sm text-gray-500 mt-1">Masuk dengan kode yang dikirim ke email admin</p>
      </div>

      <div class="card p-6 shadow-lg">
        <!-- Langkah 1: email -->
        <form v-if="step === 'email'" class="space-y-4" @submit.prevent="sendOtp()">
          <div>
            <label class="label-text">Email admin</label>
            <input v-model="email" type="email" placeholder="nama@email.com" class="input-field" autocomplete="email" required />
          </div>
          <div v-if="errorMsg" class="flex items-center gap-2 p-3 bg-error-50 border border-error-100 rounded-xl text-sm text-error-600">
            <span>✕</span> {{ errorMsg }}
          </div>
          <button type="submit" class="btn-primary-full" :disabled="loading || !email">
            <span v-if="loading" class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>
            <span v-else>Kirim Kode</span>
          </button>
        </form>

        <!-- Langkah 2: kode OTP -->
        <form v-else class="space-y-4" @submit.prevent="verifyOtp">
          <p class="text-sm text-gray-600">
            Jika <span class="font-semibold">{{ email }}</span> terdaftar sebagai admin, kode 6 digit telah dikirim. Berlaku 10 menit.
          </p>
          <div>
            <label class="label-text">Kode verifikasi</label>
            <input
              v-model="code" type="text" inputmode="numeric" maxlength="6" placeholder="••••••"
              class="input-field text-center tracking-[0.4em] text-lg" autocomplete="one-time-code" required
            />
          </div>
          <div v-if="errorMsg" class="flex items-center gap-2 p-3 bg-error-50 border border-error-100 rounded-xl text-sm text-error-600">
            <span>✕</span> {{ errorMsg }}
          </div>
          <button type="submit" class="btn-primary-full" :disabled="loading || code.length < 6">
            <span v-if="loading" class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>
            <span v-else>Masuk</span>
          </button>
          <div class="flex items-center justify-between text-xs text-gray-500">
            <button type="button" class="hover:text-gray-800" @click="step = 'email'; code = ''; errorMsg = ''">Ganti email</button>
            <button type="button" class="hover:text-gray-800 disabled:opacity-40" :disabled="resendCooldown > 0 || loading" @click="sendOtp(true)">
              {{ resendCooldown > 0 ? `Kirim ulang (${resendCooldown}s)` : 'Kirim ulang kode' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: [] })

const step = ref<'email' | 'otp'>('email')
const email = ref('')
const code = ref('')
const loading = ref(false)
const errorMsg = ref('')
const resendCooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

function startCooldown(seconds = 60) {
  resendCooldown.value = seconds
  if (cooldownTimer) clearInterval(cooldownTimer)
  cooldownTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0 && cooldownTimer) { clearInterval(cooldownTimer); cooldownTimer = null }
  }, 1000)
}
onBeforeUnmount(() => { if (cooldownTimer) clearInterval(cooldownTimer) })

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
      const token = await (window as any).grecaptcha.execute(recaptchaSiteKey, { action: 'admin_login' })
      resolve(token)
    })
  })
}

async function sendOtp(resend = false) {
  if (resend && resendCooldown.value > 0) return
  loading.value = true
  errorMsg.value = ''
  try {
    const recaptchaToken = await getRecaptchaToken()
    await $fetch('/api/admin/send-otp', { method: 'POST', body: { email: email.value, recaptchaToken } })
    step.value = 'otp'
    startCooldown()
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage || 'Terjadi kesalahan, coba lagi'
  } finally {
    loading.value = false
  }
}

async function verifyOtp() {
  loading.value = true
  errorMsg.value = ''
  try {
    await $fetch('/api/admin/verify-otp', { method: 'POST', body: { email: email.value, code: code.value } })
    window.location.href = '/admin'
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage || 'Kode tidak valid'
    loading.value = false
  }
}
</script>
