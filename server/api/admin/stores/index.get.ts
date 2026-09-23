// Daftar semua toko untuk admin platform — PRD §11 Fase 6 (tab "Toko").
export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const { status, search } = getQuery(event)

  const where: Record<string, any> = {}
  if (status) where.status = String(status)
  if (search) where.name = { contains: String(search), mode: 'insensitive' }

  return prisma.store.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      owner: { select: { name: true, phone: true, email: true } },
      plan: { select: { tier: true, name: true, searchPriority: true, hasVerifiedBadge: true } }
    }
  })
})
