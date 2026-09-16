export async function verifyTurnstile(token: string, ip?: string) {
  const config = useRuntimeConfig()
  const secret = config.turnstileSecretKey
  if (!secret) {
    console.warn('[turnstile] TURNSTILE_SECRET_KEY tidak dikonfigurasi — verifikasi dilewati')
    return
  }

  const body = new URLSearchParams({ secret, response: token })
  if (ip) body.set('remoteip', ip)

  const res = await $fetch<{ success: boolean; 'error-codes'?: string[] }>(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    { method: 'POST', body: body.toString(), headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  )

  if (!res.success) {
    throw createError({ statusCode: 400, statusMessage: 'Verifikasi keamanan gagal, coba lagi' })
  }
}
