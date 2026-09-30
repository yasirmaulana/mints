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

              <!-- Akun sudah punya nomor HP: pilih pakai nomor akun atau nomor lain khusus pesanan ini -->
              <div v-if="accountPhone" class="space-y-2">
                <button
                  type="button"
                  class="w-full text-left rounded-2xl px-4 py-3 flex items-center gap-3 transition-all"
                  :style="phoneMode === 'account' ? 'background:#090b0c;color:white' : 'background:white;border:1px solid rgba(9,11,12,0.12);color:#090b0c'"
                  @click="phoneMode = 'account'"
                >
                  <span
                    class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                    :style="phoneMode === 'account' ? 'border-color:rgba(255,255,255,0.6)' : 'border-color:rgba(9,11,12,0.2)'"
                  >
                    <span v-if="phoneMode === 'account'" class="w-2 h-2 rounded-full" style="background:white" />
                  </span>
                  <span class="text-sm font-normal tabular-nums">{{ accountPhone }}</span>
                  <span class="text-xs ml-auto" :style="phoneMode === 'account' ? 'color:rgba(255,255,255,0.6)' : 'color:rgba(9,11,12,0.4)'">Nomor akun</span>
                </button>
                <button
                  type="button"
                  class="w-full text-left rounded-2xl px-4 py-3 flex items-center gap-3 transition-all"
                  :style="phoneMode === 'new' ? 'background:#090b0c;color:white' : 'background:white;border:1px solid rgba(9,11,12,0.12);color:#090b0c'"
                  @click="phoneMode = 'new'"
                >
                  <span
                    class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                    :style="phoneMode === 'new' ? 'border-color:rgba(255,255,255,0.6)' : 'border-color:rgba(9,11,12,0.2)'"
                  >
                    <span v-if="phoneMode === 'new'" class="w-2 h-2 rounded-full" style="background:white" />
                  </span>
                  <span class="text-sm font-normal">Nomor lain untuk pesanan ini</span>
                </button>
                <input
                  v-if="phoneMode === 'new'"
                  v-model="form.buyerPhone"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none"
                  style="background:white;border:1px solid rgba(9,11,12,0.12);color:#090b0c"
                />
              </div>

              <!-- Akun belum punya nomor HP: isi di sini, opsi simpan ke akun -->
              <div v-else class="space-y-2">
                <input v-model="form.buyerPhone" type="tel" placeholder="08xxxxxxxxxx" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="background:white;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
                <label class="flex items-center gap-2 text-sm" style="color:rgba(9,11,12,0.6)">
                  <input v-model="saveNewPhone" type="checkbox" class="rounded" />
                  Simpan sebagai nomor HP akun saya
                </label>
              </div>

              <p class="text-xs mt-2" style="color:rgba(9,11,12,0.4)">Digunakan untuk konfirmasi pesanan via WhatsApp</p>
            </div>
          </div>

          <button
            class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity"
            :style="canStep0 ? 'background:#090b0c;color:white' : 'background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed'"
            :disabled="!canStep0"
            @click="canStep0 && goToStep1()"
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

          <!-- Alamat tersimpan: pilih salah satu, atau tambah alamat baru -->
          <div v-if="savedAddresses.length && !showAddressForm" class="space-y-3">
            <button
              v-for="a in savedAddresses"
              :key="a.id"
              class="w-full text-left rounded-3xl p-4 transition-all"
              :style="selectedAddressId === a.id ? 'background:#090b0c;color:white' : 'background:white;color:#090b0c'"
              @click="chooseSavedAddress(a)"
            >
              <div class="flex items-center gap-2">
                <span
                  class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0"
                  :style="selectedAddressId === a.id ? 'border-color:rgba(255,255,255,0.6)' : 'border-color:rgba(9,11,12,0.2)'"
                >
                  <span v-if="selectedAddressId === a.id" class="w-2 h-2 rounded-full" style="background:white" />
                </span>
                <p class="text-sm font-normal">{{ a.label || a.cityName }}</p>
                <span v-if="a.isDefault" class="text-xs px-2 py-0.5 rounded-full" :style="selectedAddressId === a.id ? 'background:rgba(255,255,255,0.2)' : 'background:rgba(9,11,12,0.06)'">Utama</span>
              </div>
              <p class="text-sm mt-2 pl-6" :style="selectedAddressId === a.id ? 'color:rgba(255,255,255,0.75)' : 'color:rgba(9,11,12,0.6)'">{{ a.address }}</p>
              <p class="text-xs mt-1 pl-6" :style="selectedAddressId === a.id ? 'color:rgba(255,255,255,0.55)' : 'color:rgba(9,11,12,0.4)'">{{ a.cityName }}</p>
            </button>

            <button
              class="w-full rounded-full py-3 text-sm font-normal transition-opacity"
              style="background:rgba(9,11,12,0.05);color:#090b0c"
              @click="openNewAddressForm"
            >+ Tambah Alamat Baru</button>

            <button
              class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity"
              :style="canStep1 ? 'background:#090b0c;color:white' : 'background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed'"
              :disabled="!canStep1"
              @click="canStep1 && loadShipping()"
            >Cek Ongkir</button>
          </div>

          <!-- Form alamat baru -->
          <div v-else class="space-y-4">
            <button v-if="savedAddresses.length" class="text-sm mb-1" style="color:rgba(9,11,12,0.5)" @click="showAddressForm = false">← Pilih dari alamat tersimpan</button>
            <div>
              <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Alamat Lengkap</label>
              <textarea v-model="form.address" rows="3" placeholder="Jl. Contoh No. 1, RT/RW, Kelurahan, Kecamatan" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none" style="background:white;border:1px solid rgba(9,11,12,0.12);color:#090b0c" />
            </div>
            <div>
              <label class="block text-sm font-normal mb-2" style="color:rgba(9,11,12,0.6)">Kelurahan/ Kecamatan/ Kabupaten/ Kota</label>
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
            <label class="flex items-center gap-2 text-sm" style="color:rgba(9,11,12,0.6)">
              <input v-model="saveNewAddress" type="checkbox" class="rounded" />
              Simpan alamat ini untuk checkout berikutnya
            </label>
          </div>

          <button
            v-if="!savedAddresses.length || showAddressForm"
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
            <!-- Satu blok per toko — keranjang lintas toko, ongkir dihitung dari kota asal masing-masing (PRD §11 Fase 5) -->
            <div v-for="g in groupedByStore" :key="g.storeId || 'null'" class="rounded-3xl p-4 space-y-3" style="background:white">
              <p class="text-sm font-normal" style="color:rgba(9,11,12,0.6)">{{ g.storeName || 'MINTS' }}</p>

              <div class="flex flex-wrap gap-2">
                <button
                  v-for="c in couriers"
                  :key="c"
                  class="px-4 py-2 rounded-full text-sm font-normal transition-all"
                  :disabled="courierUnavailable(g.storeId, c)"
                  :style="courierUnavailable(g.storeId, c)
                    ? 'background:rgba(9,11,12,0.03);color:rgba(9,11,12,0.25);cursor:not-allowed'
                    : (shippingState[g.storeId || 'null']?.courierCode === c ? 'background:#090b0c;color:white' : 'background:rgba(9,11,12,0.05);color:#090b0c')"
                  @click="!courierUnavailable(g.storeId, c) && selectCourier(g.storeId, c)"
                >{{ c.toUpperCase() }}<span v-if="courierUnavailable(g.storeId, c)" class="ml-1 text-[10px]">· tidak tersedia</span></button>
              </div>

              <div class="space-y-2">
                <div
                  v-for="svc in shippingState[g.storeId || 'null']?.services || []"
                  :key="svc.service"
                  class="flex items-center justify-between rounded-2xl p-3 cursor-pointer transition-all"
                  :style="shippingState[g.storeId || 'null']?.selected?.service === svc.service ? 'background:#090b0c;color:white' : 'background:rgba(9,11,12,0.03);color:#090b0c'"
                  @click="shippingState[g.storeId || 'null'].selected = svc"
                >
                  <div>
                    <p class="text-sm font-normal">{{ shippingState[g.storeId || 'null']?.courierCode.toUpperCase() }} {{ svc.service }}</p>
                    <p class="text-xs mt-0.5" :style="shippingState[g.storeId || 'null']?.selected?.service === svc.service ? 'color:rgba(255,255,255,0.55)' : 'color:rgba(9,11,12,0.4)'">{{ svc.description }} · Est. {{ svc.cost[0]?.etd || '?' }} hari</p>
                  </div>
                  <p class="text-sm font-normal tabular-nums shrink-0">{{ formatPrice(svc.cost[0]?.value || 0) }}</p>
                </div>
                <div v-if="!(shippingState[g.storeId || 'null']?.services || []).length" class="text-center py-6 text-sm" style="color:rgba(9,11,12,0.4)">Tidak ada layanan tersedia untuk rute ini</div>
              </div>

              <!-- Voucher toko -->
              <div class="flex items-center gap-2 pt-2 border-t" style="border-color:rgba(9,11,12,0.06)">
                <input
                  v-model="voucherState[g.storeId || 'null'].input"
                  type="text"
                  placeholder="Kode voucher toko ini"
                  class="flex-1 rounded-full px-4 py-2 text-sm outline-none"
                  style="background:rgba(9,11,12,0.04)"
                  @keyup.enter="applyVoucher(g.storeId)"
                >
                <button
                  class="px-4 py-2 rounded-full text-sm font-normal shrink-0"
                  style="background:#090b0c;color:white"
                  :disabled="voucherState[g.storeId || 'null'].loading"
                  @click="applyVoucher(g.storeId)"
                >Terapkan</button>
              </div>
              <p v-if="voucherState[g.storeId || 'null'].message" class="text-xs" :style="voucherState[g.storeId || 'null'].discount > 0 ? 'color:rgb(22,163,74)' : 'color:rgb(185,28,28)'">
                {{ voucherState[g.storeId || 'null'].message }}
              </p>
            </div>

            <button
              class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity"
              :style="canStep2 ? 'background:#090b0c;color:white' : 'background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed'"
              :disabled="!canStep2"
              @click="canStep2 && goToStep3()"
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
              <div class="text-left flex-1">
                <p class="text-sm font-normal">{{ pm.name }}</p>
                <p class="text-xs mt-0.5" :style="form.paymentMethod === pm.code ? 'color:rgba(255,255,255,0.5)' : 'color:rgba(9,11,12,0.4)'">{{ pm.description }}</p>
              </div>
              <p v-if="paymentFees[pm.code]" class="text-xs shrink-0" :style="form.paymentMethod === pm.code ? 'color:rgba(255,255,255,0.6)' : 'color:rgba(9,11,12,0.45)'">+{{ formatPrice(paymentFees[pm.code]) }}</p>
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
              <p v-if="selectedPaymentFee > 0" class="text-xs mt-0.5" style="color:rgba(9,11,12,0.45)">Biaya admin {{ formatPrice(selectedPaymentFee) }}</p>
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
              <span class="tabular-nums">{{ formatPrice(finalShippingCost) }}</span>
            </div>
            <div v-if="totalDiscount > 0" class="flex justify-between text-sm">
              <span style="color:rgba(9,11,12,0.5)">Diskon voucher</span>
              <span class="tabular-nums" style="color:rgb(22,163,74)">-{{ formatPrice(totalDiscount) }}</span>
            </div>
            <div v-if="selectedPaymentFee > 0" class="flex justify-between text-sm">
              <span style="color:rgba(9,11,12,0.5)">Biaya admin</span>
              <span class="tabular-nums">{{ formatPrice(selectedPaymentFee) }}</span>
            </div>
            <div class="flex justify-between pt-3 border-t" style="border-color:rgba(9,11,12,0.08)">
              <span class="text-sm font-normal">Total</span>
              <span class="text-lg font-normal tabular-nums tracking-tight">{{ formatPrice(subtotal + finalShippingCost - totalDiscount + selectedPaymentFee) }}</span>
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
import { GATEWAY_METHODS, NO_REDIRECT_METHODS } from '~~/shared/utils/payment-methods'

