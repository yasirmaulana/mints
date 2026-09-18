export async function verifyRecaptcha(token: string) {
  const config = useRuntimeConfig()
  const secret = config.recaptchaSecretKey
  if (!secret) {
    console.warn('[recaptcha] RECAPTCHA_SECRET_KEY tidak dikonfigurasi — verifikasi dilewati')
    return
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
