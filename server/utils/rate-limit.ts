// In-memory rate limiter — resets on server restart
// ponytail: upgrade ke Redis/unstorage jika multi-instance deployment

interface Bucket {
  count: number
  resetAt: number
}

const store = new Map<string, Bucket>()

/**
 * Enforce rate limit. Throws 429 if exceeded.
 * @param key      Identifier (e.g. `login:${ip}`)
 * @param max      Max attempts in window
 * @param windowMs Window duration in ms
 */
export function checkRateLimit(key: string, max = 5, windowMs = 15 * 60 * 1000) {
  const now = Date.now()
  let bucket = store.get(key)

  if (!bucket || now > bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs }
    store.set(key, bucket)
  }

  bucket.count++
  if (bucket.count > max) {
    throw createError({
      statusCode: 429,
      statusMessage: `Terlalu banyak percobaan. Coba lagi dalam ${Math.ceil((bucket.resetAt - now) / 60000)} menit`
    })
  }

  // Cleanup stale keys occasionally
  if (store.size > 10000) {
    for (const [k, v] of store) {
      if (now > v.resetAt) store.delete(k)
    }
  }
}
