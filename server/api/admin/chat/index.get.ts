export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  // Hanya chat tamu lama (dukungan platform). Chat pembeli ↔ toko bersifat privat dan tidak ditampilkan di sini.
  const sessions = await prisma.chatSession.findMany({
    where: { buyerId: null },
    orderBy: { updatedAt: 'desc' },
    include: {
      messages: { orderBy: { createdAt: 'desc' }, take: 1 }
    }
  })

  return sessions
})
