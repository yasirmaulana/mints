import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { phone, password, turnstileToken } = body ?? {}

  await verifyTurnstile(turnstileToken ?? '', getHeader(event, 'x-forwarded-for') ?? getRequestIP(event) ?? '')

  if (!phone?.trim() || !password?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Nomor HP dan password wajib diisi' })
  }

  const normalizedPhone = phone.replace(/\D/g, '').replace(/^0/, '62')
  const buyer = await prisma.buyer.findUnique({ where: { phone: normalizedPhone } })

  if (!buyer || !(await bcrypt.compare(password, buyer.password))) {
    throw createError({ statusCode: 401, statusMessage: 'Nomor HP atau password salah' })
  }

  setCookie(event, 'buyer_session', buyer.id, {
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
    path: '/'
  })

  return { success: true, buyer: { id: buyer.id, name: buyer.name, phone: buyer.phone, email: buyer.email } }
})
