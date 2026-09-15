export default defineEventHandler(async (event) => {
  const { origin, destination, weight, courier } = getQuery(event)

  if (!origin || !destination || !weight || !courier) {
    throw createError({ statusCode: 400, statusMessage: 'origin, destination, weight, courier wajib diisi' })
  }

  const config = useRuntimeConfig()
  const freeShippingMin = Number(config.public.freeShippingMin || 500000)

  // Return free shipping indicator without calling API
  const body = new URLSearchParams({
    origin: String(origin),
    destination: String(destination),
    weight: String(weight),
    courier: String(courier)
  })

  const res = await $fetch<any>('https://api.rajaongkir.com/starter/cost', {
    method: 'POST',
    headers: {
      key: config.rajaOngkirKey,
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  })

  const services = res?.rajaongkir?.results?.[0]?.costs ?? []
  return { services, freeShippingMin }
})
