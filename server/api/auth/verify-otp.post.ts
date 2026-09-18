export default defineEventHandler(async (event) => {
  const ip = getHeader(event, 'x-forwarded-for')?.split(',')[0].trim() ?? getRequestIP(event) ?? 'unknown'
  checkRateLimit(`verify-otp:${ip}`, 10, 15 * 60 * 1000)

  const { email, code } = await readBody(event) ?? {}
  if (!email?.trim() || !code?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Email dan kode wajib diisi' })
  }

  const normalizedEmail = email.trim().toLowerCase()

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

  const maxAge = 60 * 60 * 24 * 30
  setCookie(event, 'buyer_session', buyer.id, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge,
    path: '/',
  })
  setCookie(event, 'buyer_auth', '1', {
    httpOnly: false,
    secure: true,
    sameSite: 'strict',
    maxAge,
    path: '/',
  })

  return { success: true, buyer: { id: buyer.id, name: buyer.name, email: buyer.email } }
})
