// Daftar pesanan milik toko — PRD §11 Fase 2 "manajemen pesanan per toko".
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ctx = await getStoreContext(event, id, { requireActive: false })

  const orders = await prisma.order.findMany({
    where: { storeId: ctx.store.id },
    orderBy: { createdAt: 'desc' },
    include: {
      product: { select: { title: true, imageUrl: true } },
      payment: { select: { status: true, paidAt: true } },
      shipment: { select: { courier: true, trackingNo: true, status: true } }
    }
  })

  return orders
})
