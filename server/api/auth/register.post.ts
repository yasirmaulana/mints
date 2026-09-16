import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const ip = getHeader(event, 'x-forwarded-for')?.split(',')[0].trim() ?? getRequestIP(event) ?? 'unknown'
  checkRateLimit(`buyer-register:${ip}`, 5, 60 * 60 * 1000)

  const body = await readBody(event)
  const { name, phone, password, email } = body ?? {}

  if (!name?.trim() || !phone?.trim() || !password?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Nama, nomor HP, dan password wajib diisi' })
  }

  const normalizedPhone = phone.replace(/\D/g, '').replace(/^0/, '62')
  if (!/^(62|08)\d{8,12}$/.test('0' + normalizedPhone.replace(/^62/, ''))) {
    throw createError({ statusCode: 400, statusMessage: 'Nomor HP tidak valid' })
  }

  const exists = await prisma.buyer.findUnique({ where: { phone: normalizedPhone } })
  if (exists) {
    throw createError({ statusCode: 409, statusMessage: 'Nomor HP sudah terdaftar' })
  }

  const hashed = await bcrypt.hash(password, 10)
  const buyer = await prisma.buyer.create({
    data: {
      name: name.trim(),
      phone: normalizedPhone,
      email: email?.trim() || null,
      password: hashed
    }
  })

  const maxAge = 60 * 60 * 24 * 30
  setCookie(event, 'buyer_session', buyer.id, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge,
    path: '/'
  })
  setCookie(event, 'buyer_auth', '1', {
    httpOnly: false,
    secure: true,
    sameSite: 'strict',
    maxAge,
    path: '/'
  })

  return { success: true, buyer: { id: buyer.id, name: buyer.name, phone: buyer.phone, email: buyer.email } }
})
