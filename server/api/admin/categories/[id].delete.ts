export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = getRouterParam(event, 'id')!
  const childCount = await prisma.category.count({ where: { parentId: id } })
  if (childCount > 0) {
    throw createError({ statusCode: 400, statusMessage: `Hapus ${childCount} subkategorinya dulu` })
  }
  await prisma.category.delete({ where: { id } })
  return { success: true }
})
