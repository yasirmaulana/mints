import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Password admin awal wajib diberikan lewat environment — tidak ada password bawaan,
// supaya seed yang tidak sengaja dijalankan di produksi tidak membuat akun yang bisa ditebak.
//   ADMIN_SEED_USERNAME (opsional, default "admin")
//   ADMIN_SEED_PASSWORD (wajib, minimal 12 karakter)
async function main() {
  const username = process.env.ADMIN_SEED_USERNAME || 'admin'
  const password = process.env.ADMIN_SEED_PASSWORD
  if (!password || password.length < 12) {
    console.error('Seed dibatalkan: set ADMIN_SEED_PASSWORD (minimal 12 karakter) sebelum menjalankan `npm run db:seed`.')
    process.exit(1)
  }

  const hashed = await bcrypt.hash(password, 10)
  await prisma.admin.upsert({
    where: { username },
    update: {},
    create: { username, password: hashed }
  })
  console.log(`Seed admin selesai — username: ${username}`)
}

main().finally(() => prisma.$disconnect())
