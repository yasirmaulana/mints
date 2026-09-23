// Tambah kategori produk (global, dipakai lintas toko) — dibuka untuk penjual toko, bukan admin-only,
// karena kategori tidak dipisah per toko (lihat model Category, tidak ada storeId).
export default defineEventHandler(async (event) => {
  await requireBuyerSession(event)
  const { name } = await readBody(event)
  if (!name?.trim()) throw createError({ statusCode: 400, statusMessage: 'Nama kategori wajib diisi' })

  const slug = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const existing = await prisma.category.findFirst({ where: { OR: [{ name: name.trim() }, { slug }] } })
  if (existing) return existing

  return await prisma.category.create({ data: { name: name.trim(), slug } })
})
