// Edit produk milik toko. Foto baru menambah ke storage (bukan mengganti kuota lama).
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const pid = getRouterParam(event, 'pid')!
  const ctx = await getStoreContext(event, id)

  const existing = await prisma.product.findUnique({ where: { id: pid } })
  if (!existing || existing.storeId !== ctx.store.id) {
    throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan' })
  }

  const formData = await readMultipartFormData(event)
  const fields: Record<string, string> = {}
  const imageParts: { data: Buffer; filename: string; type: string }[] = []

  if (formData) {
    for (const part of formData) {
      if (part.name === 'images' && part.filename) {
        imageParts.push({ data: part.data, filename: part.filename, type: part.type || 'image/jpeg' })
      } else if (part.name) {
        fields[part.name] = part.data.toString()
      }
    }
  }

  if (imageParts.length) {
    assertMediaAllowed(
      ctx,
      imageParts.map(p => ({ kind: 'IMAGE' as const, sizeKb: p.data.length / 1024 })),
      { images: 1 + existing.images.length, videos: 0 }
    )
  }

  const data: Record<string, any> = {}
  if (fields.title !== undefined) data.title = fields.title
  if (fields.price !== undefined) data.price = parseFloat(fields.price)
  if (fields.originalPrice !== undefined) data.originalPrice = fields.originalPrice ? parseFloat(fields.originalPrice) : null
  if (fields.description !== undefined) data.description = fields.description || null
  if (fields.categoryId !== undefined) data.categoryId = fields.categoryId || null
  if (fields.weight !== undefined) data.weight = fields.weight ? parseInt(fields.weight) : null
  if (fields.material !== undefined) data.material = fields.material || null
  if (fields.status !== undefined) data.status = fields.status

  let variants: { size: string; stock: number }[] | null = null
  if (fields.variants) {
    try { variants = JSON.parse(fields.variants) } catch {}
    if (variants) assertVariantCount(ctx, variants.length)
  }

  const uploadedUrls: string[] = []
  for (const part of imageParts) {
    uploadedUrls.push(await uploadToS3(part.data, part.filename, part.type))
  }
  const addedSizeKb = Math.round(imageParts.reduce((sum, p) => sum + p.data.length, 0) / 1024)

  const product = await prisma.$transaction(async (tx) => {
    const updated = await tx.product.update({
      where: { id: pid },
      data: {
        ...data,
        images: uploadedUrls.length ? [...existing.images, ...uploadedUrls] : undefined
      }
    })

    if (variants) {
      await tx.productVariant.deleteMany({ where: { productId: pid } })
      await tx.productVariant.createMany({
        data: variants.map(v => ({ productId: pid, size: v.size, stock: v.stock }))
      })
    }

    if (addedSizeKb > 0) {
      await tx.store.update({ where: { id: ctx.store.id }, data: { storageUsedKb: { increment: addedSizeKb } } })
    }

    return updated
  })

  return product
})
