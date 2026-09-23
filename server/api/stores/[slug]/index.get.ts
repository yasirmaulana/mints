// Profil toko publik — PRD §6.4. 404 (bukan 403) untuk status non-ACTIVE agar
// tidak membocorkan status komersial toko ke pengunjung.
export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!

  const store = await prisma.store.findUnique({
    where: { slug },
    select: {
      id: true, name: true, slug: true, description: true,
      logoUrl: true, bannerUrl: true, cityName: true, status: true,
      createdAt: true,
      plan: { select: { tier: true, hasVerifiedBadge: true } }
    }
  })

  if (!store || store.status !== 'ACTIVE') {
    throw createError({ statusCode: 404, statusMessage: 'Toko tidak ditemukan' })
  }

  setResponseHeader(event, 'Cache-Control', 's-maxage=60, stale-while-revalidate=300')

  return store
})
