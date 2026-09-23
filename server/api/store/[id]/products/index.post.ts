// Tambah produk ke toko — menegakkan kuota paket (jumlah produk, jumlah foto, ukuran file, storage).
// PRD §6.2, §7.1. Video belum didukung di sini — upload video butuh presigned S3 URL (Fase 3).
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ctx = await getStoreContext(event, id)

  assertCanAddProduct(ctx)

  const formData = await readMultipartFormData(event)
  if (!formData) throw createError({ statusCode: 400, statusMessage: 'Form data kosong' })

  const fields: Record<string, string> = {}
  const imageParts: { data: Buffer; filename: string; type: string }[] = []

  for (const part of formData) {
    if (part.name === 'images' && part.filename) {
      imageParts.push({ data: part.data, filename: part.filename, type: part.type || 'image/jpeg' })
    } else if (part.name) {
      fields[part.name] = part.data.toString()
    }
  }

  const title = fields.title
  const price = fields.price
  if (!title || !price) {
    throw createError({ statusCode: 400, statusMessage: 'title dan price wajib diisi' })
  }
  if (!imageParts.length) {
    throw createError({ statusCode: 400, statusMessage: 'Minimal satu foto produk wajib diupload' })
  }

  assertMediaAllowed(
    ctx,
    imageParts.map(p => ({ kind: 'IMAGE' as const, sizeKb: p.data.length / 1024 })),
    { images: 0, videos: 0 }
  )

  let variants: { size: string; stock: number }[] = []
  if (fields.variants) {
    try { variants = JSON.parse(fields.variants) } catch {}
  }
  if (variants.length) assertVariantCount(ctx, variants.length)

  const uploadedUrls: string[] = []
  for (const part of imageParts) {
    uploadedUrls.push(await uploadToS3(part.data, part.filename, part.type))
  }
  const totalSizeKb = Math.round(imageParts.reduce((sum, p) => sum + p.data.length, 0) / 1024)

  const product = await prisma.$transaction(async (tx) => {
    const created = await tx.product.create({
      data: {
        storeId: ctx.store.id,
        title,
        price: parseFloat(price),
        originalPrice: fields.originalPrice ? parseFloat(fields.originalPrice) : null,
        description: fields.description || null,
        categoryId: fields.categoryId || null,
        weight: fields.weight ? parseInt(fields.weight) : null,
        material: fields.material || null,
        productType: (fields.productType as 'REGULAR' | 'PRE_ORDER') || 'REGULAR',
        estimatedReadyDate: fields.estimatedReadyDate ? new Date(fields.estimatedReadyDate) : null,
        imageUrl: uploadedUrls[0],
        images: uploadedUrls.slice(1)
      }
    })

    if (variants.length) {
      await tx.productVariant.createMany({
        data: variants.map(v => ({ productId: created.id, size: v.size, stock: v.stock }))
      })
    }

    await tx.store.update({
      where: { id: ctx.store.id },
      data: {
        productCount: { increment: 1 },
        storageUsedKb: { increment: totalSizeKb }
      }
    })

    return created
  })

  return product
})
