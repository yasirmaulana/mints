// Mulai langganan berbayar (upgrade/perpanjang) — PRD §6.3, §8.1.
// planId TIDAK PERNAH datang dari sisi klien untuk aktivasi gratis; di sini klien memilih
// paket tapi status toko hanya berubah setelah callback Duitku tervalidasi (§10).
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ctx = await getStoreContext(event, id, { requireActive: false })

  const body = await readBody(event)
  const planId = String(body?.planId || '')
  if (!planId) throw createError({ statusCode: 400, statusMessage: 'planId wajib diisi' })

  const plan = await prisma.plan.findUnique({ where: { id: planId } })
  if (!plan || !plan.isActive) throw createError({ statusCode: 400, statusMessage: 'Paket tidak valid' })
  if (plan.priceMonthly <= 0) throw createError({ statusCode: 400, statusMessage: 'Paket ini gratis, tidak perlu pembayaran' })

  // Downgrade/pindah paket ditolak bila pemakaian saat ini melebihi batas paket tujuan (§6.3).
  if (plan.tier !== ctx.store.plan.tier) {
    assertPlanChangeAllowed(ctx, plan)
  }

  const pendingCount = await prisma.subscription.count({
    where: { storeId: ctx.store.id, status: 'PENDING_PAYMENT' }
  })
  if (pendingCount > 0) {
    throw createError({ statusCode: 409, statusMessage: 'Sudah ada langganan menunggu pembayaran. Selesaikan atau tunggu kedaluwarsa terlebih dahulu.' })
  }

  const now = new Date()
  // Perpanjang sebelum kedaluwarsa menambah durasi ke expiresAt yang ada; setelah kedaluwarsa dihitung dari sekarang (§6.3).
  const periodStart = ctx.store.expiresAt > now ? ctx.store.expiresAt : now
  const periodEnd = new Date(periodStart.getTime() + plan.durationDays * 24 * 60 * 60 * 1000)

  const config = useRuntimeConfig()
  const isProduction = config.duitkuIsProduction === 'true'
  const merchantCode = config.duitkuMerchantCode
  const apiKey = config.duitkuApiKey
  if (!merchantCode || !apiKey) {
    throw createError({ statusCode: 503, statusMessage: 'Payment gateway belum dikonfigurasi. Hubungi admin.' })
  }

  const merchantOrderId = `MINTS-SUB-${ctx.store.id.slice(0, 8)}-${Date.now()}`
  const amount = String(plan.priceMonthly)
  const signature = duitkuSignature(merchantCode, merchantOrderId, amount, apiKey)
  const baseUrl = getDuitkuBaseUrl(isProduction)

  const payload = {
    merchantCode,
    paymentAmount: Number(amount),
    paymentMethod: String(body?.paymentMethod || 'VC'),
    merchantOrderId,
    productDetails: `Langganan ${plan.name} — ${ctx.store.name}`,
    customerVaName: ctx.store.name,
    email: `store-${ctx.store.id.slice(0, 8)}@mints.id`,
    phoneNumber: ctx.store.phone,
    additionalParam: '',
    merchantUserInfo: '',
    callbackUrl: config.duitkuCallbackUrl,
    returnUrl: config.duitkuReturnUrl || `${config.appUrl || 'https://mints.id'}/toko/langganan`,
    signature,
    expiryPeriod: 1440
  }

  const duitkuRes = await $fetch<any>(`${baseUrl}/v2/inquiry`, {
    method: 'POST',
    body: payload,
    headers: { 'content-type': 'application/json' }
  })

  if (duitkuRes.statusCode !== '00') {
    throw createError({ statusCode: 400, statusMessage: duitkuRes.statusMessage || 'Gagal membuat transaksi Duitku' })
  }

  const subscription = await prisma.subscription.create({
    data: {
      storeId: ctx.store.id,
      planId: plan.id,
      status: 'PENDING_PAYMENT',
      amount: plan.priceMonthly,
      periodStart,
      periodEnd,
      duitkuReference: merchantOrderId,
      paymentUrl: duitkuRes.paymentUrl
    }
  })

  return { paymentUrl: subscription.paymentUrl, subscriptionId: subscription.id }
})
