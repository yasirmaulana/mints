<template>
  <div class="min-h-screen antialiased" style="background:#f5f5f2;color:#090b0c;font-family:'Inter Tight',system-ui,sans-serif">

    <!-- Navbar -->
    <header class="sticky top-0 z-40 px-5 py-4 md:px-12" style="background:rgba(245,245,242,0.88);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.06)">
      <div class="relative flex h-10 items-center max-w-3xl mx-auto">
        <NuxtLink to="/cart" class="flex items-center gap-2 text-sm transition-opacity hover:opacity-60" style="color:#090b0c">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Keranjang
        </NuxtLink>
        <NuxtLink to="/" class="absolute left-1/2 -translate-x-1/2 font-black text-xl tracking-tighter" style="font-family:'Inter Tight',sans-serif;color:#090b0c;letter-spacing:-0.04em">MINTS</NuxtLink>
      </div>
    </header>

    <!-- Steps -->
    <div class="px-5 md:px-12" style="border-bottom:1px solid rgba(9,11,12,0.06)">
      <div class="max-w-3xl mx-auto py-4 flex items-center gap-1 overflow-x-auto">
        <template v-for="(s, i) in steps" :key="s.key">
          <button
            class="flex items-center gap-2 text-sm whitespace-nowrap transition-opacity rounded-full px-3 py-1.5"
            :style="step === i ? 'background:#090b0c;color:white' : step > i ? 'color:rgba(9,11,12,0.7)' : 'color:rgba(9,11,12,0.3)'"
            @click="step > i && (step = i)"
          >
            <span
              class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-normal shrink-0"
              :style="step >= i ? 'background:rgba(255,255,255,0.25)' : 'background:rgba(9,11,12,0.08)'"
            >{{ step > i ? '✓' : i + 1 }}</span>
            {{ s.label }}
          </button>
          <div v-if="i < steps.length - 1" class="w-4 h-px shrink-0" style="background:rgba(9,11,12,0.15)" />
        </template>
      </div>
    </div>

    <div class="mx-auto max-w-3xl px-5 py-8 md:px-12">

      <!-- Empty cart -->
      <div v-if="!cartItems.length" class="flex flex-col items-center justify-center py-32 gap-4">
        <p class="text-5xl font-normal">○</p>
        <p class="text-lg font-normal" style="color:rgba(9,11,12,0.5)">Keranjang kosong</p>
        <NuxtLink to="/" class="rounded-full px-7 py-3 text-sm font-normal transition-opacity hover:opacity-85" style="background:#090b0c;color:white">Belanja Sekarang</NuxtLink>
      </div>

      <template v-else>

        <!-- Step 0: Data Pembeli -->
        <div v-if="step === 0" class="space-y-5">
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
              <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Langkah 1</span>
            </div>
            <h2 class="text-2xl font-normal tracking-tight">Data Pembeli</h2>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Nama Lengkap</label>
              <input v-model="form.buyerName" type="text" placeholder="Nama penerima" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:white;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
            </div>
            <div>
              <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Nomor HP (WhatsApp)</label>
              <input v-model="form.buyerPhone" type="tel" placeholder="08xxxxxxxxxx" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:white;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
              <p class="text-xs mt-2" style="color:rgba(9,11,12,0.4)">Digunakan untuk konfirmasi pesanan via WhatsApp</p>
            </div>
          </div>

          <button
            class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity"
            :style="canStep0 ? 'background:#090b0c;color:white' : 'background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed'"
            :disabled="!canStep0"
            @click="canStep0 && (step = 1)"
          >Lanjut ke Alamat</button>
        </div>

        <!-- Step 1: Alamat -->
        <div v-if="step === 1" class="space-y-5">
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
              <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Langkah 2</span>
            </div>
            <h2 class="text-2xl font-normal tracking-tight">Alamat Pengiriman</h2>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Alamat Lengkap</label>
              <textarea v-model="form.address" rows="3" placeholder="Jl. Contoh No. 1, RT/RW, Kelurahan, Kecamatan" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none" style="background:white;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
            </div>
            <div>
              <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Kota / Kabupaten</label>
              <div class="relative">
                <input
                  v-model="citySearch"
                  type="text"
                  placeholder="Cari kota..."
                  class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none"
                  style="background:white;border:1px solid rgba(9,11,12,0.12);color:#090b0c"
                  @input="searchCities"
                  @focus="showCityDropdown = true"
                />
                <div v-if="showCityDropdown && cities.length" class="absolute z-10 w-full mt-2 shadow-lg max-h-56 overflow-y-auto" style="background:white;border:1px solid rgba(9,11,12,0.1);border-radius:1rem">
                  <button
                    v-for="city in cities"
                    :key="city.city_id"
                    class="w-full text-left px-4 py-2.5 text-sm transition-colors"
                    style="color:#090b0c"
                    @mouseover="($event.currentTarget as HTMLElement).style.background='rgba(9,11,12,0.04)'"
                    @mouseleave="($event.currentTarget as HTMLElement).style.background='transparent'"
                    @click="selectCity(city)"
                  >{{ city.label || `${city.type} ${city.city_name}, ${city.province}` }}</button>
                </div>
              </div>
              <p v-if="form.cityName" class="text-xs mt-2 font-normal" style="color:rgba(9,11,12,0.5)">Dipilih: {{ form.cityName }}</p>
            </div>
          </div>

          <button
            class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity"
            :style="canStep1 ? 'background:#090b0c;color:white' : 'background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed'"
            :disabled="!canStep1"
            @click="canStep1 && loadShipping()"
          >Cek Ongkir</button>
        </div>

        <!-- Step 2: Pengiriman -->
        <div v-if="step === 2" class="space-y-5">
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
              <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Langkah 3</span>
            </div>
            <h2 class="text-2xl font-normal tracking-tight">Pilih Pengiriman</h2>
          </div>

          <div v-if="loadingShipping" class="flex items-center gap-3 py-8">
            <div class="w-5 h-5 rounded-full border-2 animate-spin" style="border-color:rgba(9,11,12,0.15);border-top-color:#090b0c" />
            <p class="text-sm" style="color:rgba(9,11,12,0.4)">Memuat ongkos kirim…</p>
          </div>
          <template v-else>
            <!-- Free shipping notice -->
            <div v-if="subtotal >= freeShippingMin" class="rounded-2xl p-4" style="background:rgba(34,197,94,0.1);border:1px solid rgba(34,197,94,0.25)">
              <p class="text-sm font-normal" style="color:rgb(22,163,74)">Selamat! Kamu mendapat gratis ongkir ke seluruh Indonesia.</p>
            </div>

            <template v-else>
              <!-- Courier selector -->
              <div>
                <p class="text-sm font-normal mb-3" style="color:rgba(9,11,12,0.6)">Pilih Kurir</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="c in couriers"
                    :key="c"
                    class="px-4 py-2 rounded-full text-sm font-normal transition-all"
                    :style="form.courierCode === c ? 'background:#090b0c;color:white' : 'background:white;color:#090b0c'"
                    @click="selectCourier(c)"
                  >{{ c.toUpperCase() }}</button>
                </div>
              </div>

              <!-- Services -->
              <div class="space-y-2">
                <div
                  v-for="svc in shippingServices"
                  :key="svc.service"
                  class="flex items-center justify-between rounded-2xl p-4 cursor-pointer transition-all"
                  :style="selectedService?.service === svc.service ? 'background:#090b0c;color:white' : 'background:white;color:#090b0c'"
                  @click="selectedService = svc"
                >
                  <div>
                    <p class="text-sm font-normal">{{ form.courierCode.toUpperCase() }} {{ svc.service }}</p>
                    <p class="text-xs mt-0.5" :style="selectedService?.service === svc.service ? 'color:rgba(255,255,255,0.55)' : 'color:rgba(9,11,12,0.4)'">{{ svc.description }} · Est. {{ svc.cost[0]?.etd || '?' }} hari</p>
                  </div>
                  <p class="text-sm font-normal tabular-nums shrink-0">{{ formatPrice(svc.cost[0]?.value || 0) }}</p>
                </div>
                <div v-if="!shippingServices.length" class="text-center py-8 text-sm" style="color:rgba(9,11,12,0.4)">Tidak ada layanan tersedia untuk rute ini</div>
              </div>
            </template>

            <button
              class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity"
              :style="canStep2 ? 'background:#090b0c;color:white' : 'background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed'"
              :disabled="!canStep2"
              @click="canStep2 && (step = 3)"
            >Lanjut ke Pembayaran</button>
          </template>
        </div>

        <!-- Step 3: Pembayaran -->
        <div v-if="step === 3" class="space-y-5">
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
              <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Langkah 4</span>
            </div>
            <h2 class="text-2xl font-normal tracking-tight">Metode Pembayaran</h2>
          </div>

          <div class="space-y-2">
            <button
              v-for="pm in paymentMethods"
              :key="pm.code"
              class="w-full flex items-center gap-4 rounded-2xl p-4 transition-all"
              :style="form.paymentMethod === pm.code ? 'background:#090b0c;color:white' : 'background:white;color:#090b0c'"
              @click="form.paymentMethod = pm.code"
            >
              <span
                class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                :style="form.paymentMethod === pm.code ? 'border-color:rgba(255,255,255,0.6)' : 'border-color:rgba(9,11,12,0.2)'"
              >
                <span v-if="form.paymentMethod === pm.code" class="w-2 h-2 rounded-full" style="background:white" />
              </span>
              <div class="text-left">
                <p class="text-sm font-normal">{{ pm.name }}</p>
                <p class="text-xs mt-0.5" :style="form.paymentMethod === pm.code ? 'color:rgba(255,255,255,0.5)' : 'color:rgba(9,11,12,0.4)'">{{ pm.description }}</p>
              </div>
            </button>
          </div>

          <button
            class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity"
            :style="form.paymentMethod ? 'background:#090b0c;color:white' : 'background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed'"
            :disabled="!form.paymentMethod"
            @click="form.paymentMethod && (step = 4)"
          >Lanjut ke Review</button>
        </div>

        <!-- Step 4: Review -->
        <div v-if="step === 4" class="space-y-5">
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <div class="h-px w-5" style="background:rgba(9,11,12,0.6)" />
              <span class="text-xs font-normal uppercase tracking-[0.16rem]" style="color:rgba(9,11,12,0.5)">Langkah 5</span>
            </div>
            <h2 class="text-2xl font-normal tracking-tight">Review Pesanan</h2>
          </div>

          <!-- Summary blocks -->
          <div class="rounded-3xl overflow-hidden" style="background:white">
            <div class="p-5 border-b" style="border-color:rgba(9,11,12,0.06)">
              <p class="text-xs font-normal uppercase tracking-[0.12rem] mb-3" style="color:rgba(9,11,12,0.4)">Data Pembeli</p>
              <p class="text-sm font-normal">{{ form.buyerName }}</p>
              <p class="text-sm mt-0.5" style="color:rgba(9,11,12,0.5)">{{ form.buyerPhone }}</p>
            </div>
            <div class="p-5 border-b" style="border-color:rgba(9,11,12,0.06)">
              <p class="text-xs font-normal uppercase tracking-[0.12rem] mb-3" style="color:rgba(9,11,12,0.4)">Alamat Pengiriman</p>
              <p class="text-sm font-normal">{{ form.address }}</p>
              <p class="text-sm mt-1 font-normal">{{ form.cityName }}</p>
            </div>
            <div class="p-5 border-b" style="border-color:rgba(9,11,12,0.06)">
              <p class="text-xs font-normal uppercase tracking-[0.12rem] mb-3" style="color:rgba(9,11,12,0.4)">Pengiriman</p>
              <p class="text-sm font-normal">{{ shippingLabel }}</p>
              <p class="text-sm mt-0.5" :style="finalShippingCost === 0 ? 'color:rgb(22,163,74)' : 'color:rgba(9,11,12,0.5)'">{{ shippingCostDisplay }}</p>
            </div>
            <div class="p-5">
              <p class="text-xs font-normal uppercase tracking-[0.12rem] mb-3" style="color:rgba(9,11,12,0.4)">Metode Pembayaran</p>
              <p class="text-sm font-normal">{{ selectedPaymentMethodLabel }}</p>
              <!-- Info rekening bank jika memilih Transfer Manual -->
              <template v-if="form.paymentMethod === 'FT' && paymentConfig?.bankAccounts?.length">
                <div class="mt-3 space-y-2">
                  <p class="text-xs font-medium uppercase tracking-wide" style="color:rgba(9,11,12,0.4)">Rekening Tujuan</p>
                  <div v-for="acc in paymentConfig.bankAccounts" :key="acc.accountNumber" class="flex items-start gap-3 p-3 rounded-xl" style="background:rgba(9,11,12,0.03);border:1px solid rgba(9,11,12,0.06)">
                    <div class="flex-1">
                      <p class="text-sm font-semibold">{{ acc.bank }}</p>
                      <p class="text-sm mt-0.5" style="color:rgba(9,11,12,0.7)">{{ acc.accountNumber }}</p>
                      <p class="text-xs mt-0.5" style="color:rgba(9,11,12,0.45)">a.n. {{ acc.accountName }}</p>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- Items -->
          <div class="rounded-3xl overflow-hidden" style="background:white">
            <div class="px-5 py-4 border-b" style="border-color:rgba(9,11,12,0.06)">
              <p class="text-xs font-normal uppercase tracking-[0.12rem]" style="color:rgba(9,11,12,0.4)">Produk ({{ itemCount }} item)</p>
            </div>
            <div
              v-for="item in cartItems"
              :key="`${item.productId}-${item.variantId}`"
              class="flex gap-4 px-5 py-4 border-b last:border-b-0"
              style="border-color:rgba(9,11,12,0.06)"
            >
              <div class="w-14 h-14 rounded-2xl overflow-hidden shrink-0" style="background:rgba(9,11,12,0.05)">
                <img :src="item.imageUrl" :alt="item.title" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-normal truncate">{{ item.title }}</p>
                <p v-if="item.size" class="text-xs mt-0.5" style="color:rgba(9,11,12,0.4)">Ukuran: {{ item.size }}</p>
                <p class="text-xs mt-1" style="color:rgba(9,11,12,0.4)">{{ item.qty }}× {{ formatPrice(item.price) }}</p>
              </div>
              <p class="text-sm font-normal tabular-nums shrink-0">{{ formatPrice(item.price * item.qty) }}</p>
            </div>
          </div>

          <!-- Total -->
          <div class="rounded-3xl p-5 space-y-3" style="background:white">
            <div class="flex justify-between text-sm">
              <span style="color:rgba(9,11,12,0.5)">Subtotal</span>
              <span class="tabular-nums">{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span style="color:rgba(9,11,12,0.5)">Ongkos kirim</span>
              <span class="tabular-nums" :style="finalShippingCost === 0 ? 'color:rgb(22,163,74)' : ''">{{ finalShippingCost === 0 ? 'GRATIS' : formatPrice(finalShippingCost) }}</span>
            </div>
            <div class="flex justify-between pt-3 border-t" style="border-color:rgba(9,11,12,0.08)">
              <span class="text-sm font-normal">Total</span>
              <span class="text-lg font-normal tabular-nums tracking-tight">{{ formatPrice(subtotal + finalShippingCost) }}</span>
            </div>
          </div>

          <!-- State: stok habis -->
          <div v-if="soldOutError" class="rounded-2xl overflow-hidden" style="border:1px solid rgba(239,68,68,0.2)">
            <div class="px-5 pt-5 pb-4 space-y-1" style="background:rgba(239,68,68,0.05)">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 shrink-0" style="color:rgb(185,28,28)" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
                </svg>
                <p class="text-sm font-semibold" style="color:rgb(185,28,28)">Stok habis saat checkout</p>
              </div>
              <p class="text-sm pl-7" style="color:rgba(9,11,12,0.6)">
                <strong style="color:rgb(153,27,27)">{{ soldOutError }}</strong> sudah terjual oleh pembeli lain sesaat sebelum pesananmu diproses.
              </p>
            </div>
            <div class="px-5 py-4 space-y-2" style="background:white">
              <p class="text-xs" style="color:rgba(9,11,12,0.45)">Item tersebut sudah dihapus dari keranjang. Silakan pilih produk lain.</p>
              <div class="flex flex-col sm:flex-row gap-2 pt-1">
                <NuxtLink to="/koleksi" class="flex-1 rounded-full py-2.5 text-sm font-medium text-center transition-colors" style="background:#090b0c;color:white">
                  Lihat Koleksi
                </NuxtLink>
                <NuxtLink to="/flash_sale" class="flex-1 rounded-full py-2.5 text-sm font-medium text-center transition-colors" style="background:rgba(9,11,12,0.06);color:#090b0c">
                  Flash Sale
                </NuxtLink>
                <NuxtLink to="/" class="flex-1 rounded-full py-2.5 text-sm font-medium text-center transition-colors" style="background:rgba(9,11,12,0.06);color:#090b0c">
                  Beranda
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Tombol normal (sembunyikan jika sold out) -->
          <template v-else>
            <button
              class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity"
              :style="placing ? 'background:rgba(9,11,12,0.4);color:white;cursor:not-allowed' : 'background:#090b0c;color:white'"
              :disabled="placing"
              @click="placeOrder"
            >{{ placing ? 'Memproses…' : 'Buat Pesanan & Bayar' }}</button>

            <!-- Error umum -->
            <div v-if="orderError" class="rounded-2xl p-4 text-sm" style="background:rgba(239,68,68,0.08);color:rgb(185,28,28)">{{ orderError }}</div>
          </template>
        </div>

      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'buyer' })
