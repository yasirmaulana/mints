<template>
  <div class="flex h-full min-h-0 bg-white" style="color:#090b0c">
    <!-- Daftar percakapan -->
    <aside class="min-h-0 w-full shrink-0 flex-col border-r md:flex md:w-[290px]" :class="activeId ? 'hidden' : 'flex'" style="border-color:rgba(9,11,12,0.08)">
      <div class="flex items-center gap-2 p-3">
        <div class="relative flex-1">
          <input v-model="search" type="text" :placeholder="mode === 'buyer' ? 'Cari nama toko' : 'Cari nama pembeli'" class="h-8 w-full rounded-full border pl-8 pr-3 text-xs focus:outline-none" style="border-color:rgba(9,11,12,0.15)" />
          <svg class="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" style="color:rgba(9,11,12,0.4)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </div>
        <select v-model="filter" class="h-8 rounded-full border bg-white px-2 text-xs focus:outline-none" style="border-color:rgba(9,11,12,0.15)">
          <option value="all">Semua</option>
          <option value="unread">Belum dibaca</option>
        </select>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto">
        <p v-if="loadingList" class="px-4 py-6 text-center text-xs" style="color:rgba(9,11,12,0.4)">Memuat…</p>
        <p v-else-if="!filteredThreads.length" class="px-4 py-10 text-center text-xs" style="color:rgba(9,11,12,0.4)">
          {{ threads.length ? 'Tidak ada percakapan yang cocok' : (mode === 'buyer' ? 'Belum ada percakapan. Klik "Chat Penjual" di halaman produk atau toko.' : 'Belum ada pesan dari pembeli.') }}
        </p>
        <button
          v-for="t in filteredThreads" :key="t.id"
          class="flex w-full items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-black/[0.03]"
          :style="t.id === activeId ? 'background:rgba(9,11,12,0.05)' : ''"
          @click="selectThread(t.id)"
        >
          <span class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-bold" style="background:#f5f5f2;color:rgba(9,11,12,0.45)">
            <img v-if="t.avatarUrl" :src="t.avatarUrl" :alt="t.name" class="h-full w-full object-cover" />
            <template v-else>{{ t.name.charAt(0).toUpperCase() }}</template>
          </span>
          <span class="min-w-0 flex-1">
            <span class="flex items-baseline justify-between gap-2">
              <span class="truncate text-sm font-semibold">{{ t.name }}</span>
              <span class="shrink-0 text-[11px]" style="color:rgba(9,11,12,0.4)">{{ listDate(t.lastMessageAt) }}</span>
            </span>
            <span class="flex items-center justify-between gap-2">
              <span class="truncate text-xs" style="color:rgba(9,11,12,0.55)">{{ t.lastMessage || 'Belum ada pesan' }}</span>
              <span v-if="t.unread > 0" class="flex h-4 min-w-[16px] shrink-0 items-center justify-center rounded-full px-1 text-[10px] font-bold" style="background:#ef4444;color:white">{{ t.unread > 99 ? '99+' : t.unread }}</span>
            </span>
          </span>
        </button>
      </div>
    </aside>

    <!-- Percakapan / empty state -->
    <section class="min-w-0 flex-1 flex-col md:flex" :class="activeId ? 'flex' : 'hidden'" style="background:#f5f5f2">
      <template v-if="active">
        <div class="flex items-center gap-3 border-b bg-white px-4 py-3" style="border-color:rgba(9,11,12,0.08)">
          <button class="md:hidden" aria-label="Kembali" @click="activeId = ''">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <span class="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full text-xs font-bold" style="background:#f5f5f2;color:rgba(9,11,12,0.45)">
            <img v-if="active.avatarUrl" :src="active.avatarUrl" :alt="active.name" class="h-full w-full object-cover" />
            <template v-else>{{ active.name.charAt(0).toUpperCase() }}</template>
          </span>
          <NuxtLink v-if="mode === 'buyer' && active.slug" :to="`/toko/${active.slug}`" class="truncate text-sm font-semibold hover:underline">{{ active.name }}</NuxtLink>
          <span v-else class="truncate text-sm font-semibold">{{ active.name }}</span>
        </div>

        <div ref="scroller" class="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-4">
          <p v-if="!messages.length && !loadingMsgs" class="py-10 text-center text-xs" style="color:rgba(9,11,12,0.4)">Mulai percakapan dengan mengirim pesan.</p>
          <div v-for="m in messages" :key="m.id" class="flex" :class="m.sender === mode ? 'justify-end' : 'justify-start'">
            <div class="max-w-[78%] rounded-2xl px-3.5 py-2 text-sm" :style="m.sender === mode ? 'background:#090b0c;color:white;border-bottom-right-radius:4px' : 'background:white;border-bottom-left-radius:4px'">
              <p class="whitespace-pre-wrap break-words">{{ m.body }}</p>
              <p class="mt-0.5 text-right text-[10px]" :style="m.sender === mode ? 'color:rgba(255,255,255,0.5)' : 'color:rgba(9,11,12,0.4)'">{{ clock(m.createdAt) }}</p>
            </div>
          </div>
        </div>

        <p v-if="errorMsg" class="bg-red-50 px-4 py-2 text-xs" style="color:#991b1b">{{ errorMsg }}</p>
        <form class="flex items-end gap-2 border-t bg-white p-3" style="border-color:rgba(9,11,12,0.08)" @submit.prevent="send">
          <textarea
            v-model="draft" rows="1" maxlength="2000" placeholder="Ketik pesan…"
            class="max-h-24 min-h-[38px] flex-1 resize-none rounded-2xl border px-3.5 py-2 text-sm focus:outline-none"
            style="border-color:rgba(9,11,12,0.15)"
            @keydown.enter.exact.prevent="send"
          />
          <button type="submit" class="h-[38px] rounded-full px-5 text-sm transition-opacity disabled:opacity-40" style="background:#090b0c;color:white" :disabled="!draft.trim() || sending">Kirim</button>
        </form>
      </template>

      <!-- Empty state -->
      <div v-else class="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <svg class="mb-5 w-52" viewBox="0 0 200 130" fill="none">
          <rect x="35" y="18" width="110" height="74" rx="6" fill="#e4e4df"/>
          <rect x="42" y="25" width="96" height="60" rx="3" fill="#f5f5f2"/>
          <rect x="52" y="34" width="52" height="26" rx="5" fill="#090b0c"/>
          <rect x="60" y="42" width="34" height="3" rx="1.5" fill="#fff" opacity=".8"/>
          <rect x="60" y="49" width="22" height="3" rx="1.5" fill="#fff" opacity=".5"/>
          <path d="M18 98h144l-8 12H26z" fill="#cfcfc9"/>
          <rect x="112" y="52" width="48" height="26" rx="13" fill="#fabc3f"/>
          <circle cx="127" cy="65" r="2.5" fill="#090b0c"/><circle cx="136" cy="65" r="2.5" fill="#090b0c"/><circle cx="145" cy="65" r="2.5" fill="#090b0c"/>
        </svg>
        <p class="text-sm font-semibold">Selamat Datang di Chat MINTS</p>
        <p class="mt-1 text-xs" style="color:rgba(9,11,12,0.45)">
          {{ mode === 'buyer' ? 'Mulai mengobrol dengan penjual kami sekarang!' : 'Pilih percakapan untuk membalas pembeli.' }}
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
interface Thread { id: string; storeId: string; name: string; slug: string | null; avatarUrl: string | null; lastMessage: string; lastMessageAt: string; unread: number }
interface Message { id: string; sender: string; body: string; createdAt: string }

