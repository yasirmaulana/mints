import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Admin awal untuk login OTP email — tidak ada password. Wajib lewat environment:
//   ADMIN_SEED_EMAIL (wajib)
//   ADMIN_SEED_NAME  (opsional, nama tampilan)
// Aman dijalankan berkali-kali (upsert by email).
async function main() {
  const email = process.env.ADMIN_SEED_EMAIL?.trim().toLowerCase()
  if (!email) {
    console.error('Seed dibatalkan: set ADMIN_SEED_EMAIL sebelum menjalankan `npm run db:seed`.')
    process.exit(1)
  }
  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, username: process.env.ADMIN_SEED_NAME?.trim() || null }
  })
  console.log(`Seed admin selesai — email: ${email}`)
}

main().finally(() => prisma.$disconnect())
