export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!

  const shipment = await prisma.shipment.findUnique({ where: { orderId: id } })
  if (!shipment) throw createError({ statusCode: 404, statusMessage: 'Shipment tidak ditemukan' })

  const config = useRuntimeConfig()
  const rajaOngkirKey = config.rajaOngkirKey

  // Cache check: only re-fetch if last checked > 30 min ago
  const staleCutoff = new Date(Date.now() - 30 * 60 * 1000)
  if (shipment.lastChecked && shipment.lastChecked > staleCutoff) {
    return { tracking: shipment.rawTracking, cachedAt: shipment.lastChecked }
  }

  const body = new URLSearchParams({
    waybill: shipment.trackingNo,
    courier: shipment.courier
  })

  const res = await $fetch<any>('https://api.rajaongkir.com/starter/waybill', {
    method: 'POST',
    headers: {
      key: rajaOngkirKey,
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  })

  const tracking = res?.rajaongkir?.result ?? null
  const status = tracking?.delivery_status?.status || shipment.status

  await prisma.shipment.update({
    where: { orderId: id },
    data: { rawTracking: tracking, status, lastChecked: new Date() }
  })

  return { tracking, cachedAt: new Date() }
})
