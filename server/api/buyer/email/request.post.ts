import { randomInt } from 'node:crypto'
import { sendOtpEmail } from '~/server/utils/mailer'

// Langkah 1 ganti/tambah email: kirim kode ke email BARU. Email profil hanya berubah setelah kode
// dari inbox email itu diverifikasi (verify.post.ts) — mencegah pendaftaran email orang lain ke akun
// sendiri (login memakai OTP email, jadi pemilik asli email itu nanti masuk ke akun penyerang).
export default defineEventHandler(async (event) => {
  const buyer = await requireBuyerSession(event)
  const { email } = await readBody(event) ?? {}

  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    throw createError({ statusCode: 400, statusMessage: 'Email tidak valid' })
  }
  const normalizedEmail = email.trim().toLowerCase()
  if (normalizedEmail === buyer.email?.toLowerCase()) {
    throw createError({ statusCode: 400, statusMessage: 'Email sama dengan email akun saat ini' })
  }

  // Batas per email (dibagi dengan send-otp login) dan per akun.
  await checkRateLimit(`send-otp-email:${normalizedEmail}`, 3, 10 * 60 * 1000)
  await checkRateLimit(`email-change:${buyer.id}`, 5, 60 * 60 * 1000)

  const taken = await prisma.buyer.findFirst({
    where: { email: { equals: normalizedEmail, mode: 'insensitive' }, NOT: { id: buyer.id } },
    select: { id: true }
  })
  if (taken) throw createError({ statusCode: 409, statusMessage: 'Email sudah digunakan akun lain' })

  await prisma.emailOtp.updateMany({ where: { email: normalizedEmail, used: false }, data: { used: true } })
  const code = String(randomInt(100000, 1000000))
  await prisma.emailOtp.create({
    data: { email: normalizedEmail, code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
  })
  await sendOtpEmail(normalizedEmail, code)

  return { success: true }
})
