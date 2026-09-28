// Cron harian: batalkan order yang tidak dibayar dan kembalikan stok/kuota voucher-nya.
// Tanpa ini, checkout yang tidak dibayar menahan stok selamanya (bisa dipakai untuk menguras stok toko).
// Dipicu Vercel Cron (lihat vercel.json) dengan header Authorization: Bearer <CRON_SECRET>.
const MIN_AGE_MS = 26 * 60 * 60 * 1000       // Payment Duitku kedaluwarsa 24 jam; +2 jam sebagai jeda callback terlambat
const PAYMENT_EXPIRY_GRACE_MS = 60 * 60 * 1000
const BATCH_SIZE = 500

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  if (!config.cronSecret || !safeEqual(getHeader(event, 'authorization'), `Bearer ${config.cronSecret}`)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const now = Date.now()
  const candidates = await prisma.order.findMany({
    where: {
      status: 'PENDING_PAYMENT',
      source: { not: 'OFFLINE' }, // order offline dikelola admin
      createdAt: { lt: new Date(now - MIN_AGE_MS) }
    },
    select: { id: true, payment: { select: { status: true, paymentMethod: true, expiredAt: true } } },
    orderBy: { createdAt: 'asc' },
    take: BATCH_SIZE
  })

  let cancelled = 0
  let skipped = 0
  for (const { id, payment } of candidates) {
    // Transfer manual (FT): pembeli mungkin sudah transfer dan menunggu konfirmasi admin — jangan dibatalkan otomatis.
    // Pembayaran yang sudah lunas, atau belum lewat masa berlaku gateway, juga dilewati.
    if (payment && (
      payment.paymentMethod === 'FT' ||
      payment.status === 'paid' ||
      (payment.expiredAt && payment.expiredAt.getTime() > now - PAYMENT_EXPIRY_GRACE_MS)
    )) {
      skipped++
      continue
    }

    const done = await prisma.$transaction(async (tx) => {
      const ok = await cancelPendingOrder(tx, id)
      if (ok) await tx.payment.updateMany({ where: { orderId: id, status: 'pending' }, data: { status: 'expired' } })
      return ok
    })
    if (done) cancelled++
  }

  return { cancelled, skipped, scanned: candidates.length }
})
