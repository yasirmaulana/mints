// Callback Duitku untuk langganan toko — satu-satunya tempat status Subscription/Store berubah
// menjadi ACTIVE (PRD §10: "status langganan hanya berubah berdasarkan data dari callback yang tervalidasi").
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const config = useRuntimeConfig()
  const merchantCode = config.duitkuMerchantCode
  const apiKey = config.duitkuApiKey

  const { merchantCode: mc, amount, merchantOrderId, resultCode, signature } = body

  const expectedSignature = duitkuCallbackSignature(merchantCode, String(amount), merchantOrderId, apiKey)
  if (signature !== expectedSignature) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid signature' })
  }

  const subscription = await prisma.subscription.findUnique({
    where: { duitkuReference: merchantOrderId },
    include: { store: true, plan: true }
  })
  if (!subscription) {
    throw createError({ statusCode: 404, statusMessage: 'Subscription not found' })
  }

  if (resultCode === '00') {
    if (subscription.status !== 'ACTIVE') {
      await prisma.$transaction([
        prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: 'ACTIVE', paidAt: new Date(), rawCallback: body }
        }),
        prisma.store.update({
          where: { id: subscription.storeId },
          data: {
            planId: subscription.planId,
            expiresAt: subscription.periodEnd,
            status: 'ACTIVE'
          }
        })
      ])

      const store = subscription.store
      const fonnteKey = config.fonnteApiKey
      if (fonnteKey && store.phone) {
        const waTemplate = await prisma.waTemplate.findUnique({ where: { key: 'subscription_active' } })
        const tanggal = subscription.periodEnd.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        const msg = waTemplate?.template
          ? waTemplate.template.replace('{name}', store.name).replace('{plan}', subscription.plan.name).replace('{date}', tanggal)
          : `Halo ${store.name}! Langganan paket ${subscription.plan.name} kamu aktif sampai ${tanggal}. Terima kasih sudah berjualan di MINTS! 🎉`

        await $fetch('https://api.fonnte.com/send', {
          method: 'POST',
          headers: { Authorization: fonnteKey },
          body: { target: store.phone, message: msg }
        }).catch(() => {})
      }
    }
  } else if (resultCode === '01') {
    // Pending — no state change
  } else {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'CANCELLED', rawCallback: body }
    })
  }

  return { success: true }
})
