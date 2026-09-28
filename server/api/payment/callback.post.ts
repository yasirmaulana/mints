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
  if (!safeEqual(signature, expectedSignature)) {
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
    // Successful payment — update semua Payment/Order yang berbagi transaksi ini.
    // Idempoten: hanya order yang masih PENDING_PAYMENT yang menjadi PAID. Duitku bisa mengirim callback
    // yang sama berkali-kali (retry); tanpa syarat ini order yang sudah dibatalkan/dikirim ikut ditimpa
    // dan WA "pembayaran diterima" terkirim berulang.
    const [, paidOrders] = await prisma.$transaction([
      prisma.payment.updateMany({
        where: { duitkuReference: merchantOrderId, status: { not: 'paid' } },
        data: { status: 'paid', paidAt: new Date(), rawCallback: body }
      }),
      prisma.order.updateMany({
        where: { id: { in: payments.map(p => p.orderId) }, status: 'PENDING_PAYMENT' },
        data: { status: 'PAID' }
      })
    ])
    if (paidOrders.count === 0) return { success: true }

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
    // Failed/cancelled — batalkan order terkait dan kembalikan stok. Hanya order yang masih
    // PENDING_PAYMENT yang diproses (cancelPendingOrder): callback gagal yang dikirim ulang tidak boleh
    // menambah stok dua kali, dan callback gagal yang datang setelah order lunas tidak boleh membatalkannya.
    await prisma.$transaction(async (tx) => {
      await tx.payment.updateMany({
        where: { duitkuReference: merchantOrderId, status: { notIn: ['paid', 'failed'] } },
        data: { status: 'failed', rawCallback: body }
      })
      for (const { order } of payments) {
        if (order) await cancelPendingOrder(tx, order.id)
      }
    })
  }

  return { success: true }
})
