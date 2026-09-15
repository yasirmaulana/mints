export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const formData = await readMultipartFormData(event)
  if (!formData) throw createError({ statusCode: 400, statusMessage: 'Form data kosong' })

  const fields: Record<string, string> = {}
  let imageUrl = ''
  const extraImages: string[] = []

  for (const part of formData) {
    if (part.name === 'image' && part.filename) {
      imageUrl = await uploadToS3(part.data, part.filename, part.type || 'image/jpeg')
    } else if (part.name === 'images' && part.filename) {
      const url = await uploadToS3(part.data, part.filename, part.type || 'image/jpeg')
      extraImages.push(url)
    } else if (part.name) {
      fields[part.name] = part.data.toString()
    }
  }

  if (!fields.title || !fields.price) {
    throw createError({ statusCode: 400, statusMessage: 'title dan price wajib diisi' })
  }

  const sessionId = fields.sessionId && fields.sessionId !== '' ? fields.sessionId : null
  const categoryId = fields.categoryId && fields.categoryId !== '' ? fields.categoryId : null
  const description = fields.description || null
  const weight = fields.weight ? parseInt(fields.weight) : null
  const material = fields.material || null
  const productType = (fields.productType as 'REGULAR' | 'PRE_ORDER') || 'REGULAR'
  const estimatedReadyDate = fields.estimatedReadyDate ? new Date(fields.estimatedReadyDate) : null

  // Parse variants: JSON array [{size, stock}]
  let variants: { size: string; stock: number }[] = []
  if (fields.variants) {
    try { variants = JSON.parse(fields.variants) } catch {}
  }

  const sharedData = {
    title: fields.title,
    price: parseFloat(fields.price),
    description,
    sessionId,
    categoryId,
    weight,
    material,
    productType,
    estimatedReadyDate
  }

  if (fields.id) {
    const existing = await prisma.product.findUnique({ where: { id: fields.id }, select: { images: true } })
    const updated = await prisma.product.update({
      where: { id: fields.id },
      data: {
        ...sharedData,
        ...(imageUrl && { imageUrl }),
        images: extraImages.length > 0 ? [...(existing?.images ?? []), ...extraImages] : undefined
      }
    })

    if (variants.length > 0) {
      await prisma.productVariant.deleteMany({ where: { productId: fields.id } })
      await prisma.productVariant.createMany({
        data: variants.map(v => ({ productId: fields.id!, size: v.size, stock: v.stock }))
      })
    }

    return updated
  }

  if (!imageUrl) throw createError({ statusCode: 400, statusMessage: 'Foto produk wajib diupload' })

  const product = await prisma.product.create({
    data: {
      ...sharedData,
      imageUrl,
      images: extraImages,
      status: 'AVAILABLE'
    }
  })

  if (variants.length > 0) {
    await prisma.productVariant.createMany({
      data: variants.map(v => ({ productId: product.id, size: v.size, stock: v.stock }))
    })
  }

  return product
})
