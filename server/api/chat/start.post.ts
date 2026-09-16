export default defineEventHandler(async (event) => {
  const ip = getHeader(event, 'x-forwarded-for')?.split(',')[0].trim() ?? getRequestIP(event) ?? 'unknown'
  checkRateLimit(`chat-start:${ip}`, 10, 5 * 60 * 1000)

  const body = await readBody(event)
  const { buyerPhone, buyerName, productId, orderId, message } = body

  if (!buyerPhone || !buyerName || !message) {
    throw createError({ statusCode: 400, statusMessage: 'buyerPhone, buyerName, dan message wajib diisi' })
  }

  // Reuse existing session if open (within 24h)
  const existing = await prisma.chatSession.findFirst({
    where: {
      buyerPhone,
      ...(productId ? { productId } : {}),
      createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    },
    orderBy: { createdAt: 'desc' }
  })

  let sessionId = existing?.id

  if (!sessionId) {
    const session = await prisma.chatSession.create({
      data: { buyerPhone, buyerName, productId: productId || null, orderId: orderId || null }
    })
    sessionId = session.id
  }

  await prisma.chatMessage.create({
    data: { sessionId, sender: 'buyer', body: message }
  })

  await prisma.chatSession.update({
    where: { id: sessionId },
    data: { isRead: false, updatedAt: new Date() }
  })

  return { sessionId }
})
