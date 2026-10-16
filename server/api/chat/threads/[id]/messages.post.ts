export default defineEventHandler(async (event) => {
  const thread = await getBuyerThread(event, getRouterParam(event, 'id')!)
  return await postThreadMessage(thread.id, 'buyer', await readBody(event))
})
