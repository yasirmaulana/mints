export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const buyerId = getCookie(event, 'buyer_session')

  const required = ['buyerName', 'buyerPhone', 'address', 'cityId', 'cityName', 'items']
  for (const f of required) {
    if (!body[f]) throw createError({ statusCode: 400, statusMessage: `${f} wajib diisi` })
  }

  const phoneRegex = /^(08|628|\+628)\d{8,12}$/
  if (!phoneRegex.test(body.buyerPhone)) {
    throw createError({ statusCode: 400, statusMessage: 'Format nomor HP tidak valid' })
  }

  if (!Array.isArray(body.items) || !body.items.length) {
    throw createError({ statusCode: 400, statusMessage: 'Keranjang kosong' })
  }

  const config = useRuntimeConfig()
  const freeShippingMin = Number(config.public.freeShippingMin || 500000)

  // Validate stock & calculate order total
  const items: { productId: string; variantId: string | null; qty: number; size: string | null }[] = body.items

  const orders = await prisma.$transaction(async (tx) => {
    const createdOrders = []

    for (const item of items) {
      // Check variant stock if applicable
      if (item.variantId) {
        const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } })
        if (!variant || variant.stock < item.qty) {
          throw createError({ statusCode: 400, statusMessage: `Stok ${item.size || item.variantId} tidak cukup` })
        }
        await tx.productVariant.update({
          where: { id: item.variantId },
          data: { stock: { decrement: item.qty } }
        })
        // Mark sold out if all variants exhausted
        const remainingStock = await tx.productVariant.aggregate({
          where: { productId: item.productId },
          _sum: { stock: true }
        })
        if ((remainingStock._sum.stock ?? 0) === 0) {
          await tx.product.update({ where: { id: item.productId }, data: { status: 'SOLD_OUT' } })
        }
      }

      const product = await tx.product.findUnique({
        where: { id: item.productId },
        select: { id: true, title: true, price: true, productType: true, status: true }
      })
      if (!product) throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan' })
      if (!item.variantId && product.status === 'SOLD_OUT') {
        throw createError({ statusCode: 400, statusMessage: `${product.title} sudah habis terjual` })
      }

      const order = await tx.order.create({
        data: {
          productId: item.productId,
          buyerId: buyerId || null,
          buyerName: body.buyerName,
          buyerPhone: body.buyerPhone,
          address: body.address,
          cityId: body.cityId,
          cityName: body.cityName,
          courierCode: body.courierCode || null,
          courierService: body.courierService || null,
          shippingCost: Number(body.totalSubtotal) >= freeShippingMin ? 0 : (body.shippingCost || 0),
          status: 'PENDING_PAYMENT',
          source: 'REGULAR'
        }
      })
      createdOrders.push({ orderId: order.id, title: product.title })
    }

    return createdOrders
  })

  return { success: true, orders }
})
