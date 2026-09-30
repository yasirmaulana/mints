// Checkout lintas toko — PRD §11 Fase 5. Keranjang dipecah per toko: satu Order per item,
// storeId & ongkir diambil per kelompok toko. Pembayaran tetap satu transaksi Duitku yang
// mencakup semua order (lihat server/api/payment/create-transaction.post.ts).
// Komisi platform (plan.commissionPercent / Order.commissionAmount) untuk sementara tidak
// dipakai — dihitung ulang bila fitur ini diaktifkan kembali.
const MAX_CART_ITEMS = 50
const MAX_ITEM_QTY = 100

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const buyerId = await getBuyerId(event)

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
    select: { id: true, title: true, storeId: true, store: { select: { status: true } } }
  })
  const productById = new Map(products.map(p => [p.id, p]))
  const weightByStore = new Map<string, number>()
  for (const item of items) {
    const product = productById.get(item.productId)
    if (!product) throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan' })
    // Katalog publik hanya menampilkan toko ACTIVE (PRD §6.4); checkout harus konsisten,
    // kalau tidak toko EXPIRED/SUSPENDED/DRAFT masih bisa dibeli lewat productId langsung.
    if (product.storeId && product.store?.status !== 'ACTIVE') {
      throw createError({ statusCode: 400, statusMessage: `${product.title} tidak dapat dibeli: toko sedang tidak aktif` })
    }
    const key = product.storeId || 'null'
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
    } catch (err) {
      console.error('[checkout] fetchShippingServices gagal:', storeKey, err)
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
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        select: { id: true, title: true, price: true, productType: true, status: true, storeId: true }
      })
      if (!product) throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan' })

      if (item.variantId) {
        // Varian harus milik produk yang dibeli (harga diambil dari produk, stok dari varian — tanpa
        // syarat ini stok produk lain bisa "dipinjam"). Pengurangan stok atomik dalam satu statement:
        // cek-lalu-update terpisah bisa oversell saat dua checkout membaca stok yang sama bersamaan.
        const { count } = await tx.productVariant.updateMany({
          where: { id: item.variantId, productId: item.productId, stock: { gte: item.qty } },
          data: { stock: { decrement: item.qty } }
        })
        if (count === 0) {
          throw createError({ statusCode: 400, statusMessage: `Stok ${item.size || item.variantId} tidak cukup` })
        }
        const remainingStock = await tx.productVariant.aggregate({
          where: { productId: item.productId },
          _sum: { stock: true }
        })
        if ((remainingStock._sum.stock ?? 0) === 0) {
          await tx.product.update({ where: { id: item.productId }, data: { status: 'SOLD_OUT' } })
        }
      } else {
        // Produk berukuran wajib memilih varian; tanpa ini stok tidak pernah berkurang (pesan tanpa batas).
        if (await tx.productVariant.count({ where: { productId: product.id } }) > 0) {
          throw createError({ statusCode: 400, statusMessage: `Pilih ukuran untuk ${product.title}` })
        }
        if (product.status === 'SOLD_OUT') {
          throw createError({ statusCode: 400, statusMessage: `${product.title} sudah habis terjual` })
        }
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
          // Kuota terbatas: compare-and-swap pada usedCount yang barusan dibaca. Cek `usedCount < quota`
          // lalu increment terpisah bisa dilewati dua checkout bersamaan; di sini yang kalah dapat count 0.
          const { count } = await tx.voucher.updateMany({
            where: voucher!.quota === null ? { id: voucher!.id } : { id: voucher!.id, usedCount: voucher!.usedCount },
            data: { usedCount: { increment: 1 } }
          })
          if (count === 0) {
            throw createError({ statusCode: 409, statusMessage: 'Kuota voucher baru saja habis atau berubah, coba lagi' })
          }
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

  // Simpan alamat baru untuk buyer login (best-effort — kegagalan di sini tidak boleh
  // menggagalkan checkout yang sudah sukses). Tidak dobel kalau alamat identik sudah ada.
  if (buyerId && body.saveAddress) {
    try {
      const dup = await prisma.address.findFirst({
        where: { buyerId, address: body.address, cityId: body.cityId }
      })
      if (!dup) {
        const existingCount = await prisma.address.count({ where: { buyerId } })
        await prisma.address.create({
          data: {
            buyerId,
            recipientName: body.buyerName,
            phone: body.buyerPhone,
            address: body.address,
            cityId: body.cityId,
            cityName: body.cityName,
            isDefault: existingCount === 0
          }
        })
      }
    } catch {
      // abaikan — pesanan tetap berhasil dibuat
    }
  }

  return { success: true, orders }
})
