export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      variants: { orderBy: { size: 'asc' } }
    }
  })

  if (!product) throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan' })

  return product
})
