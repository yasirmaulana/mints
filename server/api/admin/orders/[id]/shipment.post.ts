export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const { courier, trackingNo } = body

  if (!courier || !trackingNo) {
    throw createError({ statusCode: 400, statusMessage: 'courier dan trackingNo wajib diisi' })
  }

  const order = await prisma.order.findUnique({ where: { id } })
  if (!order) throw createError({ statusCode: 404, statusMessage: 'Order tidak ditemukan' })

  const shipment = await prisma.shipment.upsert({
    where: { orderId: id },
    create: { orderId: id, courier, trackingNo, status: 'WAITING_PICKUP' },
    update: { courier, trackingNo, status: 'WAITING_PICKUP', lastChecked: null }
  })

  await prisma.order.update({
    where: { id },
    data: { status: 'READY_TO_SHIP', courierCode: courier }
  })

  // Send WA notification
  const config = useRuntimeConfig()
  const fonnteKey = config.fonnteApiKey
  if (fonnteKey && order.buyerPhone) {
    const waTemplate = await prisma.waTemplate.findUnique({ where: { key: 'shipped' } })
    const msg = waTemplate?.template
      ? waTemplate.template
          .replace('{name}', order.buyerName)
          .replace('{courier}', courier.toUpperCase())
          .replace('{trackingNo}', trackingNo)
          .replace('{trackUrl}', `${config.appUrl}/track?no=${trackingNo}&courier=${courier}`)
      : `Halo ${order.buyerName}! Pesanan kamu sudah dikirim! 📦\n\nKurir: ${courier.toUpperCase()}\nNo. Resi: ${trackingNo}\n\nCek status pengiriman: ${config.appUrl}/track?no=${trackingNo}&courier=${courier}`

    await $fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { Authorization: fonnteKey },
      body: { target: order.buyerPhone, message: msg }
    }).catch(() => {})
  }

  return shipment
})
