// Upload gambar toko (logo/banner) lalu simpan URL-nya ke Store — dipisah dari index.patch.ts
// karena PATCH menerima JSON, sedangkan file upload butuh multipart.
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ctx = await getStoreContext(event, id, { requireActive: false })

  const formData = await readMultipartFormData(event)
  if (!formData) throw createError({ statusCode: 400, statusMessage: 'Form data kosong' })

  let kind = ''
  let filePart: { data: Buffer; filename: string; type: string } | null = null
  for (const part of formData) {
    if (part.name === 'kind') kind = part.data.toString()
    else if (part.name === 'image' && part.filename) {
      filePart = { data: part.data, filename: part.filename, type: part.type || 'image/jpeg' }
    }
  }

  if (kind !== 'logo' && kind !== 'banner') {
    throw createError({ statusCode: 400, statusMessage: 'kind harus "logo" atau "banner"' })
  }
  if (!filePart) throw createError({ statusCode: 400, statusMessage: 'File gambar wajib diupload' })

  const url = await uploadToS3(filePart.data, filePart.filename, filePart.type, `stores/${kind}s`)

  const store = await prisma.store.update({
    where: { id: ctx.store.id },
    data: kind === 'logo' ? { logoUrl: url } : { bannerUrl: url },
    include: { plan: true }
  })

  return store
})
