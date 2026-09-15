export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { status } = await readBody(event)

  const allowed = ['PENDING_PAYMENT', 'PAID', 'IN_PRODUCTION', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']
  if (!id || !allowed.includes(status)) {
    throw createError({ statusCode: 400, statusMessage: 'Status tidak valid' })
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status }
  })

  return order
})
