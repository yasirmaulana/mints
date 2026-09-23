// Sitemap toko ACTIVE — PRD §11 Fase 2. XML statis sederhana, tanpa modul tambahan.
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const stores = await prisma.store.findMany({
    where: { status: 'ACTIVE' },
    select: { slug: true, updatedAt: true }
  })

  const urls = stores.map(s =>
    `<url><loc>${config.appUrl}/toko/${s.slug}</loc><lastmod>${s.updatedAt.toISOString()}</lastmod></url>`
  ).join('')

  setResponseHeader(event, 'Content-Type', 'application/xml')
  setResponseHeader(event, 'Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
})
