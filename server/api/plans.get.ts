// Daftar paket aktif untuk halaman aktivasi & upgrade toko — publik, tanpa data sensitif.
export default defineEventHandler(async (event) => {
  const plans = await prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { searchPriority: 'asc' }
  })

  setResponseHeader(event, 'Cache-Control', 's-maxage=300, stale-while-revalidate=3600')

  return plans
})
