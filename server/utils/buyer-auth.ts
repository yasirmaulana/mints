export async function requireBuyerSession(event: any) {
  const buyerId = getCookie(event, 'buyer_session')
  if (!buyerId) {
    throw createError({ statusCode: 401, statusMessage: 'Login diperlukan' })
  }
  const buyer = await prisma.buyer.findUnique({ where: { id: buyerId } })
  if (!buyer) {
    deleteCookie(event, 'buyer_session')
    throw createError({ statusCode: 401, statusMessage: 'Sesi tidak valid' })
  }
  return buyer
}