useSeoMeta({ title: 'Checkout — MINTS' })

const { cartItems, itemCount, subtotal, freeShippingMin, clearCart, removeItem } = useCart()
const { user, fetchMe } = useAuth()
const router = useRouter()

const steps = [
  { key: 'buyer', label: 'Data Pembeli' },
  { key: 'address', label: 'Alamat' },
  { key: 'shipping', label: 'Pengiriman' },
  { key: 'payment', label: 'Pembayaran' },
  { key: 'review', label: 'Review' }
]
const step = ref(0)

const form = reactive({
  buyerName: '',
  buyerPhone: '',
  address: '',
  cityId: '',
  cityName: '',
  courierCode: 'jne',
  courierService: '',
  paymentMethod: ''
})

const citySearch = ref('')
const cities = ref<any[]>([])
const showCityDropdown = ref(false)
const shippingServices = ref<any[]>([])
const selectedService = ref<any>(null)
const loadingShipping = ref(false)
const placing = ref(false)
const orderError = ref('')
const soldOutError = ref('') // nama produk yang habis, kosong = tidak ada error sold out

const couriers = ['jne', 'jnt', 'sicepat', 'pos', 'tiki']

onMounted(async () => {
  await fetchMe()
  if (user.value) {
    if (!form.buyerName) form.buyerName = user.value.name
    if (!form.buyerPhone) form.buyerPhone = user.value.phone
  }
})

