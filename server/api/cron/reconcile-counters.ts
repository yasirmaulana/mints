// Cron rekonsiliasi counter terdenormalisasi Store.productCount/storageUsedKb — PRD §11 Fase 6.
// Counter ini dijaga incremental di setiap endpoint (lihat server/utils/plan-limits.ts), tapi bisa
// meleset akibat request gagal di tengah jalan / migrasi manual — cron ini menghitung ulang dari
// sumber kebenaran (Product, StoreMedia) dan memperbaiki toko yang menyimpang.
// Dipicu Vercel Cron dengan header Authorization: Bearer <CRON_SECRET>.
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const auth = getHeader(event, 'authorization')
  if (!config.cronSecret || auth !== `Bearer ${config.cronSecret}`) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const stores = await prisma.store.findMany({ select: { id: true, productCount: true, storageUsedKb: true } })

  let fixed = 0
  for (const store of stores) {
    const [productCount, storageAgg] = await Promise.all([
      prisma.product.count({ where: { storeId: store.id } }),
      prisma.storeMedia.aggregate({ where: { storeId: store.id }, _sum: { sizeKb: true } })
    ])
    const storageUsedKb = storageAgg._sum.sizeKb ?? 0

    if (productCount !== store.productCount || storageUsedKb !== store.storageUsedKb) {
      await prisma.store.update({ where: { id: store.id }, data: { productCount, storageUsedKb } })
      fixed++
    }
  }

  return { checked: stores.length, fixed }
})
