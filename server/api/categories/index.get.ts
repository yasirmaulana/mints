export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 's-maxage=300, stale-while-revalidate=600')
  return await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } }
  })
})
