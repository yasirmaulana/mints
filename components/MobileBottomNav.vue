<template>
    <!-- Bottom nav (mobile) -->
    <nav class="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t bg-white md:hidden" style="border-color:rgba(9,11,12,0.1);padding-bottom:env(safe-area-inset-bottom)">
      <NuxtLink v-for="n in bottomNav" :key="n.to" :to="n.to" class="relative flex flex-col items-center gap-0.5 py-2 text-[10px]" :style="`color:${n.to === route.path ? '#090b0c' : 'rgba(9,11,12,0.55)'}`">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="n.icon" />
        {{ n.label }}
        <span v-if="n.to === '/cart' && itemCount > 0" class="absolute right-[22%] top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold" style="background:#fabc3f;color:#090b0c">{{ itemCount }}</span>
      </NuxtLink>
    </nav>
</template>

<script setup lang="ts">
const route = useRoute()
const { itemCount } = useCart()

const bottomNav = [
  { to: '/', label: 'Beranda', icon: '<path d="M3 11l9-8 9 8v10a1 1 0 01-1 1h-5v-7H9v7H4a1 1 0 01-1-1z"/>' },
  { to: '/koleksi', label: 'Koleksi', icon: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>' },
  { to: '/flash_sale', label: 'Flash Sale', icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>' },
  { to: '/cart', label: 'Keranjang', icon: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/>' },
  { to: '/account', label: 'Akun', icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/>' }
]
</script>
