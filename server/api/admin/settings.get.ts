const ALLOWED_KEYS = new Set(['shipping_origin_city_id', 'shipping_origin_city_label'])

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const { keys } = getQuery(event) as { keys?: string }
  const requestedKeys = keys ? keys.split(',').filter(k => ALLOWED_KEYS.has(k)) : [...ALLOWED_KEYS]

  const rows = await prisma.storeSettings.findMany({
    where: { key: { in: requestedKeys } }
  })

  const result: Record<string, string> = {}
  for (const row of rows) result[row.key] = row.value
  return result
})
