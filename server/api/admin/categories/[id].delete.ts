export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const id = getRouterParam(event, 'id')!
  await prisma.category.delete({ where: { id } })
  return { success: true }
})
