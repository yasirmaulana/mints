export default defineEventHandler(async (event) => {
  const { search } = getQuery(event)
  const config = useRuntimeConfig()

  const res = await $fetch<any>('https://rajaongkir.komerce.id/api/v1/destination/domestic-destination', {
    headers: { key: config.rajaOngkirKey },
    query: search ? { search: String(search) } : {}
  })

  const destinations: any[] = res?.data ?? []

  // Map new shape → old shape used by checkout.vue
  // New: { id, label, city_name, province_name, district_name, subdistrict_name, zip_code }
  // Old: { city_id, city_name, type, province }
  return destinations.slice(0, 30).map((d) => ({
    city_id: String(d.id),
    city_name: d.subdistrict_name || d.city_name,
    type: d.district_name ? d.district_name : '',
    province: d.province_name,
    // pass through for display label
    label: d.label
  }))
})
