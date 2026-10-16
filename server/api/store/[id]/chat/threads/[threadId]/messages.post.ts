export default defineEventHandler(async (event) => {
  const thread = await getSellerThread(event, getRouterParam(event, 'id')!, getRouterParam(event, 'threadId')!)
  return await postThreadMessage(thread.id, 'seller', await readBody(event))
})
