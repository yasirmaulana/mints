export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, 'sessionId')!
  await assertChatAccess(event, sessionId)
  await checkRateLimit(`chat-msg:${sessionId}`, 30, 5 * 60 * 1000)

  const body = await readBody(event)
  const message = typeof body?.message === 'string' ? body.message.trim() : ''

  if (!message) {
    throw createError({ statusCode: 400, statusMessage: 'message wajib diisi' })
  }
  if (message.length > MAX_CHAT_MESSAGE) {
    throw createError({ statusCode: 400, statusMessage: `Pesan terlalu panjang (maks. ${MAX_CHAT_MESSAGE} karakter)` })
  }

  const session = await prisma.chatSession.findUnique({ where: { id: sessionId } })
  if (!session) throw createError({ statusCode: 404, statusMessage: 'Session tidak ditemukan' })

  const msg = await prisma.chatMessage.create({
    data: { sessionId, sender: 'buyer', body: message }
  })

  await prisma.chatSession.update({
    where: { id: sessionId },
    data: { isRead: false, updatedAt: new Date() }
  })

  return msg
})
