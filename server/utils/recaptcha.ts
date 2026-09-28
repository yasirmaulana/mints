export async function verifyRecaptcha(token: string) {
  const config = useRuntimeConfig()
  const secret = config.recaptchaSecretKey
  if (!secret) {
    // Site key terisi berarti reCAPTCHA sengaja diaktifkan (klien mengirim token): secret yang hilang
    // adalah salah konfigurasi, dan melewati verifikasi diam-diam membuat login/OTP tanpa perlindungan bot.
    // Keduanya kosong = reCAPTCHA sengaja dimatikan (mis. dev lokal).
    if (config.public.recaptchaSiteKey) {
      console.error('[recaptcha] RECAPTCHA_SITE_KEY terisi tetapi RECAPTCHA_SECRET_KEY kosong — permintaan ditolak')
      throw createError({ statusCode: 500, statusMessage: 'Verifikasi keamanan belum dikonfigurasi' })
    }
    console.warn('[recaptcha] reCAPTCHA tidak dikonfigurasi — verifikasi dilewati')
    return
  }
  if (typeof token !== 'string' || !token) {
    throw createError({ statusCode: 400, statusMessage: 'Verifikasi keamanan gagal, coba lagi' })
  }

  const res = await $fetch<{ success: boolean; score: number; 'error-codes'?: string[] }>(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token }).toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  )

  if (!res.success || res.score < 0.5) {
    throw createError({ statusCode: 400, statusMessage: 'Verifikasi keamanan gagal, coba lagi' })
  }
}
