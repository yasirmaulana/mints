export default defineEventHandler(async (event) => {
  const buyer = await requireBuyerSession(event)
  const id = getRouterParam(event, 'id')

  const existing = await prisma.address.findUnique({ where: { id } })
  if (!existing || existing.buyerId !== buyer.id) {
    throw createError({ statusCode: 404, statusMessage: 'Alamat tidak ditemukan' })
  }

  await prisma.address.delete({ where: { id: existing.id } })

  // Kalau yang dihapus adalah alamat default, angkat alamat terbaru berikutnya jadi default —
  // supaya checkout selanjutnya tetap punya alamat terpilih otomatis.
  if (existing.isDefault) {
    const next = await prisma.address.findFirst({ where: { buyerId: buyer.id }, orderBy: { createdAt: 'desc' } })
    if (next) await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } })
  }

  return { success: true }
})
