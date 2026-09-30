export default defineEventHandler(async (event) => {
  const buyer = await requireBuyerSession(event)

  return prisma.address.findMany({
    where: { buyerId: buyer.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }]
  })
})
