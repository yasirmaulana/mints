import { sendOtpEmail } from '~/server/utils/mailer'
import { verifyRecaptcha } from '~/server/utils/recaptcha'

export default defineEventHandler(async (event) => {
  const ip = getHeader(event, 'x-forwarded-for')?.split(',')[0].trim() ?? getRequestIP(event) ?? 'unknown'
  checkRateLimit(`send-otp:${ip}`, 5, 10 * 60 * 1000)

  const { email, recaptchaToken } = await readBody(event) ?? {}

  await verifyRecaptcha(recaptchaToken)
  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Email tidak valid' })
  }

  const normalizedEmail = email.trim().toLowerCase()

  // Invalidate OTP lama yang belum dipakai
  await prisma.emailOtp.updateMany({
    where: { email: normalizedEmail, used: false },
    data: { used: true },
  })

  const code = String(Math.floor(100000 + Math.random() * 900000))
  await prisma.emailOtp.create({
    data: {
      email: normalizedEmail,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  })

  await sendOtpEmail(normalizedEmail, code)

  return { success: true }
})
