export default defineEventHandler(async (event) => {
  // Autocomplete kota dipanggil tiap ketikan (debounce 300 ms), jadi batasnya lebih longgar.
  await rateLimitByIp(event, 'shipping-cities', 120, 10 * 60 * 1000)

  const { search } = getQuery(event)
  if (search && String(search).length > 100) {
    throw createError({ statusCode: 400, statusMessage: 'Kata pencarian terlalu panjang' })
  }
  const config = useRuntimeConfig()

  const res = await $fetch<any>('https://rajaongkir.komerce.id/api/v1/destination/domestic-destination', {
    headers: { key: config.rajaOngkirKey },
    query: search ? { search: String(search), limit: 50 } : { limit: 50 }
  })

  const destinations: any[] = res?.data ?? []

  // Map new shape → old shape used by checkout.vue
  // New: { id, label, city_name, province_name, district_name, subdistrict_name, zip_code }
  // Old: { city_id, city_name, type, province }
  return destinations.map((d) => ({
    city_id: String(d.id),
    city_name: d.subdistrict_name || d.city_name,
    type: d.district_name ? d.district_name : '',
    province: d.province_name,
    // pass through for display label
    label: d.label
  }))
})
