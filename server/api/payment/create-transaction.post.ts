export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { orderId, paymentMethod } = body

  if (!orderId || !paymentMethod) {
    throw createError({ statusCode: 400, statusMessage: 'orderId dan paymentMethod wajib diisi' })
  }

  const buyerId = getCookie(event, 'buyer_session')

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { product: true }
  })
  if (!order) throw createError({ statusCode: 404, statusMessage: 'Order tidak ditemukan' })

  // Ownership: jika order terikat akun, harus login dengan akun yang sama
  if (order.buyerId && order.buyerId !== buyerId) {
    throw createError({ statusCode: 403, statusMessage: 'Akses tidak diizinkan' })
  }
  if (order.status !== 'PENDING_PAYMENT') {
    throw createError({ statusCode: 400, statusMessage: 'Order sudah diproses atau dibatalkan' })
  }

  const merchantOrderId = `MINTS-${orderId.slice(0, 8)}-${Date.now()}`
  const expiredAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  // Transfer Bank Manual — tidak perlu gateway, simpan Payment record langsung
  if (paymentMethod === 'FT') {
    await prisma.payment.create({
      data: {
        orderId,
        duitkuReference: merchantOrderId,
        paymentUrl: null,
        paymentMethod: 'FT',
        vaNumber: null,
        status: 'pending',
        expiredAt
      }
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

  const amount = String(Number(order.product.price) + (order.shippingCost || 0))
  const signature = duitkuSignature(merchantCode, merchantOrderId, amount, apiKey)

  const payload = {
    merchantCode,
    paymentAmount: Number(amount),
    paymentMethod,
    merchantOrderId,
    productDetails: order.product.title,
    customerVaName: order.buyerName,
    email: `${order.buyerPhone.replace(/\D/g, '')}@mints.id`,
    phoneNumber: order.buyerPhone,
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

  await prisma.payment.create({
    data: {
      orderId,
      duitkuReference: merchantOrderId,
      paymentUrl: duitkuRes.paymentUrl,
      paymentMethod,
      vaNumber: duitkuRes.vaNumber || null,
      status: 'pending',
      expiredAt
    }
  })

  return { paymentUrl: duitkuRes.paymentUrl, merchantOrderId }
})
