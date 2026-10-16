export default defineEventHandler(async (event) => {
  const thread = await getBuyerThread(event, getRouterParam(event, 'id')!)
  setResponseHeader(event, 'Cache-Control', 'no-store')
  return { messages: await readThreadMessages(thread, 'buyer', getQuery(event).after) }
})
