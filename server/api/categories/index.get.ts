// Pohon kategori publik: induk + subkategori. _count.products di induk = gabungan semua anaknya.
export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 's-maxage=300, stale-while-revalidate=600')
  const active = { store: { status: 'ACTIVE' as const } }
  const recentImage = { where: active, orderBy: { createdAt: 'desc' as const }, take: 1, select: { imageUrl: true } }
  const count = { select: { products: { where: active } } }

  const parents = await prisma.category.findMany({
    where: { parentId: null },
    include: {
      _count: count,
      products: recentImage,
      children: {
        orderBy: { name: 'asc' },
        include: { _count: count, products: recentImage }
      }
    }
  })

  return parents
    .map(({ products, children, _count, ...p }) => ({
      ...p,
      // gambar ikon: produk terbaru di induk, atau di salah satu anaknya
      imageUrl: products[0]?.imageUrl ?? children.find(c => c.products[0])?.products[0]?.imageUrl ?? null,
      children: children.map(({ products: _p, ...c }) => c),
      _count: { products: _count.products + children.reduce((n, c) => n + c._count.products, 0) }
    }))
    .sort((a, b) => b._count.products - a._count.products || a.name.localeCompare(b.name))
})
