export default defineEventHandler(async (event) => {
  const { phone } = getQuery(event)
  if (!phone) throw createError({ statusCode: 400, statusMessage: 'phone wajib diisi' })

  const orders = await prisma.order.findMany({
    where: { buyerPhone: String(phone), source: 'REGULAR' },
    include: {
      product: { select: { id: true, title: true, imageUrl: true } },
      payment: { select: { status: true, paymentUrl: true, paidAt: true } },
      shipment: { select: { courier: true, trackingNo: true, status: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return orders
})