const GATEWAY_METHODS = [
  { code: 'VC', name: 'Virtual Account BCA', description: 'Transfer via Virtual Account BCA' },
  { code: 'M2', name: 'Virtual Account Mandiri', description: 'Transfer via Virtual Account Mandiri' },
  { code: 'BT', name: 'Virtual Account BRI', description: 'Transfer via Virtual Account BRI' },
  { code: 'B1', name: 'Virtual Account BNI', description: 'Transfer via Virtual Account BNI' },
  { code: 'OV', name: 'OVO', description: 'Bayar dengan OVO' },
  { code: 'DA', name: 'DANA', description: 'Bayar dengan DANA' },
  { code: 'SP', name: 'ShopeePay', description: 'Bayar dengan ShopeePay' },
  { code: 'I1', name: 'BCA KlikPay', description: 'Bayar dengan BCA KlikPay' },
]

interface BankAccount { bank: string; accountName: string; accountNumber: string }
const { data: paymentConfig } = await useFetch<{ gatewayEnabled: boolean; bankAccounts: BankAccount[] }>('/api/payment/settings')

const paymentMethods = computed(() => {
  const methods = []
  if (paymentConfig.value?.gatewayEnabled) methods.push(...GATEWAY_METHODS)
  const banks = paymentConfig.value?.bankAccounts ?? []
  if (banks.length) methods.push({ code: 'FT', name: 'Transfer Bank Manual', description: `Transfer ke rekening ${banks[0].bank}${banks.length > 1 ? ` (+${banks.length - 1} lainnya)` : ''}` })
  return methods
})

