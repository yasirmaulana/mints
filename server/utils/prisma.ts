import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

// ponytail: singleton untuk dev HMR — di production pakai ACCELERATE_URL untuk connection pooling
const globalForPrisma = globalThis as unknown as { prisma: ReturnType<typeof buildPrisma> }

function buildPrisma() {
  // Hanya pakai Accelerate di production — dev tetap pakai DATABASE_URL langsung
  const accelerateUrl = process.env.ACCELERATE_URL ?? ''
  const useAccelerate = process.env.NODE_ENV === 'production' && accelerateUrl.startsWith('prisma')
  if (useAccelerate) process.env.DATABASE_URL = accelerateUrl
  const client = new PrismaClient()
  return useAccelerate ? client.$extends(withAccelerate()) : client
}

export const prisma = globalForPrisma.prisma ?? buildPrisma()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
