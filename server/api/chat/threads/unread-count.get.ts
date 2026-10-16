export default defineEventHandler(async (event) => {
  const buyer = await requireBuyerSession(event)
  setResponseHeader(event, 'Cache-Control', 'no-store')
  return { count: await unreadTotal('buyer', buyer.id) }
})
