import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// ponytail: Upstash limiter dibuat satu instance per (max, window) combo — cache by config key
// Untuk Vercel: set UPSTASH_REDIS_REST_URL dan UPSTASH_REDIS_REST_TOKEN di environment variables

const limiterCache = new Map<string, Ratelimit>()
let redis: Redis | null = null

function getRedis() {
  if (redis) return redis
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  redis = new Redis({ url, token })
  return redis
}

function getUpstashLimiter(max: number, windowMs: number) {
  const r = getRedis()
  if (!r) return null
  const cacheKey = `${max}:${windowMs}`
  if (!limiterCache.has(cacheKey)) {
    limiterCache.set(cacheKey, new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(max, `${Math.round(windowMs / 1000)} s`),
      prefix: 'rl',
    }))
  }
  return limiterCache.get(cacheKey)!
}

// In-memory fallback for dev / VPS without Upstash
interface Bucket { count: number; resetAt: number }
const store = new Map<string, Bucket>()

function checkInMemory(key: string, max: number, windowMs: number) {
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
  if (store.size > 10000) {
    for (const [k, v] of store) { if (now > v.resetAt) store.delete(k) }
  }
}

export async function checkRateLimit(key: string, max = 5, windowMs = 15 * 60 * 1000) {
  const limiter = getUpstashLimiter(max, windowMs)
  if (limiter) {
    const { success, reset } = await limiter.limit(key)
    if (!success) {
      const retryIn = Math.ceil((reset - Date.now()) / 60000)
      throw createError({ statusCode: 429, statusMessage: `Terlalu banyak percobaan. Coba lagi dalam ${retryIn} menit` })
    }
    return
  }
  checkInMemory(key, max, windowMs)
}
