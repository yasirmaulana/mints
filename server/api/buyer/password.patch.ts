import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const buyer = await requireBuyerSession(event)
  const { currentPassword, newPassword } = await readBody(event) ?? {}

  if (!currentPassword?.trim() || !newPassword?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Password lama dan baru wajib diisi' })
  }
  if (newPassword.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'Password baru minimal 6 karakter' })
  }

  if (!(await bcrypt.compare(currentPassword, buyer.password))) {
    throw createError({ statusCode: 401, statusMessage: 'Password lama salah' })
  }

  await prisma.buyer.update({
    where: { id: buyer.id },
    data: { password: await bcrypt.hash(newPassword, 10) }
  })

  return { success: true }
})
