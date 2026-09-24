// Validasi kode voucher saat checkout (preview potongan sebelum submit order).
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const storeId = body.storeId
  const code = String(body.code || '').trim().toUpperCase()
  const subtotal = Number(body.subtotal || 0)

  if (!storeId || !code) throw createError({ statusCode: 400, statusMessage: 'storeId dan code wajib diisi' })

  const voucher = await prisma.voucher.findUnique({ where: { storeId_code: { storeId, code } } })
  if (!voucher || !voucher.isActive) {
    return { valid: false, discountAmount: 0, message: 'Kode voucher tidak ditemukan' }
  }
  if (voucher.expiresAt && voucher.expiresAt < new Date()) {
    return { valid: false, discountAmount: 0, message: 'Voucher sudah kedaluwarsa' }
  }
  if (voucher.quota !== null && voucher.usedCount >= voucher.quota) {
    return { valid: false, discountAmount: 0, message: 'Kuota voucher sudah habis' }
  }
  if (subtotal < voucher.minPurchase) {
    return { valid: false, discountAmount: 0, message: `Minimal pembelian Rp ${voucher.minPurchase.toLocaleString('id-ID')}` }
  }

  return { valid: true, discountAmount: voucher.discountAmount, message: 'Voucher berhasil diterapkan' }
})
