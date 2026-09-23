// Edit paket langganan — harga, kuota, komisi, badge, prioritas pencarian (PRD §11 Fase 6).
// tier tidak bisa diubah (identitas paket); planId tetap sama supaya Store/Subscription yang
// sudah mereferensikan paket ini tidak perlu migrasi data.
const NUMERIC_FIELDS = [
  'priceMonthly', 'durationDays', 'maxStores', 'maxProducts', 'maxImagesPerProduct',
  'maxVideosPerProduct', 'maxImageSizeMb', 'maxVideoSizeMb', 'maxVideoDurationSec',
  'maxStorageMb', 'maxVariantsPerProduct', 'maxFlashSaleSessions', 'searchPriority'
] as const

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)

  const data: Record<string, any> = {}
  if (body?.name) data.name = String(body.name).trim()
  if (body?.commissionPercent !== undefined) data.commissionPercent = Number(body.commissionPercent)
  if (body?.hasCustomDomain !== undefined) data.hasCustomDomain = Boolean(body.hasCustomDomain)
  if (body?.hasVerifiedBadge !== undefined) data.hasVerifiedBadge = Boolean(body.hasVerifiedBadge)
  if (body?.isActive !== undefined) data.isActive = Boolean(body.isActive)

  for (const key of NUMERIC_FIELDS) {
    if (body?.[key] === undefined) continue
    data[key] = body[key] === null ? null : Number(body[key])
  }

  const plan = await prisma.plan.findUnique({ where: { id } })
  if (!plan) throw createError({ statusCode: 404, statusMessage: 'Paket tidak ditemukan' })

  return prisma.plan.update({ where: { id }, data })
})
