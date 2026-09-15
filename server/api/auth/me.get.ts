export default defineEventHandler(async (event) => {
  const buyer = await requireBuyerSession(event)
  return {
    id: buyer.id,
    name: buyer.name,
    email: buyer.email,
    phone: buyer.phone,
    gender: buyer.gender,
    birthDate: buyer.birthDate?.toISOString().slice(0, 10) || null
  }
})
