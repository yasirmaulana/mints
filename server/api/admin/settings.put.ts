const ALLOWED_KEYS = new Set([
  'shipping_origin_city_id',
  'shipping_origin_city_label',
  'payment_gateway_enabled',
  'bank_accounts'
])

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const body = await readBody(event) as Record<string, string>

  const entries = Object.entries(body).filter(([k]) => ALLOWED_KEYS.has(k))
  if (!entries.length) throw createError({ statusCode: 400, statusMessage: 'Tidak ada key yang valid' })

  await Promise.all(
    entries.map(([key, value]) =>
      prisma.storeSettings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      })
    )
  )

  return { success: true }
})
