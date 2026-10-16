import { sendOtpEmail } from '~/server/utils/mailer'
import { verifyRecaptcha } from '~/server/utils/recaptcha'

export default defineEventHandler(async (event) => {
  const ip = getClientIp(event)
  await checkRateLimit(`send-otp:${ip}`, 5, 10 * 60 * 1000)

  const { email, recaptchaToken } = await readBody(event) ?? {}

  await verifyRecaptcha(recaptchaToken)
  if (typeof email !== 'string' || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Email tidak valid' })
  }

  const normalizedEmail = email.trim().toLowerCase()
  // Batas per email (selain per IP): mencegah email-bombing ke satu alamat dari banyak IP.
  await checkRateLimit(`send-otp-email:${normalizedEmail}`, 3, 10 * 60 * 1000)

  const code = await issueOtp(normalizedEmail, 'BUYER')

  await sendOtpEmail(normalizedEmail, code)

  return { success: true }
})
