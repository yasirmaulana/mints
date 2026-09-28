// Pembatalan order yang masih menunggu bayar + pengembalian stok/voucher — dipakai callback pembayaran
// gagal dan cron pembatalan otomatis, supaya keduanya memakai logika yang sama.

/**
 * Batalkan satu order HANYA bila statusnya masih PENDING_PAYMENT, lalu kembalikan stok varian
 * dan kuota voucher yang ia pakai. Kembalian `false` = order sudah diproses/dibatalkan sebelumnya,
 * tidak ada yang diubah — callback yang dikirim ulang tidak boleh mengembalikan stok dua kali,
 * dan order yang sudah lunas tidak boleh dibatalkan. Panggil di dalam prisma.$transaction.
 */
export async function cancelPendingOrder(tx: any, orderId: string): Promise<boolean> {
  const { count } = await tx.order.updateMany({
    where: { id: orderId, status: 'PENDING_PAYMENT' },
    data: { status: 'CANCELLED' }
  })
  if (count === 0) return false

  const order = await tx.order.findUnique({
    where: { id: orderId },
    select: { productId: true, variantId: true, qty: true, storeId: true, voucherCode: true }
  })
  if (!order) return true

  if (order.variantId) {
    await tx.productVariant.update({ where: { id: order.variantId }, data: { stock: { increment: order.qty } } })
    const total = await tx.productVariant.aggregate({ where: { productId: order.productId }, _sum: { stock: true } })
    await tx.product.update({
      where: { id: order.productId },
      data: { status: (total._sum.stock ?? 0) > 0 ? 'AVAILABLE' : 'SOLD_OUT' }
    })
  } else if (order.productId) {
    await tx.product.update({ where: { id: order.productId }, data: { status: 'AVAILABLE' } })
  }

  // Kuota voucher dikembalikan (dipakai satu kali per order pembawa voucher di checkout).
  if (order.voucherCode && order.storeId) {
    await tx.voucher.updateMany({
      where: { storeId: order.storeId, code: order.voucherCode, usedCount: { gt: 0 } },
      data: { usedCount: { decrement: 1 } }
    })
  }

  return true
}
