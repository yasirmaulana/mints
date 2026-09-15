export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const id = getRouterParam(event, 'id')!
  const body = await readBody(event) ?? {}
  // body.variants: [{ size: string, stock: number }]
  const variants: { size: string; stock: number }[] = body.variants ?? []

  if (!Array.isArray(variants) || variants.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'variants wajib diisi' })
  }

  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan' })

  // Upsert each variant's stock (requires @@unique([productId, size]) on ProductVariant)
  await Promise.all(variants.map(v =>
    prisma.productVariant.upsert({
      where: { productId_size: { productId: id, size: v.size } },
      create: { productId: id, size: v.size, stock: Math.max(0, v.stock) },
      update: { stock: Math.max(0, v.stock) }
    })
  ))

  // Auto-update product status based on total stock
  const allVariants = await prisma.productVariant.findMany({ where: { productId: id } })
  const totalStock = allVariants.reduce((s, v) => s + v.stock, 0)
  await prisma.product.update({
    where: { id },
    data: { status: totalStock > 0 ? 'AVAILABLE' : 'SOLD_OUT' }
  })

  return { success: true, totalStock }
})