definePageMeta({ middleware: 'buyer' })
useSeoMeta({ title: 'Checkout — MINTS' })

const { cartItems, itemCount, subtotal, groupedByStore, clearCart, removeItem } = useCart()
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
  paymentMethod: ''
})

const citySearch = ref('')
const cities = ref<any[]>([])
const showCityDropdown = ref(false)

// Alamat tersimpan milik buyer login — dipilih atau ditambah baru (lihat pembahasan checkout alamat).
const savedAddresses = ref<any[]>([])
const selectedAddressId = ref<string | null>(null)
const showAddressForm = ref(false)
const saveNewAddress = ref(true)

async function loadSavedAddresses() {
  try {
    savedAddresses.value = await $fetch<any[]>('/api/buyer/addresses')
  } catch {
    savedAddresses.value = []
  }
  if (savedAddresses.value.length) {
    const def = savedAddresses.value.find(a => a.isDefault) || savedAddresses.value[0]
    chooseSavedAddress(def)
  } else {
    showAddressForm.value = true
  }
}

function chooseSavedAddress(a: any) {
  selectedAddressId.value = a.id
  showAddressForm.value = false
  form.address = a.address
  form.cityId = a.cityId
  form.cityName = a.cityName
  citySearch.value = a.cityName
}

function openNewAddressForm() {
  selectedAddressId.value = null
  showAddressForm.value = true
  form.address = ''
  form.cityId = ''
  form.cityName = ''
  citySearch.value = ''
  saveNewAddress.value = true
}
// Satu entri per toko (storeId | 'null'): pengiriman dipilih per toko, PRD §11 Fase 5.
// byCourier: cache hasil per kode kurir supaya pindah tab tidak query ulang ke RajaOngkir —
// semua kurir di-prefetch paralel sekali saat masuk step ini (lihat loadShipping()).
const shippingState = reactive<Record<string, { courierCode: string; services: any[]; selected: any; byCourier: Record<string, any[]> }>>({})
// Satu entri per toko: kode voucher diinput manual, divalidasi via /api/vouchers/validate
const voucherState = reactive<Record<string, { input: string; code: string; discount: number; message: string; loading: boolean }>>({})
watchEffect(() => {
  for (const g of groupedByStore.value) {
    const key = g.storeId || 'null'
    if (!voucherState[key]) voucherState[key] = { input: '', code: '', discount: 0, message: '', loading: false }
  }
})
const totalDiscount = computed(() => Object.values(voucherState).reduce((sum, v) => sum + v.discount, 0))
async function applyVoucher(storeId: string | null) {
  const key = storeId || 'null'
  const state = voucherState[key]
  if (!storeId || !state.input.trim()) return
  state.loading = true
  try {
    const g = groupedByStore.value.find(g => (g.storeId || 'null') === key)
    const res = await $fetch<{ valid: boolean; discountAmount: number; message: string }>('/api/vouchers/validate', {
      method: 'POST',
      body: { storeId, code: state.input.trim(), subtotal: g?.subtotal || 0 }
    })
    state.message = res.message
    state.discount = res.valid ? res.discountAmount : 0
    state.code = res.valid ? state.input.trim().toUpperCase() : ''
  } catch {
    state.message = 'Gagal memvalidasi voucher'
    state.discount = 0
    state.code = ''
  } finally {
    state.loading = false
  }
}
const loadingShipping = ref(false)
const placing = ref(false)
const orderError = ref('')
const soldOutError = ref('') // nama produk yang habis, kosong = tidak ada error sold out

