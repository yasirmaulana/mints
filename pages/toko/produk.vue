<template>
  <div class="min-h-screen antialiased" style="background:#f5f5f2;color:#090b0c;font-family:'Inter Tight',system-ui,sans-serif">
    <header class="sticky top-0 z-40 px-5 py-4 md:px-12" style="background:rgba(245,245,242,0.88);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.06)">
      <div class="relative flex h-10 items-center max-w-4xl mx-auto">
        <NuxtLink :to="`/toko/dashboard?store=${storeId}`" class="flex items-center gap-2 text-sm transition-opacity hover:opacity-60" style="color:#090b0c">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Dashboard
        </NuxtLink>
        <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2 font-black text-xl tracking-tighter" style="color:#090b0c;letter-spacing:-0.04em">MINTS</NuxtLink>
      </div>
    </header>

    <div class="mx-auto max-w-4xl px-5 py-10 md:px-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-normal tracking-tight">Produk Toko</h2>
        <button class="rounded-full px-5 py-2.5 text-sm font-normal" style="background:#090b0c;color:white" @click="openProductForm()">
          + Tambah Produk
        </button>
      </div>

      <div v-if="errorMsg" class="rounded-2xl px-4 py-3 mb-5 text-sm" style="background:#fde8e8;color:#991b1b">{{ errorMsg }}</div>

      <div v-if="loading" class="py-10 text-center text-sm" style="color:rgba(9,11,12,0.5)">Memuat…</div>
      <div v-else-if="!products.length" class="py-10 text-center text-sm" style="color:rgba(9,11,12,0.5)">Belum ada produk.</div>
      <div v-else class="grid gap-4 md:grid-cols-3">
        <div v-for="p in products" :key="p.id" class="rounded-3xl overflow-hidden" style="background:white">
          <img :src="p.imageUrl" :alt="p.title" class="w-full aspect-square object-cover" />
          <div class="p-4">
            <p class="text-sm font-normal truncate">{{ p.title }}</p>
            <p class="text-sm mt-1" style="color:rgba(9,11,12,0.55)">Rp {{ Number(p.price).toLocaleString('id-ID') }}</p>
            <p v-if="p.videoUrl" class="text-xs mt-2" style="color:rgba(9,11,12,0.5)">✓ Video terpasang</p>
            <div class="flex items-center gap-3 mt-3 flex-wrap">
              <button class="text-xs transition-opacity hover:opacity-60" style="color:#090b0c" @click="openProductForm(p)">Edit</button>
              <label class="text-xs transition-opacity hover:opacity-60 cursor-pointer" style="color:#090b0c">
                {{ videoUploading[p.id] ? 'Mengunggah…' : (p.videoUrl ? 'Ganti Video' : '+ Video') }}
                <input type="file" accept="video/mp4,video/quicktime,video/webm" class="hidden" :disabled="videoUploading[p.id]" @change="uploadVideo(p, $event)" />
              </label>
              <button class="text-xs transition-opacity hover:opacity-60" style="color:#991b1b" @click="remove(p.id)">Hapus</button>
            </div>
            <p v-if="videoError[p.id]" class="text-xs mt-2" style="color:#991b1b">{{ videoError[p.id] }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Form Produk -->
    <div v-if="showProductModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 py-6 overflow-y-auto">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]" @click="showProductModal = false" />
      <div class="relative rounded-3xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" style="background:white">
        <h2 class="text-lg font-normal mb-4">{{ editingProduct ? 'Edit Produk' : 'Tambah Produk' }}</h2>
        <form class="space-y-4" @submit.prevent="saveProduct">
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Nama Produk *</label>
              <input v-model="productForm.title" type="text" placeholder="Gamis Kaftan Premium" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12)" required />
            </div>
            <div>
              <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Harga (Rp) *</label>
              <input v-model="productForm.price" type="number" placeholder="350000" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12)" required />
            </div>
            <div>
              <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Harga Asli (Rp) <span class="text-xs" style="color:rgba(9,11,12,0.4)">opsional</span></label>
              <input v-model="productForm.originalPrice" type="number" placeholder="500000" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12)" />
            </div>
            <div>
              <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Berat (gram)</label>
              <input v-model="productForm.weight" type="number" placeholder="500" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12)" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Kategori</label>
              <input
                v-model="categoryInput"
                list="category-options"
                type="text"
                placeholder="Pilih atau ketik nama kategori baru"
                class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none"
                style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12)"
              />
              <datalist id="category-options">
                <option v-for="cat in categories" :key="cat.id" :value="cat.name" />
              </datalist>
              <p class="text-xs mt-1.5" style="color:rgba(9,11,12,0.4)">Ketik nama kategori yang belum ada di daftar untuk membuatnya otomatis.</p>
            </div>
            <div>
              <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Tipe Produk</label>
              <select v-model="productForm.productType" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12)">
                <option value="REGULAR">Reguler</option>
                <option value="PRE_ORDER">Pre-Order</option>
              </select>
            </div>
          </div>

          <div v-if="productForm.productType === 'PRE_ORDER'">
            <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Estimasi Selesai Produksi</label>
            <input v-model="productForm.estimatedReadyDate" type="date" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12)" />
          </div>

          <div>
            <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Bahan</label>
            <input v-model="productForm.material" type="text" placeholder="Ceruti, Wolfis, dll." class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12)" />
          </div>

          <div>
            <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Deskripsi</label>
            <textarea v-model="productForm.description" rows="3" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none" style="background:#f5f5f2;border:1px solid rgba(9,11,12,0.12)" />
          </div>

          <div>
            <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Stok per Ukuran</label>
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <div
                v-for="v in productForm.variants"
                :key="v.size"
                class="rounded-xl p-2.5 text-center"
                :style="v.stock > 0 ? 'border:1px solid #090b0c;background:#f5f5f2' : 'border:1px solid rgba(9,11,12,0.12)'"
              >
                <p class="text-xs font-normal mb-1">{{ v.size }}</p>
                <input v-model.number="v.stock" type="number" min="0" class="w-full text-center text-sm rounded-lg px-1 py-1 focus:outline-none" style="background:white;border:1px solid rgba(9,11,12,0.12)" />
              </div>
            </div>
            <p class="text-xs mt-1.5" style="color:rgba(9,11,12,0.4)">Pre-Order: semua ukuran otomatis tersedia tanpa stok minimum.</p>
          </div>

          <div>
            <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">{{ editingProduct ? 'Foto Utama (kosongkan jika tidak diubah)' : 'Foto Utama *' }}</label>
            <input type="file" accept="image/*" class="text-sm" @change="onFileChange" />
          </div>
          <div>
            <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Foto Tambahan (bisa pilih beberapa)</label>
            <input type="file" accept="image/*" multiple class="text-sm" @change="onExtraFilesChange" />
            <p v-if="extraFiles.length" class="text-xs mt-1" style="color:rgba(9,11,12,0.4)">{{ extraFiles.length }} foto dipilih</p>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" class="flex-1 rounded-full py-3 text-sm font-normal" style="background:#f5f5f2;color:#090b0c" @click="showProductModal = false">Batal</button>
            <button type="submit" :disabled="savingProduct" class="flex-1 rounded-full py-3 text-sm font-normal transition-opacity hover:opacity-85 disabled:opacity-40" style="background:#090b0c;color:white">
              {{ savingProduct ? 'Menyimpan…' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'buyer' })
