// Terbitkan presigned PUT URL untuk upload video — PRD §7.1, §8.1.
// Server hanya memvalidasi kuota & tipe di sini; ukuran final diverifikasi ulang saat confirm.
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ctx = await getStoreContext(event, id)

  const body = await readBody(event)
  const productId = String(body?.productId || '')
  const mimeType = String(body?.mimeType || '')
  const estimatedSizeKb = Number(body?.estimatedSizeKb || 0)
  const durationSec = body?.durationSec ? Number(body.durationSec) : undefined

  if (!productId || !mimeType) {
    throw createError({ statusCode: 400, statusMessage: 'productId dan mimeType wajib diisi' })
  }

  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product || product.storeId !== ctx.store.id) {
    throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan' })
  }

  const existingVideos = await prisma.storeMedia.count({ where: { productId, kind: 'VIDEO' } })

  // Cek kuota lebih dulu (tipe, jumlah, ukuran perkiraan, durasi, storage) sebelum menerbitkan URL.
  assertMediaAllowed(
    ctx,
    [{ kind: 'VIDEO', sizeKb: estimatedSizeKb, durationSec }],
    { images: 0, videos: existingVideos }
  )

  const { uploadUrl, s3Key, expiresIn } = await presignVideoUpload(ctx.store.id, productId, mimeType)

  return { uploadUrl, s3Key, expiresIn, productId, mimeType }
})