const couriers = ['jne', 'jnt', 'sicepat', 'pos', 'tiki']

// Nomor HP akun (Buyer.phone) — kalau sudah ada, buyer memilih pakai nomor akun atau nomor lain
// khusus pesanan ini. Kalau belum ada, buyer isi di checkout dan bisa disimpan ke akun.
const accountPhone = ref('')
const phoneMode = ref<'account' | 'new'>('account')
const saveNewPhone = ref(true)

onMounted(async () => {
  await fetchMe()
  if (user.value) {
    if (!form.buyerName) form.buyerName = user.value.name
    if (user.value.phone) {
      accountPhone.value = user.value.phone
      phoneMode.value = 'account'
      form.buyerPhone = user.value.phone
    }
  }
  await loadSavedAddresses()
})

watch(phoneMode, (m) => {
  if (m === 'account') form.buyerPhone = accountPhone.value
  else form.buyerPhone = ''
})

async function goToStep1() {
  // Akun belum punya nomor HP dan buyer minta disimpan: simpan best-effort, jangan blokir checkout kalau gagal.
  if (!accountPhone.value && saveNewPhone.value && form.buyerPhone) {
    try {
      await $fetch('/api/buyer/profile', { method: 'PATCH', body: { phone: form.buyerPhone } })
      await fetchMe()
      accountPhone.value = user.value?.phone || form.buyerPhone
    } catch {
      // nomor sudah dipakai akun lain atau gagal simpan — tetap lanjut pakai nomor ini untuk pesanan ini
    }
  }
  step.value = 1
}

