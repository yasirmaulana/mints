import { isIP } from 'node:net'
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

// Jumlah proxy tepercaya di depan aplikasi (env TRUSTED_PROXY_COUNT, default 1).
// - Vercel: 1 (Vercel menimpa x-forwarded-for dengan IP klien, isinya satu entri).
// - VPS, satu Nginx yang menimpa header dengan $remote_addr (setelah real_ip): 1.
// - VPS, Cloudflare + Nginx yang menambahkan ($proxy_add_x_forwarded_for): 2.
// Lihat CATATAN_DEPLOY_VPS.md.
function trustedProxyCount(): number {
  const n = Number.parseInt(process.env.TRUSTED_PROXY_COUNT ?? '1', 10)
  return Number.isInteger(n) && n >= 1 && n <= 5 ? n : 1
}

let warnedShortChain = false

/**
 * IP klien yang tidak bisa dipalsukan dari luar: entri ke-N dari KANAN x-forwarded-for, yaitu entri
 * yang ditambahkan proxy yang kita percaya. Isian dari klien ada di sebelah kiri dan diabaikan —
 * mengambil entri pertama membuat semua rate limit bisa dilewati dengan mengirim header palsu.
 * Bila header tidak ada/tidak valid, dipakai IP koneksi socket.
 */
export function getClientIp(event: any): string {
  const n = trustedProxyCount()
  const entries = (getHeader(event, 'x-forwarded-for') ?? '').split(',').map((s: string) => s.trim()).filter(Boolean)

  if (entries.length) {
    let picked: string
    if (entries.length >= n) {
      picked = entries[entries.length - n]
    } else {
      // Rantai lebih pendek dari yang dikonfigurasi (mis. TRUSTED_PROXY_COUNT=2 di Vercel yang hanya
      // punya satu entri). Memakai IP socket akan membuat semua pengunjung berbagi satu IP proxy dan
      // saling memblokir, jadi pakai entri pertama yang ada dan beri tahu lewat log.
      if (!warnedShortChain) {
        warnedShortChain = true
        console.warn(`[client-ip] TRUSTED_PROXY_COUNT=${n} tetapi x-forwarded-for hanya berisi ${entries.length} entri — periksa konfigurasi proxy`)
      }
      picked = entries[0]
    }
    if (isIP(picked)) return picked
  }

  const socketIp = getRequestIP(event)
  return socketIp && isIP(socketIp) ? socketIp : 'unknown'
}

/** Batasi request per IP untuk endpoint publik: `scope` membedakan bucket antar endpoint. */
export async function rateLimitByIp(event: any, scope: string, max: number, windowMs: number) {
  await checkRateLimit(`${scope}:${getClientIp(event)}`, max, windowMs)
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
