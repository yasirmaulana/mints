// Direktori toko aktif — PRD §6.4/§8.2. Diurutkan berdasarkan searchPriority paket (badge terverifikasi dulu).
export default defineEventHandler(async (event) => {
  const { page = '1', pageSize = '20', search } = getQuery(event)

  const take = Math.min(Math.max(parseInt(String(pageSize)) || 20, 1), 50)
  const skip = (Math.max(parseInt(String(page)) || 1, 1) - 1) * take

  const where: Record<string, any> = { status: 'ACTIVE' }
  if (search) where.name = { contains: String(search), mode: 'insensitive' }

  const [stores, total] = await Promise.all([
    prisma.store.findMany({
      where,
      select: {
        id: true, name: true, slug: true, logoUrl: true, cityName: true,
        plan: { select: { tier: true, hasVerifiedBadge: true, searchPriority: true } }
      },
      orderBy: [{ plan: { searchPriority: 'desc' } }, { createdAt: 'desc' }],
      skip,
      take
    }),
    prisma.store.count({ where })
  ])

  setResponseHeader(event, 'Cache-Control', 's-maxage=120, stale-while-revalidate=600')

  return { stores, total, page: Number(page), pageSize: take }
})