// Daftar metode gateway ada di shared/utils/payment-methods.ts (dipakai juga oleh server untuk validasi).

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
// Semua toko harus punya layanan terpilih
const canStep2 = computed(() => groupedByStore.value.every(g => !!shippingState[g.storeId || 'null']?.selected))

// Total ongkir dijumlah dari semua toko
const finalShippingCost = computed(() => {
  return groupedByStore.value.reduce((sum, g) => {
    const sel = shippingState[g.storeId || 'null']?.selected
    return sum + (sel?.cost?.[0]?.value || 0)
  }, 0)
})

const shippingLabel = computed(() => {
  const n = groupedByStore.value.length
  return n > 1 ? `${n} toko` : (shippingState[groupedByStore.value[0]?.storeId || 'null']?.selected ? 'Dipilih' : '-')
})

const shippingCostDisplay = computed(() => formatPrice(finalShippingCost.value))
const selectedPaymentMethodLabel = computed(() => paymentMethods.value.find((p: any) => p.code === form.paymentMethod)?.name || '-')

// Estimasi biaya admin per metode (tampilan saja — lihat server/api/payment/fees.get.ts).
// paymentAmount yang benar-benar dikirim ke Duitku tidak berubah oleh nilai ini.
const paymentFees = ref<Record<string, number>>({})
const selectedPaymentFee = computed(() => paymentFees.value[form.paymentMethod] || 0)

