// Daftar toko milik pengguna login + ringkasan kuota masing-masing — PRD §8.1.
export default defineEventHandler(async (event) => {
  const buyer = await requireBuyerSession(event)

  const stores = await prisma.store.findMany({
    where: { ownerId: buyer.id, status: { not: 'ARCHIVED' } },
    include: { plan: true },
    orderBy: { createdAt: 'desc' }
  })

  return stores.map(store => buildQuotaSummary({ store: store as any }))
})
