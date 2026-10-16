import { sendOtpEmail } from '~/server/utils/mailer'
import { verifyRecaptcha } from '~/server/utils/recaptcha'

// Kirim OTP login admin. Hanya email yang terdaftar sebagai admin yang benar-benar dikirimi kode,
// tapi respons SELALU sama — supaya daftar email admin tidak bisa ditebak dari sini.
export default defineEventHandler(async (event) => {
  const ip = getClientIp(event)
  await checkRateLimit(`admin-send-otp:${ip}`, 5, 10 * 60 * 1000)

  const { email, recaptchaToken } = await readBody(event) ?? {}
  await verifyRecaptcha(recaptchaToken)
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    throw createError({ statusCode: 400, statusMessage: 'Email tidak valid' })
  }

  const normalizedEmail = email.trim().toLowerCase()
  await checkRateLimit(`admin-send-otp-email:${normalizedEmail}`, 3, 10 * 60 * 1000)

  if (await resolveAdminIdByEmail(normalizedEmail)) {
    const code = await issueOtp(normalizedEmail, 'ADMIN')
    await sendOtpEmail(normalizedEmail, code, 'MINTS Admin')
  }

  return { success: true }
})
