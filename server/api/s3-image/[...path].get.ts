import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { Readable } from 'stream'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rawPath = getRouterParam(event, 'path')
  if (!rawPath) throw createError({ statusCode: 400 })

  // Prevent path traversal — only allow paths under known prefixes
  const ALLOWED_PREFIXES = ['products/', 'payments/', 'uploads/']
  const normalised = rawPath.replace(/\.\.\//g, '').replace(/^\/+/, '')
  if (!ALLOWED_PREFIXES.some(p => normalised.startsWith(p))) {
    throw createError({ statusCode: 403, statusMessage: 'Akses tidak diizinkan' })
  }
  const path = normalised

  const client = new S3Client({
    region: config.s3Region,
    endpoint: config.s3Endpoint,
    credentials: {
      accessKeyId: config.s3AccessKey,
      secretAccessKey: config.s3SecretKey
    },
    forcePathStyle: true
  })

  const response = await client.send(new GetObjectCommand({
    Bucket: config.s3Bucket,
    Key: path
  }))

  if (response.ContentType) {
    setResponseHeader(event, 'Content-Type', response.ContentType)
  }
  setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

  // Stream body ke response
  const stream = response.Body as Readable
  const chunks: Buffer[] = []
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
})
