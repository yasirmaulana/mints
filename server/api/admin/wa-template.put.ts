const ALLOWED_KEYS = new Set(['order_confirmed', 'order_paid', 'order_shipped', 'order_cancelled', 'order_offline'])

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const body = await readBody(event) as Record<string, string>

  const entries = Object.entries(body).filter(([key]) => ALLOWED_KEYS.has(key))
  if (!entries.length) throw createError({ statusCode: 400, statusMessage: 'Tidak ada template yang valid' })

  await Promise.all(
    entries.map(([key, template]) =>
      prisma.waTemplate.upsert({
        where: { key },
        update: { template: String(template) },
        create: { key, template: String(template) }
      })
    )
  )

  return { success: true }
})