async function goToStep3() {
  step.value = 3
  const amount = subtotal.value + finalShippingCost.value - totalDiscount.value
  try {
    paymentFees.value = await $fetch<Record<string, number>>('/api/payment/fees', { query: { amount } })
  } catch {
    paymentFees.value = {}
  }
}

function storeWeight(storeId: string | null) {
  const key = storeId || 'null'
  const items = groupedByStore.value.find(g => (g.storeId || 'null') === key)?.items || []
  return items.reduce((sum, item) => sum + (item.qty * 300), 0)
}

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
  try {
    for (const g of groupedByStore.value) {
      const key = g.storeId || 'null'
      // Tujuan/berat berubah tiap kali step ini dimasuki (alamat bisa diganti di step
      // sebelumnya) — cache byCourier lama sudah tidak relevan, mulai dari kosong lagi.
      shippingState[key] = { courierCode: 'jne', services: [], selected: null, byCourier: {} }
    }
    // Prefetch semua kurir untuk semua toko sekaligus secara paralel, supaya pindah tab kurir
    // di UI tinggal baca cache (instan) tanpa query ulang ke RajaOngkir satu per satu.
    await Promise.all(
      groupedByStore.value.flatMap(g => couriers.map(c => fetchShippingCosts(g.storeId, c)))
    )
    for (const g of groupedByStore.value) {
      const key = g.storeId || 'null'
      shippingState[key].services = shippingState[key].byCourier['jne'] || []
    }
  } finally {
    loadingShipping.value = false
  }
}

