export default defineEventHandler(async (event) => {
  const selfId = await requireAdminSession(event)
  const id = getRouterParam(event, 'id')!

  if (id === selfId) {
    throw createError({ statusCode: 400, statusMessage: 'Tidak bisa menghapus akun sendiri' })
  }
  // Cegah hapus semua admin — minimal harus ada 1
  const count = await prisma.admin.count()
  if (count <= 1) {
    throw createError({ statusCode: 400, statusMessage: 'Tidak bisa menghapus admin terakhir' })
  }

  await prisma.admin.delete({ where: { id } })
  return { success: true }
})
