const TOKEN_VERSION = 'v1'

function getSecret(): string {
  const s = useRuntimeConfig().sessionSecret as string
  if (!s) throw createError({ statusCode: 500, statusMessage: 'SESSION_SECRET tidak dikonfigurasi' })
  return s
}

async function hmacSign(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function hmacVerify(secret: string, data: string, sig: string): Promise<boolean> {
  const expected = await hmacSign(secret, data)
  if (expected.length !== sig.length) return false
  // constant-time compare
  let diff = 0
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i)
  return diff === 0
}

/** Generate a signed admin session token: "v1.<timestamp>.<hmac>" */
export async function createAdminToken(): Promise<string> {
  const ts = Date.now().toString()
  const secret = getSecret()
  const sig = await hmacSign(secret, `${TOKEN_VERSION}.${ts}`)
  return `${TOKEN_VERSION}.${ts}.${sig}`
}

/** Verify token is valid and not older than maxAgeMs (default 8h) */
export async function verifyAdminToken(token: string | undefined, maxAgeMs = 8 * 60 * 60 * 1000): Promise<boolean> {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3 || parts[0] !== TOKEN_VERSION) return false
  const [, ts, sig] = parts
  const age = Date.now() - parseInt(ts)
  if (isNaN(age) || age > maxAgeMs || age < 0) return false
  const secret = getSecret()
  return hmacVerify(secret, `${TOKEN_VERSION}.${ts}`, sig)
}

export async function requireAdminSession(event: any) {
  const token = getCookie(event, 'admin_session')
  if (!(await verifyAdminToken(token))) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}
