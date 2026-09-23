// Buat transaksi pembayaran untuk satu atau beberapa Order sekaligus (checkout lintas toko,
// PRD §11 Fase 5 "satu pembayaran → beberapa order"). Semua Payment yang dibuat berbagi
// duitkuReference yang sama — satu transaksi Duitku, dipecah ke Payment per order.
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { paymentMethod } = body
  const orderIds: string[] = Array.isArray(body.orderIds) ? body.orderIds : (body.orderId ? [body.orderId] : [])

  if (!orderIds.length || !paymentMethod) {
    throw createError({ statusCode: 400, statusMessage: 'orderIds dan paymentMethod wajib diisi' })
  }

  const buyerId = getCookie(event, 'buyer_session')

  const orders = await prisma.order.findMany({
    where: { id: { in: orderIds } },
    include: { product: true }
  })
  if (orders.length !== orderIds.length) throw createError({ statusCode: 404, statusMessage: 'Order tidak ditemukan' })

  for (const order of orders) {
    if (order.buyerId && order.buyerId !== buyerId) {
      throw createError({ statusCode: 403, statusMessage: 'Akses tidak diizinkan' })
    }
    if (order.status !== 'PENDING_PAYMENT') {
      throw createError({ statusCode: 400, statusMessage: 'Order sudah diproses atau dibatalkan' })
    }
  }

  const merchantOrderId = `MINTS-${orderIds[0].slice(0, 8)}-${Date.now()}`
  const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  const totalAmount = orders.reduce((sum, o) => sum + Number(o.product.price) * o.qty + (o.shippingCost || 0), 0)

  // Transfer Bank Manual — tidak perlu gateway, simpan Payment record langsung per order
  if (paymentMethod === 'FT') {
    await prisma.payment.createMany({
      data: orders.map(o => ({
        orderId: o.id,
        duitkuReference: merchantOrderId,
        paymentUrl: null,
        paymentMethod: 'FT',
        vaNumber: null,
        status: 'pending',
        expiredAt
      }))
    })
    return { paymentUrl: null, merchantOrderId }
  }

  const config = useRuntimeConfig()
  const isProduction = config.duitkuIsProduction === 'true'
  const merchantCode = config.duitkuMerchantCode
  const apiKey = config.duitkuApiKey

  if (!merchantCode || !apiKey) {
    throw createError({ statusCode: 503, statusMessage: 'Payment gateway belum dikonfigurasi. Hubungi admin.' })
  }

  const baseUrl = getDuitkuBaseUrl(isProduction)

  const amount = String(totalAmount)
  const signature = duitkuSignature(merchantCode, merchantOrderId, amount, apiKey)
  const buyer = orders[0]

  const payload = {
    merchantCode,
    paymentAmount: Number(amount),
    paymentMethod,
    merchantOrderId,
    productDetails: orders.length > 1 ? `${orders[0].product.title} +${orders.length - 1} lainnya` : orders[0].product.title,
    customerVaName: buyer.buyerName,
    email: `${buyer.buyerPhone.replace(/\D/g, '')}@mints.id`,
    phoneNumber: buyer.buyerPhone,
    additionalParam: '',
    merchantUserInfo: '',
    callbackUrl: config.duitkuCallbackUrl,
    returnUrl: config.duitkuReturnUrl || `${config.appUrl || 'https://mints.id'}/orders`,
    signature,
    expiryPeriod: 1440 // minutes
  }

  const duitkuRes = await $fetch<any>(`${baseUrl}/v2/inquiry`, {
    method: 'POST',
    body: payload,
    headers: { 'content-type': 'application/json' }
  })

  if (duitkuRes.statusCode !== '00') {
    throw createError({ statusCode: 400, statusMessage: duitkuRes.statusMessage || 'Gagal membuat transaksi Duitku' })
  }

  await prisma.payment.createMany({
    data: orders.map(o => ({
      orderId: o.id,
      duitkuReference: merchantOrderId,
      paymentUrl: duitkuRes.paymentUrl,
      paymentMethod,
      vaNumber: duitkuRes.vaNumber || null,
      status: 'pending',
      expiredAt
    }))
  })

  return { paymentUrl: duitkuRes.paymentUrl, merchantOrderId }
})
