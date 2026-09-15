export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const sessions = await prisma.chatSession.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      messages: { orderBy: { createdAt: 'desc' }, take: 1 }
    }
  })

  return sessions
})
