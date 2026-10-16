export default defineEventHandler(async (event) => {
  const selfId = await requireAdminSession(event)
  const admins = await prisma.admin.findMany({
    select: { id: true, email: true, username: true, createdAt: true },
    orderBy: { createdAt: 'asc' }
  })
  return admins.map(a => ({ ...a, isSelf: a.id === selfId }))
})
