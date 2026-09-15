export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, 'sessionId')!
  const body = await readBody(event)

  if (!body?.message?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'message wajib diisi' })
  }

  const session = await prisma.chatSession.findUnique({ where: { id: sessionId } })
  if (!session) throw createError({ statusCode: 404, statusMessage: 'Session tidak ditemukan' })

  const msg = await prisma.chatMessage.create({
    data: { sessionId, sender: 'buyer', body: body.message.trim() }
  })

  await prisma.chatSession.update({
    where: { id: sessionId },
    data: { isRead: false, updatedAt: new Date() }
  })

  return msg
})
