import { normalizeSize, sortVariants, MAX_SIZE_LENGTH } from '~~/shared/utils/product-sizes'

export interface VariantInput { size: string; stock: number }

/**
 * Parse & validasi `variants`: JSON string (multipart form) atau array (body JSON).
 * Ukuran boleh bebas, tapi dirapikan, tidak boleh kosong/terlalu panjang/duplikat, dan stok harus bilangan bulat >= 0.
 */
export function parseVariantsInput(raw: unknown): VariantInput[] {
  let parsed: unknown = raw
  if (typeof raw === 'string') {
    try { parsed = JSON.parse(raw) } catch {
      throw createError({ statusCode: 400, statusMessage: 'Format varian ukuran tidak valid' })
    }
  }
  if (!Array.isArray(parsed)) {
    throw createError({ statusCode: 400, statusMessage: 'Format varian ukuran tidak valid' })
  }

  const seen = new Set<string>()
  const result: VariantInput[] = []
  for (const item of parsed) {
    const size = normalizeSize(item?.size)
    if (!size) throw createError({ statusCode: 400, statusMessage: 'Nama ukuran tidak boleh kosong' })
    if (size.length > MAX_SIZE_LENGTH) {
      throw createError({ statusCode: 400, statusMessage: `Ukuran "${size.slice(0, 10)}…" terlalu panjang (maks. ${MAX_SIZE_LENGTH} karakter)` })
    }
    if (seen.has(size)) {
      throw createError({ statusCode: 400, statusMessage: `Ukuran "${size}" terisi lebih dari sekali` })
    }
    seen.add(size)

    const stock = Number(item?.stock ?? 0)
    if (!Number.isInteger(stock) || stock < 0) {
      throw createError({ statusCode: 400, statusMessage: `Stok ukuran "${size}" harus bilangan bulat 0 atau lebih` })
    }
    result.push({ size, stock })
  }
  return sortVariants(result)
}
