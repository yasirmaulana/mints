// Ubah status pesanan milik toko — subset dari status yang boleh diubah penjual sendiri.
// Pembatalan/refund tetap lewat admin (di luar cakupan Fase 2 seller-facing).
const SELLER_ALLOWED = ['IN_PRODUCTION', 'READY_TO_SHIP', 'DELIVERED']

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const oid = getRouterParam(event, 'oid')!
  const ctx = await getStoreContext(event, id)

  const order = await prisma.order.findUnique({ where: { id: oid } })
  if (!order || order.storeId !== ctx.store.id) {
    throw createError({ statusCode: 404, statusMessage: 'Pesanan tidak ditemukan' })
  }

  const body = await readBody(event)
  const status = String(body?.status || '')
  if (!SELLER_ALLOWED.includes(status)) {
    throw createError({ statusCode: 400, statusMessage: `Status harus salah satu dari: ${SELLER_ALLOWED.join(', ')}` })
  }

  return prisma.order.update({ where: { id: oid }, data: { status } })
})
