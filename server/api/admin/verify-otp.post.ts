export default defineEventHandler(async (event) => {
  const ip = getClientIp(event)
  await checkRateLimit(`admin-verify-otp:${ip}`, 10, 15 * 60 * 1000)

  const { email, code } = await readBody(event) ?? {}
  if (typeof email !== 'string' || typeof code !== 'string' || !email.trim() || !code.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Email dan kode wajib diisi' })
  }

  const normalizedEmail = email.trim().toLowerCase()
  // Kode 6 digit hanya aman bila percobaan tebak per akun dibatasi, apa pun IP-nya.
  await checkRateLimit(`admin-verify-otp-email:${normalizedEmail}`, 5, 15 * 60 * 1000)

  const invalid = () => createError({ statusCode: 401, statusMessage: 'Kode tidak valid atau sudah kadaluarsa' })

  if (!(await consumeOtp(normalizedEmail, code, 'ADMIN'))) throw invalid()

  // Cek ulang: admin bisa saja dihapus setelah kode dikirim
  const adminId = await resolveAdminIdByEmail(normalizedEmail)
  if (!adminId) throw invalid()

  setAdminSession(event, await createAdminToken(adminId))
  return { success: true }
})
