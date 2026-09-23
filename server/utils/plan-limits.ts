// Satu sumber kebenaran untuk seluruh pengecekan batasan paket toko.
// PRD_Multi_Toko_Langganan.md §7.1 — tidak ada endpoint yang boleh membaca
// angka batasan langsung dari Plan atau dari konstanta di luar modul ini.

export interface StoreContext {
  store: NonNullable<Awaited<ReturnType<typeof loadStoreWithPlan>>>
}

async function loadStoreWithPlan(storeId: string) {
  return prisma.store.findUnique({
    where: { id: storeId },
    include: { plan: true }
  })
}

/**
 * Memuat toko + paketnya, memastikan pemanggil adalah pemiliknya,
 * dan (kecuali diminta lain) menolak toko yang bukan ACTIVE.
 */
export async function getStoreContext(
  event: any,
  storeId: string,
  opts: { requireActive?: boolean } = { requireActive: true }
): Promise<StoreContext> {
  const buyer = await requireBuyerSession(event)

  const store = await loadStoreWithPlan(storeId)
  if (!store) {
    throw createError({ statusCode: 404, statusMessage: 'Toko tidak ditemukan' })
  }
  if (store.ownerId !== buyer.id) {
    // 404, bukan 403 — jangan konfirmasi ke pemanggil bahwa toko ini ada tapi bukan miliknya
    throw createError({ statusCode: 404, statusMessage: 'Toko tidak ditemukan' })
  }
  if (opts.requireActive !== false && store.status !== 'ACTIVE') {
    throw createError({ statusCode: 403, statusMessage: `Toko berstatus ${store.status} — tidak dapat melakukan aksi ini` })
  }

  return { store: store as StoreContext['store'] }
}

/** Cek batas jumlah toko yang boleh dimiliki satu buyer, berdasarkan paket yang ia pilih. */
export async function assertCanCreateStore(buyerId: string, planId: string) {
  const plan = await prisma.plan.findUnique({ where: { id: planId } })
  if (!plan || !plan.isActive) {
    throw createError({ statusCode: 400, statusMessage: 'Paket tidak valid' })
  }

  if (plan.maxStores !== null) {
    // Toko ARCHIVED tidak dihitung — sudah keluar dari siklus hidup aktif.
    const count = await prisma.store.count({
      where: { ownerId: buyerId, status: { not: 'ARCHIVED' } }
    })
    if (count >= plan.maxStores) {
      throw createError({
        statusCode: 403,
        statusMessage: `Paket ${plan.name} membatasi maksimal ${plan.maxStores} toko. Upgrade paket untuk membuka toko baru.`
      })
    }
  }

  return plan
}

/** Cek batas jumlah produk per toko sebelum menambah produk baru. */
export function assertCanAddProduct(ctx: StoreContext) {
  const { store } = ctx
  const max = store.plan.maxProducts
  if (max !== null && store.productCount >= max) {
    throw createError({
      statusCode: 403,
      statusMessage: `Paket ${store.plan.name} membatasi maksimal ${max} produk. Upgrade paket atau hapus produk lain.`
    })
  }
}

/** Cek batas varian ukuran per produk. */
export function assertVariantCount(ctx: StoreContext, variantCount: number) {
  const max = ctx.store.plan.maxVariantsPerProduct
  if (max !== null && variantCount > max) {
    throw createError({
      statusCode: 403,
      statusMessage: `Paket ${ctx.store.plan.name} membatasi maksimal ${max} varian ukuran per produk.`
    })
  }
}

interface MediaFileCheck {
  kind: 'IMAGE' | 'VIDEO'
  sizeKb: number
  durationSec?: number
}

/**
 * Cek batasan media untuk SATU PRODUK: jumlah foto, jumlah video, ukuran per file,
 * durasi video, dan sisa kuota storage toko. Panggil sebelum menyimpan file —
 * tidak menulis apa pun, hanya melempar error bila batas terlampaui.
 *
 * `existingImages`/`existingVideos` = jumlah media sejenis yang SUDAH ada di produk ini
 * (dipakai saat menambah foto ke produk yang sudah punya sebagian).
 */
