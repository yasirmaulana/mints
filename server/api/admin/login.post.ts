import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const ip = getHeader(event, 'x-forwarded-for')?.split(',')[0].trim() ?? getRequestIP(event) ?? 'unknown'
  checkRateLimit(`admin-login:${ip}`, 10, 15 * 60 * 1000)

  const body = await readBody(event)
  const { username, password } = body ?? {}

  const config = useRuntimeConfig()

  if (!username || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Username dan password wajib diisi' })
  }

  let authenticated = false

  // 1. Check database admins first (created via admin panel)
  const dbAdmin = await prisma.admin.findUnique({ where: { username } })
  if (dbAdmin) {
    authenticated = await bcrypt.compare(password, dbAdmin.password)
  }

  // 2. Fall back to env super-admin credentials (timing-safe HMAC compare)
  if (!authenticated && config.adminUsername && config.adminPassword) {
    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey('raw', enc.encode('compare'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
    const [sigUser, sigPass, sigExpUser, sigExpPass] = await Promise.all([
      crypto.subtle.sign('HMAC', key, enc.encode(username)),
      crypto.subtle.sign('HMAC', key, enc.encode(password)),
      crypto.subtle.sign('HMAC', key, enc.encode(config.adminUsername as string)),
      crypto.subtle.sign('HMAC', key, enc.encode(config.adminPassword as string)),
    ])
    const userMatch = sigUser.byteLength === sigExpUser.byteLength &&
      new Uint8Array(sigUser).every((b, i) => b === new Uint8Array(sigExpUser)[i])
    const passMatch = sigPass.byteLength === sigExpPass.byteLength &&
      new Uint8Array(sigPass).every((b, i) => b === new Uint8Array(sigExpPass)[i])
    authenticated = userMatch && passMatch
  }

  if (!authenticated) {
    throw createError({ statusCode: 401, statusMessage: 'Username atau password salah' })
  }

  const token = await createAdminToken()
  const maxAge = 60 * 60 * 8
  setCookie(event, 'admin_session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge,
    path: '/'
  })
  // Non-httpOnly flag so client middleware can detect login state
  setCookie(event, 'admin_auth', '1', {
    httpOnly: false,
    secure: true,
    sameSite: 'strict',
    maxAge,
    path: '/'
  })

  return { success: true }
})
