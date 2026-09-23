// Daftar & laporan pendapatan langganan untuk admin — PRD §11 Fase 6.
export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const { status } = getQuery(event)

  const where: Record<string, any> = {}
  if (status) where.status = String(status)

  const subscriptions = await prisma.subscription.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      store: { select: { name: true, slug: true } },
      plan: { select: { name: true, tier: true } }
    }
  })

  const paid = subscriptions.filter((s: (typeof subscriptions)[number]) => s.status === 'ACTIVE' || s.paidAt)
  const totalRevenue = paid.reduce((sum: number, s: (typeof subscriptions)[number]) => sum + s.amount, 0)
  const revenueByPlan: Record<string, number> = {}
  for (const s of paid) {
    revenueByPlan[s.plan.name] = (revenueByPlan[s.plan.name] || 0) + s.amount
  }

  return { subscriptions, report: { totalRevenue, paidCount: paid.length, revenueByPlan } }
})
