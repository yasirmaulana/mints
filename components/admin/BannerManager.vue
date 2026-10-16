<template>
  <div>
    <h2 class="text-lg font-bold text-gray-900 mb-4">Manajemen Banner Beranda</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Form -->
      <form class="card p-5 space-y-3" @submit.prevent="save">
        <h3 class="text-sm font-bold text-gray-900">{{ form.id ? 'Ubah Banner' : 'Tambah Banner' }}</h3>
        <input v-model="form.title" type="text" placeholder="Judul banner" class="input-field" required />
        <input v-model="form.linkUrl" type="text" placeholder="Link tujuan (mis. /flash_sale), opsional" class="input-field" />
        <div class="grid grid-cols-2 gap-2">
          <select v-model="form.position" class="input-field">
            <option value="MAIN">Carousel utama</option>
            <option value="SIDE">Banner samping (desktop)</option>
          </select>
          <input v-model.number="form.sortOrder" type="number" placeholder="Urutan" class="input-field" />
        </div>
        <label class="flex items-center gap-2 text-sm text-gray-700">
          <input v-model="form.isActive" type="checkbox" /> Aktif
        </label>
        <div>
          <input type="file" accept="image/*" class="text-sm" @change="onFile" />
          <p class="mt-1 text-xs text-gray-400">Utama: rasio ±2.5:1 (mis. 1200×480). Samping: ±2:1.</p>
        </div>
        <img v-if="preview" :src="preview" class="w-full rounded-lg border border-gray-100" alt="Preview" />
        <div class="flex gap-2">
          <button type="submit" class="btn-primary" :disabled="saving || compressing">
            <span v-if="saving || compressing" class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>
            <span v-else>Simpan</span>
          </button>
          <button v-if="form.id" type="button" class="btn-secondary" @click="reset">Batal</button>
        </div>
      </form>

      <!-- Daftar -->
      <div class="card p-4 space-y-3">
        <p v-if="!banners?.length" class="text-sm text-gray-400 text-center py-4">Belum ada banner</p>
        <div v-for="b in banners" :key="b.id" class="flex gap-3 items-center border-b border-gray-100 pb-3 last:border-0">
          <img :src="b.imageUrl" class="w-24 h-12 object-cover rounded bg-gray-100" alt="" />
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ b.title }}</p>
            <p class="text-xs text-gray-400">
              {{ b.position === 'MAIN' ? 'Utama' : 'Samping' }} · urutan {{ b.sortOrder }} · {{ b.isActive ? 'aktif' : 'nonaktif' }}
            </p>
          </div>
          <button class="text-xs text-blue-600 px-2" @click="edit(b)">Ubah</button>
          <button class="text-xs text-red-500 px-2" :disabled="deleting === b.id" @click="remove(b.id)">Hapus</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { compressToWebp } from '~/composables/useImageCompress'

const { data: banners, refresh } = await useFetch<any[]>('/api/admin/banners')

const blank = () => ({ id: '', title: '', linkUrl: '', position: 'MAIN', sortOrder: 0, isActive: true })
const form = reactive(blank())
const file = ref<File | null>(null)
const preview = ref('')
const saving = ref(false)
const compressing = ref(false)
const deleting = ref<string | null>(null)

function reset() {
  Object.assign(form, blank())
  file.value = null
  preview.value = ''
}

function edit(b: any) {
  Object.assign(form, { id: b.id, title: b.title, linkUrl: b.linkUrl ?? '', position: b.position, sortOrder: b.sortOrder, isActive: b.isActive })
  file.value = null
  preview.value = b.imageUrl
}

async function onFile(e: Event) {
  const input = e.target as HTMLInputElement
  const f = input.files?.[0]
  if (!f) return
  compressing.value = true
  try {
    file.value = await compressToWebp(f, { maxWidth: 1600 })
    preview.value = URL.createObjectURL(file.value)
  } catch (err: any) {
    alert(err?.message || 'Gagal memproses gambar')
    input.value = ''
  } finally {
    compressing.value = false
  }
}

async function save() {
  saving.value = true
  try {
    const fd = new FormData()
    if (form.id) fd.append('id', form.id)
    fd.append('title', form.title)
    fd.append('linkUrl', form.linkUrl)
    fd.append('position', form.position)
    fd.append('sortOrder', String(form.sortOrder ?? 0))
    fd.append('isActive', String(form.isActive))
    if (file.value) fd.append('image', file.value)
    await $fetch('/api/admin/banners', { method: 'POST', body: fd })
    reset()
    await refresh()
  } catch (e: any) {
    alert(e?.data?.statusMessage || 'Gagal menyimpan banner')
  } finally {
    saving.value = false
  }
}

async function remove(id: string) {
  if (!confirm('Hapus banner ini?')) return
  deleting.value = id
  try {
    await $fetch(`/api/admin/banners/${id}`, { method: 'DELETE' })
    await refresh()
  } finally {
    deleting.value = null
  }
}
</script>
