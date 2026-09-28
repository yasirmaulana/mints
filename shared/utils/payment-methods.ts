// Daftar metode pembayaran gateway (Duitku) yang BOLEH dipilih — satu sumber kebenaran untuk client
// (daftar di checkout dan halaman langganan) dan server (validasi create-transaction & subscribe).
//
// Kartu kredit (kode Duitku "VC") sengaja TIDAK ada di daftar ini. Menyembunyikan tombol di UI tidak
// cukup: server menerima kode apa pun yang dikirim klien, jadi server menolak semua kode di luar daftar.
// Untuk mengaktifkan metode lain, tambahkan di sini SAJA (kode harus sama dengan kode Duitku:
// cek daftar resmi di dashboard Duitku atau API getpaymentmethod).
//
// "FT" (transfer bank manual) bukan metode gateway dan ditangani terpisah di create-transaction.
export type PaymentKind = 'va' | 'qris' | 'redirect'

export interface GatewayMethod {
  code: string
  name: string
  description: string
  /** va/qris: nomor VA atau QR ditampilkan di halaman sendiri; redirect: pindah ke halaman gateway. */
  kind: PaymentKind
}

export const GATEWAY_METHODS: GatewayMethod[] = [
  { code: 'BC', name: 'Virtual Account BCA', description: 'Transfer via Virtual Account BCA', kind: 'va' },
  { code: 'M2', name: 'Virtual Account Mandiri', description: 'Transfer via Virtual Account Mandiri', kind: 'va' },
  { code: 'BR', name: 'Virtual Account BRI', description: 'Transfer via Virtual Account BRI (BRIVA)', kind: 'va' },
  { code: 'I1', name: 'Virtual Account BNI', description: 'Transfer via Virtual Account BNI', kind: 'va' },
  { code: 'SP', name: 'ShopeePay', description: 'Bayar dengan ShopeePay (QRIS)', kind: 'qris' },
  { code: 'OV', name: 'OVO', description: 'Bayar dengan OVO', kind: 'redirect' },
  { code: 'DA', name: 'DANA', description: 'Bayar dengan DANA', kind: 'redirect' }
]

const ALLOWED_CODES = new Set(GATEWAY_METHODS.map(m => m.code))

export function isAllowedGatewayMethod(code: unknown): code is string {
  return typeof code === 'string' && ALLOWED_CODES.has(code)
}

/** Metode yang nomor VA/QR-nya ditampilkan di /account/pembayaran (bukan redirect ke gateway). */
export const NO_REDIRECT_METHODS: string[] = GATEWAY_METHODS.filter(m => m.kind !== 'redirect').map(m => m.code)

/**
 * Label untuk MENAMPILKAN metode yang tersimpan di pesanan, termasuk kode lama yang tidak bisa dipilih lagi.
 * Sebelumnya kode Duitku salah dipetakan (mis. "VC" ditampilkan sebagai "Virtual Account BCA" padahal
 * kartu kredit); label kode lama di bawah mengikuti arti kodenya di Duitku.
 */
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  ...Object.fromEntries(GATEWAY_METHODS.map(m => [m.code, m.name])),
  FT: 'Transfer Bank Manual',
  VC: 'Kartu Kredit',
  BT: 'Virtual Account Permata',
  B1: 'Virtual Account CIMB Niaga',
  BK: 'BCA KlikPay'
}