const props = defineProps<{ mode: 'buyer' | 'seller'; storeId?: string; initialStoreId?: string | null }>()
const emit = defineEmits<{ unread: [count: number] }>()

// Polling versi pertama (tanpa WebSocket — deploy serverless): pesan tiap 3 dtk, daftar tiap 6 dtk.
const POLL_MS = 3000

const listUrl = computed(() => props.mode === 'buyer' ? '/api/chat/threads' : `/api/store/${props.storeId}/chat/threads`)
const messagesUrl = (id: string) => `${listUrl.value}/${id}/messages`

const threads = ref<Thread[]>([])
const messages = ref<Message[]>([])
const activeId = ref('')
const search = ref('')
const filter = ref<'all' | 'unread'>('all')
const draft = ref('')
const sending = ref(false)
const loadingList = ref(true)
const loadingMsgs = ref(false)
const errorMsg = ref('')
const scroller = ref<HTMLElement | null>(null)
let lastAt = ''

const active = computed(() => threads.value.find(t => t.id === activeId.value) ?? null)
const filteredThreads = computed(() => {
  const q = search.value.trim().toLowerCase()
  return threads.value.filter(t =>
    (!q || t.name.toLowerCase().includes(q)) && (filter.value === 'all' || t.unread > 0)
  )
})

