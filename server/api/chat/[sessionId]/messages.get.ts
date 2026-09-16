export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, 'sessionId')!
  const { after } = getQuery(event)

  const session = await prisma.chatSession.findUnique({ where: { id: sessionId } })
  if (!session) throw createError({ statusCode: 404, statusMessage: 'Session tidak ditemukan' })

  const where: Record<string, any> = { sessionId }
  if (after) {
    const afterDate = new Date(String(after))
    if (!isNaN(afterDate.getTime())) where.createdAt = { gt: afterDate }
  }

  const messages = await prisma.chatMessage.findMany({
    where,
    orderBy: { createdAt: 'asc' }
  })

  setResponseHeader(event, 'Cache-Control', 'no-store')
  return { messages }
})
