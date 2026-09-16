export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  return await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        select: {
          title: true,
          price: true,
          imageUrl: true,
          sessionId: true,
          variants: { select: { id: true, size: true } }
        }
      },
      payment: { select: { status: true, paymentUrl: true, paidAt: true } },
      shipment: { select: { courier: true, trackingNo: true, status: true } }
    }
  })
})
