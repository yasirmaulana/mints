// Mulai (atau ambil kembali) percakapan dengan sebuah toko. Satu thread per pasangan pembeli–toko.
export default defineEventHandler(async (event) => {
  const buyer = await requireBuyerSession(event)
  await checkRateLimit(`chat-open:${buyer.id}`, 30, 5 * 60 * 1000)

  const { storeId } = await readBody(event) ?? {}
  if (typeof storeId !== 'string' || !storeId) {
    throw createError({ statusCode: 400, statusMessage: 'storeId wajib diisi' })
  }

  const store = await prisma.store.findUnique({
    where: { id: storeId },
    select: { id: true, ownerId: true, status: true, name: true, slug: true, logoUrl: true }
  })
  if (!store || store.status !== 'ACTIVE') {
    throw createError({ statusCode: 404, statusMessage: 'Toko tidak ditemukan' })
  }
  if (store.ownerId === buyer.id) {
    throw createError({ statusCode: 400, statusMessage: 'Tidak bisa chat dengan toko sendiri' })
  }

  const thread = await prisma.chatSession.upsert({
    where: { buyerId_storeId: { buyerId: buyer.id, storeId } },
    create: { buyerId: buyer.id, storeId, buyerName: buyer.name, buyerPhone: buyer.phone ?? '' },
    update: {}
  })
  return serializeThread({ ...thread, store }, 'buyer')
})