const canStep0 = computed(() => form.buyerName.trim().length >= 3 && /^(08|628|\+628)\d{8,12}$/.test(form.buyerPhone))
const canStep1 = computed(() => form.address.trim().length >= 10 && !!form.cityId)
const canStep2 = computed(() => subtotal.value >= freeShippingMin.value || !!selectedService.value)

const finalShippingCost = computed(() => {
  if (subtotal.value >= freeShippingMin.value) return 0
  return selectedService.value?.cost?.[0]?.value || 0
})

const shippingLabel = computed(() => {
  if (subtotal.value >= freeShippingMin.value) return 'Gratis Ongkir'
  if (!selectedService.value) return '-'
  return `${form.courierCode.toUpperCase()} ${selectedService.value.service}`
})

const shippingCostDisplay = computed(() => finalShippingCost.value === 0 ? 'GRATIS' : formatPrice(finalShippingCost.value))
const selectedPaymentMethodLabel = computed(() => paymentMethods.value.find((p: any) => p.code === form.paymentMethod)?.name || '-')
const totalWeight = computed(() => cartItems.value.reduce((sum, item) => sum + (item.qty * 300), 0))

let citySearchTimeout: ReturnType<typeof setTimeout>
function searchCities() {
  clearTimeout(citySearchTimeout)
  citySearchTimeout = setTimeout(async () => {
    if (!citySearch.value.trim()) { cities.value = []; return }
    cities.value = await $fetch('/api/shipping/cities', { query: { search: citySearch.value } })
  }, 300)
}

