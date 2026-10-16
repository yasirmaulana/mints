// Chat pembeli ↔ toko. Dua sisi memakai logika yang sama; bedanya hanya sisi mana yang membaca/menulis:
//   'buyer'  = pembeli (akses lewat sesi pembeli, thread miliknya)
//   'seller' = pemilik toko (akses lewat getStoreContext, thread tokonya)
export type ChatSide = 'buyer' | 'seller'

const LIST_LIMIT = 100
const MESSAGE_LIMIT = 200
const PREVIEW_LEN = 120

function serializeThread(t: any, side: ChatSide) {
  return {
    id: t.id,
    storeId: t.storeId as string,
    // pembeli melihat nama toko, penjual melihat nama pembeli
    name: side === 'buyer' ? t.store?.name ?? 'Toko' : t.buyerName,
    slug: side === 'buyer' ? t.store?.slug ?? null : null,
    avatarUrl: side === 'buyer' ? t.store?.logoUrl ?? null : null,
    lastMessage: t.lastMessage,
    lastMessageAt: t.lastMessageAt,
    unread: side === 'buyer' ? t.buyerUnread : t.sellerUnread
  }
}

/** Thread milik pembeli ini, atau 404. */
export async function getBuyerThread(event: any, threadId: string) {
  const buyer = await requireBuyerSession(event)
  const thread = await prisma.chatSession.findFirst({ where: { id: threadId, buyerId: buyer.id } })
  if (!thread) throw createError({ statusCode: 404, statusMessage: 'Percakapan tidak ditemukan' })
  return thread
}

/** Thread milik toko ini (dan pemanggil pemilik tokonya), atau 404. */
export async function getSellerThread(event: any, storeId: string, threadId: string) {
  await getStoreContext(event, storeId, { requireActive: false })
  const thread = await prisma.chatSession.findFirst({ where: { id: threadId, storeId, buyerId: { not: null } } })
  if (!thread) throw createError({ statusCode: 404, statusMessage: 'Percakapan tidak ditemukan' })
  return thread
}

export async function listThreads(side: ChatSide, ownerId: string, query: { q?: unknown; unread?: unknown } = {}) {
  const q = typeof query.q === 'string' ? query.q.trim().slice(0, 100) : ''
  const unreadOnly = query.unread === '1' || query.unread === 'true'

  const where: Record<string, any> = side === 'buyer'
    ? { buyerId: ownerId, storeId: { not: null } }
    : { storeId: ownerId, buyerId: { not: null } }
  if (unreadOnly) where[side === 'buyer' ? 'buyerUnread' : 'sellerUnread'] = { gt: 0 }
  if (q) {
    if (side === 'buyer') where.store = { name: { contains: q, mode: 'insensitive' } }
    else where.buyerName = { contains: q, mode: 'insensitive' }
  }

  const threads = await prisma.chatSession.findMany({
    where,
    orderBy: { lastMessageAt: 'desc' },
    take: LIST_LIMIT,
    include: { store: { select: { name: true, slug: true, logoUrl: true } } }
  })
  return threads.map(t => serializeThread(t, side))
}

export async function unreadTotal(side: ChatSide, ownerId: string): Promise<number> {
  const field = side === 'buyer' ? 'buyerUnread' : 'sellerUnread'
  const agg = await prisma.chatSession.aggregate({
    where: side === 'buyer' ? { buyerId: ownerId, storeId: { not: null } } : { storeId: ownerId, buyerId: { not: null } },
    _sum: { [field]: true }
  })
  return agg._sum[field] ?? 0
}

/** Pesan thread (lebih baru dari `after` bila diberikan) dan tandai terbaca untuk sisi pembaca. */
export async function readThreadMessages(thread: { id: string; buyerUnread: number; sellerUnread: number }, side: ChatSide, after?: unknown) {
  const afterDate = typeof after === 'string' && after ? new Date(after) : null
  const hasCursor = !!afterDate && !isNaN(afterDate.getTime())

  const rows = await prisma.chatMessage.findMany({
    where: { sessionId: thread.id, ...(hasCursor ? { createdAt: { gt: afterDate! } } : {}) },
    orderBy: { createdAt: hasCursor ? 'asc' : 'desc' },
    take: MESSAGE_LIMIT
  })
  const messages = hasCursor ? rows : rows.reverse()

  const unread = side === 'buyer' ? thread.buyerUnread : thread.sellerUnread
  if (unread > 0) {
    await prisma.chatSession.update({
      where: { id: thread.id },
      data: side === 'buyer' ? { buyerUnread: 0 } : { sellerUnread: 0 }
    })
  }
  return messages
}

/** Tulis pesan teks dari `side`: simpan, perbarui ringkasan thread, tambah unread sisi lawan. */
export async function postThreadMessage(threadId: string, side: ChatSide, body: unknown) {
  await checkRateLimit(`chat-thread:${threadId}:${side}`, 30, 5 * 60 * 1000)

  const text = typeof (body as any)?.message === 'string' ? (body as any).message.trim() : ''
  if (!text) throw createError({ statusCode: 400, statusMessage: 'Pesan tidak boleh kosong' })
  if (text.length > MAX_CHAT_MESSAGE) {
    throw createError({ statusCode: 400, statusMessage: `Pesan terlalu panjang (maks. ${MAX_CHAT_MESSAGE} karakter)` })
  }

  const [msg] = await prisma.$transaction([
    prisma.chatMessage.create({ data: { sessionId: threadId, sender: side, body: text } }),
    prisma.chatSession.update({
      where: { id: threadId },
      data: {
        lastMessage: text.slice(0, PREVIEW_LEN),
        lastMessageAt: new Date(),
        ...(side === 'buyer' ? { buyerUnread: 0, sellerUnread: { increment: 1 } } : { sellerUnread: 0, buyerUnread: { increment: 1 } })
      }
    })
  ])
  return msg
}

export { serializeThread }
