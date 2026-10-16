// Isi/ubah email admin — terutama untuk admin lama (username/password) yang belum punya email.
export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = getRouterParam(event, 'id')!
  const { email } = await readBody(event) ?? {}

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    throw createError({ statusCode: 400, statusMessage: 'Email tidak valid' })
  }
  const normalizedEmail = email.trim().toLowerCase()

  const taken = await prisma.admin.findUnique({ where: { email: normalizedEmail } })
  if (taken && taken.id !== id) {
    throw createError({ statusCode: 409, statusMessage: 'Email sudah dipakai admin lain' })
  }

  return await prisma.admin.update({
    where: { id },
    data: { email: normalizedEmail },
    select: { id: true, email: true, username: true, createdAt: true }
  })
})
