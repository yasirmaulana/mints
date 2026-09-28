// Penerima laporan pelanggaran CSP (Content-Security-Policy-Report-Only) dari browser.
// Endpoint ini publik dan dipanggil browser sendiri, jadi dijaga ketat: rate limit per IP, batas ukuran
// body, tidak menyimpan ke database, dan hanya mencatat ringkasan ke log (dilihat di log fungsi Vercel).
// Browser mengirim dua format: report-uri → {"csp-report": {...}}, Reporting API → [{type, body}].
const MAX_BODY_BYTES = 8 * 1024
const FIELDS = ['blocked-uri', 'violated-directive', 'effective-directive', 'document-uri', 'source-file', 'line-number', 'disposition'] as const

// Pelanggaran akibat ekstensi browser pengunjung, bukan dari situs kita.
const NOISE = /^(chrome-extension|moz-extension|safari-extension|safari-web-extension|webkit-masked-url|about):/i

// Buang query/hash agar token atau data pribadi di URL (mis. ?redirect=, ?no=) tidak masuk log.
function stripQuery(value: string) {
  return value.split(/[?#]/)[0]
}

function summarize(raw: any) {
  const src = raw?.['csp-report'] ?? raw?.body ?? raw
  if (!src || typeof src !== 'object') return null
  const out: Record<string, string | number> = {}
  for (const key of FIELDS) {
    // Reporting API memakai camelCase (blockedURL, violatedDirective, ...): petakan ke nama report-uri.
    const camel = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    const v = src[key] ?? src[camel] ?? (key === 'blocked-uri' ? src.blockedURL : undefined) ?? (key === 'document-uri' ? src.documentURL : undefined)
    if (v === undefined || v === null || v === '') continue
    out[key] = typeof v === 'number' ? v : stripQuery(String(v)).slice(0, 200)
  }
  return out['violated-directive'] || out['effective-directive'] ? out : null
}

export default defineEventHandler(async (event) => {
  await rateLimitByIp(event, 'csp-report', 60, 10 * 60 * 1000)

  const declared = Number(getHeader(event, 'content-length') || 0)
  if (declared > MAX_BODY_BYTES) throw createError({ statusCode: 413, statusMessage: 'Laporan terlalu besar' })

  const raw = await readRawBody(event, 'utf8')
  if (!raw || raw.length > MAX_BODY_BYTES) throw createError({ statusCode: 413, statusMessage: 'Laporan tidak valid' })

  let parsed: unknown
  try { parsed = JSON.parse(raw) } catch { return sendNoContent(event) }

  // Satu request bisa memuat beberapa laporan (Reporting API); batasi agar log tidak dibanjiri.
  for (const item of (Array.isArray(parsed) ? parsed : [parsed]).slice(0, 10)) {
    const summary = summarize(item)
    if (!summary) continue
    if (typeof summary['blocked-uri'] === 'string' && NOISE.test(summary['blocked-uri'])) continue
    console.warn('[csp-report]', JSON.stringify(summary))
  }

  return sendNoContent(event)
})
