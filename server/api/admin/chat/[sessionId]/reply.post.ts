export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const sessionId = getRouterParam(event, 'sessionId')!
  const body = await readBody(event)

  if (!body?.message?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'message wajib diisi' })
  }

  const session = await prisma.chatSession.findUnique({ where: { id: sessionId } })
  if (!session) throw createError({ statusCode: 404, statusMessage: 'Session tidak ditemukan' })

  const msg = await prisma.chatMessage.create({
    data: { sessionId, sender: 'admin', body: body.message.trim() }
  })

  await prisma.chatSession.update({
    where: { id: sessionId },
    data: { isRead: true, updatedAt: new Date() }
  })

  // Send WA notification to buyer
  const config = useRuntimeConfig()
  const fonnteKey = config.fonnteApiKey
  if (fonnteKey && session.buyerPhone && body.notifyWa !== false) {
    await $fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { Authorization: fonnteKey },
      body: { target: session.buyerPhone, message: `[MINTS] ${body.message.trim()}` }
    }).catch(() => {})
  }

  return msg
})
