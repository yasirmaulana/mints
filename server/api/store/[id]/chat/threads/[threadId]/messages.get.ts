export default defineEventHandler(async (event) => {
  const thread = await getSellerThread(event, getRouterParam(event, 'id')!, getRouterParam(event, 'threadId')!)
  setResponseHeader(event, 'Cache-Control', 'no-store')
  return { messages: await readThreadMessages(thread, 'seller', getQuery(event).after) }
})
