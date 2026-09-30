import { GATEWAY_METHODS } from '~~/shared/utils/payment-methods'

// Estimasi biaya admin per metode pembayaran untuk ditampilkan ke pembeli SEBELUM checkout.
// Murni tampilan — paymentAmount yang dikirim ke /v2/inquiry (create-transaction.post.ts) tetap
// harga bersih; Duitku menambahkan fee otomatis di sisi mereka sesuai setting portal merchant
// (fee ditanggung merchant atau customer). Endpoint ini tidak mengubah nominal yang ditagihkan.
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const amount = Math.round(Number(query.amount))
  if (!Number.isFinite(amount) || amount <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'amount tidak valid' })
  }

  const config = useRuntimeConfig()
  const isProduction = config.duitkuIsProduction === 'true'
  const merchantCode = config.duitkuMerchantCode
  const apiKey = config.duitkuApiKey
  if (!merchantCode || !apiKey) {
    // Gateway belum dikonfigurasi — bukan error fatal untuk endpoint tampilan ini, cukup kosong.
    return {}
  }

  const baseUrl = getDuitkuBaseUrl(isProduction)
  const datetime = duitkuDatetimeNow()
  const signature = duitkuFeeSignature(merchantCode, amount, datetime, apiKey)

  try {
    const res = await $fetch<any>(`${baseUrl}/paymentmethod/getpaymentmethod`, {
      method: 'POST',
      body: { merchantcode: merchantCode, amount, datetime, signature },
      headers: { 'content-type': 'application/json' }
    })
    const allowedCodes = new Set(GATEWAY_METHODS.map(m => m.code))
    const fees: Record<string, number> = {}
    for (const item of res?.paymentFee || []) {
      if (allowedCodes.has(item.paymentMethod)) {
        fees[item.paymentMethod] = Math.round(Number(item.totalFee)) || 0
      }
    }
    return fees
  } catch {
    // Gagal ambil estimasi fee tidak boleh menghalangi buyer melanjutkan checkout — biarkan kosong,
    // nominal fee sebenarnya tetap ditentukan Duitku saat transaksi dibuat.
    return {}
  }
})
