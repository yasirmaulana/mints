// Detail toko milik pemanggil + ringkasan kuota — PRD §8.1.
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ctx = await getStoreContext(event, id, { requireActive: false })
  const subscriptions = await prisma.subscription.findMany({
    where: { storeId: ctx.store.id },
    include: { plan: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 20
  })
  return { ...ctx.store, subscriptions, quota: buildQuotaSummary(ctx) }
})
