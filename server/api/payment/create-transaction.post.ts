// Buat transaksi pembayaran untuk satu atau beberapa Order sekaligus (checkout lintas toko,
// PRD §11 Fase 5 "satu pembayaran → beberapa order"). Semua Payment yang dibuat berbagi
// duitkuReference yang sama — satu transaksi Duitku, dipecah ke Payment per order.
export default defineEventHandler(async (event) => {
  const body = await readBody(event) ?? {}
  const { paymentMethod } = body
  const rawOrderIds: unknown[] = Array.isArray(body.orderIds) ? body.orderIds : (body.orderId ? [body.orderId] : [])

  if (!rawOrderIds.length || !paymentMethod) {
    throw createError({ statusCode: 400, statusMessage: 'orderIds dan paymentMethod wajib diisi' })
  }
  // Kode metode Duitku berupa 2–4 huruf/angka (mis. BC, M2, SP, OV) atau "FT" (transfer manual);
  // nilai lain diteruskan mentah ke gateway, jadi format dibatasi di sini.
  if (typeof paymentMethod !== 'string' || !/^[A-Za-z0-9]{2,10}$/.test(paymentMethod)) {
    throw createError({ statusCode: 400, statusMessage: 'paymentMethod tidak valid' })
  }
  if (rawOrderIds.length > 50 || rawOrderIds.some(id => typeof id !== 'string' || !id)) {
    throw createError({ statusCode: 400, statusMessage: 'orderIds tidak valid' })
  }
  const orderIds = [...new Set(rawOrderIds as string[])]

  const buyerId = await getBuyerId(event)

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
  // Potongan voucher (tersimpan di order pertama tiap toko oleh checkout) harus ikut mengurangi tagihan;
  // sebelumnya diabaikan sehingga pembeli membayar harga penuh meski voucher sudah "terpakai".
  const totalAmount = orders.reduce(
    (sum, o) => sum + Number(o.product.price) * o.qty + (o.shippingCost || 0) - (o.discountAmount || 0),
    0
  )
  if (!(totalAmount > 0)) {
    throw createError({ statusCode: 400, statusMessage: 'Total pembayaran tidak valid' })
  }

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
    return { paymentUrl: null, merchantOrderId, paymentMethod: 'FT' }
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
      qrString: duitkuRes.qrString || null,
      status: 'pending',
      expiredAt
    }))
  })

  return {
    paymentUrl: duitkuRes.paymentUrl,
    vaNumber: duitkuRes.vaNumber || null,
    qrString: duitkuRes.qrString || null,
    merchantOrderId,
    paymentMethod,
    amount: totalAmount,
    expiredAt
  }
})
