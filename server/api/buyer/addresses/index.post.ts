const phoneRegex = /^(08|628|\+628)\d{8,12}$/

export default defineEventHandler(async (event) => {
  const buyer = await requireBuyerSession(event)
  const body = await readBody(event)

  const recipientName = String(body?.recipientName || '').trim()
  const phone = String(body?.phone || '').trim()
  const address = String(body?.address || '').trim()
  const cityId = String(body?.cityId || '').trim()
  const cityName = String(body?.cityName || '').trim()
  const label = body?.label ? String(body.label).trim().slice(0, 40) : null

  if (recipientName.length < 3) throw createError({ statusCode: 400, statusMessage: 'Nama penerima wajib diisi' })
  if (!phoneRegex.test(phone)) throw createError({ statusCode: 400, statusMessage: 'Format nomor HP tidak valid' })
  if (address.length < 10) throw createError({ statusCode: 400, statusMessage: 'Alamat lengkap wajib diisi' })
  if (!cityId || !cityName) throw createError({ statusCode: 400, statusMessage: 'Kota/kabupaten wajib dipilih' })

  const existingCount = await prisma.address.count({ where: { buyerId: buyer.id } })
  const makeDefault = body?.isDefault === true || existingCount === 0

  const created = await prisma.$transaction(async (tx) => {
    if (makeDefault) {
      await tx.address.updateMany({ where: { buyerId: buyer.id, isDefault: true }, data: { isDefault: false } })
    }
    return tx.address.create({
      data: {
        buyerId: buyer.id,
        label,
        recipientName,
        phone,
        address,
        cityId,
        cityName,
        isDefault: makeDefault
      }
    })
  })

  return created
})
