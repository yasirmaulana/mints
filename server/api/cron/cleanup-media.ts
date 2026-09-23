// Cron harian: hapus objek video di S3 yang di-presign tapi tidak pernah dikonfirmasi
// (upload gagal/dibatalkan/kadaluwarsa) — PRD §7.1, §11 Fase 3.
// Dipicu Vercel Cron (lihat vercel.json) dengan header Authorization: Bearer <CRON_SECRET>.
import { ListObjectsV2Command } from '@aws-sdk/client-s3'

const ORPHAN_AGE_MS = 24 * 60 * 60 * 1000 // objek lebih tua dari 24 jam & belum ter-confirm dianggap sampah

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const auth = getHeader(event, 'authorization')
  if (!config.cronSecret || auth !== `Bearer ${config.cronSecret}`) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const client = getS3Client()
  const confirmedKeys = new Set((await prisma.storeMedia.findMany({ select: { s3Key: true } })).map(m => m.s3Key))

  let deleted = 0
  let continuationToken: string | undefined
  do {
    const page = await client.send(new ListObjectsV2Command({
      Bucket: config.s3Bucket,
      Prefix: 'stores/',
      ContinuationToken: continuationToken
    }))

    for (const obj of page.Contents || []) {
      if (!obj.Key || confirmedKeys.has(obj.Key)) continue
      const age = Date.now() - (obj.LastModified?.getTime() || 0)
      if (age > ORPHAN_AGE_MS) {
        await deleteS3Object(obj.Key)
        deleted++
      }
    }

    continuationToken = page.IsTruncated ? page.NextContinuationToken : undefined
  } while (continuationToken)

  return { deleted }
})
