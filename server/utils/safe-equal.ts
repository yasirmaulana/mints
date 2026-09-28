import { createHash, timingSafeEqual } from 'node:crypto'

/**
 * Bandingkan dua string rahasia (signature webhook, bearer cron) dalam waktu konstan.
 * Keduanya di-hash dulu supaya panjangnya sama — timingSafeEqual menolak buffer beda panjang,
 * dan pengecekan panjang manual justru membocorkan panjang rahasia.
 */
export function safeEqual(a: unknown, b: unknown): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}
