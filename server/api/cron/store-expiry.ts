// Cron harian: tandai toko kedaluwarsa EXPIRED, dan kirim notifikasi H-7/H-3/H-1 — PRD §11 Fase 4.
// Dipicu Vercel Cron dengan header Authorization: Bearer <CRON_SECRET>.
const REMINDER_DAYS = [7, 3, 1]
const DAY_MS = 24 * 60 * 60 * 1000

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const auth = getHeader(event, 'authorization')
  if (!config.cronSecret || auth !== `Bearer ${config.cronSecret}`) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const now = new Date()

  // 1. Toko yang sudah lewat expiresAt dan masih ACTIVE → EXPIRED (mode read-only, §11 Fase 4).
  const expired = await prisma.store.updateMany({
    where: { status: 'ACTIVE', expiresAt: { lt: now } },
    data: { status: 'EXPIRED' }
  })

  // 2. Notifikasi H-7/H-3/H-1 untuk toko yang masih ACTIVE.
  let notified = 0
  const fonnteKey = config.fonnteApiKey
  const waTemplate = await prisma.waTemplate.findUnique({ where: { key: 'store_expiry_reminder' } })

  for (const daysLeft of REMINDER_DAYS) {
    const targetDay = startOfDay(new Date(now.getTime() + daysLeft * DAY_MS))
    const nextDay = new Date(targetDay.getTime() + DAY_MS)

    const stores = await prisma.store.findMany({
      where: { status: 'ACTIVE', expiresAt: { gte: targetDay, lt: nextDay } },
      select: { id: true, name: true, phone: true, expiresAt: true }
    })

    for (const store of stores) {
      if (!fonnteKey || !store.phone) continue
      const tanggal = store.expiresAt.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      const msg = waTemplate?.template
        ? waTemplate.template.replace('{name}', store.name).replace('{days}', String(daysLeft)).replace('{date}', tanggal)
        : `Halo ${store.name}! Tokomu di MINTS akan berakhir dalam ${daysLeft} hari (${tanggal}). Perpanjang sekarang agar tetap tampil untuk pembeli: ${config.appUrl}/toko/langganan`

      await $fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: { Authorization: fonnteKey },
        body: { target: store.phone, message: msg }
      }).catch(() => {})
      notified++
    }
  }

  return { expired: expired.count, notified }
})
