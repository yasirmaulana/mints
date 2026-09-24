// Hapus voucher milik toko.
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const voucherId = getRouterParam(event, 'voucherId')!
  const ctx = await getStoreContext(event, id, { requireActive: false })

  const existing = await prisma.voucher.findUnique({ where: { id: voucherId } })
  if (!existing || existing.storeId !== ctx.store.id) {
    throw createError({ statusCode: 404, statusMessage: 'Voucher tidak ditemukan' })
  }

  await prisma.voucher.delete({ where: { id: voucherId } })
  return { success: true }
})
