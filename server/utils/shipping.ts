// Perhitungan ongkir lewat RajaOngkir — dipakai endpoint pratinjau (shipping/cost.get.ts)
// dan checkout (regular.post.ts), supaya ongkir yang ditagih dihitung server, bukan dipercaya dari client.

// Berat per unit produk (gram). Harus sama dengan storeWeight() di pages/checkout.vue,
// karena ongkir yang dilihat pembeli dihitung dari berat itu.
export const UNIT_WEIGHT_GRAMS = 300

export interface ShippingService {
  service: string
  description: string
  cost: number
  etd: string
}

export async function fetchShippingServices(opts: {
  storeId?: string | null
  destination: string
  weight: number | string
  courier: string
}): Promise<ShippingService[]> {
  const config = useRuntimeConfig()

  // Origin per toko (checkout lintas toko, PRD §11 Fase 5) bila storeId diberikan,
  // jika tidak fallback ke pengaturan lama: DB > env > default Surabaya (501).
  let origin: string | null = null
  if (opts.storeId) {
    const store = await prisma.store.findUnique({ where: { id: String(opts.storeId) }, select: { cityId: true } })
    origin = store?.cityId || null
  }
  if (!origin) {
    const dbOrigin = await prisma.storeSettings.findUnique({ where: { key: 'shipping_origin_city_id' } })
    origin = dbOrigin?.value || config.rajaOngkirOriginCityId || '501'
  }

  const body = new URLSearchParams({
    origin: String(origin),
    destination: String(opts.destination),
    weight: String(opts.weight),
    courier: String(opts.courier)
  })

  const res = await $fetch<any>('https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost', {
    method: 'POST',
    headers: {
      key: config.rajaOngkirKey,
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  })

  // Bentuk respons baru RajaOngkir: { service, description, cost: number, etd: string }
  return res?.data ?? []
}