function selectCity(city: any) {
  form.cityId = city.city_id
  form.cityName = city.label || `${city.type} ${city.city_name}`
  citySearch.value = `${city.type} ${city.city_name}`
  showCityDropdown.value = false
}

async function loadShipping() {
  loadingShipping.value = true
  step.value = 2
  selectedService.value = null
  shippingServices.value = []
  try {
    if (subtotal.value < freeShippingMin.value) await fetchShippingCosts()
  } finally {
    loadingShipping.value = false
  }
}

async function fetchShippingCosts() {
  const res = await $fetch<any>('/api/shipping/cost', {
    query: { destination: form.cityId, weight: totalWeight.value, courier: form.courierCode }
  })
  shippingServices.value = res.services || []
}

async function selectCourier(code: string) {
  form.courierCode = code
  selectedService.value = null
  loadingShipping.value = true
  await fetchShippingCosts().finally(() => { loadingShipping.value = false })
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

async function placeOrder() {
  placing.value = true
  orderError.value = ''
  soldOutError.value = ''
  try {
    const res = await $fetch<any>('/api/checkout/regular', {
      method: 'POST',
      body: {
        buyerName: form.buyerName,
        buyerPhone: form.buyerPhone,
        address: form.address,
        cityId: form.cityId,
        cityName: form.cityName,
        courierCode: form.courierCode,
        courierService: selectedService.value?.service || '',
        shippingCost: finalShippingCost.value,
        totalSubtotal: subtotal.value,
        items: cartItems.value.map(i => ({
          productId: i.productId,
          variantId: i.variantId || null,
          qty: i.qty,
          size: i.size || null,
          source: i.source || 'REGULAR'
        }))
      }
    })

    const firstOrderId = res.orders?.[0]?.orderId
    if (firstOrderId && form.paymentMethod !== 'FT') {
      const payRes = await $fetch<any>('/api/payment/create-transaction', {
        method: 'POST',
        body: { orderId: firstOrderId, paymentMethod: form.paymentMethod }
      })
      clearCart()
      window.location.href = payRes.paymentUrl
    } else {
      clearCart()
      router.push('/account/orders')
    }
  } catch (err: any) {
    const msg: string = err?.data?.statusMessage || ''
    // Deteksi error "sudah habis terjual" — ekstrak nama produk dari pesan server
    // Format server: "<Nama Produk> sudah habis terjual"
    const soldOutMatch = msg.match(/^(.+?)\s+sudah habis terjual$/i)
    if (soldOutMatch) {
      soldOutError.value = soldOutMatch[1]
      // Hapus item yang sold out dari cart
      const soldOutTitle = soldOutMatch[1].toLowerCase()
      cartItems.value
        .filter((i: any) => i.title.toLowerCase() === soldOutTitle)
        .forEach((i: any) => removeItem(i.productId, i.variantId))
    } else {
      orderError.value = msg || 'Terjadi kesalahan. Silakan coba lagi.'
    }
  } finally {
    placing.value = false
  }
}

if (process.client) {
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('.relative')) showCityDropdown.value = false
  })
}
</script>
