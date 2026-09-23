// Kategori yang benar-benar dipakai produk toko ini — untuk sidebar filter halaman toko publik.
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!

  const store = await prisma.store.findUnique({ where: { slug }, select: { id: true, status: true } })
  if (!store || store.status !== 'ACTIVE') {
    throw createError({ statusCode: 404, statusMessage: 'Toko tidak ditemukan' })
  }

  const categories = await prisma.category.findMany({
    where: { products: { some: { storeId: store.id } } },
    orderBy: { name: 'asc' }
  })

  setResponseHeader(event, 'Cache-Control', 's-maxage=60, stale-while-revalidate=300')
  return categories
})
