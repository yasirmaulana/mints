// Aktivasi toko baru — PRD_Multi_Toko_Langganan.md §6.1.
//
// Cakupan Fase 1: hanya paket FREE yang bisa langsung aktif di sini. Paket berbayar
// (PREMIUM/GOLD/PLATINUM) butuh alur langganan + callback Duitku (Fase 4, belum dibangun) —
// endpoint ini menolaknya secara eksplisit alih-alih berpura-pura sukses.
export default defineEventHandler(async (event) => {
  const buyer = await requireBuyerSession(event)
  const body = await readBody(event)

  const name = String(body?.name || '').trim()
  const phone = String(body?.phone || '').trim()
  let slug = String(body?.slug || '').trim().toLowerCase()
  const description = body?.description ? String(body.description).trim().slice(0, 500) : null
  const address = body?.address ? String(body.address).trim() : null
  const cityId = body?.cityId ? String(body.cityId) : null
  const cityName = body?.cityName ? String(body.cityName) : null
  const tier = String(body?.tier || 'FREE').toUpperCase()

  if (!name || name.length < 3 || name.length > 80) {
    throw createError({ statusCode: 400, statusMessage: 'Nama toko wajib diisi (3–80 karakter)' })
  }
  const phoneRegex = /^(08|628|\+628)\d{8,12}$/
  if (!phoneRegex.test(phone)) {
    throw createError({ statusCode: 400, statusMessage: 'Format nomor HP toko tidak valid' })
  }
  if (!slug) slug = slugify(name)
  const slugCheck = validateStoreSlug(slug)
  if (!slugCheck.ok) {
    throw createError({ statusCode: 400, statusMessage: slugCheck.message })
  }

  if (tier !== 'FREE') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Paket berbayar belum tersedia untuk aktivasi langsung. Aktivasi dengan paket Free terlebih dahulu, lalu upgrade setelah fitur langganan tersedia.'
    })
  }

  const plan = await assertCanCreateStore(buyer.id, (await prisma.plan.findUnique({ where: { tier: 'FREE' } }))!.id)

  const existingSlug = await prisma.store.findUnique({ where: { slug } })
  if (existingSlug) {
    throw createError({ statusCode: 409, statusMessage: 'Slug toko sudah dipakai, coba yang lain' })
  }

  const setting = await prisma.storeSettings.findUnique({ where: { key: 'store.auto_approve' } })
  const autoApprove = setting ? setting.value === 'true' : true // default: auto-approve (belum ada UI review admin)

  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + plan.durationDays)

  const store = await prisma.store.create({
    data: {
      ownerId: buyer.id,
      name,
      slug,
      description,
      phone,
      address,
      cityId,
      cityName,
      planId: plan.id,
      status: autoApprove ? 'ACTIVE' : 'PENDING_REVIEW',
      expiresAt
    },
    include: { plan: true }
  })

  return store
})
