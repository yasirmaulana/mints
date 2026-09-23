// Hapus produk milik toko — mengembalikan kuota productCount & storageUsedKb, dan menghapus
// objek S3 (foto + video) terkait. PRD §7.1 "penghapusan objek S3 saat produk/media dihapus".
const S3_PROXY_PREFIX = '/api/s3-image/'

function keyFromProxyUrl(url: string): string | null {
  return url.startsWith(S3_PROXY_PREFIX) ? url.slice(S3_PROXY_PREFIX.length) : null
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const pid = getRouterParam(event, 'pid')!
  const ctx = await getStoreContext(event, id, { requireActive: false })

  const existing = await prisma.product.findUnique({ where: { id: pid } })
  if (!existing || existing.storeId !== ctx.store.id) {
    throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan' })
  }

  const videoMedia = await prisma.storeMedia.findMany({ where: { productId: pid } })

  const imageKeys = [existing.imageUrl, ...existing.images].map(keyFromProxyUrl).filter((k): k is string => !!k)
  const imageSizes = await Promise.all(imageKeys.map(k => headS3Object(k)))
  const imageSizeKb = imageSizes.reduce((sum, h) => sum + Math.ceil(h.sizeBytes / 1024), 0)
  const videoSizeKb = videoMedia.reduce((sum, m) => sum + m.sizeKb, 0)
  const totalSizeKb = imageSizeKb + videoSizeKb

  await prisma.$transaction(async (tx) => {
    await tx.product.delete({ where: { id: pid } }) // cascade: ProductVariant, StoreMedia
    await tx.store.update({
      where: { id: ctx.store.id },
      data: {
        productCount: { decrement: 1 },
        storageUsedKb: { decrement: totalSizeKb }
      }
    })
  })

  await Promise.all([
    ...imageKeys.map(k => deleteS3Object(k)),
    ...videoMedia.map(m => deleteS3Object(m.s3Key))
  ])

  return { success: true }
})
