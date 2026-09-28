// Logika ukuran produk yang dipakai bersama client (form produk) dan server (validasi + urutan tampil).
// Ukuran disimpan sebagai string bebas di ProductVariant.size; file ini yang menjaga agar
// "xl", "XL " dan "16.5"/"16,5" tidak jadi ukuran yang berbeda, dan mengurutkannya dengan benar.

export const MAX_SIZE_LENGTH = 20

// Urutan ukuran huruf dari kecil ke besar.
const LETTER_ORDER = ['XXXS', 'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL', '5XL']
const FREE_SIZE = 'Free Size'

export interface SizePreset {
  key: string
  label: string
  sizes: string[]
}

export const SIZE_PRESETS: SizePreset[] = [
  { key: 'huruf', label: 'Huruf', sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },
  { key: 'anak', label: 'Angka kecil (anak)', sizes: ['2', '4', '6', '8', '10', '12', '14'] },
  { key: 'belasan', label: 'Belasan', sizes: ['16', '16,5', '17', '17,5', '18', '18,5', '19'] },
  { key: 'puluhan', label: 'Puluhan', sizes: ['28', '30', '32', '34', '36', '38', '40'] },
  { key: 'free', label: 'Free Size', sizes: [FREE_SIZE] }
]

export const CUSTOM_PRESET_KEY = 'kustom'

/** Rapikan input ukuran: trim, rapatkan spasi, desimal pakai koma, huruf kapital, "free size" baku. */
export function normalizeSize(raw: unknown): string {
  let s = String(raw ?? '').trim().replace(/\s+/g, ' ')
  if (/^\d+[.,]\d+$/.test(s)) s = s.replace('.', ',')
  if (s.toLowerCase() === FREE_SIZE.toLowerCase()) return FREE_SIZE
  if (/^[a-z0-9]+$/i.test(s) && /[a-z]/i.test(s)) s = s.toUpperCase()
  return s
}

function numericValue(size: string): number | null {
  return /^\d+(,\d+)?$/.test(size) ? parseFloat(size.replace(',', '.')) : null
}

// Peringkat grup: huruf (0) → Free Size (1) → angka (2) → lainnya (3)
function rank(size: string): [number, number] {
  const letterIdx = LETTER_ORDER.indexOf(size)
  if (letterIdx !== -1) return [0, letterIdx]
  if (size === FREE_SIZE) return [1, 0]
  const n = numericValue(size)
  if (n !== null) return [2, n]
  return [3, 0]
}

export function compareSizes(a: string, b: string): number {
  const [ga, va] = rank(a)
  const [gb, vb] = rank(b)
  if (ga !== gb) return ga - gb
  if (va !== vb) return va - vb
  return a.localeCompare(b, 'id', { numeric: true })
}

/** Urutkan array varian (atau objek berkey `size`) — tidak mengubah array asli. */
export function sortVariants<T extends { size: string }>(variants: T[]): T[] {
  return [...variants].sort((x, y) => compareSizes(x.size, y.size))
}

/** Preset mana yang cocok dengan kumpulan ukuran ini? Semua ukuran harus ada di preset; selain itu "kustom". */
export function detectPresetKey(sizes: string[]): string {
  if (!sizes.length) return SIZE_PRESETS[0].key
  const hit = SIZE_PRESETS.find(p => sizes.every(s => p.sizes.includes(s)))
  return hit ? hit.key : CUSTOM_PRESET_KEY
}
