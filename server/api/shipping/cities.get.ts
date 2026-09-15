export default defineEventHandler(async (event) => {
  const { search } = getQuery(event)
  const config = useRuntimeConfig()

  const res = await $fetch<any>('https://api.rajaongkir.com/starter/city', {
    headers: { key: config.rajaOngkirKey }
  })

  let cities: any[] = res?.rajaongkir?.results ?? []

  if (search) {
    const q = String(search).toLowerCase()
    cities = cities.filter((c: any) =>
      c.city_name.toLowerCase().includes(q) || c.type.toLowerCase().includes(q)
    )
  }

  return cities.slice(0, 30)
})
