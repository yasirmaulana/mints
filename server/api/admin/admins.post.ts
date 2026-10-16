// Tambah admin: cukup email (login lewat OTP, tanpa password). `name` opsional, hanya untuk tampilan.
export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const { email, name } = await readBody(event) ?? {}

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    throw createError({ statusCode: 400, statusMessage: 'Email tidak valid' })
  }
  const normalizedEmail = email.trim().toLowerCase()
  const displayName = typeof name === 'string' && name.trim() ? name.trim() : null

  if (await prisma.admin.findUnique({ where: { email: normalizedEmail } })) {
    throw createError({ statusCode: 409, statusMessage: 'Email sudah terdaftar sebagai admin' })
  }
  if (displayName && await prisma.admin.findUnique({ where: { username: displayName } })) {
    throw createError({ statusCode: 409, statusMessage: 'Nama sudah digunakan' })
  }

  return await prisma.admin.create({
    data: { email: normalizedEmail, username: displayName },
    select: { id: true, email: true, username: true, createdAt: true }
  })
})
