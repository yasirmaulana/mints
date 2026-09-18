function maskPhone(phone: string) {
  return phone.length > 3 ? phone.slice(0, -3) + 'xxx' : 'xxx'
}

export default defineEventHandler(async (event) => {
  const { sessionId, categoryId, productType, status, search } = getQuery(event)

  const where: Record<string, any> = {}

  if (sessionId) where.sessionId = String(sessionId)
  if (categoryId) where.categoryId = String(categoryId)
  if (productType) where.productType = String(productType)
  if (status) where.status = String(status)
  if (search) where.title = { contains: String(search), mode: 'insensitive' }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      variants: { orderBy: { size: 'asc' } },
      orders: { select: { buyerPhone: true }, take: 1 }
    }
  })

  // Cache publik 60s, stale-while-revalidate 5 menit — hanya jika tidak ada filter dinamis
  if (!search && !sessionId) {
    setResponseHeader(event, 'Cache-Control', 's-maxage=60, stale-while-revalidate=300')
  } else {
    setResponseHeader(event, 'Cache-Control', 'no-store')
  }

  return products.map(({ orders, ...p }) => ({
    ...p,
    maskedPhone: p.status === 'SOLD_OUT' && orders[0]?.buyerPhone ? maskPhone(orders[0].buyerPhone) : null
  }))
})
