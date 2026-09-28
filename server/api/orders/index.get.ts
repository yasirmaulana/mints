// Daftar pesanan reguler.
// - Pembeli login: semua pesanan milik akunnya (nomor HP/kode tidak diperlukan).
// - Tamu: harus membuktikan kepemilikan dengan nomor HP DAN kode pesanan (8 karakter pertama
//   ID order, tampil sebagai "#ABCD1234" di notifikasi WA/halaman pembayaran). Nomor HP saja
//   tidak cukup — mudah ditebak, sehingga siapa pun bisa membaca nama/alamat/pesanan orang lain.
export default defineEventHandler(async (event) => {
  const { phone, code } = getQuery(event)

  const include = {
    product: { select: { id: true, title: true, imageUrl: true } },
    payment: { select: { status: true, paymentUrl: true, paidAt: true } },
    shipment: { select: { courier: true, trackingNo: true, status: true } }
  }

  const buyerId = await getBuyerId(event)
  if (buyerId) {
    const buyer = await prisma.buyer.findUnique({ where: { id: buyerId }, select: { id: true } })
    if (buyer) {
      return prisma.order.findMany({
        where: { source: 'REGULAR', buyerId: buyer.id },
        include,
        orderBy: { createdAt: 'desc' }
      })
    }
  }

  const ip = getHeader(event, 'x-forwarded-for')?.split(',')[0].trim() ?? getRequestIP(event) ?? 'unknown'
  await checkRateLimit(`orders-lookup:${ip}`, 20, 15 * 60 * 1000)

  if (!phone || !code) {
    throw createError({ statusCode: 400, statusMessage: 'Nomor HP dan kode pesanan wajib diisi' })
  }

  const phoneStr = String(phone).replace(/\s/g, '')
  if (!/^(08|628|\+628)\d{7,12}$/.test(phoneStr)) {
    throw createError({ statusCode: 400, statusMessage: 'Format nomor HP tidak valid' })
  }
  const codeStr = String(code).replace(/^#/, '').trim().toLowerCase()
  if (!/^[0-9a-f]{8}$/.test(codeStr)) {
    throw createError({ statusCode: 400, statusMessage: 'Kode pesanan tidak valid (8 karakter, contoh: ABCD1234)' })
  }
  // Batas per nomor HP: menahan tebakan kode dari banyak IP ke satu nomor.
  await checkRateLimit(`orders-lookup-phone:${phoneStr}`, 10, 15 * 60 * 1000)

  return prisma.order.findMany({
    where: { source: 'REGULAR', buyerPhone: phoneStr, id: { startsWith: codeStr } },
    include,
    orderBy: { createdAt: 'desc' }
  })
})
