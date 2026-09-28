export default defineEventHandler(async (event) => {
  // Setiap request memanggil RajaOngkir dengan API key kita; checkout memakai ±1 panggilan per toko.
  await rateLimitByIp(event, 'shipping-cost', 60, 10 * 60 * 1000)

  const { destination, weight, courier, storeId } = getQuery(event)

  if (!destination || !weight || !courier) {
    throw createError({ statusCode: 400, statusMessage: 'destination, weight, courier wajib diisi' })
  }
  const weightNum = Number(weight)
  if (!/^\d{1,10}$/.test(String(destination)) || !Number.isInteger(weightNum) || weightNum < 1 || weightNum > 2_000_000
    || !/^[A-Za-z0-9_:]{2,40}$/.test(String(courier))) {
    throw createError({ statusCode: 400, statusMessage: 'destination, weight, atau courier tidak valid' })
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
