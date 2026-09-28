export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  return await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } }
  })
})
