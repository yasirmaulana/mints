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

  // Catalog mode: no sessionId → only REGULAR/PRE_ORDER products
  if (!sessionId) {
    where.sessionId = null
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      variants: { orderBy: { size: 'asc' } },
      order: { select: { buyerPhone: true } }
    }
  })

  return products.map(({ order, ...p }) => ({
    ...p,
    maskedPhone: p.status === 'SOLD_OUT' && order?.buyerPhone ? maskPhone(order.buyerPhone) : null
  }))
})
