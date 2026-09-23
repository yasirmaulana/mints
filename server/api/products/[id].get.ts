export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      variants: { orderBy: { size: 'asc' } },
      store: { select: { id: true, name: true, status: true, cityId: true, cityName: true } }
    }
  })

  // Toko non-ACTIVE dianggap tidak ada bagi pembeli — sama seperti aturan halaman toko (§6.4).
  if (!product || product.store?.status !== 'ACTIVE') {
    throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan' })
  }
  const { store, ...result } = product

  return { ...result, store: { id: store.id, name: store.name, cityId: store.cityId, cityName: store.cityName } }
})
