// Buat/ubah banner (multipart: id?, title, linkUrl, position, sortOrder, isActive, image)
export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const formData = await readMultipartFormData(event)
  if (!formData) throw createError({ statusCode: 400, statusMessage: 'Form data kosong' })

  const fields: Record<string, string> = {}
  let imageUrl = ''
  for (const part of formData) {
    if (part.name === 'image' && part.filename) {
      imageUrl = await uploadToS3(part.data, part.filename, part.type || 'image/jpeg', 'uploads')
    } else if (part.name) {
      fields[part.name] = part.data.toString()
    }
  }

  const title = fields.title?.trim()
  if (!title) throw createError({ statusCode: 400, statusMessage: 'Judul banner wajib diisi' })

  // Hanya path internal atau http(s) — cegah javascript: dsb. di href banner
  const linkUrl = fields.linkUrl?.trim() || null
  if (linkUrl && !/^(\/(?!\/)|https?:\/\/)/.test(linkUrl)) {
    throw createError({ statusCode: 400, statusMessage: 'Link harus diawali "/" atau http(s)://' })
  }

  const position = fields.position === 'SIDE' ? 'SIDE' : 'MAIN'
  const sortOrder = Number.parseInt(fields.sortOrder) || 0
  const isActive = fields.isActive !== 'false'
  const data = { title, linkUrl, position, sortOrder, isActive } as const

  if (fields.id) {
    return await prisma.banner.update({ where: { id: fields.id }, data: { ...data, ...(imageUrl && { imageUrl }) } })
  }
  if (!imageUrl) throw createError({ statusCode: 400, statusMessage: 'Gambar banner wajib diunggah' })
  return await prisma.banner.create({ data: { ...data, imageUrl } })
})
