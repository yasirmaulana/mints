export default defineEventHandler(async (event) => {
  // Proxy publik ke RajaOngkir memakai API key kita: tanpa batas, kuota bisa dihabiskan pihak luar.
  await rateLimitByIp(event, 'track', 20, 10 * 60 * 1000)

  const { no, courier } = getQuery(event)
  if (!no || !courier) throw createError({ statusCode: 400, statusMessage: 'no dan courier wajib diisi' })
  if (!/^[A-Za-z0-9-]{4,40}$/.test(String(no)) || !/^[A-Za-z0-9_]{2,20}$/.test(String(courier))) {
    throw createError({ statusCode: 400, statusMessage: 'Nomor resi atau kurir tidak valid' })
  }

  const config = useRuntimeConfig()

  const body = new URLSearchParams({
    waybill: String(no),
    courier: String(courier)
  })

  const res = await $fetch<any>('https://api.rajaongkir.com/starter/waybill', {
    method: 'POST',
    headers: {
      key: config.rajaOngkirKey,
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  })

  const result = res?.rajaongkir?.result
  if (!result) throw createError({ statusCode: 404, statusMessage: 'Data pengiriman tidak ditemukan' })

  return result
})
