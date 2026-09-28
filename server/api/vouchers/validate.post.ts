// Validasi kode voucher saat checkout (preview potongan sebelum submit order).
export default defineEventHandler(async (event) => {
  // Endpoint publik yang membedakan "kode tidak ada" vs "kadaluarsa/habis": tanpa batas, kode voucher
  // toko (mis. DISKON10) bisa ditebak dengan kamus.
  await rateLimitByIp(event, 'voucher-validate', 30, 10 * 60 * 1000)

  const body = await readBody(event) ?? {}
  const storeId = typeof body.storeId === 'string' ? body.storeId.slice(0, 64) : ''
  const code = String(body.code || '').trim().toUpperCase().slice(0, 50)
  const subtotal = Number(body.subtotal || 0)

  if (!storeId || !code) throw createError({ statusCode: 400, statusMessage: 'storeId dan code wajib diisi' })
  if (!Number.isFinite(subtotal) || subtotal < 0) throw createError({ statusCode: 400, statusMessage: 'subtotal tidak valid' })

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
