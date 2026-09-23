// Edit profil toko (nama, deskripsi, kontak, logo/banner) — PRD §6.1.
// Slug SENGAJA tidak bisa diubah di sini: mengubah slug toko yang sudah publik
// merusak link yang sudah dibagikan (SEO, riwayat pesan) — di luar cakupan Fase 1.
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ctx = await getStoreContext(event, id, { requireActive: false })
  const body = await readBody(event)

  const data: Record<string, any> = {}

  if (body?.name !== undefined) {
    const name = String(body.name).trim()
    if (!name || name.length < 3 || name.length > 80) {
      throw createError({ statusCode: 400, statusMessage: 'Nama toko wajib diisi (3–80 karakter)' })
    }
    data.name = name
  }
  if (body?.phone !== undefined) {
    const phone = String(body.phone).trim()
    if (!/^(08|628|\+628)\d{8,12}$/.test(phone)) {
      throw createError({ statusCode: 400, statusMessage: 'Format nomor HP toko tidak valid' })
    }
    data.phone = phone
  }
  if (body?.description !== undefined) {
    data.description = body.description ? String(body.description).trim().slice(0, 500) : null
  }
  if (body?.address !== undefined) data.address = body.address ? String(body.address).trim() : null
  if (body?.cityId !== undefined) data.cityId = body.cityId ? String(body.cityId) : null
  if (body?.cityName !== undefined) data.cityName = body.cityName ? String(body.cityName) : null
  if (body?.logoUrl !== undefined) data.logoUrl = body.logoUrl ? String(body.logoUrl) : null
  if (body?.bannerUrl !== undefined) data.bannerUrl = body.bannerUrl ? String(body.bannerUrl) : null

  const store = await prisma.store.update({
    where: { id: ctx.store.id },
    data,
    include: { plan: true }
  })

  return store
})
