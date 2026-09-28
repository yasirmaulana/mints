export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const id = getRouterParam(event, 'id')!
  await prisma.flashSaleConfig.delete({ where: { id } })
  return { success: true }
})
