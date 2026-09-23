// Ringkasan kuota toko untuk dashboard — PRD §8.1.
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const ctx = await getStoreContext(event, id, { requireActive: false })
  return buildQuotaSummary(ctx)
})
