export default defineEventHandler(async (event) => {
  const { no, courier } = getQuery(event)
  if (!no || !courier) throw createError({ statusCode: 400, statusMessage: 'no dan courier wajib diisi' })

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
