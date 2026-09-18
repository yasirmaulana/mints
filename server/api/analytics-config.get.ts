export default defineEventHandler(async () => {
  const row = await prisma.storeSettings.findUnique({ where: { key: 'analytics_pixels' } })
  if (!row) return []
  try { return JSON.parse(row.value) } catch { return [] }
})
