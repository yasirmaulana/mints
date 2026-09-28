// Langkah 2 ganti/tambah email: verifikasi kode yang dikirim ke email baru, baru simpan ke akun.
export default defineEventHandler(async (event) => {
  const buyer = await requireBuyerSession(event)
  const { email, code } = await readBody(event) ?? {}

  if (typeof email !== 'string' || typeof code !== 'string' || !email.trim() || !code.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Email dan kode wajib diisi' })
  }
  const normalizedEmail = email.trim().toLowerCase()

  // Kode 6 digit hanya aman bila percobaan tebak dibatasi: per email (dibagi dengan verify-otp login) dan per akun.
  await checkRateLimit(`verify-otp-email:${normalizedEmail}`, 5, 15 * 60 * 1000)
  await checkRateLimit(`email-change-verify:${buyer.id}`, 10, 15 * 60 * 1000)

  const otp = await prisma.emailOtp.findFirst({
    where: { email: normalizedEmail, code: code.trim(), used: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' }
  })
  if (!otp) throw createError({ statusCode: 401, statusMessage: 'Kode tidak valid atau sudah kadaluarsa' })

  await prisma.emailOtp.update({ where: { id: otp.id }, data: { used: true } })

  try {
    await prisma.buyer.update({ where: { id: buyer.id }, data: { email: normalizedEmail } })
  } catch (err: any) {
    // Unique constraint: email keburu dipakai akun lain di antara langkah 1 dan 2.
    if (err?.code === 'P2002') throw createError({ statusCode: 409, statusMessage: 'Email sudah digunakan akun lain' })
    throw err
  }

  return { email: normalizedEmail }
})
