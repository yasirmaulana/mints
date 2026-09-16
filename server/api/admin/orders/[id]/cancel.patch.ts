export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const id = getRouterParam(event, 'id')!

  const order = await prisma.order.findUnique({
    where: { id },
    select: { status: true, productId: true, variantId: true, qty: true }
  })
  if (!order) throw createError({ statusCode: 404, statusMessage: 'Pesanan tidak ditemukan' })
  if (order.status !== 'PENDING_PAYMENT') throw createError({ statusCode: 400, statusMessage: 'Hanya pesanan PENDING_PAYMENT yang bisa dibatalkan' })

  await prisma.$transaction(async (tx) => {
    await tx.order.update({ where: { id }, data: { status: 'CANCELLED' } })

    if (order.variantId) {
      await tx.productVariant.update({
        where: { id: order.variantId },
        data: { stock: { increment: order.qty } }
      })
      const totalStock = await tx.productVariant.aggregate({
        where: { productId: order.productId },
        _sum: { stock: true }
      })
      await tx.product.update({
        where: { id: order.productId },
        data: { status: (totalStock._sum.stock ?? 0) > 0 ? 'AVAILABLE' : 'SOLD_OUT' }
      })
    } else {
      await tx.product.update({ where: { id: order.productId }, data: { status: 'AVAILABLE' } })
    }
  })

  return { success: true }
})
