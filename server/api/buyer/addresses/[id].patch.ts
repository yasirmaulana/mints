const phoneRegex = /^(08|628|\+628)\d{8,12}$/

export default defineEventHandler(async (event) => {
  const buyer = await requireBuyerSession(event)
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  const existing = await prisma.address.findUnique({ where: { id } })
  if (!existing || existing.buyerId !== buyer.id) {
    throw createError({ statusCode: 404, statusMessage: 'Alamat tidak ditemukan' })
  }

  const data: any = {}
  if (body?.label !== undefined) data.label = body.label ? String(body.label).trim().slice(0, 40) : null
  if (body?.recipientName !== undefined) {
    const v = String(body.recipientName).trim()
    if (v.length < 3) throw createError({ statusCode: 400, statusMessage: 'Nama penerima wajib diisi' })
    data.recipientName = v
  }
  if (body?.phone !== undefined) {
    const v = String(body.phone).trim()
    if (!phoneRegex.test(v)) throw createError({ statusCode: 400, statusMessage: 'Format nomor HP tidak valid' })
    data.phone = v
  }
  if (body?.address !== undefined) {
    const v = String(body.address).trim()
    if (v.length < 10) throw createError({ statusCode: 400, statusMessage: 'Alamat lengkap wajib diisi' })
    data.address = v
  }
  if (body?.cityId !== undefined && body?.cityName !== undefined) {
    data.cityId = String(body.cityId).trim()
    data.cityName = String(body.cityName).trim()
    if (!data.cityId || !data.cityName) throw createError({ statusCode: 400, statusMessage: 'Kota/kabupaten wajib dipilih' })
  }

  if (body?.isDefault === true) {
    await prisma.$transaction(async (tx) => {
      await tx.address.updateMany({ where: { buyerId: buyer.id, isDefault: true }, data: { isDefault: false } })
      await tx.address.update({ where: { id: existing.id }, data: { ...data, isDefault: true } })
    })
  } else {
    await prisma.address.update({ where: { id: existing.id }, data })
  }

  return prisma.address.findUnique({ where: { id: existing.id } })
})
