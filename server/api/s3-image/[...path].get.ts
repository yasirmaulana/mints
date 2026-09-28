import { GetObjectCommand } from '@aws-sdk/client-s3'
import type { Readable } from 'stream'

// Proxy baca untuk objek S3 (bucket tidak public). Objek dialirkan (stream), bukan dibaca utuh ke
// memori — video bisa sampai 200 MB dan versi lama menampungnya seluruhnya di memori fungsi.
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const key = safePublicS3Key(getRouterParam(event, 'path'))
  if (!key) throw createError({ statusCode: 403, statusMessage: 'Akses tidak diizinkan' })

  // Dukungan Range (satu rentang saja): Safari/iOS tidak memutar video tanpanya, dan seek jadi murah.
  const rangeHeader = getHeader(event, 'range')
  const range = rangeHeader && /^bytes=\d*-\d*$/.test(rangeHeader) ? rangeHeader : undefined

  let response
  try {
    response = await getS3Client().send(new GetObjectCommand({ Bucket: config.s3Bucket, Key: key, Range: range }))
  } catch (err: any) {
    const status = err?.$metadata?.httpStatusCode
    if (status === 404 || err?.name === 'NoSuchKey') throw createError({ statusCode: 404, statusMessage: 'File tidak ditemukan' })
    if (status === 416) throw createError({ statusCode: 416, statusMessage: 'Rentang tidak valid' })
    throw createError({ statusCode: 502, statusMessage: 'Gagal mengambil file' })
  }

  if (response.ContentType) setResponseHeader(event, 'Content-Type', response.ContentType)
  if (response.ContentLength !== undefined) setResponseHeader(event, 'Content-Length', response.ContentLength)
  setResponseHeader(event, 'Accept-Ranges', 'bytes')
  if (range && response.ContentRange) {
    setResponseStatus(event, 206)
    setResponseHeader(event, 'Content-Range', response.ContentRange)
  }
  setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

  return sendStream(event, response.Body as Readable)
})
