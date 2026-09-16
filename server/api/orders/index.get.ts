export default defineEventHandler(async (event) => {
  const { phone } = getQuery(event)
  if (!phone) throw createError({ statusCode: 400, statusMessage: 'phone wajib diisi' })

  // Validate phone format to prevent enumeration with arbitrary strings
  const phoneStr = String(phone).replace(/\s/g, '')
  if (!/^(08|628|\+628)\d{7,12}$/.test(phoneStr)) {
    throw createError({ statusCode: 400, statusMessage: 'Format nomor HP tidak valid' })
  }

  // If logged in, only allow fetching own orders (prefer buyerId over phone)
  const buyerId = getCookie(event, 'buyer_session')

  const orders = await prisma.order.findMany({
    where: {
      source: 'REGULAR',
      ...(buyerId ? { buyerId } : { buyerPhone: phoneStr })
    },
    include: {
      product: { select: { id: true, title: true, imageUrl: true } },
      payment: { select: { status: true, paymentUrl: true, paidAt: true } },
      shipment: { select: { courier: true, trackingNo: true, status: true } }
    },
    orderBy: { createdAt: 'desc' }
  })

  return orders
})
