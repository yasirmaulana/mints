export default defineEventHandler(async (event) => {
  const buyer = await requireBuyerSession(event)
  setResponseHeader(event, 'Cache-Control', 'no-store')
  return await listThreads('buyer', buyer.id, getQuery(event))
})
