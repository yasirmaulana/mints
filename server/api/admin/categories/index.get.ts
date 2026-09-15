export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  return await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } }
  })
})
