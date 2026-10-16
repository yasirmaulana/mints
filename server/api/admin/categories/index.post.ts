// Tambah kategori (induk) atau subkategori (bila parentId diisi). Hanya admin platform.
export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const { name, parentId } = await readBody(event)
  if (!name?.trim()) throw createError({ statusCode: 400, statusMessage: 'Nama kategori wajib diisi' })

  const slugify = (s: string) => s.toLowerCase().replace(/&/g, ' dan ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  let slug = slugify(name)

  if (parentId) {
    const parent = await prisma.category.findUnique({ where: { id: parentId } })
    if (!parent) throw createError({ statusCode: 404, statusMessage: 'Kategori induk tidak ditemukan' })
    if (parent.parentId) throw createError({ statusCode: 400, statusMessage: 'Subkategori tidak bisa punya anak (maksimal 2 tingkat)' })
    slug = `${parent.slug}-${slug}`
  }
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Nama kategori tidak valid' })

  const dup = await prisma.category.findFirst({
    where: { OR: [{ slug }, { parentId: parentId || null, name: name.trim() }] }
  })
  if (dup) throw createError({ statusCode: 409, statusMessage: 'Kategori dengan nama tersebut sudah ada' })

  return await prisma.category.create({ data: { name: name.trim(), slug, parentId: parentId || null } })
})