async function fetchShippingCosts(storeId: string | null, courier: string) {
  const key = storeId || 'null'
  const state = shippingState[key]
  try {
    const res = await $fetch<any>('/api/shipping/cost', {
      query: { destination: form.cityId, weight: storeWeight(storeId), courier, storeId: storeId || undefined }
    })
    state.byCourier[courier] = res.services || []
  } catch {
    // Kegagalan genuine (bukan "tidak ada layanan" — itu sudah ditangani sebagai array kosong
    // di server/utils/shipping.ts) tetap ditandai gagal, bukan kosong, supaya tab-nya tidak
    // salah tertandai "tidak tersedia" padahal cuma error sesaat.
    delete state.byCourier[courier]
  }
}

function courierUnavailable(storeId: string | null, courier: string) {
  const key = storeId || 'null'
  const cached = shippingState[key]?.byCourier[courier]
  return Array.isArray(cached) && cached.length === 0
}

function selectCourier(storeId: string | null, code: string) {
  const key = storeId || 'null'
  const state = shippingState[key]
  state.courierCode = code
  state.selected = null
  state.services = state.byCourier[code] || []
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

async function placeOrder() {
  placing.value = true
  orderError.value = ''
  soldOutError.value = ''
  try {
    const shippingByStore: Record<string, { courierCode?: string; courierService?: string; cost?: number }> = {}
    const voucherByStore: Record<string, string> = {}
    for (const g of groupedByStore.value) {
      const key = g.storeId || 'null'
      const state = shippingState[key]
      shippingByStore[key] = {
        courierCode: state?.courierCode,
        courierService: state?.selected?.service,
        cost: state?.selected?.cost?.[0]?.value || 0
      }
      if (voucherState[key]?.code) voucherByStore[key] = voucherState[key].code
    }

    const res = await $fetch<any>('/api/checkout/regular', {
      method: 'POST',
      body: {
        buyerName: form.buyerName,
        buyerPhone: form.buyerPhone,
        address: form.address,
        cityId: form.cityId,
        cityName: form.cityName,
        saveAddress: showAddressForm.value && saveNewAddress.value,
        shippingByStore,
        voucherByStore,
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

    const orderIds = (res.orders || []).map((o: any) => o.orderId)
    if (orderIds.length) {
      const payRes = await $fetch<any>('/api/payment/create-transaction', {
        method: 'POST',
        body: { orderIds, paymentMethod: form.paymentMethod }
      })
      clearCart()
      if (NO_REDIRECT_METHODS.includes(payRes.paymentMethod) && (payRes.vaNumber || payRes.qrString)) {
        router.push({
          path: '/account/pembayaran',
          query: {
            ref: payRes.merchantOrderId,
            method: payRes.paymentMethod,
            va: payRes.vaNumber || '',
            qr: payRes.qrString || '',
            amount: String(payRes.amount || ''),
            expiredAt: payRes.expiredAt || ''
          }
        })
      } else if (payRes.paymentUrl) {
        window.location.href = payRes.paymentUrl
      } else {
        router.push('/account/orders')
      }
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
