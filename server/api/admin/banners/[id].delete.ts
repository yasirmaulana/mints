export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = getRouterParam(event, 'id')!
  await prisma.banner.delete({ where: { id } })
  return { success: true }
})
