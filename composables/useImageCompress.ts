// Kompres gambar di browser lalu konversi ke WebP sebelum diunggah.
// Endpoint upload lewat Nitro (batas body Vercel ±4,5 MB, batas server 2 MB di uploadToS3),
// jadi foto besar dari HP harus dikecilkan di client dulu.
export interface CompressOptions {
  maxWidth?: number
  maxBytes?: number
  quality?: number
}

const MAX_INPUT_BYTES = 20 * 1024 * 1024 // tolak file mentah yang terlalu besar supaya browser tidak kehabisan memori

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', quality))
}

export async function compressToWebp(file: File, opts: CompressOptions = {}): Promise<File> {
  const { maxWidth = 1920, maxBytes = 1.8 * 1024 * 1024, quality = 0.82 } = opts

  if (!file.type.startsWith('image/')) throw new Error('File harus berupa gambar')
  // GIF dilewati: canvas hanya mengambil frame pertama dan menghilangkan animasi.
  if (file.type === 'image/gif') return file
  if (file.size > MAX_INPUT_BYTES) throw new Error('File terlalu besar (maks. 20 MB)')

  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new Error('Gambar tidak dapat dibaca')
  }

  let width = Math.min(bitmap.width, maxWidth)
  let q = quality
  let blob: Blob | null = null

  // Turunkan kualitas, lalu dimensi, sampai ukurannya masuk batas.
  for (let attempt = 0; attempt < 6; attempt++) {
    const height = Math.round(bitmap.height * (width / bitmap.width))
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) break
    ctx.drawImage(bitmap, 0, 0, width, height)

    blob = await canvasToBlob(canvas, q)
    // Browser yang tidak mendukung encode WebP akan mengembalikan PNG/JPEG.
    if (!blob || blob.type !== 'image/webp') { blob = null; break }
    if (blob.size <= maxBytes) break

    if (q > 0.6) q -= 0.1
    else width = Math.round(width * 0.8)
  }
  bitmap.close()

  if (!blob) throw new Error('Browser tidak mendukung konversi WebP')
  if (blob.size > maxBytes) throw new Error('Gambar masih terlalu besar setelah dikompres, gunakan gambar lain')

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image'
  return new File([blob], `${baseName}.webp`, { type: 'image/webp' })
}
