export default defineEventHandler(async (event) => {
  const ip = getClientIp(event)
  await checkRateLimit(`verify-otp:${ip}`, 10, 15 * 60 * 1000)

  const { email, code } = await readBody(event) ?? {}
  if (typeof email !== 'string' || typeof code !== 'string' || !email.trim() || !code.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Email dan kode wajib diisi' })
  }

  const normalizedEmail = email.trim().toLowerCase()
  // Batas per email: kode 6 digit hanya aman kalau percobaan tebak per akun dibatasi,
  // apa pun IP-nya (IP bisa berganti-ganti atau dipalsukan).
  await checkRateLimit(`verify-otp-email:${normalizedEmail}`, 5, 15 * 60 * 1000)

  const otp = await prisma.emailOtp.findFirst({
    where: {
      email: normalizedEmail,
      code: String(code).trim(),
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!otp) {
    throw createError({ statusCode: 401, statusMessage: 'Kode tidak valid atau sudah kadaluarsa' })
  }

  await prisma.emailOtp.update({ where: { id: otp.id }, data: { used: true } })

  // Upsert buyer — login dan register digabung
  let buyer = await prisma.buyer.findUnique({ where: { email: normalizedEmail } })
  if (!buyer) {
    const nameFallback = normalizedEmail.split('@')[0]
    buyer = await prisma.buyer.create({
      data: { email: normalizedEmail, name: nameFallback },
    })
  }

  await setBuyerSession(event, buyer.id, 'strict')

  return { success: true, buyer: { id: buyer.id, name: buyer.name, email: buyer.email } }
})
