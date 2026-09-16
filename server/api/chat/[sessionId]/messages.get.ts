export default defineEventHandler(async (event) => {
  const sessionId = getRouterParam(event, 'sessionId')!

  const session = await prisma.chatSession.findUnique({ where: { id: sessionId } })
  if (!session) throw createError({ statusCode: 404, statusMessage: 'Session tidak ditemukan' })

  // SSE stream
  const { res } = event.node
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders?.()

  const sendEvent = (data: unknown) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  // Send existing messages
  const existing = await prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' }
  })
  sendEvent({ type: 'init', messages: existing })

  // Poll for new messages every 2s — use createdAt, not id (UUID ordering is alphabetical, not chronological)
  let lastCreatedAt: Date = existing.length ? existing[existing.length - 1].createdAt : new Date(0)
  const interval = setInterval(async () => {
    const newMsgs = await prisma.chatMessage.findMany({
      where: { sessionId, createdAt: { gt: lastCreatedAt } },
      orderBy: { createdAt: 'asc' }
    })
    if (newMsgs.length) {
      lastCreatedAt = newMsgs[newMsgs.length - 1].createdAt
      sendEvent({ type: 'messages', messages: newMsgs })
    }
  }, 2000)

  event.node.req.on('close', () => {
    clearInterval(interval)
    res.end()
  })

  // Keep alive ping every 15s
  const ping = setInterval(() => {
    res.write(': ping\n\n')
  }, 15000)
  event.node.req.on('close', () => clearInterval(ping))

  // Prevent Nitro from auto-closing
  return new Promise(() => {})
})
