<template>
  <!-- Floating button -->
  <div class="fixed bottom-6 right-6 z-50">
    <Transition name="fade">
      <div
        v-if="open"
        class="absolute bottom-16 right-0 w-80 rounded-2xl shadow-2xl border overflow-hidden flex flex-col"
        style="height: 420px; background: var(--background); border-color: var(--border)"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 flex-shrink-0" style="background: var(--brand-400)">
          <div>
            <p class="font-semibold text-sm text-white">Chat dengan Seller</p>
            <p class="text-xs text-white/80">Biasanya balas dalam 1 jam</p>
          </div>
          <button class="text-white/80 hover:text-white" @click="open = false">✕</button>
        </div>

        <!-- Identity form (before session started) -->
        <div v-if="!sessionId" class="flex-1 p-4 flex flex-col gap-3 justify-center">
          <p class="text-sm text-center" style="color: var(--muted-foreground)">Perkenalkan diri kamu dulu ya!</p>
          <input v-model="nameInput" type="text" placeholder="Nama kamu" class="w-full rounded-lg border px-3 py-2 text-sm" style="background: var(--input); border-color: var(--border); color: var(--foreground)" @keydown.enter="phoneInput && startChat()" />
          <input v-model="phoneInput" type="tel" placeholder="Nomor WhatsApp" class="w-full rounded-lg border px-3 py-2 text-sm" style="background: var(--input); border-color: var(--border); color: var(--foreground)" @keydown.enter="nameInput && startChat()" />
          <input v-model="firstMessage" type="text" placeholder="Pesan pertama..." class="w-full rounded-lg border px-3 py-2 text-sm" style="background: var(--input); border-color: var(--border); color: var(--foreground)" @keydown.enter="startChat()" />
          <button
            class="w-full py-2 rounded-lg text-sm font-semibold transition-opacity"
            :class="canStart ? 'opacity-100' : 'opacity-40'"
            :disabled="!canStart || starting"
            style="background: var(--brand-400); color: white"
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
                ? 'background: var(--brand-400); color: white; border-bottom-right-radius: 4px'
                : 'background: var(--muted); color: var(--foreground); border-bottom-left-radius: 4px'"
            >
              {{ msg.body }}
              <p class="text-xs mt-0.5 opacity-60">{{ formatTime(msg.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Input -->
        <div v-if="sessionId" class="p-3 border-t flex gap-2 flex-shrink-0" style="border-color: var(--border)">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Ketik pesan..."
            class="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none"
            style="background: var(--input); border-color: var(--border); color: var(--foreground)"
            @keydown.enter="sendMessage"
          />
          <button
            class="px-3 py-2 rounded-lg text-sm font-semibold"
            style="background: var(--brand-400); color: white"
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
      messages.value.push(...data.messages)
      if (!open.value) unread.value += data.messages.filter((m: any) => m.sender === 'admin').length
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
