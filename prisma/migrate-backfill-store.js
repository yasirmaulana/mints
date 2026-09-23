// Migrasi backfill multi-toko — PRD_Multi_Toko_Langganan.md §5.3.
//
// Sebelum fitur multi-toko, seluruh Product/Order adalah milik platform tanpa storeId.
// Script ini:
//   1. Membuat satu akun Buyer sistem (pemilik toko platform)
//   2. Membuat "toko resmi platform" (slug: mints, tier PLATINUM, expiresAt jauh di masa depan)
//   3. Backfill storeId pada seluruh Product & Order yang masih NULL
//   4. Memverifikasi tidak ada Product/Order tersisa tanpa storeId
//
// Idempotent — aman dijalankan berkali-kali. TIDAK mengubah storeId menjadi NOT NULL
// di skema (langkah 6 PRD, dilakukan terpisah setelah verifikasi ini lolos di semua environment).
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SYSTEM_BUYER_EMAIL = 'platform@mints.id'
const PLATFORM_STORE_SLUG = 'mints'

async function main() {
  const platinum = await prisma.plan.findUnique({ where: { tier: 'PLATINUM' } })
  if (!platinum) throw new Error('Plan PLATINUM belum ada — jalankan prisma/seed-plans.js dulu')

  // 1. Akun sistem pemilik toko platform
  const systemBuyer = await prisma.buyer.upsert({
    where: { email: SYSTEM_BUYER_EMAIL },
    update: {},
    create: {
      name: 'MINTS Official',
      email: SYSTEM_BUYER_EMAIL
    }
  })

  // 2. Toko resmi platform — expiresAt 50 tahun ke depan, praktis tidak pernah kedaluwarsa
  const farFuture = new Date()
  farFuture.setFullYear(farFuture.getFullYear() + 50)

  let platformStore = await prisma.store.findUnique({ where: { slug: PLATFORM_STORE_SLUG } })
  if (!platformStore) {
    platformStore = await prisma.store.create({
      data: {
        ownerId: systemBuyer.id,
        name: 'MINTS Official Store',
        slug: PLATFORM_STORE_SLUG,
        description: 'Toko resmi MINTS — katalog & pesanan dari sebelum fitur multi-toko.',
        phone: '000000000000',
        status: 'ACTIVE',
        planId: platinum.id,
        expiresAt: farFuture
      }
    })
    console.log(`Toko platform dibuat: ${platformStore.id} (slug: ${platformStore.slug})`)
  } else {
    console.log(`Toko platform sudah ada: ${platformStore.id}`)
  }

  // 3. Backfill Product tanpa storeId
  const productsBefore = await prisma.product.count({ where: { storeId: null } })
  const productBackfill = await prisma.product.updateMany({
    where: { storeId: null },
    data: { storeId: platformStore.id }
  })
  console.log(`Product backfill: ${productBackfill.count} baris (dari ${productsBefore} tanpa storeId)`)

  // 4. Backfill Order tanpa storeId
  const ordersBefore = await prisma.order.count({ where: { storeId: null } })
  const orderBackfill = await prisma.order.updateMany({
    where: { storeId: null },
    data: { storeId: platformStore.id }
  })
  console.log(`Order backfill: ${orderBackfill.count} baris (dari ${ordersBefore} tanpa storeId)`)

  // 5. Sinkronkan counter productCount toko platform
  const productCount = await prisma.product.count({ where: { storeId: platformStore.id } })
  await prisma.store.update({ where: { id: platformStore.id }, data: { productCount } })

  // 6. Verifikasi wajib — tidak boleh ada Product/Order tersisa tanpa storeId di environment ini
  const remainingProducts = await prisma.product.count({ where: { storeId: null } })
  const remainingOrders = await prisma.order.count({ where: { storeId: null } })

  if (remainingProducts > 0 || remainingOrders > 0) {
    throw new Error(
      `Backfill belum tuntas — Product tanpa storeId: ${remainingProducts}, Order tanpa storeId: ${remainingOrders}. ` +
      `storeId TIDAK BOLEH diwajibkan (NOT NULL) di skema sebelum ini menjadi 0.`
    )
  }

  console.log('Verifikasi OK — seluruh Product dan Order sudah punya storeId.')
  console.log(`Store platform: id=${platformStore.id} productCount=${productCount}`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
