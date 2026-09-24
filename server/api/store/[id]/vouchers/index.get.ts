// Daftar voucher milik toko.
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ctx = await getStoreContext(event, id, { requireActive: false })

  return prisma.voucher.findMany({
    where: { storeId: ctx.store.id },
    orderBy: { createdAt: 'desc' }
  })
})
