export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  return await prisma.banner.findMany({ orderBy: [{ position: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }] })
})
