import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

// ponytail: singleton untuk dev HMR — di production pakai ACCELERATE_URL untuk connection pooling
const globalForPrisma = globalThis as unknown as { prisma: ReturnType<typeof buildPrisma> }

function buildPrisma() {
  const accelerateUrl = process.env.ACCELERATE_URL ?? ''
  const dbUrl = process.env.DATABASE_URL ?? ''
  // Pakai Accelerate jika ACCELERATE_URL tersedia (production Vercel)
  const useAccelerate = accelerateUrl.startsWith('prisma+postgres')
  const client = new PrismaClient({
    datasources: { db: { url: useAccelerate ? accelerateUrl : dbUrl } }
  })
  return useAccelerate ? client.$extends(withAccelerate()) : client
}

export const prisma = globalForPrisma.prisma ?? buildPrisma()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
