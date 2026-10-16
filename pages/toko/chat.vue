<template>
  <div class="min-h-screen antialiased" style="background:#f5f5f2;color:#090b0c;font-family:'Inter Tight',system-ui,sans-serif">
    <header class="sticky top-0 z-40 px-5 py-4 md:px-12" style="background:rgba(245,245,242,0.88);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.06)">
      <div class="relative flex h-10 items-center max-w-5xl mx-auto">
        <NuxtLink :to="`/toko/dashboard?store=${storeId}`" class="flex items-center gap-2 text-sm transition-opacity hover:opacity-60" style="color:#090b0c">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Dashboard
        </NuxtLink>
        <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2 font-black text-xl tracking-tighter" style="color:#090b0c;letter-spacing:-0.04em">MINTS</NuxtLink>
      </div>
    </header>

    <div class="mx-auto max-w-5xl px-5 py-8 md:px-12">
      <h2 class="mb-5 text-2xl font-normal tracking-tight">
        Chat Pembeli
        <span v-if="unread > 0" class="ml-2 align-middle text-sm" style="color:#ef4444">({{ unread }} belum dibaca)</span>
      </h2>
      <div class="h-[calc(100vh-190px)] min-h-[420px] overflow-hidden rounded-3xl" style="background:white;border:1px solid rgba(9,11,12,0.06)">
        <ChatPane mode="seller" :store-id="storeId" @unread="n => (unread = n)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'buyer' })
useSeoMeta({ title: 'Chat Pembeli — MINTS' })

const route = useRoute()
const storeId = String(route.query.store || '')
if (!storeId) await navigateTo('/toko/dashboard')

const unread = ref(0)
</script>
