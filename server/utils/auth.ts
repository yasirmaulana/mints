export function getSecret(): string {
  const s = useRuntimeConfig().sessionSecret as string
  if (!s) throw createError({ statusCode: 500, statusMessage: 'SESSION_SECRET tidak dikonfigurasi' })
  return s
}

export async function hmacSign(secret: string, data: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function hmacVerify(secret: string, data: string, sig: string): Promise<boolean> {
  const expected = await hmacSign(secret, data)
  if (expected.length !== sig.length) return false
  // constant-time compare
  let diff = 0
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i)
  return diff === 0
}

// Sesi admin: cookie `admin_session` berisi token bertanda tangan HMAC dengan identitas admin.
// Format: "a1.<adminId>.<expiryMs>.<hmac>" (prefix "a1" memisahkan dari token pembeli "b1." dan chat "chat.").
// adminId = id baris Admin, atau ROOT_ADMIN_ID untuk super-admin dari env ADMIN_EMAIL (tanpa baris di tabel).
const ADMIN_TOKEN_VERSION = 'a1'
export const ADMIN_SESSION_MAX_AGE_SEC = 60 * 60 * 8
export const ROOT_ADMIN_ID = 'root'

function rootAdminEmail(): string {
  return String(useRuntimeConfig().adminEmail || '').trim().toLowerCase()
}

/** Cari admin yang boleh login dengan email ini (tabel Admin, atau super-admin env). null = bukan admin. */
export async function resolveAdminIdByEmail(email: string): Promise<string | null> {
  const dbAdmin = await prisma.admin.findUnique({ where: { email }, select: { id: true } })
  if (dbAdmin) return dbAdmin.id
  const root = rootAdminEmail()
  return root && root === email ? ROOT_ADMIN_ID : null
}

export async function createAdminToken(adminId: string): Promise<string> {
  const exp = Date.now() + ADMIN_SESSION_MAX_AGE_SEC * 1000
  const payload = `${ADMIN_TOKEN_VERSION}.${adminId}.${exp}`
  return `${payload}.${await hmacSign(getSecret(), payload)}`
}

/**
 * adminId bila token valid, belum kedaluwarsa, DAN admin-nya masih terdaftar (dicek ke DB tiap request
 * supaya admin yang dihapus langsung kehilangan akses, tidak menunggu token habis). Selain itu null.
 */
export async function verifyAdminSession(token: string | undefined): Promise<string | null> {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 4 || parts[0] !== ADMIN_TOKEN_VERSION) return null
  const [, adminId, exp, sig] = parts
  if (!adminId || !(Number(exp) > Date.now())) return null
  if (!(await hmacVerify(getSecret(), `${ADMIN_TOKEN_VERSION}.${adminId}.${exp}`, sig))) return null

  if (adminId === ROOT_ADMIN_ID) return rootAdminEmail() ? ROOT_ADMIN_ID : null
  const admin = await prisma.admin.findUnique({ where: { id: adminId }, select: { email: true } })
  return admin?.email ? adminId : null
}

export async function verifyAdminToken(token: string | undefined): Promise<boolean> {
  return !!(await verifyAdminSession(token))
}

/** Pastikan request datang dari admin yang login; kembalikan adminId-nya. */
export async function requireAdminSession(event: any): Promise<string> {
  const adminId = await verifyAdminSession(getCookie(event, 'admin_session'))
  if (!adminId) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  return adminId
}

export function setAdminSession(event: any, token: string) {
  const opts = { secure: true, sameSite: 'strict', maxAge: ADMIN_SESSION_MAX_AGE_SEC, path: '/' } as const
  setCookie(event, 'admin_session', token, { ...opts, httpOnly: true })
  // Flag non-httpOnly agar middleware client tahu status login
  setCookie(event, 'admin_auth', '1', { ...opts, httpOnly: false })
}
