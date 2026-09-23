// Hapus media (video) — menghapus objek S3 dan mengembalikan kuota storage. PRD §8.1.
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const mid = getRouterParam(event, 'mid')!
  const ctx = await getStoreContext(event, id, { requireActive: false })

  const media = await prisma.storeMedia.findUnique({ where: { id: mid } })
  if (!media || media.storeId !== ctx.store.id) {
    throw createError({ statusCode: 404, statusMessage: 'Media tidak ditemukan' })
  }

  await prisma.$transaction(async (tx) => {
    await tx.storeMedia.delete({ where: { id: mid } })
    if (media.productId) {
      await tx.product.updateMany({ where: { id: media.productId, videoUrl: media.url }, data: { videoUrl: null } })
    }
    await tx.store.update({ where: { id: ctx.store.id }, data: { storageUsedKb: { decrement: media.sizeKb } } })
  })

  await deleteS3Object(media.s3Key)

  return { success: true }
})
