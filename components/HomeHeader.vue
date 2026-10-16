<template>
    <!-- Header sticky: logo + search + aksi -->
    <header class="sticky top-0 z-50" style="background:rgba(245,245,242,0.95);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.08)">
      <!-- Link atas (desktop) -->
      <div class="hidden md:block px-8">
        <div class="mx-auto flex max-w-6xl items-center justify-between py-1.5 text-xs" style="color:rgba(9,11,12,0.55)">
          <div class="flex gap-5">
            <NuxtLink to="/koleksi" class="hover:text-[#090b0c]">Koleksi</NuxtLink>
            <NuxtLink to="/flash_sale" class="hover:text-[#090b0c]">Flash Sale</NuxtLink>
            <NuxtLink to="/tentang-kami" class="hover:text-[#090b0c]">Tentang Kami</NuxtLink>
            <NuxtLink to="/faq" class="hover:text-[#090b0c]">Bantuan</NuxtLink>
          </div>
          <div class="flex gap-5">
            <template v-if="isLoggedIn">
              <NuxtLink to="/account/orders" class="hover:text-[#090b0c]">Pesanan Saya</NuxtLink>
              <NuxtLink to="/account" class="hover:text-[#090b0c]">Akun</NuxtLink>
            </template>
            <NuxtLink v-else to="/login" class="hover:text-[#090b0c]">Masuk / Daftar</NuxtLink>
          </div>
        </div>
      </div>

      <div class="px-4 py-3 md:px-8">
        <div class="mx-auto flex max-w-6xl items-center gap-3 md:gap-8">
          <NuxtLink to="/" class="shrink-0 text-xl font-black" style="letter-spacing:-0.04em">MINTS</NuxtLink>

          <form class="relative flex-1" @submit.prevent="emit('submit')">
            <input
              v-model="query"
              type="search"
              placeholder="Cari gamis, abaya, hijab..."
              class="h-10 w-full rounded-full border bg-white pl-4 pr-12 text-sm focus:outline-none"
              style="border-color:rgba(9,11,12,0.15);color:#090b0c"
            />
            <button type="submit" class="absolute right-1 top-1 flex h-8 w-9 items-center justify-center rounded-full" style="background:#090b0c;color:white" aria-label="Cari">
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </button>
          </form>

          <NuxtLink to="/cart" class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full" aria-label="Keranjang">
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"/></svg>
            <span v-if="itemCount > 0" class="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold" style="background:#fabc3f;color:#090b0c">{{ itemCount }}</span>
          </NuxtLink>
        </div>
      </div>
    </header>
</template>

<script setup lang="ts">
// Header sticky bersama (beranda & halaman kategori): logo, search bar, keranjang.
const props = defineProps<{ modelValue?: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string]; submit: [] }>()

const query = computed({
  get: () => props.modelValue ?? '',
  set: v => emit('update:modelValue', v)
})

const { itemCount } = useCart()
const { isLoggedIn, fetchMe } = useAuth()
onMounted(() => fetchMe())
</script>
