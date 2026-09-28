// Mulai sesi chat baru. Selalu membuat sesi baru dan menerbitkan token akses untuk pembuatnya:
// versi lama memakai ulang sesi terbuka berdasarkan buyerPhone yang tidak diverifikasi, sehingga
// siapa pun yang mengetik nomor HP korban mendapat sessionId sesi korban dan bisa membaca isinya.
export default defineEventHandler(async (event) => {
  const ip = getHeader(event, 'x-forwarded-for')?.split(',')[0].trim() ?? getRequestIP(event) ?? 'unknown'
  await checkRateLimit(`chat-start:${ip}`, 10, 5 * 60 * 1000)

  const body = await readBody(event) ?? {}
  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const buyerName = str(body.buyerName)
  const buyerPhone = str(body.buyerPhone).replace(/\s/g, '')
  const message = str(body.message)
  const productId = str(body.productId).slice(0, 64) || null
  const orderId = str(body.orderId)

  if (!buyerPhone || !buyerName || !message) {
    throw createError({ statusCode: 400, statusMessage: 'buyerPhone, buyerName, dan message wajib diisi' })
  }
  if (buyerName.length > 100) throw createError({ statusCode: 400, statusMessage: 'Nama terlalu panjang (maks. 100 karakter)' })
  if (message.length > MAX_CHAT_MESSAGE) {
    throw createError({ statusCode: 400, statusMessage: `Pesan terlalu panjang (maks. ${MAX_CHAT_MESSAGE} karakter)` })
  }
  if (!/^(08|628|\+628)\d{7,12}$/.test(buyerPhone)) {
    throw createError({ statusCode: 400, statusMessage: 'Format nomor HP tidak valid' })
  }

  // Kaitkan ke pesanan hanya bila pesanan itu benar-benar milik nomor HP ini.
  const linkedOrder = orderId
    ? await prisma.order.findFirst({ where: { id: orderId, buyerPhone }, select: { id: true } })
    : null

  const session = await prisma.chatSession.create({
    data: {
      buyerPhone,
      buyerName,
      productId,
      orderId: linkedOrder?.id ?? null,
      messages: { create: { sender: 'buyer', body: message } }
    }
  })

  return { sessionId: session.id, token: await signChatSession(session.id) }
})
