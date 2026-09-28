const ALLOWED_KEYS = new Set([
  'shipping_origin_city_id',
  'shipping_origin_city_label',
  'payment_gateway_enabled',
  'bank_accounts',
  'analytics_pixels'
])

import { isPixelType, isValidPixelId } from '~~/shared/utils/analytics-ids'

function assertValidPixels(raw: string) {
  const bad = (msg: string) => createError({ statusCode: 400, statusMessage: msg })
  let pixels: unknown
  try { pixels = JSON.parse(raw) } catch { throw bad('Format konfigurasi pixel tidak valid') }
  if (!Array.isArray(pixels) || pixels.length > 20) throw bad('Konfigurasi pixel harus berupa daftar (maks. 20)')

  for (const p of pixels as any[]) {
    if (!p || !isPixelType(p.type)) throw bad('Tipe pixel harus meta, gtm, atau tiktok')
    const field = p.type === 'gtm' ? 'containerId' : 'pixelId'
    const id = p[field]
    // ID kosong boleh (pixel belum diisi/dinonaktifkan); yang terisi harus sesuai format ID asli.
    if (id !== undefined && id !== '' && !isValidPixelId(p.type, id)) {
      throw bad(`${field} untuk pixel ${p.type} tidak valid`)
    }
    for (const k of ['name', 'apiToken', 'testCode', 'id']) {
      if (p[k] !== undefined && (typeof p[k] !== 'string' || p[k].length > 200)) throw bad(`Field ${k} tidak valid`)
    }
  }
}

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const body = await readBody(event) as Record<string, string>

  const entries = Object.entries(body).filter(([k]) => ALLOWED_KEYS.has(k))
  if (!entries.length) throw createError({ statusCode: 400, statusMessage: 'Tidak ada key yang valid' })

  // ID pixel disisipkan ke <script> di semua halaman publik: tolak format yang tidak sesuai ID asli.
  const pixelsEntry = entries.find(([k]) => k === 'analytics_pixels')
  if (pixelsEntry) assertValidPixels(String(pixelsEntry[1]))

  await Promise.all(
    entries.map(([key, value]) =>
      prisma.storeSettings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) }
      })
    )
  )

  return { success: true }
})
