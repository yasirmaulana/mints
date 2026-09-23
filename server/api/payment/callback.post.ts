// Callback Duitku untuk order reguler/flash-sale. Satu duitkuReference bisa mencakup
// beberapa Payment (checkout lintas toko, satu per toko) — semuanya diproses bersama
// di sini, masing-masing dengan Order dan efek stok/notifikasi sendiri (PRD §11 Fase 5).
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const config = useRuntimeConfig()
  const merchantCode = config.duitkuMerchantCode
  const apiKey = config.duitkuApiKey

  const { merchantCode: mc, amount, merchantOrderId, resultCode, additionalParam, signature } = body

  // Verify signature: MD5(merchantCode + amount + merchantOrderId + apiKey)
  const expectedSignature = duitkuCallbackSignature(merchantCode, String(amount), merchantOrderId, apiKey)
  if (signature !== expectedSignature) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid signature' })
  }

  const payments = await prisma.payment.findMany({
    where: { duitkuReference: merchantOrderId },
    include: { order: { select: { id: true, buyerName: true, buyerPhone: true, productId: true, variantId: true, qty: true } } }
  })
  if (!payments.length) {
    throw createError({ statusCode: 404, statusMessage: 'Payment not found' })
  }

  if (resultCode === '00') {
    // Successful payment — update semua Payment/Order yang berbagi transaksi ini
    await prisma.$transaction([
      prisma.payment.updateMany({
        where: { duitkuReference: merchantOrderId },
        data: { status: 'paid', paidAt: new Date(), rawCallback: body }
      }),
      prisma.order.updateMany({
        where: { id: { in: payments.map(p => p.orderId) } },
        data: { status: 'PAID' }
      })
    ])

    // Notifikasi WA sekali per pembeli (buyerPhone sama untuk semua order dalam satu checkout)
    const order = payments[0].order
    const fonnteKey = config.fonnteApiKey
    if (fonnteKey && order?.buyerPhone) {
      const waTemplate = await prisma.waTemplate.findUnique({ where: { key: 'payment_success' } })
      const orderLabel = payments.length > 1
        ? `${payments.length} pesanan`
        : `Order #${order.id.slice(0, 8).toUpperCase()}`
      const msg = waTemplate?.template
        ? waTemplate.template
            .replace('{name}', order.buyerName)
            .replace('{orderId}', order.id.slice(0, 8).toUpperCase())
        : `Halo ${order.buyerName}! Pembayaran kamu telah diterima. ${orderLabel} sedang diproses. Terima kasih sudah belanja di MINTS! 🛍️`

      await $fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: { Authorization: fonnteKey },
        body: { target: order.buyerPhone, message: msg }
      }).catch(() => {}) // non-fatal
    }
  } else if (resultCode === '01') {
    // Pending — no state change
  } else {
    // Failed/cancelled — restore variant stock if applicable, untuk semua order terkait
    await prisma.$transaction(async (tx) => {
      await tx.payment.updateMany({ where: { duitkuReference: merchantOrderId }, data: { status: 'failed', rawCallback: body } })
      await tx.order.updateMany({ where: { id: { in: payments.map(p => p.orderId) } }, data: { status: 'CANCELLED' } })

      for (const { order } of payments) {
        if (!order) continue
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
        } else if (order.productId) {
          await tx.product.update({ where: { id: order.productId }, data: { status: 'AVAILABLE' } })
        }
      }
    })
  }

  return { success: true }
})
