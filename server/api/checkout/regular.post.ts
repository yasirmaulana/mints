// Checkout lintas toko — PRD §11 Fase 5. Keranjang dipecah per toko: satu Order per item,
// storeId & ongkir diambil per kelompok toko. Pembayaran tetap satu transaksi Duitku yang
// mencakup semua order (lihat server/api/payment/create-transaction.post.ts).
// Komisi platform (plan.commissionPercent / Order.commissionAmount) untuk sementara tidak
// dipakai — dihitung ulang bila fitur ini diaktifkan kembali.
const MAX_CART_ITEMS = 50
const MAX_ITEM_QTY = 100

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

  const items: { productId: string; variantId: string | null; qty: number; size: string | null; source?: string }[] = body.items
  // shippingByStore: { [storeId | 'null']: { courierCode, courierService, cost } } — dipilih per toko di step pengiriman.
  // Field `cost` dari client DIABAIKAN: ongkir dihitung ulang server dari RajaOngkir (lihat di bawah).
  const shippingByStore: Record<string, { courierCode?: string; courierService?: string; cost?: number }> = body.shippingByStore || {}
  // voucherByStore: { [storeId | 'null']: code } — kode voucher diinput per toko di step checkout.
  const voucherByStore: Record<string, string> = body.voucherByStore || {}

  // Validasi item: qty negatif/pecahan/nol akan menambah stok atau membuat subtotal negatif.
  if (items.length > MAX_CART_ITEMS) {
    throw createError({ statusCode: 400, statusMessage: `Maksimal ${MAX_CART_ITEMS} item per checkout` })
  }
  for (const item of items) {
    if (!item || typeof item.productId !== 'string' || !item.productId) {
      throw createError({ statusCode: 400, statusMessage: 'Data item keranjang tidak valid' })
    }
    if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > MAX_ITEM_QTY) {
      throw createError({ statusCode: 400, statusMessage: `Jumlah item harus bilangan bulat 1–${MAX_ITEM_QTY}` })
    }
  }

  // Hitung ongkir di server per toko (di luar transaksi DB: ada panggilan HTTP eksternal,
  // dan interactive transaction Prisma punya timeout pendek).
  const products = await prisma.product.findMany({
    where: { id: { in: [...new Set(items.map(i => i.productId))] } },
    select: { id: true, storeId: true }
  })
  const storeByProduct = new Map(products.map(p => [p.id, p.storeId]))
  const weightByStore = new Map<string, number>()
  for (const item of items) {
    if (!storeByProduct.has(item.productId)) throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan' })
    const key = storeByProduct.get(item.productId) || 'null'
    weightByStore.set(key, (weightByStore.get(key) || 0) + item.qty * UNIT_WEIGHT_GRAMS)
  }

  const shippingResolved = new Map<string, { courierCode: string; courierService: string; cost: number }>()
  await Promise.all([...weightByStore].map(async ([storeKey, weight]) => {
    const selected = shippingByStore[storeKey]
    if (!selected?.courierCode || !selected?.courierService) {
      throw createError({ statusCode: 400, statusMessage: 'Pilih layanan pengiriman untuk semua toko' })
    }
    let services
    try {
      services = await fetchShippingServices({
        storeId: storeKey === 'null' ? null : storeKey,
        destination: String(body.cityId),
        weight,
        courier: String(selected.courierCode)
      })
    } catch {
      throw createError({ statusCode: 502, statusMessage: 'Gagal menghitung ongkos kirim, coba lagi' })
    }
    const match = services.find(s => s.service === selected.courierService)
    const cost = Math.round(Number(match?.cost))
    if (!match || !Number.isFinite(cost) || cost < 0) {
      throw createError({ statusCode: 400, statusMessage: 'Layanan pengiriman tidak tersedia, pilih ulang' })
    }
    shippingResolved.set(storeKey, { courierCode: String(selected.courierCode), courierService: match.service, cost })
  }))

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
      const qty = item.qty
      const lineSubtotal = Number(product.price) * qty
      storeSubtotals.set(storeKey, (storeSubtotals.get(storeKey) || 0) + lineSubtotal)

      // OFFLINE hanya dibuat admin lewat endpoint sendiri, bukan dari checkout publik.
      const orderSource = item.source === 'FLASH_SALE' ? 'FLASH_SALE' : 'REGULAR'
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

    // Pass 2: tempel ongkir + voucher (di order pertama tiap toko saja, agar tidak dobel saat dijumlah).
    for (const [storeKey, firstOrderId] of storeFirstOrder) {
      const subtotal = storeSubtotals.get(storeKey) || 0
      const shipping = shippingResolved.get(storeKey)
      if (!shipping) throw createError({ statusCode: 400, statusMessage: 'Ongkos kirim tidak dapat dihitung' })
      const shippingCost = shipping.cost

      // Voucher divalidasi ulang di sini (bukan percaya nilai dari client) sebelum dipakai memotong harga.
      let voucherCode: string | null = null
      let discountAmount = 0
      const inputCode = voucherByStore[storeKey]
      if (inputCode && storeKey !== 'null') {
        const code = inputCode.trim().toUpperCase()
        const voucher = await tx.voucher.findUnique({ where: { storeId_code: { storeId: storeKey, code } } })
        const valid = voucher
          && voucher.isActive
          && (!voucher.expiresAt || voucher.expiresAt >= new Date())
          && (voucher.quota === null || voucher.usedCount < voucher.quota)
          && subtotal >= voucher.minPurchase
        if (valid) {
          voucherCode = voucher!.code
          discountAmount = Math.min(voucher!.discountAmount, subtotal)
          await tx.voucher.update({ where: { id: voucher!.id }, data: { usedCount: { increment: 1 } } })
        }
      }

      await tx.order.update({
        where: { id: firstOrderId },
        data: {
          courierCode: shipping.courierCode,
          courierService: shipping.courierService,
          shippingCost,
          voucherCode,
          discountAmount: discountAmount || null
        }
      })
    }

    return createdOrders
  })

  return { success: true, orders }
})
