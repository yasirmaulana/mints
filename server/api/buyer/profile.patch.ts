export default defineEventHandler(async (event) => {
  const buyer = await requireBuyerSession(event)
  const body = await readBody(event)
  const { name, email, phone, gender, birthDate } = body ?? {}

  const data: any = {}
  if (name?.trim()) data.name = name.trim()
  if (email?.trim() !== undefined) data.email = email.trim() || null
  if (gender?.trim() !== undefined) data.gender = ['M', 'F'].includes(gender.trim()) ? gender.trim() : null
  if (birthDate !== undefined) data.birthDate = birthDate ? new Date(birthDate) : null

  if (phone?.trim()) {
    const normalized = phone.replace(/\D/g, '').replace(/^0/, '62')
    if (normalized !== buyer.phone) {
      const exists = await prisma.buyer.findUnique({ where: { phone: normalized } })
      if (exists) throw createError({ statusCode: 409, statusMessage: 'Nomor HP sudah digunakan akun lain' })
      data.phone = normalized
    }
  }

  const updated = await prisma.buyer.update({ where: { id: buyer.id }, data })

  // Cookie sesi tidak perlu di-set ulang di sini: identitas tidak berubah saat profil diedit.
  // (Kode lama menimpanya tanpa httpOnly/secure sehingga cookie sesi jadi terbaca JavaScript.)

  return {
    id: updated.id,
    name: updated.name,
    email: updated.email,
    phone: updated.phone,
    gender: updated.gender,
    birthDate: updated.birthDate?.toISOString().slice(0, 10) || null
  }
})
