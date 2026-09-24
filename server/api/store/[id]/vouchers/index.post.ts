// Buat voucher baru milik toko — kode unik per toko (bukan global).
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ctx = await getStoreContext(event, id)

  const body = await readBody(event)
  const code = String(body.code || '').trim().toUpperCase()
  const discountAmount = parseInt(body.discountAmount)

  if (!code) throw createError({ statusCode: 400, statusMessage: 'Kode voucher wajib diisi' })
  if (!discountAmount || discountAmount <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Potongan voucher wajib diisi' })
  }

  const existing = await prisma.voucher.findUnique({ where: { storeId_code: { storeId: ctx.store.id, code } } })
  if (existing) throw createError({ statusCode: 400, statusMessage: 'Kode voucher sudah dipakai' })

  return prisma.voucher.create({
    data: {
      storeId: ctx.store.id,
      code,
      discountAmount,
      minPurchase: body.minPurchase ? parseInt(body.minPurchase) : 0,
      quota: body.quota ? parseInt(body.quota) : null,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null
    }
  })
})
