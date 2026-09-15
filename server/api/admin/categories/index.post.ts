export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const { name } = await readBody(event)
  if (!name?.trim()) throw createError({ statusCode: 400, statusMessage: 'Nama kategori wajib diisi' })

  const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  return await prisma.category.create({ data: { name: name.trim(), slug } })
})