useSeoMeta({ title: 'Kelola Produk Toko — MINTS' })

const route = useRoute()
const storeId = String(route.query.store || '')
if (!storeId) await navigateTo('/toko/dashboard')

const products = ref<any[]>([])
const categories = ref<any[]>([])
const loading = ref(true)
const errorMsg = ref('')

async function loadProducts() {
  loading.value = true
  try {
    products.value = await $fetch(`/api/store/${storeId}/products`, { headers: useRequestHeaders(['cookie']) })
  } finally {
    loading.value = false
  }
}
async function loadCategories() {
  categories.value = await $fetch('/api/categories', { headers: useRequestHeaders(['cookie']) })
}
await Promise.all([loadProducts(), loadCategories()])

// ── Kategori: ketik nama yang sudah ada, atau nama baru untuk membuatnya otomatis saat simpan ──
const categoryInput = ref('')

async function resolveCategoryId(): Promise<string> {
  const name = categoryInput.value.trim()
  if (!name) return ''
  const existing = categories.value.find((c: any) => c.name.toLowerCase() === name.toLowerCase())
  if (existing) return existing.id
  const cat: any = await $fetch('/api/store/categories', { method: 'POST', body: { name } })
  categories.value.push(cat)
  return cat.id
}

// ── Form produk ──
const showProductModal = ref(false)
const savingProduct = ref(false)
const editingProduct = ref<any>(null)
const productFile = ref<File | null>(null)
const extraFiles = ref<File[]>([])
const PRODUCT_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size']
const productForm = reactive({
  title: '', price: '', originalPrice: '', description: '',
  productType: 'REGULAR', material: '', weight: '',
  estimatedReadyDate: '',
  variants: PRODUCT_SIZES.map(size => ({ size, stock: 0 }))
})

