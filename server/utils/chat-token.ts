// Chat pembeli tidak butuh login, jadi akses ke sebuah sesi dijaga token rahasia yang diterbitkan
// saat sesi dibuat (HMAC dari sessionId, disimpan di browser pembeli). Tanpa token, mengetahui
// sessionId atau nomor HP orang lain tidak cukup untuk membaca/menulis chat-nya.
// Prefix "chat." memisahkan input HMAC dari token admin ("v1.") dan pembeli ("b1.").
export const MAX_CHAT_MESSAGE = 2000

export async function signChatSession(sessionId: string): Promise<string> {
  return hmacSign(getSecret(), `chat.${sessionId}`)
}

/**
 * Izinkan akses bila token sesi valid. `allowAdmin` (hanya untuk membaca) melewati token bagi admin
 * yang sudah login — panel admin membaca pesan lewat endpoint yang sama; membalas tetap lewat
 * /api/admin/chat/[id]/reply, jadi admin tidak perlu menulis lewat endpoint publik.
 */
export async function assertChatAccess(event: any, sessionId: string, opts: { allowAdmin?: boolean } = {}) {
  if (opts.allowAdmin && (await verifyAdminToken(getCookie(event, 'admin_session')))) return
  const token = getHeader(event, 'x-chat-token')
  if (!token || !(await hmacVerify(getSecret(), `chat.${sessionId}`, token))) {
    throw createError({ statusCode: 403, statusMessage: 'Akses chat tidak diizinkan' })
  }
}
