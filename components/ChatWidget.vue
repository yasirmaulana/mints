<template>
  <!-- Floating button -->
  <div class="fixed bottom-6 right-6 z-50">
    <Transition name="fade">
      <div
        v-if="open"
        class="absolute bottom-16 right-0 w-80 rounded-2xl shadow-2xl border overflow-hidden flex flex-col"
        style="height: 420px; background: #ffffff; border-color: rgba(9,11,12,0.12)"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 flex-shrink-0" style="background: #090b0c">
          <div>
            <p class="font-semibold text-sm text-white">Chat dengan Seller</p>
            <p class="text-xs" style="color:rgba(255,255,255,0.7)">Biasanya balas dalam 1 jam</p>
          </div>
          <button style="color:rgba(255,255,255,0.7)" class="hover:text-white transition-colors" @click="open = false">✕</button>
        </div>

        <!-- Identity form (before session started) -->
        <div v-if="!sessionId" class="flex-1 p-4 flex flex-col gap-3 justify-center">
          <p class="text-sm text-center" style="color:rgba(9,11,12,0.5)">Perkenalkan diri kamu dulu ya!</p>
          <input v-model="nameInput" type="text" placeholder="Nama kamu" class="w-full rounded-lg border px-3 py-2 text-sm outline-none" style="background:#f5f5f2;border-color:rgba(9,11,12,0.15);color:#090b0c" @keydown.enter="phoneInput && startChat()" />
          <input v-model="phoneInput" type="tel" placeholder="Nomor WhatsApp" class="w-full rounded-lg border px-3 py-2 text-sm outline-none" style="background:#f5f5f2;border-color:rgba(9,11,12,0.15);color:#090b0c" @keydown.enter="nameInput && startChat()" />
          <input v-model="firstMessage" type="text" placeholder="Pesan pertama..." class="w-full rounded-lg border px-3 py-2 text-sm outline-none" style="background:#f5f5f2;border-color:rgba(9,11,12,0.15);color:#090b0c" @keydown.enter="startChat()" />
          <button
            class="w-full py-2 rounded-lg text-sm font-semibold transition-opacity"
            :class="canStart ? 'opacity-100' : 'opacity-40'"
            :disabled="!canStart || starting"
            style="background:#090b0c;color:white"
            @click="startChat"
          >{{ starting ? 'Memulai...' : 'Mulai Chat' }}</button>
        </div>

        <!-- Messages -->
        <div v-else ref="messagesEl" class="flex-1 overflow-y-auto p-3 space-y-2">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="flex"
            :class="msg.sender === 'buyer' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-[75%] rounded-2xl px-3 py-2 text-sm"
              :style="msg.sender === 'buyer'
                ? 'background:#090b0c;color:white;border-bottom-right-radius:4px'
                : 'background:rgba(9,11,12,0.06);color:#090b0c;border-bottom-left-radius:4px'"
            >
              {{ msg.body }}
              <p class="text-xs mt-0.5 opacity-60">{{ formatTime(msg.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div v-if="sessionId" class="p-3 border-t flex gap-2 flex-shrink-0" style="border-color:rgba(9,11,12,0.1)">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Ketik pesan..."
            class="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none"
            style="background:#f5f5f2;border-color:rgba(9,11,12,0.15);color:#090b0c"
            @keydown.enter="sendMessage"
          />
          <button
            class="px-3 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
            style="background:#090b0c;color:white"
            @click="sendMessage"
          >→</button>
        </div>
      </div>
    </Transition>

    <!-- FAB -->
    <button
      class="w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 relative"
      style="background: var(--brand-400); color: white"
      @click="open = !open"
    >
      <span class="text-xl">💬</span>
      <span
        v-if="!open && unread"
        class="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold"
      >{{ unread }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ productId?: string; orderId?: string }>()

const open = ref(false)
const sessionId = ref(localStorage.getItem(`chat-session-${props.productId || 'global'}`) || '')
const messages = ref<any[]>([])
const newMessage = ref('')
const nameInput = ref('')
const phoneInput = ref('')
const firstMessage = ref('')
const starting = ref(false)
const unread = ref(0)
const messagesEl = ref<HTMLElement>()

const canStart = computed(() => nameInput.value.trim().length >= 2 && /^(08|628)/.test(phoneInput.value) && firstMessage.value.trim())

let es: EventSource | null = null

async function startChat() {
  if (!canStart.value || starting.value) return
  starting.value = true
  try {
    const res = await $fetch<any>('/api/chat/start', {
      method: 'POST',
      body: {
        buyerName: nameInput.value.trim(),
        buyerPhone: phoneInput.value.trim(),
        message: firstMessage.value.trim(),
        productId: props.productId || null,
        orderId: props.orderId || null
      }
    })
    sessionId.value = res.sessionId
    localStorage.setItem(`chat-session-${props.productId || 'global'}`, res.sessionId)
    connectSSE()
  } finally {
    starting.value = false
  }
}

async function sendMessage() {
  if (!newMessage.value.trim() || !sessionId.value) return
  const body = newMessage.value.trim()
  newMessage.value = ''
  // Optimistic update — show immediately, SSE will confirm within 2s
  messages.value.push({ id: `tmp-${Date.now()}`, sender: 'buyer', body, createdAt: new Date().toISOString() })
  nextTick(() => {
    if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  })
  await $fetch(`/api/chat/${sessionId.value}/messages`, {
    method: 'POST',
    body: { message: body }
  })
}

function connectSSE() {
  if (!sessionId.value || !process.client) return
  es?.close()
  es = new EventSource(`/api/chat/${sessionId.value}/messages`)
  es.onmessage = (e) => {
    const data = JSON.parse(e.data)
    if (data.type === 'init') {
      messages.value = data.messages
    } else if (data.type === 'messages') {
      const existingIds = new Set(messages.value.filter((m: any) => !m.id.startsWith('tmp-')).map((m: any) => m.id))
      const incoming = data.messages.filter((m: any) => !existingIds.has(m.id))
      if (incoming.length) {
        messages.value = messages.value.filter((m: any) => !m.id.startsWith('tmp-'))
        messages.value.push(...incoming)
        if (!open.value) unread.value += incoming.filter((m: any) => m.sender === 'admin').length
      }
    }
    nextTick(() => {
      if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
    })
  }
}

watch(open, (val) => {
  if (val) { unread.value = 0 }
  if (val && sessionId.value && !es) connectSSE()
})

onMounted(() => {
  if (sessionId.value) connectSSE()
})

onUnmounted(() => es?.close())

function formatTime(d: string) {
  return new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s, transform 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(8px); }
</style>