export function assertMediaAllowed(
  ctx: StoreContext,
  files: MediaFileCheck[],
  existing: { images: number; videos: number } = { images: 0, videos: 0 }
) {
  const { plan } = ctx.store

  const newImages = files.filter(f => f.kind === 'IMAGE').length
  const newVideos = files.filter(f => f.kind === 'VIDEO').length

  if (plan.maxImagesPerProduct !== null && existing.images + newImages > plan.maxImagesPerProduct) {
    throw createError({
      statusCode: 403,
      statusMessage: `Paket ${plan.name} membatasi maksimal ${plan.maxImagesPerProduct} foto per produk.`
    })
  }
  if (plan.maxVideosPerProduct !== null && existing.videos + newVideos > plan.maxVideosPerProduct) {
    throw createError({
      statusCode: 403,
      statusMessage: `Paket ${plan.name} membatasi maksimal ${plan.maxVideosPerProduct} video per produk.`
    })
  }

  for (const file of files) {
    if (file.kind === 'IMAGE' && plan.maxImageSizeMb !== null && file.sizeKb > plan.maxImageSizeMb * 1024) {
      throw createError({
        statusCode: 400,
        statusMessage: `Ukuran foto melebihi batas paket ${plan.name} (maks. ${plan.maxImageSizeMb} MB).`
      })
    }
    if (file.kind === 'VIDEO') {
      if (plan.maxVideoSizeMb !== null && file.sizeKb > plan.maxVideoSizeMb * 1024) {
        throw createError({
          statusCode: 400,
          statusMessage: `Ukuran video melebihi batas paket ${plan.name} (maks. ${plan.maxVideoSizeMb} MB).`
        })
      }
      if (plan.maxVideoDurationSec !== null && (file.durationSec ?? 0) > plan.maxVideoDurationSec) {
        throw createError({
          statusCode: 400,
          statusMessage: `Durasi video melebihi batas paket ${plan.name} (maks. ${plan.maxVideoDurationSec} detik).`
        })
      }
    }
  }

  if (plan.maxStorageMb !== null) {
    const totalNewKb = files.reduce((sum, f) => sum + f.sizeKb, 0)
    const limitKb = plan.maxStorageMb * 1024
    if (ctx.store.storageUsedKb + totalNewKb > limitKb) {
      const remainingMb = Math.max(0, ((limitKb - ctx.store.storageUsedKb) / 1024)).toFixed(1)
      throw createError({
        statusCode: 403,
        statusMessage: `Kuota penyimpanan toko tidak cukup. Sisa: ${remainingMb} MB dari ${plan.maxStorageMb} MB.`
      })
    }
  }
}

/** Cek batas jumlah sesi flash sale aktif milik toko. */
export async function assertCanCreateFlashSale(ctx: StoreContext) {
  const max = ctx.store.plan.maxFlashSaleSessions
  if (max === 0) {
    throw createError({ statusCode: 403, statusMessage: `Paket ${ctx.store.plan.name} tidak termasuk fitur flash sale. Upgrade untuk mengaktifkannya.` })
  }
  if (max !== null) {
    const activeCount = await prisma.flashSaleConfig.count({
      where: { storeId: ctx.store.id, isActive: true }
    })
    if (activeCount >= max) {
      throw createError({
        statusCode: 403,
        statusMessage: `Paket ${ctx.store.plan.name} membatasi maksimal ${max} sesi flash sale aktif.`
      })
    }
  }
}

/**
 * Cek apakah penggunaan toko saat ini muat dalam batas paket TUJUAN, dipanggil sebelum
 * mengizinkan downgrade/ganti paket — PRD §6.3: downgrade ditolak bila penggunaan saat ini
 * melebihi batas paket tujuan, bukan menghapus data pengguna secara otomatis.
 */
export function assertPlanChangeAllowed(ctx: StoreContext, targetPlan: { name: string; maxProducts: number | null; maxStorageMb: number | null }) {
  const { store } = ctx
  if (targetPlan.maxProducts !== null && store.productCount > targetPlan.maxProducts) {
    throw createError({
      statusCode: 403,
      statusMessage: `Paket ${targetPlan.name} membatasi maksimal ${targetPlan.maxProducts} produk. Hapus produk hingga di bawah batas sebelum pindah ke paket ini.`
    })
  }
  if (targetPlan.maxStorageMb !== null && store.storageUsedKb > targetPlan.maxStorageMb * 1024) {
    throw createError({
      statusCode: 403,
      statusMessage: `Paket ${targetPlan.name} membatasi penyimpanan maksimal ${targetPlan.maxStorageMb} MB. Hapus media hingga di bawah batas sebelum pindah ke paket ini.`
    })
  }
}

/** Ringkasan kuota untuk ditampilkan di dashboard penjual. */
export function buildQuotaSummary(ctx: StoreContext) {
  const { store } = ctx
  const { plan } = store
  const daysLeft = Math.ceil((store.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return {
    id: store.id,
    name: store.name,
    slug: store.slug,
    plan: { tier: plan.tier, name: plan.name, maxStores: plan.maxStores },
    status: store.status,
    expiresAt: store.expiresAt,
    daysLeft,
    products: { used: store.productCount, max: plan.maxProducts },
    storageMb: { used: Math.round(store.storageUsedKb / 1024 * 10) / 10, max: plan.maxStorageMb },
    limits: {
      maxImagesPerProduct: plan.maxImagesPerProduct,
      maxVideosPerProduct: plan.maxVideosPerProduct,
      maxImageSizeMb: plan.maxImageSizeMb,
      maxVideoSizeMb: plan.maxVideoSizeMb,
      maxVideoDurationSec: plan.maxVideoDurationSec,
      maxVariantsPerProduct: plan.maxVariantsPerProduct,
      maxFlashSaleSessions: plan.maxFlashSaleSessions
    }
  }
}
