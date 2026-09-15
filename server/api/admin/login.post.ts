export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, password, turnstileToken } = body ?? {}

  await verifyTurnstile(turnstileToken ?? '', getHeader(event, 'x-forwarded-for') ?? getRequestIP(event) ?? '')
  const config = useRuntimeConfig()

  console.log('[admin/login] body received:', { username, password: password ? '***' : undefined })
  console.log('[admin/login] config.adminUsername:', config.adminUsername)
  console.log('[admin/login] config.adminPassword set:', !!config.adminPassword)

  if (!username || !password) {
    console.log('[admin/login] missing username or password')
    throw createError({ statusCode: 400, statusMessage: 'Username dan password wajib diisi' })
  }

  if (username !== config.adminUsername || password !== config.adminPassword) {
    console.log('[admin/login] credential mismatch — expected username:', config.adminUsername)
    throw createError({ statusCode: 401, statusMessage: 'Username atau password salah' })
  }

  setCookie(event, 'admin_session', 'authenticated', {
    sameSite: 'strict',
    maxAge: 60 * 60 * 8
  })

  console.log('[admin/login] login success for:', username)
  return { success: true }
})
