// Daftar paket langganan untuk admin — PRD §11 Fase 6 (tab "Paket").
export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  return prisma.plan.findMany({ orderBy: { searchPriority: 'asc' } })
})
