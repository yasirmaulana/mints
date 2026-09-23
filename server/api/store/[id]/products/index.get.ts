// Daftar produk milik toko (dashboard penjual) — PRD §6.2.
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ctx = await getStoreContext(event, id, { requireActive: false })

  const products = await prisma.product.findMany({
    where: { storeId: ctx.store.id },
    include: { variants: true },
    orderBy: { createdAt: 'desc' }
  })

  return products
})
