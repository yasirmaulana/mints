// Konfirmasi upload video selesai — verifikasi ulang lewat HeadObject (ukuran browser tidak dipercaya),
// baru catat StoreMedia & perbarui counter storage. PRD §7.1.
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ctx = await getStoreContext(event, id)

  const body = await readBody(event)
  const s3Key = String(body?.s3Key || '')
  const productId = String(body?.productId || '')
  const durationSec = body?.durationSec ? Number(body.durationSec) : null

  if (!s3Key || !productId) {
    throw createError({ statusCode: 400, statusMessage: 's3Key dan productId wajib diisi' })
  }
  if (!s3Key.startsWith(`stores/${ctx.store.id}/`)) {
    throw createError({ statusCode: 403, statusMessage: 'Kunci S3 tidak valid untuk toko ini' })
  }

  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product || product.storeId !== ctx.store.id) {
    throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan' })
  }

  const head = await headS3Object(s3Key)
  if (!head.exists) {
    throw createError({ statusCode: 400, statusMessage: 'Objek tidak ditemukan di S3 — upload mungkin belum selesai' })
  }

  const sizeKb = Math.ceil(head.sizeBytes / 1024)
  const plan = ctx.store.plan
  if (plan.maxVideoSizeMb !== null && sizeKb > plan.maxVideoSizeMb * 1024) {
    await deleteS3Object(s3Key)
    throw createError({ statusCode: 400, statusMessage: `Ukuran video melebihi batas paket ${plan.name} (maks. ${plan.maxVideoSizeMb} MB)` })
  }
  if (plan.maxVideoDurationSec !== null && durationSec !== null && durationSec > plan.maxVideoDurationSec) {
    await deleteS3Object(s3Key)
    throw createError({ statusCode: 400, statusMessage: `Durasi video melebihi batas paket ${plan.name} (maks. ${plan.maxVideoDurationSec} detik)` })
  }
  if (plan.maxStorageMb !== null && ctx.store.storageUsedKb + sizeKb > plan.maxStorageMb * 1024) {
    await deleteS3Object(s3Key)
    throw createError({ statusCode: 403, statusMessage: 'Kuota penyimpanan toko tidak cukup' })
  }

  const url = `/api/s3-image/${s3Key}`

  const media = await prisma.$transaction(async (tx) => {
    const created = await tx.storeMedia.create({
      data: {
        storeId: ctx.store.id,
        productId,
        kind: 'VIDEO',
        s3Key,
        url,
        sizeKb,
        durationSec,
        mimeType: head.contentType || 'video/mp4'
      }
    })
    await tx.product.update({ where: { id: productId }, data: { videoUrl: url } })
    await tx.store.update({ where: { id: ctx.store.id }, data: { storageUsedKb: { increment: sizeKb } } })
    return created
  })

  return media
})
