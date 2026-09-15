export default defineEventHandler(async (event) => {
  const buyer = await requireBuyerSession(event)
  const query = getQuery(event)
  const status = String(query.status || '')

  const statusGroups: Record<string, string[]> = {
    pending_payment: ['PENDING_PAYMENT'],
    processing: ['PAID', 'IN_PRODUCTION'],
    shipping: ['READY_TO_SHIP', 'SHIPPED'],
    completed: ['DELIVERED'],
    cancelled: ['CANCELLED'],
    returned: ['REFUNDED']
  }

  const where: any = { buyerId: buyer.id }
  if (status && statusGroups[status]) {
    where.status = { in: statusGroups[status] }
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      product: { select: { id: true, title: true, price: true, imageUrl: true } },
      payment: { select: { status: true, paymentUrl: true, paidAt: true } },
      shipment: { select: { courier: true, trackingNo: true, status: true } }
    }
  })

  return orders
})
