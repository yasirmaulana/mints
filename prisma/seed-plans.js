// Seed 4 paket langganan sesuai PRD_Multi_Toko_Langganan.md §4.1.
// Harga (priceMonthly) adalah NILAI SEMENTARA — lihat PRD §14 pertanyaan terbuka.
// Aman dijalankan berkali-kali (upsert by tier).
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PLANS = [
  {
    tier: 'FREE',
    name: 'Free',
    priceMonthly: 0,
    durationDays: 30,
    maxStores: 1,
    maxProducts: 3,
    maxImagesPerProduct: 3,
    maxVideosPerProduct: 1,
    maxImageSizeMb: 2,
    maxVideoSizeMb: 15,
    maxVideoDurationSec: 30,
    maxStorageMb: 50,
    maxVariantsPerProduct: 3,
    maxFlashSaleSessions: 0,
    commissionPercent: 5,
    hasCustomDomain: false,
    hasVerifiedBadge: false,
    searchPriority: 0
  },
  {
    tier: 'PREMIUM',
    name: 'Premium',
    priceMonthly: 49000,
    durationDays: 30,
    maxStores: 3,
    maxProducts: 50,
    maxImagesPerProduct: 8,
    maxVideosPerProduct: 1,
    maxImageSizeMb: 5,
    maxVideoSizeMb: 50,
    maxVideoDurationSec: 60,
    maxStorageMb: 1024,
    maxVariantsPerProduct: 10,
    maxFlashSaleSessions: 1,
    commissionPercent: 3,
    hasCustomDomain: false,
    hasVerifiedBadge: false,
    searchPriority: 1
  },
  {
    tier: 'GOLD',
    name: 'Gold',
    priceMonthly: 149000,
    durationDays: 30,
    maxStores: 10,
    maxProducts: 500,
    maxImagesPerProduct: 15,
    maxVideosPerProduct: 3,
    maxImageSizeMb: 5,
    maxVideoSizeMb: 100,
    maxVideoDurationSec: 120,
    maxStorageMb: 10240,
    maxVariantsPerProduct: null,
    maxFlashSaleSessions: 5,
    commissionPercent: 2,
    hasCustomDomain: false,
    hasVerifiedBadge: true,
    searchPriority: 2
  },
  {
    tier: 'PLATINUM',
    name: 'Platinum',
    priceMonthly: 349000,
    durationDays: 30,
    maxStores: null,
    maxProducts: null,
    maxImagesPerProduct: 20,
    maxVideosPerProduct: 5,
    maxImageSizeMb: 10,
    maxVideoSizeMb: 200,
    maxVideoDurationSec: 300,
    maxStorageMb: 51200,
    maxVariantsPerProduct: null,
    maxFlashSaleSessions: null,
    commissionPercent: 1,
    hasCustomDomain: true,
    hasVerifiedBadge: true,
    searchPriority: 3
  }
]

async function main() {
  for (const plan of PLANS) {
    await prisma.plan.upsert({
      where: { tier: plan.tier },
      update: plan,
      create: plan
    })
  }
  console.log(`Seed plan selesai — ${PLANS.length} paket (FREE, PREMIUM, GOLD, PLATINUM)`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