function openProductForm(product?: any) {
  errorMsg.value = ''
  editingProduct.value = product || null
  productForm.title = product?.title || ''
  productForm.price = product?.price ? String(product.price) : ''
  productForm.originalPrice = product?.originalPrice ? String(product.originalPrice) : ''
  productForm.description = product?.description || ''
  categoryInput.value = categories.value.find((c: any) => c.id === product?.categoryId)?.name || ''
  productForm.productType = product?.productType || 'REGULAR'
  productForm.material = product?.material || ''
  productForm.weight = product?.weight ? String(product.weight) : ''
  productForm.estimatedReadyDate = product?.estimatedReadyDate
    ? new Date(product.estimatedReadyDate).toISOString().slice(0, 10)
    : ''
  productForm.variants = PRODUCT_SIZES.map(size => {
    const existing = product?.variants?.find((v: any) => v.size === size)
    return { size, stock: existing?.stock ?? 0 }
  })
  productFile.value = null
  extraFiles.value = []
  showProductModal.value = true
}

const MAX_FILE_SIZE = 2 * 1024 * 1024

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] || null
  if (file && file.size > MAX_FILE_SIZE) {
    errorMsg.value = `Ukuran foto terlalu besar (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimal 2 MB.`
    ;(e.target as HTMLInputElement).value = ''
    return
  }
  productFile.value = file
}

function onExtraFilesChange(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files || [])
  const oversized = files.filter(f => f.size > MAX_FILE_SIZE)
  if (oversized.length) {
    errorMsg.value = `${oversized.length} foto melebihi batas 2 MB: ${oversized.map(f => f.name).join(', ')}`
    ;(e.target as HTMLInputElement).value = ''
    return
  }
  extraFiles.value = files
}

async function saveProduct() {
  errorMsg.value = ''
  if (!editingProduct.value && !productFile.value) {
    errorMsg.value = 'Foto utama wajib diisi'
    return
  }
  savingProduct.value = true
  try {
    const categoryId = await resolveCategoryId()
    const fd = new FormData()
    fd.append('title', productForm.title)
    fd.append('price', productForm.price)
    if (productForm.originalPrice) fd.append('originalPrice', productForm.originalPrice)
    fd.append('description', productForm.description)
    fd.append('categoryId', categoryId)
    fd.append('productType', productForm.productType)
    fd.append('material', productForm.material)
    fd.append('weight', productForm.weight)
    fd.append('estimatedReadyDate', productForm.estimatedReadyDate)
    const variantsToSave = productForm.variants.filter((v: { size: string; stock: number }) =>
      v.stock > 0 || productForm.productType === 'PRE_ORDER'
    )
    fd.append('variants', JSON.stringify(variantsToSave))
    if (productFile.value) fd.append('image', productFile.value)
    for (const f of extraFiles.value) fd.append('images', f)

    if (editingProduct.value) {
      await $fetch(`/api/store/${storeId}/products/${editingProduct.value.id}`, { method: 'PATCH', body: fd })
    } else {
      await $fetch(`/api/store/${storeId}/products`, { method: 'POST', body: fd })
    }
    showProductModal.value = false
    await loadProducts()
  } catch (e: any) {
    errorMsg.value = e?.data?.statusMessage || 'Gagal menyimpan produk'
  } finally {
    savingProduct.value = false
  }
}

const videoUploading = reactive<Record<string, boolean>>({})
const videoError = reactive<Record<string, string>>({})

function readVideoDuration(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const el = document.createElement('video')
    el.preload = 'metadata'
    el.onloadedmetadata = () => { resolve(Math.round(el.duration) || null); URL.revokeObjectURL(el.src) }
    el.onerror = () => resolve(null)
    el.src = URL.createObjectURL(file)
  })
}

async function uploadVideo(product: any, e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  videoError[product.id] = ''
  videoUploading[product.id] = true
  try {
    const durationSec = await readVideoDuration(file)
    const presign: any = await $fetch(`/api/store/${storeId}/media/presign`, {
      method: 'POST',
      body: { productId: product.id, mimeType: file.type, estimatedSizeKb: Math.ceil(file.size / 1024), durationSec }
    })
    await $fetch(presign.uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
    const media: any = await $fetch(`/api/store/${storeId}/media/confirm`, {
      method: 'POST',
      body: { s3Key: presign.s3Key, productId: product.id, durationSec }
    })
    product.videoUrl = media.url
  } catch (err: any) {
    videoError[product.id] = err?.data?.statusMessage || 'Gagal mengunggah video'
  } finally {
    videoUploading[product.id] = false
    ;(e.target as HTMLInputElement).value = ''
  }
}

async function remove(id: string) {
  if (!confirm('Hapus produk ini?')) return
  await $fetch(`/api/store/${storeId}/products/${id}`, { method: 'DELETE' })
  await loadProducts()
}
</script>
