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

  const payment = await prisma.payment.findUnique({
    where: { duitkuReference: merchantOrderId },
    include: { order: true }
  })
  if (!payment) {
    throw createError({ statusCode: 404, statusMessage: 'Payment not found' })
  }

  const isSandbox = config.duitkuIsProduction !== 'true'

  if (resultCode === '00') {
    // Successful payment
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'paid',
          paidAt: new Date(),
          rawCallback: body
        }
      }),
      prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'PAID' }
      })
    ])

    // Send WA notification
    const order = payment.order
    const fonnteKey = config.fonnteApiKey
    if (fonnteKey && order?.buyerPhone) {
      const waTemplate = await prisma.waTemplate.findUnique({ where: { key: 'payment_success' } })
      const msg = waTemplate?.template
        ? waTemplate.template
            .replace('{name}', order.buyerName)
            .replace('{orderId}', order.id.slice(0, 8).toUpperCase())
        : `Halo ${order.buyerName}! Pembayaran kamu telah diterima. Order #${order.id.slice(0, 8).toUpperCase()} sedang diproses. Terima kasih sudah belanja di MINTS! 🛍️`

      await $fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: { Authorization: fonnteKey },
        body: { target: order.buyerPhone, message: msg }
      }).catch(() => {}) // non-fatal
    }
  } else if (resultCode === '01') {
    // Pending — no state change
  } else {
    // Failed/cancelled
    await prisma.$transaction([
      prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'failed', rawCallback: body }
      }),
      prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'CANCELLED' }
      })
    ])
  }

  return { success: true }
})
