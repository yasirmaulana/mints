// Polling status pembayaran dari halaman /account/pembayaran (tanpa redirect balik dari Duitku).
export default defineEventHandler(async (event) => {
  const merchantOrderId = getQuery(event).merchantOrderId as string
  if (!merchantOrderId) throw createError({ statusCode: 400, statusMessage: 'merchantOrderId wajib diisi' })

  const payment = await prisma.payment.findFirst({ where: { duitkuReference: merchantOrderId } })
  if (!payment) throw createError({ statusCode: 404, statusMessage: 'Pembayaran tidak ditemukan' })

  return { status: payment.status, paidAt: payment.paidAt }
})
