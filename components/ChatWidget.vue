<template>
  <div v-if="isLoggedIn">
    <!-- Bar peluncur -->
    <button
      v-if="!open"
      class="fixed bottom-20 right-4 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-lg md:bottom-0 md:right-6 md:rounded-b-none md:rounded-t-xl"
      style="background:#090b0c;color:white"
      @click="open = true"
    >
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.4A8 8 0 1121 12z"/></svg>
      Chat
      <span v-if="unread > 0" class="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-bold" style="background:#ef4444;color:white">{{ unread > 99 ? '99+' : unread }}</span>
    </button>

    <!-- Panel -->
    <Transition name="chat">
      <div
        v-if="open"
        class="fixed inset-0 z-[60] flex flex-col bg-white md:inset-auto md:bottom-0 md:right-6 md:h-[560px] md:max-h-[85vh] md:w-[740px] md:rounded-t-xl md:shadow-2xl"
        style="border:1px solid rgba(9,11,12,0.1)"
      >
        <div class="flex items-center justify-between border-b px-4 py-3" style="border-color:rgba(9,11,12,0.08)">
          <p class="text-base font-bold">Chat <span v-if="unread > 0" class="text-xs font-normal" style="color:#ef4444">({{ unread }})</span></p>
          <button class="flex h-7 w-7 items-center justify-center rounded hover:bg-black/5" aria-label="Tutup chat" @click="open = false">
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>
        <div class="min-h-0 flex-1">
          <ChatPane mode="buyer" :initial-store-id="pendingStoreId" @unread="n => (unread = n)" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
// Chat pembeli ↔ pemilik toko. Hanya tampil untuk pembeli yang sudah login.
const { user, isLoggedIn, fetchMe } = useAuth()
const { open, pendingStoreId } = useChat()
const unread = ref(0)

// Saat panel ditutup, cek jumlah pesan belum dibaca secara berkala (panel terbuka melaporkan sendiri)
let timer: ReturnType<typeof setInterval> | null = null
async function pollUnread() {
  if (open.value || document.hidden || !isLoggedIn.value) return
  try { unread.value = (await $fetch<{ count: number }>('/api/chat/threads/unread-count')).count } catch { /* abaikan */ }
}

// tujuan toko sudah dipakai ChatPane; kosongkan agar tidak terbuka ulang
watch(open, (v) => { if (!v) pendingStoreId.value = null })

onMounted(async () => {
  if (!user.value) await fetchMe()
  pollUnread()
  timer = setInterval(pollUnread, 15000)
})
onBeforeUnmount(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
.chat-enter-active, .chat-leave-active { transition: opacity 0.15s, transform 0.15s; }
.chat-enter-from, .chat-leave-to { opacity: 0; transform: translateY(12px); }
</style>
