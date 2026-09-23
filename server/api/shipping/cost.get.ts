export default defineEventHandler(async (event) => {
  const { destination, weight, courier, storeId } = getQuery(event)

  if (!destination || !weight || !courier) {
    throw createError({ statusCode: 400, statusMessage: 'destination, weight, courier wajib diisi' })
  }

  const config = useRuntimeConfig()
  const freeShippingMin = Number(config.public.freeShippingMin || 500000)

  // Origin per toko (checkout lintas toko, PRD §11 Fase 5) bila storeId diberikan,
  // jika tidak fallback ke pengaturan lama: DB > env > default Surabaya (501).
  let origin: string | null = null
  if (storeId) {
    const store = await prisma.store.findUnique({ where: { id: String(storeId) }, select: { cityId: true } })
    origin = store?.cityId || null
  }
  if (!origin) {
    const dbOrigin = await prisma.storeSettings.findUnique({ where: { key: 'shipping_origin_city_id' } })
    origin = dbOrigin?.value || config.rajaOngkirOriginCityId || '501'
  }

  const body = new URLSearchParams({
    origin: String(origin),
    destination: String(destination),
    weight: String(weight),
    courier: String(courier)
  })

  const res = await $fetch<any>('https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost', {
    method: 'POST',
    headers: {
      key: config.rajaOngkirKey,
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  })

  // Map new flat response shape → old nested shape used by checkout.vue
  // New: { service, description, cost: number, etd: string }
  // Old: { service, description, cost: [{ value, etd, note }] }
  const rawServices: any[] = res?.data ?? []
  const services = rawServices.map((s) => ({
    service: s.service,
    description: s.description,
    cost: [{ value: s.cost, etd: s.etd, note: '' }]
  }))

  return { services, freeShippingMin }
})
