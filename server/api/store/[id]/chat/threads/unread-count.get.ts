export default defineEventHandler(async (event) => {
  const storeId = getRouterParam(event, 'id')!
  await getStoreContext(event, storeId, { requireActive: false })
  setResponseHeader(event, 'Cache-Control', 'no-store')
  return { count: await unreadTotal('seller', storeId) }
})
