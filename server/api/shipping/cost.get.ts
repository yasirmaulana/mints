export default defineEventHandler(async (event) => {
  const { destination, weight, courier, storeId } = getQuery(event)

  if (!destination || !weight || !courier) {
    throw createError({ statusCode: 400, statusMessage: 'destination, weight, courier wajib diisi' })
  }

  const rawServices = await fetchShippingServices({
    storeId: storeId ? String(storeId) : null,
    destination: String(destination),
    weight: String(weight),
    courier: String(courier)
  })

  // Map new flat response shape → old nested shape used by checkout.vue
  // New: { service, description, cost: number, etd: string }
  // Old: { service, description, cost: [{ value, etd, note }] }
  const services = rawServices.map((s) => ({
    service: s.service,
    description: s.description,
    cost: [{ value: s.cost, etd: s.etd, note: '' }]
  }))

  return { services }
})
