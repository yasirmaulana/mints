import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

// ponytail: singleton untuk dev HMR — di production pakai ACCELERATE_URL untuk connection pooling
const globalForPrisma = globalThis as unknown as { prisma: ReturnType<typeof buildPrisma> }

function buildPrisma() {
  // Pakai Accelerate jika DATABASE_URL sendiri sudah berupa prisma:// URL
  const url = process.env.DATABASE_URL ?? ''
  const client = new PrismaClient()
  return url.startsWith('prisma') ? client.$extends(withAccelerate()) : client
}

export const prisma = globalForPrisma.prisma ?? buildPrisma()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
