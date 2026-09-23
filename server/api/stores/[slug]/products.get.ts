// Katalog produk toko publik, dipaginasi — PRD §6.4.
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!
  const { page = '1', pageSize = '20', categoryId, search, sort = 'terbaru' } = getQuery(event)

  const store = await prisma.store.findUnique({ where: { slug }, select: { id: true, status: true } })
  if (!store || store.status !== 'ACTIVE') {
    throw createError({ statusCode: 404, statusMessage: 'Toko tidak ditemukan' })
  }

  const take = Math.min(Math.max(parseInt(String(pageSize)) || 20, 1), 50)
  const skip = (Math.max(parseInt(String(page)) || 1, 1) - 1) * take

  const where: Record<string, any> = { storeId: store.id }
  if (categoryId) where.categoryId = String(categoryId)
  if (search) where.title = { contains: String(search), mode: 'insensitive' }

  let products, total
  if (sort === 'terlaris') {
    // Urutkan berdasarkan total qty terjual (order tidak dibatalkan/refund) — butuh agregat manual karena tidak bisa orderBy relation-sum langsung di findMany.
    const allIds: { id: string }[] = await prisma.product.findMany({ where, select: { id: true } })
    const sold = await prisma.order.groupBy({
      by: ['productId'],
      where: { productId: { in: allIds.map((p) => p.id) }, status: { notIn: ['CANCELLED', 'REFUNDED'] } },
      _sum: { qty: true }
    })
    const soldMap = new Map<string, number>(sold.map((s: { productId: string; _sum: { qty: number | null } }) => [s.productId, s._sum.qty || 0]))
    const sortedIds = allIds.map((p) => p.id).sort((a: string, b: string) => (soldMap.get(b) || 0) - (soldMap.get(a) || 0))
    total = sortedIds.length
    const pageIds = sortedIds.slice(skip, skip + take)
    const rows = await prisma.product.findMany({
      where: { id: { in: pageIds } },
      include: { category: { select: { id: true, name: true, slug: true } }, variants: { orderBy: { size: 'asc' } } }
    })
    const rowMap = new Map(rows.map((r: { id: string }) => [r.id, r]))
    products = pageIds.map((id: string) => rowMap.get(id)).filter(Boolean)
  } else {
    const orderBy =
      sort === 'harga_asc' ? { price: 'asc' as const } :
      sort === 'harga_desc' ? { price: 'desc' as const } :
      { createdAt: 'desc' as const }
    ;[products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        include: { category: { select: { id: true, name: true, slug: true } }, variants: { orderBy: { size: 'asc' } } },
        skip,
        take
      }),
      prisma.product.count({ where })
    ])
  }

  setResponseHeader(event, 'Cache-Control', 's-maxage=60, stale-while-revalidate=300')

  return { products, total, page: Number(page), pageSize: take }
})
