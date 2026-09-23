// Checkout lintas toko — PRD §11 Fase 5. Keranjang dipecah per toko: satu Order per item,
// storeId & ongkir diambil per kelompok toko. Pembayaran tetap satu transaksi Duitku yang
// mencakup semua order (lihat server/api/payment/create-transaction.post.ts).
// Komisi platform (plan.commissionPercent / Order.commissionAmount) untuk sementara tidak
// dipakai — dihitung ulang bila fitur ini diaktifkan kembali.
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

  const items: { productId: string; variantId: string | null; qty: number; size: string | null; source?: string }[] = body.items
  // shippingByStore: { [storeId | 'null']: { courierCode, courierService, cost } } — dipilih per toko di step pengiriman.
  const shippingByStore: Record<string, { courierCode?: string; courierService?: string; cost?: number }> = body.shippingByStore || {}

  const orders = await prisma.$transaction(async (tx) => {
    const createdOrders: { orderId: string; title: string; storeId: string | null; amount: number }[] = []
    const storeSubtotals = new Map<string, number>() // storeId|'null' -> subtotal produk
    const storeFirstOrder = new Map<string, string>() // storeId|'null' -> id order pertama (penampung ongkir)

    // Pass 1: validasi stok, buat Order, kumpulkan subtotal per toko.
    for (const item of items) {
      if (item.variantId) {
        const variant = await tx.productVariant.findUnique({ where: { id: item.variantId } })
        if (!variant || variant.stock < item.qty) {
          throw createError({ statusCode: 400, statusMessage: `Stok ${item.size || item.variantId} tidak cukup` })
        }
        await tx.productVariant.update({ where: { id: item.variantId }, data: { stock: { decrement: item.qty } } })
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
        select: { id: true, title: true, price: true, productType: true, status: true, storeId: true }
      })
      if (!product) throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan' })
      if (!item.variantId && product.status === 'SOLD_OUT') {
        throw createError({ statusCode: 400, statusMessage: `${product.title} sudah habis terjual` })
      }

      const storeKey = product.storeId || 'null'
      const qty = item.qty || 1
      const lineSubtotal = Number(product.price) * qty
      storeSubtotals.set(storeKey, (storeSubtotals.get(storeKey) || 0) + lineSubtotal)

      const orderSource = (item.source as 'REGULAR' | 'FLASH_SALE' | 'OFFLINE') || 'REGULAR'
      const order = await tx.order.create({
        data: {
          productId: item.productId,
          variantId: item.variantId || null,
          qty,
          buyerId: buyerId || null,
          buyerName: body.buyerName,
          buyerPhone: body.buyerPhone,
          address: body.address,
          cityId: body.cityId,
          cityName: body.cityName,
          storeId: product.storeId,
          status: 'PENDING_PAYMENT',
          source: orderSource
        }
      })

      if (!storeFirstOrder.has(storeKey)) storeFirstOrder.set(storeKey, order.id)
      createdOrders.push({ orderId: order.id, title: product.title, storeId: product.storeId, amount: lineSubtotal })
    }

    // Pass 2: tempel ongkir (di order pertama tiap toko saja, agar tidak dobel saat dijumlah).
    for (const [storeKey, firstOrderId] of storeFirstOrder) {
      const subtotal = storeSubtotals.get(storeKey) || 0
      const shipping = shippingByStore[storeKey] || {}
      const shippingCost = subtotal >= freeShippingMin ? 0 : Number(shipping.cost || 0)
      await tx.order.update({
        where: { id: firstOrderId },
        data: {
          courierCode: shipping.courierCode || null,
          courierService: shipping.courierService || null,
          shippingCost
        }
      })
    }

    return createdOrders
  })

  return { success: true, orders }
})
