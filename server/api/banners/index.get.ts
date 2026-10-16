export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 's-maxage=60, stale-while-revalidate=300')
  return await prisma.banner.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    select: { id: true, title: true, imageUrl: true, linkUrl: true, position: true }
  })
})
