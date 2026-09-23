// Input resi pengiriman oleh penjual — sama seperti alur admin, dilingkupi kepemilikan toko.
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const oid = getRouterParam(event, 'oid')!
  const ctx = await getStoreContext(event, id)

  const order = await prisma.order.findUnique({ where: { id: oid } })
  if (!order || order.storeId !== ctx.store.id) {
    throw createError({ statusCode: 404, statusMessage: 'Pesanan tidak ditemukan' })
  }

  const body = await readBody(event)
  const courier = String(body?.courier || '').trim()
  const trackingNo = String(body?.trackingNo || '').trim()
  if (!courier || !trackingNo) {
    throw createError({ statusCode: 400, statusMessage: 'courier dan trackingNo wajib diisi' })
  }

  const shipment = await prisma.shipment.upsert({
    where: { orderId: oid },
    create: { orderId: oid, courier, trackingNo, status: 'WAITING_PICKUP' },
    update: { courier, trackingNo, status: 'WAITING_PICKUP', lastChecked: null }
  })

  await prisma.order.update({ where: { id: oid }, data: { status: 'READY_TO_SHIP', courierCode: courier } })

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
