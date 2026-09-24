// Edit voucher milik toko (termasuk toggle aktif/nonaktif).
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const voucherId = getRouterParam(event, 'voucherId')!
  const ctx = await getStoreContext(event, id, { requireActive: false })

  const existing = await prisma.voucher.findUnique({ where: { id: voucherId } })
  if (!existing || existing.storeId !== ctx.store.id) {
    throw createError({ statusCode: 404, statusMessage: 'Voucher tidak ditemukan' })
  }

  const body = await readBody(event)
  const data: Record<string, any> = {}
  if (body.discountAmount !== undefined) data.discountAmount = parseInt(body.discountAmount)
  if (body.minPurchase !== undefined) data.minPurchase = parseInt(body.minPurchase)
  if (body.quota !== undefined) data.quota = body.quota ? parseInt(body.quota) : null
  if (body.isActive !== undefined) data.isActive = !!body.isActive
  if (body.expiresAt !== undefined) data.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null

  return prisma.voucher.update({ where: { id: voucherId }, data })
})
