// Sesi pembeli: cookie `buyer_session` berisi token bertanda tangan HMAC, BUKAN buyerId mentah.
// Format: "b1.<buyerId>.<expiryMs>.<hmac>". Dengan begitu mengetahui/menebak UUID pembeli
// tidak cukup untuk menyamar sebagai pembeli itu. Prefix "b1" memisahkan input HMAC dari token admin ("v1.").
const BUYER_TOKEN_VERSION = 'b1'
export const BUYER_SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30

export async function createBuyerToken(buyerId: string): Promise<string> {
  const exp = Date.now() + BUYER_SESSION_MAX_AGE_SEC * 1000
  const payload = `${BUYER_TOKEN_VERSION}.${buyerId}.${exp}`
  return `${payload}.${await hmacSign(getSecret(), payload)}`
}

/** Kembalikan buyerId bila token valid dan belum kedaluwarsa, selain itu null. */
export async function verifyBuyerToken(token: string | undefined): Promise<string | null> {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 4 || parts[0] !== BUYER_TOKEN_VERSION) return null
  const [, buyerId, exp, sig] = parts
  if (!buyerId || !(Number(exp) > Date.now())) return null
  const ok = await hmacVerify(getSecret(), `${BUYER_TOKEN_VERSION}.${buyerId}.${exp}`, sig)
  return ok ? buyerId : null
}

/** buyerId dari cookie sesi yang tervalidasi (null = tamu / sesi tidak valid). */
export async function getBuyerId(event: any): Promise<string | null> {
  return verifyBuyerToken(getCookie(event, 'buyer_session'))
}

/** Set cookie sesi + flag `buyer_auth` (dibaca middleware client). */
export async function setBuyerSession(event: any, buyerId: string, sameSite: 'strict' | 'lax' = 'strict') {
  const token = await createBuyerToken(buyerId)
  const opts = { secure: true, sameSite, maxAge: BUYER_SESSION_MAX_AGE_SEC, path: '/' } as const
  setCookie(event, 'buyer_session', token, { ...opts, httpOnly: true })
  setCookie(event, 'buyer_auth', '1', { ...opts, httpOnly: false })
}

function clearBuyerSession(event: any) {
  deleteCookie(event, 'buyer_session', { path: '/' })
  deleteCookie(event, 'buyer_auth', { path: '/' })
}

export async function requireBuyerSession(event: any) {
  const buyerId = await getBuyerId(event)
  if (!buyerId) {
    // Cookie lama (buyerId mentah), rusak, atau kedaluwarsa: bersihkan juga flag client
    // supaya middleware halaman mengarahkan ke login, bukan terjebak di halaman yang 401.
    if (getCookie(event, 'buyer_session')) clearBuyerSession(event)
    throw createError({ statusCode: 401, statusMessage: 'Login diperlukan' })
  }
  const buyer = await prisma.buyer.findUnique({ where: { id: buyerId } })
  if (!buyer) {
    clearBuyerSession(event)
    throw createError({ statusCode: 401, statusMessage: 'Sesi tidak valid' })
  }
  return buyer
}
