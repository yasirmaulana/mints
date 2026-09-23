import { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { randomUUID } from 'crypto'

const MAX_SIZE = 2 * 1024 * 1024 // 2 MB

export function getS3Client() {
  const config = useRuntimeConfig()
  return new S3Client({
    region: config.s3Region,
    endpoint: config.s3Endpoint,
    credentials: {
      accessKeyId: config.s3AccessKey,
      secretAccessKey: config.s3SecretKey
    },
    forcePathStyle: true
  })
}

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export async function uploadToS3(data: Buffer, filename: string, contentType: string, prefix = 'products'): Promise<string> {
  if (!ALLOWED_MIME.has(contentType)) {
    throw createError({ statusCode: 400, statusMessage: 'Tipe file tidak diizinkan. Gunakan JPG, PNG, WebP, atau GIF' })
  }
  if (data.length > MAX_SIZE) {
    throw createError({ statusCode: 400, statusMessage: `Ukuran file terlalu besar. Maksimal 2 MB (saat ini ${(data.length / 1024 / 1024).toFixed(1)} MB)` })
  }

  const config = useRuntimeConfig()
  const client = getS3Client()
  // Sanitize filename — allow only safe chars, strip path components
  const safeName = filename.split(/[/\\]/).pop()?.replace(/[^a-zA-Z0-9_\-. ]/g, '_') || 'upload'
  const key = `${prefix}/${Date.now()}-${safeName}`

  await client.send(new PutObjectCommand({
    Bucket: config.s3Bucket,
    Key: key,
    Body: data,
    ContentType: contentType
  }))

  // Return proxy URL — bucket tidak public, gambar diakses via /api/s3-image/
  return `/api/s3-image/${key}`
}

// Upload video via presigned URL — PRD_Multi_Toko_Langganan.md §7.1.
// Vercel membatasi body request serverless ke ±4,5 MB, jadi video (15–200 MB)
// harus diunggah langsung dari browser ke S3, bukan lewat endpoint Nitro.
const ALLOWED_VIDEO_MIME = new Set(['video/mp4', 'video/quicktime', 'video/webm'])
const VIDEO_EXT: Record<string, string> = { 'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm' }
const PRESIGN_EXPIRES_SEC = 600 // 10 menit, sesuai PRD

export function isAllowedVideoMime(mime: string) {
  return ALLOWED_VIDEO_MIME.has(mime)
}

/** Terbitkan presigned PUT URL untuk upload video langsung ke S3. */
export async function presignVideoUpload(storeId: string, productId: string, mimeType: string) {
  if (!isAllowedVideoMime(mimeType)) {
    throw createError({ statusCode: 400, statusMessage: 'Tipe video tidak diizinkan. Gunakan MP4, MOV, atau WebM' })
  }

  const config = useRuntimeConfig()
  const client = getS3Client()
  const ext = VIDEO_EXT[mimeType]
  const key = `stores/${storeId}/${productId}/${randomUUID()}.${ext}`

  const url = await getSignedUrl(
    client,
    new PutObjectCommand({ Bucket: config.s3Bucket, Key: key, ContentType: mimeType }),
    { expiresIn: PRESIGN_EXPIRES_SEC }
  )

  return { uploadUrl: url, s3Key: key, expiresIn: PRESIGN_EXPIRES_SEC }
}

/** Verifikasi objek benar-benar ada di S3 dan ambil ukurannya — jangan percaya angka dari browser. */
export async function headS3Object(key: string) {
  const config = useRuntimeConfig()
  const client = getS3Client()
  try {
    const res = await client.send(new HeadObjectCommand({ Bucket: config.s3Bucket, Key: key }))
    return { exists: true, sizeBytes: res.ContentLength || 0, contentType: res.ContentType }
  } catch {
    return { exists: false, sizeBytes: 0, contentType: undefined }
  }
}

export async function deleteS3Object(key: string) {
  const config = useRuntimeConfig()
  const client = getS3Client()
  await client.send(new DeleteObjectCommand({ Bucket: config.s3Bucket, Key: key })).catch(() => {})
}
