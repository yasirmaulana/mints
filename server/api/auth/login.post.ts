import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const ip = getHeader(event, 'x-forwarded-for')?.split(',')[0].trim() ?? getRequestIP(event) ?? 'unknown'
  checkRateLimit(`buyer-login:${ip}`, 10, 15 * 60 * 1000)

  const body = await readBody(event)
  const { phone, password, turnstileToken } = body ?? {}

  await verifyTurnstile(turnstileToken ?? '', ip)

  if (!phone?.trim() || !password?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Nomor HP dan password wajib diisi' })
  }

  const normalizedPhone = phone.replace(/\D/g, '').replace(/^0/, '62')
  const buyer = await prisma.buyer.findUnique({ where: { phone: normalizedPhone } })

  if (!buyer || !(await bcrypt.compare(password, buyer.password))) {
    throw createError({ statusCode: 401, statusMessage: 'Nomor HP atau password salah' })
  }

  const maxAge = 60 * 60 * 24 * 30
  setCookie(event, 'buyer_session', buyer.id, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge,
    path: '/'
  })
  // Non-httpOnly flag so client middleware can detect login state without exposing the session id
  setCookie(event, 'buyer_auth', '1', {
    httpOnly: false,
    secure: true,
    sameSite: 'strict',
    maxAge,
    path: '/'
  })

  return { success: true, buyer: { id: buyer.id, name: buyer.name, phone: buyer.phone, email: buyer.email } }
})
