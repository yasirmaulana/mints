import { randomInt } from 'node:crypto'

// OTP email bersama untuk pembeli dan admin. `purpose` memisahkan keduanya: kode yang diminta lewat
// login pembeli tidak bisa dipakai di login admin (dan sebaliknya), walau emailnya sama.
export type OtpPurpose = 'BUYER' | 'ADMIN'

const OTP_TTL_MS = 10 * 60 * 1000

/** Terbitkan kode baru (OTP lama yang belum dipakai untuk email+purpose yang sama dihanguskan). */
export async function issueOtp(email: string, purpose: OtpPurpose): Promise<string> {
  await prisma.emailOtp.updateMany({
    where: { email, purpose, used: false },
    data: { used: true }
  })

  // CSPRNG — Math.random() bisa diprediksi dan tidak layak untuk kode verifikasi.
  const code = String(randomInt(100000, 1000000))
  await prisma.emailOtp.create({
    data: { email, purpose, code, expiresAt: new Date(Date.now() + OTP_TTL_MS) }
  })
  return code
}

/** Cocokkan dan hanguskan kode. true bila valid, belum dipakai, dan belum kedaluwarsa. */
export async function consumeOtp(email: string, code: string, purpose: OtpPurpose): Promise<boolean> {
  const otp = await prisma.emailOtp.findFirst({
    where: { email, purpose, code: code.trim(), used: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' }
  })
  if (!otp) return false
  await prisma.emailOtp.update({ where: { id: otp.id }, data: { used: true } })
  return true
}
