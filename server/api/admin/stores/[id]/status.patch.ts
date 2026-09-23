// Ubah status toko dari admin — approve, tolak, tangguhkan, aktifkan kembali (PRD §11 Fase 6).
// Alasan (reject/suspend) disimpan di Store.rejectReason — field yang sama dipakai untuk
// kedua kasus karena keduanya "toko tidak tayang karena keputusan admin, dengan alasan".
const ALLOWED: Record<string, string[]> = {
  DRAFT: [],
  PENDING_REVIEW: ['ACTIVE', 'REJECTED'],
  ACTIVE: ['SUSPENDED', 'REJECTED'],
  REJECTED: ['ACTIVE'],
  SUSPENDED: ['ACTIVE'],
  EXPIRED: ['ACTIVE'],
  ARCHIVED: []
}

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const status = String(body?.status || '')
  const reason = body?.reason ? String(body.reason).trim().slice(0, 500) : null

  const store = await prisma.store.findUnique({ where: { id }, select: { status: true } })
  if (!store) throw createError({ statusCode: 404, statusMessage: 'Toko tidak ditemukan' })

  const allowed = ALLOWED[store.status] || []
  if (!allowed.includes(status)) {
    throw createError({ statusCode: 400, statusMessage: `Tidak bisa mengubah status dari ${store.status} ke ${status}` })
  }
  if ((status === 'REJECTED' || status === 'SUSPENDED') && !reason) {
    throw createError({ statusCode: 400, statusMessage: 'Alasan wajib diisi untuk menolak/menangguhkan toko' })
  }

  const updated = await prisma.store.update({
    where: { id },
    data: {
      status,
      rejectReason: status === 'REJECTED' || status === 'SUSPENDED' ? reason : null
    }
  })

  return updated
})