watch(() => threads.value.reduce((n, t) => n + t.unread, 0), n => emit('unread', n), { immediate: true })

async function loadThreads() {
  try {
    const list = await $fetch<Thread[]>(listUrl.value)
    // thread yang sedang dibuka dianggap terbaca (pesannya sedang dilihat)
    threads.value = list.map(t => (t.id === activeId.value ? { ...t, unread: 0 } : t))
  } catch { /* abaikan error sesaat saat polling */ } finally {
    loadingList.value = false
  }
}

function scrollBottom() {
  nextTick(() => { if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight })
}

function append(incoming: Message[]) {
  const known = new Set(messages.value.map(m => m.id))
  const fresh = incoming.filter(m => !known.has(m.id))
  if (!fresh.length) return false
  messages.value = [...messages.value, ...fresh]
  lastAt = messages.value.at(-1)!.createdAt
  return true
}

async function loadMessages() {
  if (!activeId.value) return
  const id = activeId.value
  try {
    const res = await $fetch<{ messages: Message[] }>(messagesUrl(id), { query: lastAt ? { after: lastAt } : {} })
    if (id !== activeId.value) return // pengguna sudah pindah thread
    const nearBottom = !scroller.value || scroller.value.scrollHeight - scroller.value.scrollTop - scroller.value.clientHeight < 80
    if (append(res.messages) && (nearBottom || !lastAt)) scrollBottom()
  } catch { /* abaikan */ }
}

async function selectThread(id: string) {
  activeId.value = id
  messages.value = []
  lastAt = ''
  errorMsg.value = ''
  loadingMsgs.value = true
  const t = threads.value.find(x => x.id === id)
  if (t) t.unread = 0
  await loadMessages()
  loadingMsgs.value = false
  scrollBottom()
}

async function send() {
  const text = draft.value.trim()
  if (!text || !activeId.value || sending.value) return
  sending.value = true
  errorMsg.value = ''
  try {
    const msg = await $fetch<Message>(messagesUrl(activeId.value), { method: 'POST', body: { message: text } })
    draft.value = ''
    append([msg])
    const t = threads.value.find(x => x.id === activeId.value)
    if (t) { t.lastMessage = text.slice(0, 120); t.lastMessageAt = msg.createdAt }
    threads.value.sort((a, b) => +new Date(b.lastMessageAt) - +new Date(a.lastMessageAt))
    scrollBottom()
  } catch (e: any) {
    errorMsg.value = e?.data?.statusMessage || 'Pesan gagal terkirim'
  } finally {
    sending.value = false
  }
}

// Buka percakapan dengan toko tertentu (dari tombol "Chat Penjual")
async function openWithStore(storeId: string) {
  errorMsg.value = ''
  try {
    const t = await $fetch<Thread>('/api/chat/threads', { method: 'POST', body: { storeId } })
    if (!threads.value.some(x => x.id === t.id)) threads.value.unshift(t)
    await selectThread(t.id)
  } catch (e: any) {
    errorMsg.value = e?.data?.statusMessage || 'Gagal membuka percakapan'
    activeId.value = ''
  }
}

// --- format tanggal ---
function listDate(iso: string) {
  const d = new Date(iso), now = new Date()
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const dd = String(d.getDate()).padStart(2, '0'), mm = String(d.getMonth() + 1).padStart(2, '0')
  return d.getFullYear() === now.getFullYear() ? `${dd}/${mm}` : `${dd}/${mm}/${String(d.getFullYear()).slice(2)}`
}
function clock(iso: string) {
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

let timer: ReturnType<typeof setInterval> | null = null
let tick = 0
onMounted(async () => {
  await loadThreads()
  if (props.mode === 'buyer' && props.initialStoreId) await openWithStore(props.initialStoreId)
  timer = setInterval(() => {
    if (document.hidden) return
    tick++
    loadMessages()
    if (tick % 2 === 0) loadThreads()
  }, POLL_MS)
})
onBeforeUnmount(() => { if (timer) clearInterval(timer) })

watch(() => props.initialStoreId, (id) => { if (id && props.mode === 'buyer') openWithStore(id) })
</script>
