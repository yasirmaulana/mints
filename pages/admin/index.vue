<template>
  <div class="min-h-screen bg-gray-50 font-body">
    <!-- Topbar -->
    <div class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-brand-400 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L4.09 12.11A1 1 0 004 13h7l-1 9 9.91-11.11A1 1 0 0020 10h-7l1-8z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="font-bold text-gray-900">Page Admin</span>
      </div>
      <button class="btn-secondary text-sm" @click="logout">Keluar</button>
    </div>

    <div class="max-w-5xl mx-auto px-4 py-8">
      <!-- Tab Nav -->
      <div class="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-6">
        <div class="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"
            :class="activeTab === tab.key
              ? 'bg-white text-gray-900 shadow-xs'
              : 'text-gray-500 hover:text-gray-700'"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- ── Tab: Dashboard ── -->
      <div v-if="activeTab === 'dashboard'" class="space-y-5">
        <!-- Metrics cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="card p-4">
            <p class="text-xs text-gray-500 mb-1">Total Pesanan</p>
            <p class="text-2xl font-bold text-gray-900">{{ dashboardStats.totalOrders }}</p>
          </div>
          <div class="card p-4">
            <p class="text-xs text-gray-500 mb-1">Total Pendapatan</p>
            <p class="text-2xl font-bold text-green-600">Rp {{ formatPrice(dashboardStats.totalRevenue) }}</p>
          </div>
          <div class="card p-4">
            <p class="text-xs text-gray-500 mb-1">Menunggu Pembayaran</p>
            <p class="text-2xl font-bold text-amber-600">{{ dashboardStats.pendingCount }}</p>
          </div>
          <div class="card p-4">
            <p class="text-xs text-gray-500 mb-1">Dibatalkan</p>
            <p class="text-2xl font-bold text-gray-500">{{ dashboardStats.cancelledCount }}</p>
          </div>
          <div class="card p-4">
            <p class="text-xs text-gray-500 mb-1">Penjualan Flash Sale</p>
            <p class="text-2xl font-bold text-brand-700">{{ dashboardStats.flashSaleCount }}</p>
          </div>
          <div class="card p-4">
            <p class="text-xs text-gray-500 mb-1">Pendapatan Flash Sale</p>
            <p class="text-2xl font-bold text-brand-600">Rp {{ formatPrice(dashboardStats.flashSaleRevenue) }}</p>
          </div>
          <div class="card p-4">
            <p class="text-xs text-gray-500 mb-1">Penjualan Offline</p>
            <p class="text-2xl font-bold text-brand-700">{{ dashboardStats.offlineCount }}</p>
          </div>
          <div class="card p-4">
            <p class="text-xs text-gray-500 mb-1">Pendapatan Offline</p>
            <p class="text-2xl font-bold text-brand-600">Rp {{ formatPrice(dashboardStats.offlineRevenue) }}</p>
          </div>
        </div>

        <!-- Charts -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div class="card p-4">
            <h3 class="text-sm font-bold text-gray-900 mb-4">Pesanan per Status</h3>
            <div class="h-56 flex items-center justify-center">
              <ClientOnly>
                <DoughnutChart :data="statusChartData" :options="chartOptions" />
                <template #fallback>
                  <div class="animate-spin h-7 w-7 rounded-full border-2 border-brand-400 border-t-transparent"></div>
                </template>
              </ClientOnly>
            </div>
          </div>
          <div class="card p-4">
            <h3 class="text-sm font-bold text-gray-900 mb-4">Pesanan per Sesi</h3>
            <div class="h-56 flex items-center justify-center">
              <ClientOnly>
                <BarChart :data="sessionChartData" :options="chartOptions" />
                <template #fallback>
                  <div class="animate-spin h-7 w-7 rounded-full border-2 border-brand-400 border-t-transparent"></div>
                </template>
              </ClientOnly>
            </div>
          </div>
        </div>

      </div>

      <!-- ── Tab: Pesanan ── -->
      <div v-if="activeTab === 'orders'">
        <div class="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <h2 class="text-lg font-bold text-gray-900">Daftar Pesanan</h2>
          <div class="flex items-center gap-2 flex-wrap">
            <button
              v-if="selectedOrderIds.size > 0"
              class="btn-primary text-sm"
              :disabled="bulkNotifying"
              @click="bulkNotify"
            >
              <span v-if="bulkNotifying" class="inline-block h-3.5 w-3.5 rounded-full border-2 border-black/30 border-t-black animate-spin mr-1"></span>
              <span>Kirim WA ke {{ selectedOrderIds.size }} terpilih</span>
            </button>
            <button class="btn-primary text-sm" @click="openOfflineOrderModal">
              + Pesanan Offline
            </button>
            <button class="btn-secondary text-sm" @click="refreshOrders">
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"/></svg>
              Refresh
            </button>
          </div>
        </div>

        <!-- Filter bar -->
        <div class="flex flex-col sm:flex-row gap-2 mb-4">
          <div class="relative flex-1">
            <input
              v-model="orderSearch"
              type="text"
              placeholder="Cari nama, nomor HP, atau produk..."
              class="input-field"
            />
          </div>
          <div class="flex gap-2 overflow-x-auto pb-0.5">
            <button
              v-for="f in orderStatusFilters"
              :key="f.value"
              class="px-3 py-2 rounded-lg text-xs font-semibold border transition-colors"
              :class="orderStatusFilter === f.value
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'"
              @click="orderStatusFilter = f.value"
            >
              {{ f.label }}
              <span
                class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold"
                :class="orderStatusFilter === f.value ? 'bg-white/20' : 'bg-gray-100'"
              >{{ orderStatusCounts[f.value] ?? 0 }}</span>
            </button>
          </div>
        </div>

        <div v-if="ordersLoading" class="flex justify-center py-20">
          <div class="animate-spin h-7 w-7 rounded-full border-2 border-brand-400 border-t-transparent"></div>
        </div>
        <div v-else-if="!orders?.length" class="card p-12 text-center text-gray-400">
          Belum ada pesanan masuk
        </div>
        <div v-else-if="!filteredOrders.length" class="card p-12 text-center text-gray-400">
          Tidak ada pesanan yang cocok
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="order in filteredOrders"
            :key="order.id"
            class="card p-4 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <!-- Checkbox -->
            <div class="shrink-0 w-5 flex items-center self-start sm:self-auto pt-1 sm:pt-0">
              <input
                v-if="order.status === 'PENDING_PAYMENT'"
                type="checkbox"
                :checked="selectedOrderIds.has(order.id)"
                class="w-4 h-4 rounded accent-amber-400 cursor-pointer"
                @change="toggleOrderSelect(order.id)"
              />
            </div>
            <!-- Product info -->
            <div class="flex items-center gap-3 sm:flex-1 min-w-0">
              <img
                :src="order.product.imageUrl"
                :alt="order.product.title"
                class="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200"
              />
              <div class="min-w-0">
                <p class="font-semibold text-gray-900 text-sm line-clamp-1">{{ order.product.title }}</p>
                <p class="text-brand-600 font-bold text-sm">Rp {{ formatPrice(order.product.price) }}</p>
              </div>
            </div>

            <!-- Buyer info -->
            <div class="sm:flex-1 min-w-0 space-y-0.5">
              <p class="text-sm font-medium text-gray-800">{{ order.buyerName }}</p>
              <p class="text-xs text-gray-500 font-mono">{{ order.buyerPhone }}</p>
              <p class="text-xs text-gray-400">{{ formatDateTime(order.createdAt) }}</p>
            </div>

            <!-- Status + WA info -->
            <div class="shrink-0 flex flex-col items-start sm:items-end gap-1.5">
              <div class="flex items-center gap-1.5 flex-wrap justify-end">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  :class="order.source === 'OFFLINE'
                    ? 'bg-gray-100 text-gray-600 border border-gray-300'
                    : 'bg-brand-50 text-brand-700 border border-brand-300'"
                >
                  {{ order.source === 'OFFLINE' ? 'Offline' : 'Flash Sale' }}
                </span>
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                  :class="{
                    'bg-success-50 text-success-700 border border-success-500/30': order.status === 'PAID' || order.status === 'DELIVERED',
                    'bg-amber-50 text-amber-700 border border-brand-300': order.status === 'PENDING_PAYMENT',
                    'bg-blue-50 text-blue-700 border border-blue-300': order.status === 'IN_PRODUCTION' || order.status === 'READY_TO_SHIP' || order.status === 'SHIPPED',
                    'bg-gray-100 text-gray-500 border border-gray-200': order.status === 'CANCELLED' || order.status === 'REFUNDED',
                  }"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="{
                    'bg-success-700': order.status === 'PAID' || order.status === 'DELIVERED',
                    'bg-amber-700': order.status === 'PENDING_PAYMENT',
                    'bg-blue-700': order.status === 'IN_PRODUCTION' || order.status === 'READY_TO_SHIP' || order.status === 'SHIPPED',
                    'bg-gray-400': order.status === 'CANCELLED' || order.status === 'REFUNDED',
                  }"></span>
                  {{ orderStatusText(order.status) }}
                </span>
              </div>
              <!-- WA notify info -->
              <span v-if="order.notifyCount > 0" class="inline-flex items-center gap-1 text-[11px] text-green-700 font-medium">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.523 5.845L0 24l6.344-1.493A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.645-.52-5.148-1.424l-.369-.219-3.766.887.935-3.667-.241-.381A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                {{ order.notifyCount }}x · {{ formatDateTime(order.lastNotifiedAt) }}
              </span>
              <span v-else class="inline-flex items-center gap-1 text-[11px] text-gray-400">
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.523 5.845L0 24l6.344-1.493A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.645-.52-5.148-1.424l-.369-.219-3.766.887.935-3.667-.241-.381A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                Belum dikirim
              </span>
            </div>

            <!-- Actions -->
            <div class="flex gap-2 shrink-0 flex-wrap">
              <a
                v-if="order.paymentProof"
                :href="order.paymentProof"
                target="_blank"
                class="btn-secondary text-xs px-3 py-1.5"
              >
                Bukti
              </a>
              <template v-if="order.status !== 'CANCELLED'">
                <button
                  class="btn-secondary text-xs px-3 py-1.5"
                  :disabled="notifying === order.id"
                  @click="notifyOrder(order.id)"
                >
                  <span v-if="notifying === order.id" class="inline-block h-3 w-3 rounded-full border border-gray-400 border-t-transparent animate-spin"></span>
                  <span v-else>WA</span>
                </button>
                <button
                  v-if="order.status === 'PENDING_PAYMENT'"
                  class="btn-primary text-xs px-3 py-1.5"
                  @click="openUploadProof(order.id)"
                >
                  Upload Bukti
                </button>
                <button
                  v-if="order.status === 'PAID' || order.status === 'IN_PRODUCTION' || order.status === 'READY_TO_SHIP'"
                  class="btn-secondary text-xs px-3 py-1.5"
                  @click="openShipmentForm(order.id)"
                >
                  {{ order.shipment?.trackingNo ? 'Edit Resi' : 'Input Resi' }}
                </button>
                <button
                  v-if="order.status === 'PENDING_PAYMENT'"
                  class="text-xs px-3 py-1.5 rounded-lg border border-error-200 text-error-600 hover:bg-error-50 transition-colors"
                  :disabled="cancelling === order.id"
                  @click="cancelOrder(order.id)"
                >
                  <span v-if="cancelling === order.id" class="inline-block h-3 w-3 rounded-full border border-error-400 border-t-transparent animate-spin"></span>
                  <span v-else>Batalkan</span>
                </button>
                <select
                  v-model="order.status"
                  class="text-xs px-2 py-1.5 rounded-lg border border-gray-200 bg-white"
                  @change="updateOrderStatus(order.id, ($event.target as HTMLSelectElement).value)"
                >
                  <option v-for="s in allowedOrderStatuses" :key="s" :value="s">{{ orderStatusText(s) }}</option>
                </select>
              </template>
            </div>

            <!-- Shipment info -->
            <div v-if="order.shipment?.trackingNo" class="w-full pt-2 mt-1 border-t border-gray-100 text-xs text-gray-500 flex items-center gap-2">
              <span class="font-semibold text-gray-700">{{ order.shipment.courier?.toUpperCase() }}</span>
              <span class="font-mono">{{ order.shipment.trackingNo }}</span>
              <a :href="`/track?no=${order.shipment.trackingNo}&courier=${order.shipment.courier}`" target="_blank" class="text-brand-500 font-medium">Lacak →</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Shipment modal -->
      <div v-if="shipmentModal.open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="shipmentModal.open = false">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
          <h3 class="font-bold text-gray-900">Input Nomor Resi</h3>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Kurir</label>
            <select v-model="shipmentModal.courier" class="input-field">
              <option value="jne">JNE</option>
              <option value="jnt">J&T</option>
              <option value="sicepat">SiCepat</option>
              <option value="pos">POS</option>
              <option value="tiki">TIKI</option>
              <option value="anteraja">AnterAja</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Nomor Resi</label>
            <input v-model="shipmentModal.trackingNo" type="text" placeholder="Masukkan nomor resi" class="input-field" />
          </div>
          <div class="flex gap-2 pt-2">
            <button class="flex-1 btn-secondary text-sm" @click="shipmentModal.open = false">Batal</button>
            <button class="flex-1 btn-primary text-sm" :disabled="shipmentModal.saving" @click="saveShipment">
              <span v-if="shipmentModal.saving" class="inline-block h-3.5 w-3.5 rounded-full border-2 border-black/30 border-t-black animate-spin mr-1"></span>
              Simpan & Kirim WA
            </button>
          </div>
        </div>
      </div>

      <!-- ── Tab: Produk ── -->
      <div v-else-if="activeTab === 'products'">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">Manajemen Produk</h2>
          <button class="btn-primary" @click="openProductForm()">+ Tambah Produk</button>
        </div>

        <!-- Filter bar -->
        <div class="flex flex-col sm:flex-row gap-2 mb-4">
          <div class="relative flex-1">
            <input v-model="productSearch" type="text" placeholder="Cari nama produk..." class="input-field" />
          </div>
          <div class="flex gap-2 overflow-x-auto pb-0.5">
            <button
              v-for="f in productStatusFilters"
              :key="f.value"
              class="px-3 py-2 rounded-lg text-xs font-semibold border transition-colors"
              :class="productStatusFilter === f.value
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'"
              @click="productStatusFilter = f.value"
            >
              {{ f.label }}
              <span
                class="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold"
                :class="productStatusFilter === f.value ? 'bg-white/20' : 'bg-gray-100'"
              >{{ productStatusCounts[f.value] ?? 0 }}</span>
            </button>
          </div>
        </div>

        <div v-if="!products?.length" class="card p-12 text-center text-gray-400">
          Belum ada produk
        </div>
        <div v-else-if="!filteredProducts.length" class="card p-12 text-center text-gray-400">
          Tidak ada produk yang cocok
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div v-for="product in filteredProducts" :key="product.id" class="card overflow-hidden">
            <div class="relative aspect-square bg-gray-100 overflow-hidden">
              <img :src="product.imageUrl" :alt="product.title" class="w-full h-full object-cover" />
              <span
                class="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full"
                :class="product.status === 'AVAILABLE' ? 'bg-brand-400 text-black' : 'bg-gray-600 text-white'"
              >
                {{ product.status === 'AVAILABLE' ? 'Tersedia' : 'Sold Out' }}
              </span>
            </div>
            <div class="p-3">
              <p class="font-semibold text-sm text-gray-900 line-clamp-2 leading-tight">{{ product.title }}</p>
              <p class="text-brand-600 font-bold text-sm mt-0.5">Rp {{ formatPrice(product.price) }}</p>
              <div class="mt-1.5">
                <span v-if="product.sessionId" class="inline-block text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium truncate max-w-full">
                  {{ sessionLabel(product.sessionId) }}
                </span>
                <span v-else class="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400">
                  Belum ke sesi
                </span>
              </div>
              <!-- Stock summary -->
              <div class="mt-2 flex flex-wrap gap-1">
                <template v-if="product.variants?.length">
                  <span
                    v-for="v in product.variants"
                    :key="v.size"
                    class="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                    :class="v.stock > 0 ? 'bg-brand-50 text-brand-700' : 'bg-gray-100 text-gray-400'"
                  >{{ v.size }}:{{ v.stock }}</span>
                </template>
                <span v-else class="text-[10px] text-gray-400">Belum ada varian</span>
              </div>
              <div class="flex gap-2 mt-3">
                <button class="btn-secondary text-xs flex-1 py-1.5" @click="openProductForm(product)">Edit</button>
                <button
                  class="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-error-50 text-error-600 border border-error-100 hover:bg-red-100 transition-colors"
                  :disabled="deletingProduct === product.id"
                  @click="deleteProduct(product.id)"
                >
                  <span v-if="deletingProduct === product.id" class="inline-block h-3 w-3 rounded-full border border-error-600/40 border-t-error-600 animate-spin"></span>
                  <span v-else>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Tab: Kategori ── -->
      <div v-else-if="activeTab === 'categories'">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-900">Manajemen Kategori</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Form tambah kategori -->
          <div class="card p-5">
            <h3 class="text-sm font-bold text-gray-900 mb-3">Tambah Kategori</h3>
            <form class="flex gap-2" @submit.prevent="addCategory">
              <input v-model="newCategoryName" type="text" placeholder="Nama kategori (misal: Gamis)" class="input-field flex-1" required />
              <button type="submit" class="btn-primary shrink-0" :disabled="addingCategory">
                <span v-if="addingCategory" class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>
                <span v-else>Tambah</span>
              </button>
            </form>
          </div>

          <!-- Daftar kategori -->
          <div class="card p-4 space-y-2">
            <p v-if="!categories?.length" class="text-sm text-gray-400 text-center py-4">Belum ada kategori</p>
            <div v-for="cat in categories" :key="cat.id" class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ cat.name }}</p>
                <p class="text-xs text-gray-400">{{ cat._count?.products ?? 0 }} produk · /{{ cat.slug }}</p>
              </div>
              <button
                class="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded"
                :disabled="deletingCategory === cat.id"
                @click="deleteCategory(cat.id)"
              >
                <span v-if="deletingCategory === cat.id" class="inline-block h-3 w-3 rounded-full border border-red-400 border-t-transparent animate-spin"></span>
                <span v-else>Hapus</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Tab: Chat ── -->
      <div v-else-if="activeTab === 'chat'" class="flex gap-4" style="height: 600px">
        <!-- Session list -->
        <div class="w-64 flex-shrink-0 border rounded-xl overflow-y-auto" style="border-color: var(--border)">
          <div class="p-3 border-b font-semibold text-sm" style="border-color: var(--border)">Percakapan</div>
          <div v-if="chatLoading" class="p-4 text-sm text-center" style="color: var(--muted-foreground)">Memuat...</div>
          <div
            v-for="sess in chatSessions"
            :key="sess.id"
            class="p-3 border-b cursor-pointer transition-colors"
            :style="activeChatSession?.id === sess.id ? 'background: var(--muted)' : ''"
            style="border-color: var(--border)"
            @click="openChatSession(sess)"
          >
            <div class="flex justify-between items-start gap-1">
              <p class="text-sm font-medium truncate">{{ sess.buyerName }}</p>
              <span v-if="!sess.isRead" class="w-2 h-2 rounded-full flex-shrink-0 mt-1" style="background: var(--brand-400)" />
            </div>
            <p class="text-xs truncate mt-0.5" style="color: var(--muted-foreground)">{{ sess.messages?.[0]?.body || 'Belum ada pesan' }}</p>
          </div>
        </div>

        <!-- Chat window -->
        <div class="flex-1 border rounded-xl flex flex-col overflow-hidden" style="border-color: var(--border)">
          <div v-if="!activeChatSession" class="flex-1 flex items-center justify-center text-sm" style="color: var(--muted-foreground)">Pilih percakapan</div>
          <template v-else>
            <div class="p-3 border-b flex items-center justify-between" style="border-color: var(--border)">
              <div>
                <p class="font-semibold text-sm">{{ activeChatSession.buyerName }}</p>
                <p class="text-xs" style="color: var(--muted-foreground)">{{ activeChatSession.buyerPhone }}</p>
              </div>
            </div>
            <div ref="chatMessagesEl" class="flex-1 overflow-y-auto p-4 space-y-2">
              <div
                v-for="msg in activeChatMessages"
                :key="msg.id"
                class="flex"
                :class="msg.sender === 'admin' ? 'justify-end' : 'justify-start'"
              >
                <div
                  class="max-w-xs rounded-2xl px-3 py-2 text-sm"
                  :style="msg.sender === 'admin'
                    ? 'background:#090b0c;color:white;border-bottom-right-radius:4px'
                    : 'background:rgba(9,11,12,0.08);color:#090b0c;border-bottom-left-radius:4px'"
                >
                  {{ msg.body }}
                  <p class="text-xs mt-0.5 opacity-60">{{ new Date(msg.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }}</p>
                </div>
              </div>
            </div>
            <div class="p-3 border-t flex gap-2" style="border-color: var(--border)">
              <input v-model="adminReply" type="text" placeholder="Balas..." class="input-field flex-1" @keydown.enter="sendAdminReply" />
              <button class="btn-primary text-sm px-4" @click="sendAdminReply">Kirim</button>
            </div>
          </template>
        </div>
      </div>

      <!-- ── Tab: Konfigurasi ── -->
      <div v-else-if="activeTab === 'config'">
        <div class="flex items-start gap-6 flex-col md:flex-row">
          <!-- Form tambah sesi -->
          <div class="w-full max-w-sm shrink-0">
            <h2 class="text-lg font-bold text-gray-900 mb-4">Tambah Sesi Flash Sale</h2>
            <div class="card p-5">
              <form class="space-y-4" @submit.prevent="saveConfig">
                <div>
                  <label class="label-text">Judul Sesi</label>
                  <input v-model="configForm.title" type="text" placeholder="Flash Sale Pagi" class="input-field" />
                </div>
                <div>
                  <label class="label-text">Waktu Mulai <span class="text-error-600">*</span></label>
                  <input v-model="configForm.startTime" type="datetime-local" class="input-field" required />
                </div>
                <div>
                  <label class="label-text">Waktu Selesai <span class="text-error-600">*</span></label>
                  <input v-model="configForm.endTime" type="datetime-local" class="input-field" required />
                </div>
                <button type="submit" class="btn-primary-full" :disabled="savingConfig">
                  <span v-if="savingConfig" class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>
                  <span v-else>+ Tambah Sesi</span>
                </button>
              </form>
            </div>
          </div>

          <!-- Daftar sesi -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-gray-900">Jadwal Sesi</h2>
              <button class="btn-secondary text-sm" @click="refreshSessions">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"/></svg>
                Refresh
              </button>
            </div>

            <div v-if="sessionsLoading" class="flex justify-center py-12">
              <div class="animate-spin h-6 w-6 rounded-full border-2 border-brand-400 border-t-transparent"></div>
            </div>
            <div v-else-if="!sessions?.length" class="card p-8 text-center text-gray-400">
              Belum ada sesi terjadwal
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="session in sessionsSorted"
                :key="session.id"
                class="card p-4 flex items-center gap-4"
                :class="sessionStatus(session) === 'active' ? 'border-brand-400 bg-brand-25' : ''"
              >
                <!-- Status dot -->
                <div class="shrink-0">
                  <span
                    class="inline-block w-2.5 h-2.5 rounded-full"
                    :class="{
                      'bg-brand-400': sessionStatus(session) === 'active',
                      'bg-gray-300': sessionStatus(session) === 'upcoming' && !session.isActive,
                      'bg-gray-200': sessionStatus(session) === 'ended',
                      'bg-blue-400': sessionStatus(session) === 'upcoming' && session.isActive,
                    }"
                  ></span>
                </div>

                <!-- Info -->
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-gray-900 text-sm">{{ session.title }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">
                    {{ formatDateTime(session.startTime) }} – {{ formatDateTime(session.endTime) }}
                  </p>
                  <div class="flex items-center gap-2 mt-1 flex-wrap">
                    <span
                      class="text-xs font-semibold px-2 py-0.5 rounded-full"
                      :class="{
                        'bg-brand-50 text-brand-700': sessionStatus(session) === 'active',
                        'bg-blue-50 text-blue-700': sessionStatus(session) === 'upcoming' && session.isActive,
                        'bg-gray-100 text-gray-500': sessionStatus(session) === 'upcoming' && !session.isActive,
                        'bg-gray-100 text-gray-400': sessionStatus(session) === 'ended',
                      }"
                    >
                      {{
                        sessionStatus(session) === 'active' ? '🟢 Sedang Berjalan'
                        : sessionStatus(session) === 'ended' ? 'Selesai'
                        : session.isActive ? '🔵 Terjadwal'
                        : '⚪ Nonaktif'
                      }}
                    </span>
                    <span class="text-xs text-gray-400">
                      {{ session._count?.products ?? 0 }} produk
                    </span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-2 shrink-0">
                  <!-- Toggle aktif/nonaktif (hanya untuk upcoming) -->
                  <button
                    v-if="sessionStatus(session) !== 'ended'"
                    class="text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-colors"
                    :class="session.isActive
                      ? 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      : 'border-brand-300 bg-brand-50 text-brand-700 hover:bg-brand-100'"
                    :disabled="togglingSession === session.id"
                    @click="toggleSession(session)"
                  >
                    <span v-if="togglingSession === session.id" class="inline-block h-3 w-3 rounded-full border border-gray-400 border-t-transparent animate-spin"></span>
                    <span v-else>{{ session.isActive ? 'Nonaktifkan' : 'Aktifkan' }}</span>
                  </button>
                  <!-- Hapus -->
                  <button
                    class="text-xs px-2.5 py-1.5 rounded-lg border border-error-100 bg-error-50 text-error-600 font-semibold hover:bg-red-100 transition-colors"
                    :disabled="deletingSession === session.id"
                    @click="deleteSession(session.id)"
                  >
                    <span v-if="deletingSession === session.id" class="inline-block h-3 w-3 rounded-full border border-error-600/40 border-t-error-600 animate-spin"></span>
                    <span v-else>Hapus</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Form Produk -->
    <div v-if="showProductModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 py-6 overflow-y-auto">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]" @click="showProductModal = false" />
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 class="text-lg font-bold text-gray-900 mb-4">{{ editingProduct ? 'Edit Produk' : 'Tambah Produk' }}</h2>
        <form class="space-y-4" @submit.prevent="saveProduct">
          <!-- Nama & Harga -->
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="label-text">Nama Produk <span class="text-error-600">*</span></label>
              <input v-model="productForm.title" type="text" placeholder="Gamis Kaftan Premium" class="input-field" required />
            </div>
            <div>
              <label class="label-text">Harga (Rp) <span class="text-error-600">*</span></label>
              <input v-model="productForm.price" type="number" placeholder="350000" class="input-field" required />
            </div>
            <div>
              <label class="label-text">Harga Asli (Rp) <span class="text-xs text-gray-400 font-normal">— opsional, untuk harga coret</span></label>
              <input v-model="productForm.originalPrice" type="number" placeholder="500000" class="input-field" />
            </div>
            <div>
              <label class="label-text">Berat (gram)</label>
              <input v-model="productForm.weight" type="number" placeholder="500" class="input-field" />
            </div>
          </div>

          <!-- Kategori & Tipe -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="label-text">Kategori</label>
              <select v-model="productForm.categoryId" class="input-field">
                <option value="">— Pilih Kategori —</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
              </select>
            </div>
            <div>
              <label class="label-text">Tipe Produk</label>
              <select v-model="productForm.productType" class="input-field">
                <option value="REGULAR">Reguler</option>
                <option value="PRE_ORDER">Pre-Order</option>
              </select>
            </div>
          </div>

          <!-- Estimasi (Pre-Order) -->
          <div v-if="productForm.productType === 'PRE_ORDER'">
            <label class="label-text">Estimasi Selesai Produksi</label>
            <input v-model="productForm.estimatedReadyDate" type="date" class="input-field" />
          </div>

          <!-- Bahan & Sesi Flash Sale -->
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="label-text">Bahan</label>
              <input v-model="productForm.material" type="text" placeholder="Ceruti, Wolfis, dll." class="input-field" />
            </div>
            <div>
              <label class="label-text">Daftarkan ke Flash Sale</label>
              <select v-model="productForm.sessionId" class="input-field">
                <option value="">— Tidak —</option>
                <option v-for="s in sessions" :key="s.id" :value="s.id">
                  {{ s.title }}
                </option>
              </select>
            </div>
          </div>

          <!-- Deskripsi -->
          <div>
            <label class="label-text">Deskripsi</label>
            <textarea v-model="productForm.description" rows="2" placeholder="Deskripsi produk (opsional)" class="input-field resize-none" />
          </div>

          <!-- Varian Ukuran + Stok -->
          <div>
            <label class="label-text mb-2 block">Stok per Ukuran</label>
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              <div
                v-for="v in productForm.variants"
                :key="v.size"
                class="border rounded-xl p-2.5 text-center"
                :class="v.stock > 0 ? 'border-brand-400 bg-brand-50' : 'border-gray-200'"
              >
                <p class="text-xs font-bold text-gray-700 mb-1">{{ v.size }}</p>
                <input
                  v-model.number="v.stock"
                  type="number"
                  min="0"
                  class="w-full text-center text-sm font-semibold border rounded-lg px-1 py-1 focus:outline-none focus:border-brand-400"
                  :class="v.stock > 0 ? 'border-brand-300 bg-white text-brand-700' : 'border-gray-200 text-gray-400'"
                />
              </div>
            </div>
            <p class="text-xs text-gray-400 mt-1.5">Pre-Order: semua ukuran otomatis tersedia tanpa stok minimum.</p>
          </div>

          <!-- Foto -->
          <div>
            <label class="label-text">{{ editingProduct ? 'Foto Utama (kosongkan jika tidak diubah)' : 'Foto Utama *' }}</label>
            <input type="file" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer" @change="onFileChange" />
          </div>
          <div>
            <label class="label-text">Foto Tambahan (bisa pilih beberapa)</label>
            <input type="file" accept="image/*" multiple class="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer" @change="onExtraFilesChange" />
            <p v-if="extraFiles.length" class="text-xs text-gray-400 mt-1">{{ extraFiles.length }} foto dipilih</p>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" class="btn-secondary-full" @click="showProductModal = false">Batal</button>
            <button type="submit" class="btn-primary-full" :disabled="savingProduct">
              <span v-if="savingProduct" class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>
              <span v-else>Simpan</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal: Upload Bukti -->
    <div v-if="showProofModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 py-6">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]" @click="showProofModal = false" />
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-1">Upload Bukti Transfer</h2>
        <p class="text-sm text-gray-500 mb-4">Status pesanan akan otomatis berubah menjadi <strong>Lunas</strong></p>
        <div class="space-y-4">
          <div>
            <label class="label-text">File Bukti Transfer</label>
            <input
              type="file"
              accept="image/*"
              class="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"
              @change="onProofFileChange"
            />
          </div>
          <div class="flex gap-3 pt-2">
            <button class="btn-secondary-full" @click="showProofModal = false">Batal</button>
            <button class="btn-primary-full" :disabled="uploadingProof" @click="uploadProof">
              <span v-if="uploadingProof" class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>
              <span v-else>Konfirmasi Lunas</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Tab: Pengaturan WA ── -->
    <div v-else-if="activeTab === 'settings'" class="flex flex-col items-center gap-6 py-4 px-4">
      <div class="card p-6 space-y-6 w-full max-w-2xl">
        <h2 class="text-base font-bold text-gray-900">Template Pesan WA</h2>

        <div class="space-y-2">
          <label class="label-text block">Pesan Satu Produk</label>
          <div class="flex flex-wrap gap-1.5">
            <code
              v-for="p in ['{{name}}','{{product}}','{{price}}','{{bank_info}}']"
              :key="p"
              class="bg-brand-50 text-brand-700 border border-brand-200 px-1.5 py-0.5 rounded text-xs cursor-pointer hover:bg-brand-100 select-none"
              @click="insertPlaceholder('single', p)"
            >{{ p }}</code>
          </div>
          <textarea
            ref="singleTextarea"
            v-model="waSingle"
            rows="9"
            class="input-field font-mono text-xs w-full"
          />
        </div>

        <div class="space-y-2">
          <label class="label-text block">Pesan Bulk (banyak produk, satu nomor)</label>
          <div class="flex flex-wrap gap-1.5">
            <code
              v-for="p in ['{{name}}','{{items}}','{{total}}','{{bank_info}}']"
              :key="p"
              class="bg-brand-50 text-brand-700 border border-brand-200 px-1.5 py-0.5 rounded text-xs cursor-pointer hover:bg-brand-100 select-none"
              @click="insertPlaceholder('bulk', p)"
            >{{ p }}</code>
          </div>
          <textarea
            ref="bulkTextarea"
            v-model="waBulk"
            rows="11"
            class="input-field font-mono text-xs w-full"
          />
        </div>

        <div class="flex items-center gap-3">
          <button class="btn-primary" :disabled="waTemplateSaving" @click="saveWaTemplates">
            <span v-if="waTemplateSaving" class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
            <span v-else>Simpan Template</span>
          </button>
          <span v-if="waTemplateSaved" class="text-sm text-green-600 font-medium">Tersimpan</span>
        </div>
      </div>

      <!-- Kelola Admin -->
      <div class="card p-6 space-y-5 w-full max-w-2xl">
        <h2 class="text-base font-bold text-gray-900">Kelola Admin</h2>

        <!-- Daftar admin -->
        <div class="divide-y divide-gray-100">
          <div v-for="a in adminList" :key="a.id" class="flex items-center justify-between py-3">
            <div>
              <p class="text-sm font-medium text-gray-800">{{ a.username }}</p>
              <p class="text-xs text-gray-400">Dibuat {{ formatDateTime(a.createdAt) }}</p>
            </div>
            <button
              class="text-xs text-red-500 hover:text-red-700 disabled:opacity-40"
              :disabled="deletingAdminId === a.id"
              @click="deleteAdmin(a.id)"
            >
              <span v-if="deletingAdminId === a.id" class="inline-block h-3 w-3 rounded-full border-2 border-red-300 border-t-red-500 animate-spin" />
              <span v-else>Hapus</span>
            </button>
          </div>
        </div>

        <!-- Form tambah admin -->
        <div class="border-t pt-4 space-y-3">
          <p class="text-sm font-semibold text-gray-700">Tambah Admin Baru</p>
          <div class="space-y-2">
            <div>
              <label class="block text-xs text-gray-500 mb-1">Username</label>
              <input v-model="adminForm.username" type="text" placeholder="Masukkan username" class="input-field w-full" />
            </div>
            <div>
              <label class="block text-xs text-gray-500 mb-1">Password</label>
              <input v-model="adminForm.password" type="password" placeholder="Min. 6 karakter" class="input-field w-full" />
            </div>
          </div>
          <button class="btn-primary w-full" :disabled="addingAdmin || !adminForm.username || !adminForm.password" @click="addAdmin">
            <span v-if="addingAdmin" class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
            <span v-else>Tambah Admin</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal: Pesanan Offline -->
    <div v-if="showOfflineOrderModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 py-6">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]" @click="showOfflineOrderModal = false" />
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Pesanan Offline</h2>
        <form class="space-y-4" @submit.prevent="submitOfflineOrder">
          <div>
            <label class="label-text">Produk <span class="text-error-600">*</span></label>
            <select v-model="offlineOrderForm.productId" class="input-field" required>
              <option value="">— Pilih produk tersedia —</option>
              <option
                v-for="p in availableProducts"
                :key="p.id"
                :value="p.id"
              >
                {{ p.title }} · Rp {{ formatPrice(p.price) }}
              </option>
            </select>
            <p v-if="!availableProducts.length" class="text-xs text-amber-600 mt-1">
              Tidak ada produk tersedia. Tambah produk di tab Produk terlebih dahulu.
            </p>
          </div>
          <div>
            <label class="label-text">Nama Pembeli <span class="text-error-600">*</span></label>
            <input v-model="offlineOrderForm.buyerName" type="text" placeholder="Nama lengkap pembeli" class="input-field" required />
          </div>
          <div>
            <label class="label-text">Nomor HP <span class="text-error-600">*</span></label>
            <input v-model="offlineOrderForm.buyerPhone" type="tel" placeholder="08xxxxxxxxxx" class="input-field" required />
          </div>
          <div>
            <label class="label-text">Status Pembayaran</label>
            <div class="flex gap-2 mt-1">
              <button
                type="button"
                class="flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors"
                :class="offlineOrderForm.paymentStatus === 'PAID'
                  ? 'bg-success-50 text-success-700 border-success-500/40'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'"
                @click="offlineOrderForm.paymentStatus = 'PAID'"
              >Sudah Bayar</button>
              <button
                type="button"
                class="flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors"
                :class="offlineOrderForm.paymentStatus === 'PENDING_PAYMENT'
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'"
                @click="offlineOrderForm.paymentStatus = 'PENDING_PAYMENT'"
              >Belum Bayar</button>
            </div>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" class="btn-secondary-full" @click="showOfflineOrderModal = false">Batal</button>
            <button type="submit" class="btn-primary-full" :disabled="savingOfflineOrder">
              <span v-if="savingOfflineOrder" class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>
              <span v-else>Simpan Pesanan</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Toast -->
    <div v-if="toast.visible" class="fixed bottom-6 left-1/2 -translate-x-0.5 z-[60] w-full max-w-sm px-4">
      <div
        class="rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 text-sm font-medium"
        :class="toast.type === 'success' ? 'bg-success-50 border border-success-500/30 text-success-700' : 'bg-error-50 border border-error-100 text-error-600'"
      >
        <span>{{ toast.type === 'success' ? '✓' : '✕' }}</span>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const activeTab = ref('dashboard')
const tabs = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'orders', label: 'Pesanan' },
  { key: 'products', label: 'Produk' },
  { key: 'categories', label: 'Kategori' },
  { key: 'chat', label: 'Chat' },
  { key: 'config', label: 'Flash Sale' },
  { key: 'settings', label: 'Pengaturan' }
]

// Toast
const toast = reactive({ visible: false, type: 'success', message: '' })
let toastTimer: ReturnType<typeof setTimeout>
function showToast(type: 'success' | 'error', message: string) {
  clearTimeout(toastTimer)
  Object.assign(toast, { visible: true, type, message })
  toastTimer = setTimeout(() => { toast.visible = false }, 4000)
}

// Orders
const { data: orders, pending: ordersLoading, refresh: refreshOrders } = await useFetch('/api/admin/orders')
const notifying = ref<string | null>(null)
const cancelling = ref<string | null>(null)

const shipmentModal = reactive({
  open: false,
  orderId: '',
  courier: 'jne',
  trackingNo: '',
  saving: false
})

function openShipmentForm(orderId: string) {
  shipmentModal.orderId = orderId
  shipmentModal.trackingNo = ''
  shipmentModal.courier = 'jne'
  shipmentModal.open = true
}

async function saveShipment() {
  if (!shipmentModal.trackingNo.trim()) return
  shipmentModal.saving = true
  try {
    await $fetch(`/api/admin/orders/${shipmentModal.orderId}/shipment`, {
      method: 'POST',
      body: { courier: shipmentModal.courier, trackingNo: shipmentModal.trackingNo.trim() }
    })
    shipmentModal.open = false
    await refreshOrders()
  } catch (err: any) {
    alert(err?.data?.statusMessage || 'Gagal menyimpan resi')
  } finally {
    shipmentModal.saving = false
  }
}
// ── Chat ──
const { data: chatSessions, pending: chatLoading, refresh: refreshChat } = useFetch<any[]>('/api/admin/chat', { lazy: true })
const activeChatSession = ref<any>(null)
const activeChatMessages = ref<any[]>([])
const adminReply = ref('')
const chatMessagesEl = ref<HTMLElement>()
let chatPollTimer: ReturnType<typeof setTimeout> | null = null
let chatLastCreatedAt = ''

async function openChatSession(sess: any) {
  activeChatSession.value = sess
  activeChatMessages.value = []
  chatLastCreatedAt = ''
  stopChatPolling()
  await loadChatMessages(sess.id)
  startChatPolling(sess.id)
}

async function loadChatMessages(sessionId: string) {
  const res = await $fetch<{ messages: any[] }>(`/api/chat/${sessionId}/messages`)
  activeChatMessages.value = res.messages
  if (res.messages.length) chatLastCreatedAt = res.messages[res.messages.length - 1].createdAt
  nextTick(() => {
    if (chatMessagesEl.value) chatMessagesEl.value.scrollTop = chatMessagesEl.value.scrollHeight
  })
}

async function pollChatMessages(sessionId: string) {
  try {
    const url = chatLastCreatedAt
      ? `/api/chat/${sessionId}/messages?after=${encodeURIComponent(chatLastCreatedAt)}`
      : `/api/chat/${sessionId}/messages`
    const res = await $fetch<{ messages: any[] }>(url)
    if (res.messages.length) {
      const existingIds = new Set(activeChatMessages.value.filter((m: any) => !m.id.startsWith('tmp-')).map((m: any) => m.id))
      const incoming = res.messages.filter((m: any) => !existingIds.has(m.id))
      if (incoming.length) {
        activeChatMessages.value = activeChatMessages.value.filter((m: any) => !m.id.startsWith('tmp-'))
        activeChatMessages.value.push(...incoming)
        chatLastCreatedAt = incoming[incoming.length - 1].createdAt
        nextTick(() => {
          if (chatMessagesEl.value) chatMessagesEl.value.scrollTop = chatMessagesEl.value.scrollHeight
        })
      }
    }
  } catch {}
  if (activeChatSession.value?.id === sessionId) {
    chatPollTimer = setTimeout(() => pollChatMessages(sessionId), 3000)
  }
}

function startChatPolling(sessionId: string) {
  stopChatPolling()
  chatPollTimer = setTimeout(() => pollChatMessages(sessionId), 3000)
}

function stopChatPolling() {
  if (chatPollTimer) { clearTimeout(chatPollTimer); chatPollTimer = null }
}

async function sendAdminReply() {
  if (!adminReply.value.trim() || !activeChatSession.value) return
  const msg = adminReply.value.trim()
  adminReply.value = ''
  // Optimistic update
  activeChatMessages.value.push({ id: `tmp-${Date.now()}`, sender: 'admin', body: msg, createdAt: new Date().toISOString() })
  nextTick(() => {
    if (chatMessagesEl.value) chatMessagesEl.value.scrollTop = chatMessagesEl.value.scrollHeight
  })
  await $fetch(`/api/admin/chat/${activeChatSession.value.id}/reply`, {
    method: 'POST',
    body: { message: msg }
  })
  refreshChat()
}

onUnmounted(() => stopChatPolling())

// ── /Chat ──

const showProofModal = ref(false)
const uploadingProof = ref(false)
const selectedOrderId = ref<string | null>(null)
const proofFile = ref<File | null>(null)

// Multi-select WA blast
const selectedOrderIds = ref<Set<string>>(new Set())
const bulkNotifying = ref(false)

function toggleOrderSelect(id: string) {
  const next = new Set(selectedOrderIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedOrderIds.value = next
}

async function bulkNotify() {
  if (!selectedOrderIds.value.size) return
  bulkNotifying.value = true
  try {
    const res = await $fetch<{ sent: number }>('/api/admin/orders/bulk-notify', {
      method: 'POST',
      body: { orderIds: Array.from(selectedOrderIds.value) }
    })
    selectedOrderIds.value = new Set()
    showToast('success', `WA terkirim ke ${res.sent} nomor`)
  } catch (err: any) {
    showToast('error', err.data?.statusMessage || 'Gagal kirim WA')
  } finally {
    bulkNotifying.value = false
  }
}

// Order filters
const productSearch = ref('')
const productStatusFilter = ref('ALL')
const productStatusFilters = [
  { value: 'ALL', label: 'Semua' },
  { value: 'AVAILABLE', label: 'Tersedia' },
  { value: 'SOLD_OUT', label: 'Sold Out' }
]
const productStatusCounts = computed(() => {
  const all = (products.value as any[]) ?? []
  const counts: Record<string, number> = { ALL: all.length, AVAILABLE: 0, SOLD_OUT: 0 }
  for (const p of all) counts[p.status] = (counts[p.status] ?? 0) + 1
  return counts
})
const filteredProducts = computed(() => {
  const all = (products.value as any[]) ?? []
  const q = productSearch.value.trim().toLowerCase()
  return all.filter(p => {
    if (productStatusFilter.value !== 'ALL' && p.status !== productStatusFilter.value) return false
    if (!q) return true
    return p.title.toLowerCase().includes(q)
  })
})

const orderSearch = ref('')
const orderStatusFilter = ref('ALL')
const orderStatusFilters = [
  { value: 'ALL', label: 'Semua' },
  { value: 'PENDING_PAYMENT', label: 'Menunggu' },
  { value: 'PAID', label: 'Lunas' },
  { value: 'IN_PRODUCTION', label: 'Dikemas' },
  { value: 'READY_TO_SHIP', label: 'Siap Kirim' },
  { value: 'SHIPPED', label: 'Dikirim' },
  { value: 'DELIVERED', label: 'Selesai' },
  { value: 'CANCELLED', label: 'Dibatalkan' }
]

const orderStatusCounts = computed(() => {
  const all = (orders.value as any[]) ?? []
  const counts: Record<string, number> = { ALL: all.length, PENDING_PAYMENT: 0, PAID: 0, IN_PRODUCTION: 0, READY_TO_SHIP: 0, SHIPPED: 0, DELIVERED: 0, CANCELLED: 0 }
  for (const o of all) counts[o.status] = (counts[o.status] ?? 0) + 1
  return counts
})

const filteredOrders = computed(() => {
  const all = (orders.value as any[]) ?? []
  const q = orderSearch.value.trim().toLowerCase()
  return all.filter(o => {
    if (orderStatusFilter.value !== 'ALL' && o.status !== orderStatusFilter.value) return false
    if (!q) return true
    return (
      o.buyerName.toLowerCase().includes(q) ||
      o.buyerPhone.includes(q) ||
      o.product?.title?.toLowerCase().includes(q)
    )
  })
})

async function notifyOrder(id: string) {
  notifying.value = id
  try {
    await $fetch(`/api/admin/orders/${id}/notify`, { method: 'POST' })
    showToast('success', 'Pesan WhatsApp berhasil dikirim')
  } catch (err: any) {
    showToast('error', err.data?.statusMessage || 'Gagal kirim WA')
  } finally {
    notifying.value = null
  }
}

async function cancelOrder(id: string) {
  if (!confirm('Batalkan pesanan ini? Produk akan kembali tersedia.')) return
  cancelling.value = id
  try {
    await $fetch(`/api/admin/orders/${id}/cancel`, { method: 'PATCH' })
    showToast('success', 'Pesanan dibatalkan', 'Produk kembali tersedia')
    await refreshOrders()
  } catch (err: any) {
    showToast('error', err.data?.statusMessage || 'Gagal membatalkan pesanan')
  } finally {
    cancelling.value = null
  }
}

const allowedOrderStatuses = ['PENDING_PAYMENT', 'PAID', 'IN_PRODUCTION', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']

async function updateOrderStatus(id: string, status: string) {
  try {
    await $fetch(`/api/admin/orders/${id}/status`, { method: 'PATCH', body: { status } })
    showToast('success', 'Status diperbarui')
    await refreshOrders()
  } catch (err: any) {
    showToast('error', err.data?.statusMessage || 'Gagal mengubah status')
  }
}

function openUploadProof(id: string) {
  selectedOrderId.value = id
  proofFile.value = null
  showProofModal.value = true
}

function onProofFileChange(e: Event) {
  proofFile.value = (e.target as HTMLInputElement).files?.[0] || null
}

async function uploadProof() {
  if (!proofFile.value || !selectedOrderId.value) {
    showToast('error', 'Pilih file terlebih dahulu')
    return
  }
  uploadingProof.value = true
  try {
    const fd = new FormData()
    fd.append('proof', proofFile.value)
    await $fetch(`/api/admin/orders/${selectedOrderId.value}/upload-proof`, { method: 'POST', body: fd })
    showProofModal.value = false
    showToast('success', 'Bukti diupload, status berubah menjadi Lunas')
    await refreshOrders()
  } catch (err: any) {
    showToast('error', err.data?.statusMessage || 'Gagal upload bukti')
  } finally {
    uploadingProof.value = false
  }
}

// Products
const { data: products, refresh: refreshProducts } = await useFetch('/api/admin/products')
const { data: categories, refresh: refreshCategories } = await useFetch<any[]>('/api/admin/categories')

// Category management
const newCategoryName = ref('')
const addingCategory = ref(false)
const deletingCategory = ref<string | null>(null)

async function addCategory() {
  addingCategory.value = true
  try {
    await $fetch('/api/admin/categories', { method: 'POST', body: { name: newCategoryName.value } })
    newCategoryName.value = ''
    await refreshCategories()
  } catch (e: any) {
    alert(e?.data?.statusMessage || 'Gagal menambah kategori')
  } finally {
    addingCategory.value = false
  }
}

async function deleteCategory(id: string) {
  if (!confirm('Hapus kategori ini? Produk yang sudah ada tidak terhapus.')) return
  deletingCategory.value = id
  try {
    await $fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    await refreshCategories()
  } finally {
    deletingCategory.value = null
  }
}
const showProductModal = ref(false)
const savingProduct = ref(false)
const deletingProduct = ref<string | null>(null)

const editingProduct = ref<any>(null)
const productFile = ref<File | null>(null)
const extraFiles = ref<File[]>([])
const PRODUCT_SIZES = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size']
const productForm = reactive({
  title: '', price: '', originalPrice: '', sessionId: '', description: '',
  categoryId: '', productType: 'REGULAR', material: '', weight: '',
  estimatedReadyDate: '',
  variants: PRODUCT_SIZES.map(size => ({ size, stock: 0 }))
})

function openProductForm(product?: any) {
  editingProduct.value = product || null
  productForm.title = product?.title || ''
  productForm.price = product?.price ? String(product.price) : ''
  productForm.originalPrice = product?.originalPrice ? String(product.originalPrice) : ''
  productForm.sessionId = product?.sessionId || ''
  productForm.description = product?.description || ''
  productForm.categoryId = product?.categoryId || ''
  productForm.productType = product?.productType || 'REGULAR'
  productForm.material = product?.material || ''
  productForm.weight = product?.weight ? String(product.weight) : ''
  productForm.estimatedReadyDate = product?.estimatedReadyDate
    ? new Date(product.estimatedReadyDate).toISOString().slice(0, 10)
    : ''
  // Pre-fill variants from existing product
  productForm.variants = PRODUCT_SIZES.map(size => {
    const existing = product?.variants?.find((v: any) => v.size === size)
    return { size, stock: existing?.stock ?? 0 }
  })
  productFile.value = null
  extraFiles.value = []
  showProductModal.value = true
}

const MAX_FILE_SIZE = 2 * 1024 * 1024

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0] || null
  if (file && file.size > MAX_FILE_SIZE) {
    showToast('error', `Ukuran foto terlalu besar (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimal 2 MB.`)
    ;(e.target as HTMLInputElement).value = ''
    return
  }
  productFile.value = file
}

function onExtraFilesChange(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files || [])
  const oversized = files.filter(f => f.size > MAX_FILE_SIZE)
  if (oversized.length) {
    showToast('error', `${oversized.length} foto melebihi batas 2 MB: ${oversized.map(f => f.name).join(', ')}`)
    ;(e.target as HTMLInputElement).value = ''
    return
  }
  extraFiles.value = files
}

async function saveProduct() {
  savingProduct.value = true
  try {
    const fd = new FormData()
    fd.append('title', productForm.title)
    fd.append('price', productForm.price)
    if (productForm.originalPrice) fd.append('originalPrice', productForm.originalPrice)
    fd.append('sessionId', productForm.sessionId)
    fd.append('description', productForm.description)
    fd.append('categoryId', productForm.categoryId)
    fd.append('productType', productForm.productType)
    fd.append('material', productForm.material)
    fd.append('weight', productForm.weight)
    fd.append('estimatedReadyDate', productForm.estimatedReadyDate)
    // Only include variants with stock > 0 or all if pre-order
    const variantsToSave = productForm.variants.filter(v =>
      v.stock > 0 || productForm.productType === 'PRE_ORDER'
    )
    fd.append('variants', JSON.stringify(variantsToSave))
    if (editingProduct.value) fd.append('id', editingProduct.value.id)
    if (productFile.value) fd.append('image', productFile.value)
    for (const f of extraFiles.value) fd.append('images', f)
    await $fetch('/api/admin/products', { method: 'POST', body: fd })
    showProductModal.value = false
    showToast('success', 'Produk berhasil disimpan')
    await refreshProducts()
  } catch (err: any) {
    showToast('error', err.data?.statusMessage || 'Gagal menyimpan produk')
  } finally {
    savingProduct.value = false
  }
}

async function deleteProduct(id: string) {
  deletingProduct.value = id
  try {
    await $fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    showToast('success', 'Produk dihapus')
    await refreshProducts()
  } catch (err: any) {
    showToast('error', err.data?.statusMessage || 'Gagal menghapus produk')
  } finally {
    deletingProduct.value = null
  }
}

// Sessions
interface Session {
  id: string
  title: string
  startTime: string
  endTime: string
  isActive: boolean
}
const { data: sessions, pending: sessionsLoading, refresh: refreshSessions } = await useFetch<Session[]>('/api/admin/flash-sale/sessions')
const deletingSession = ref<string | null>(null)
const togglingSession = ref<string | null>(null)

const nowMs = ref(Date.now())
onMounted(() => {
  const t = setInterval(() => { nowMs.value = Date.now() }, 10000)
  onUnmounted(() => clearInterval(t))
})

const sessionsSorted = computed(() =>
  [...(sessions.value ?? [])].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
)

function sessionStatus(s: Session): 'active' | 'upcoming' | 'ended' {
  const start = new Date(s.startTime).getTime()
  const end = new Date(s.endTime).getTime()
  if (nowMs.value >= start && nowMs.value <= end) return 'active'
  if (nowMs.value < start) return 'upcoming'
  return 'ended'
}

async function toggleSession(session: Session) {
  togglingSession.value = session.id
  try {
    await $fetch(`/api/admin/flash-sale/sessions/${session.id}`, { method: 'PATCH', body: { isActive: !session.isActive } })
    await refreshSessions()
  } catch (err: any) {
    showToast('error', err.data?.statusMessage || 'Gagal mengubah status sesi')
  } finally {
    togglingSession.value = null
  }
}

async function deleteSession(id: string) {
  deletingSession.value = id
  try {
    await $fetch(`/api/admin/flash-sale/sessions/${id}`, { method: 'DELETE' })
    showToast('success', 'Sesi dihapus')
    await refreshSessions()
  } catch (err: any) {
    showToast('error', err.data?.statusMessage || 'Gagal menghapus sesi')
  } finally {
    deletingSession.value = null
  }
}

// Dashboard computed
const dashboardStats = computed(() => {
  const all = (orders.value as any[]) ?? []
  const paid = all.filter(o => o.status === 'PAID')
  const pending = all.filter(o => o.status === 'PENDING_PAYMENT')
  const cancelled = all.filter(o => o.status === 'CANCELLED')
  const revenue = paid.reduce((sum, o) => sum + Number(o.product?.price || 0), 0)
  const active = all.filter(o => o.status !== 'CANCELLED')
  const offline = active.filter(o => o.source === 'OFFLINE')
  const offlinePaid = offline.filter(o => o.status === 'PAID')
  const offlineRevenue = offlinePaid.reduce((sum, o) => sum + Number(o.product?.price || 0), 0)
  const flashSale = active.filter(o => o.source === 'FLASH_SALE')
  const flashSalePaid = flashSale.filter(o => o.status === 'PAID')
  const flashSaleRevenue = flashSalePaid.reduce((sum, o) => sum + Number(o.product?.price || 0), 0)
  return {
    totalOrders: active.length,
    totalRevenue: revenue,
    pendingCount: pending.length,
    cancelledCount: cancelled.length,
    offlineCount: offline.length,
    offlineRevenue,
    flashSaleCount: flashSale.length,
    flashSaleRevenue
  }
})

const statusChartData = computed(() => {
  const all = (orders.value as any[]) ?? []
  const paid = all.filter(o => o.status === 'PAID').length
  const pending = all.filter(o => o.status === 'PENDING_PAYMENT').length
  const cancelled = all.filter(o => o.status === 'CANCELLED').length
  return {
    labels: ['Lunas', 'Menunggu', 'Dibatalkan'],
    datasets: [{
      data: [paid, pending, cancelled],
      backgroundColor: ['#22c55e', '#f59e0b', '#9ca3af'],
      borderWidth: 0
    }]
  }
})

const sessionChartData = computed(() => {
  const all = (orders.value as any[]) ?? []
  const map = new Map<string, { title: string; count: number }>()
  for (const o of all) {
    const sid = o.product?.sessionId || 'Tanpa Sesi'
    const session = (sessions.value as any[])?.find(s => s.id === sid)
    const title = session?.title || sid
    const cur = map.get(sid) || { title, count: 0 }
    cur.count++
    map.set(sid, cur)
  }
  const items = Array.from(map.values())
  return {
    labels: items.map(i => i.title),
    datasets: [{
      label: 'Jumlah Pesanan',
      data: items.map(i => i.count),
      backgroundColor: '#FABC3F',
      borderRadius: 6
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } }
  }
}

// Config form (tambah sesi baru)
const configForm = reactive({ title: 'Flash Sale Special', startTime: '', endTime: '' })
const savingConfig = ref(false)

// datetime-local input menghasilkan "YYYY-MM-DDTHH:mm" tanpa timezone.
// Vercel server UTC akan parse sebagai UTC, bukan WIB — tambah offset +07:00 secara eksplisit.
function toJakartaISO(localDatetime: string) {
  return localDatetime ? `${localDatetime}:00+07:00` : ''
}

async function saveConfig() {
  savingConfig.value = true
  try {
    await $fetch('/api/admin/flash-sale/config', {
      method: 'POST',
      body: {
        ...configForm,
        startTime: toJakartaISO(configForm.startTime),
        endTime: toJakartaISO(configForm.endTime),
      }
    })
    showToast('success', 'Sesi Flash Sale berhasil ditambahkan')
    configForm.title = 'Flash Sale Special'
    configForm.startTime = ''
    configForm.endTime = ''
    await refreshSessions()
  } catch (err: any) {
    showToast('error', err.data?.statusMessage || 'Gagal menyimpan sesi')
  } finally {
    savingConfig.value = false
  }
}

function sessionLabel(sessionId: string) {
  const s = sessions.value?.find(s => s.id === sessionId)
  if (!s) return sessionId
  return `${s.title} · ${formatTime(s.startTime)}`
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false
  })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', hour12: false })
}

function formatPrice(price: number | string) {
  return Number(price).toLocaleString('id-ID')
}

function orderStatusText(status: string) {
  const map: Record<string, string> = {
    PENDING_PAYMENT: 'Belum Bayar', PAID: 'Lunas', IN_PRODUCTION: 'Dikemas',
    READY_TO_SHIP: 'Siap Kirim', SHIPPED: 'Dikirim', DELIVERED: 'Selesai',
    CANCELLED: 'Dibatalkan', REFUNDED: 'Pengembalian'
  }
  return map[status] || status
}

async function logout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}

// ── WA Template Settings ──
const { data: waTemplates, refresh: refreshTemplates } = await useFetch<Record<string, string>>('/api/admin/wa-template')
const waSingle = ref('')
const waBulk = ref('')
const waTemplateSaving = ref(false)
const waTemplateSaved = ref(false)
const singleTextarea = ref<HTMLTextAreaElement | null>(null)
const bulkTextarea = ref<HTMLTextAreaElement | null>(null)

function insertPlaceholder(target: 'single' | 'bulk', placeholder: string) {
  const el = target === 'single' ? singleTextarea.value : bulkTextarea.value
  if (!el) return
  const start = el.selectionStart ?? el.value.length
  const end = el.selectionEnd ?? el.value.length
  const val = el.value
  const newVal = val.slice(0, start) + placeholder + val.slice(end)
  if (target === 'single') waSingle.value = newVal
  else waBulk.value = newVal
  nextTick(() => {
    el.focus()
    el.setSelectionRange(start + placeholder.length, start + placeholder.length)
  })
}

watch(waTemplates, (val) => {
  if (val) {
    waSingle.value = val.single ?? ''
    waBulk.value = val.bulk ?? ''
  }
}, { immediate: true })

async function saveWaTemplates() {
  waTemplateSaving.value = true
  waTemplateSaved.value = false
  await $fetch('/api/admin/wa-template', {
    method: 'PUT',
    body: { single: waSingle.value, bulk: waBulk.value }
  })
  waTemplateSaving.value = false
  waTemplateSaved.value = true
  await refreshTemplates()
  setTimeout(() => { waTemplateSaved.value = false }, 3000)
}

// ── Kelola Admin ──
const { data: adminList, refresh: refreshAdmins } = await useFetch<{ id: string; username: string; createdAt: string }[]>('/api/admin/admins')
const adminForm = reactive({ username: '', password: '' })
const addingAdmin = ref(false)
const deletingAdminId = ref<string | null>(null)

async function addAdmin() {
  addingAdmin.value = true
  try {
    await $fetch('/api/admin/admins', { method: 'POST', body: adminForm })
    adminForm.username = ''
    adminForm.password = ''
    await refreshAdmins()
    showToast('success', 'Admin berhasil ditambahkan')
  } catch (e: any) {
    showToast('error', e?.data?.statusMessage || 'Gagal menambahkan admin')
  } finally {
    addingAdmin.value = false
  }
}

async function deleteAdmin(id: string) {
  if (!confirm('Hapus admin ini?')) return
  deletingAdminId.value = id
  try {
    await $fetch(`/api/admin/admins/${id}`, { method: 'DELETE' })
    await refreshAdmins()
    showToast('success', 'Admin berhasil dihapus')
  } catch (e: any) {
    showToast('error', e?.data?.statusMessage || 'Gagal menghapus admin')
  } finally {
    deletingAdminId.value = null
  }
}

// Offline Order
const showOfflineOrderModal = ref(false)
const savingOfflineOrder = ref(false)
const offlineOrderForm = reactive({
  productId: '',
  buyerName: '',
  buyerPhone: '',
  paymentStatus: 'PAID' as 'PAID' | 'PENDING_PAYMENT',
})

const availableProducts = computed(() =>
  (products.value ?? []).filter((p: any) => p.status === 'AVAILABLE')
)

function openOfflineOrderModal() {
  offlineOrderForm.productId = ''
  offlineOrderForm.buyerName = ''
  offlineOrderForm.buyerPhone = ''
  offlineOrderForm.paymentStatus = 'PAID'
  showOfflineOrderModal.value = true
}

async function submitOfflineOrder() {
  savingOfflineOrder.value = true
  try {
    await $fetch('/api/admin/orders/offline', {
      method: 'POST',
      body: {
        productId: offlineOrderForm.productId,
        buyerName: offlineOrderForm.buyerName,
        buyerPhone: offlineOrderForm.buyerPhone,
        paymentStatus: offlineOrderForm.paymentStatus,
      }
    })
    showOfflineOrderModal.value = false
    await Promise.all([refreshOrders(), refreshProducts()])
    showToast('success', 'Pesanan offline berhasil disimpan')
  } catch (e: any) {
    showToast('error', e?.data?.statusMessage || 'Gagal menyimpan pesanan offline')
  } finally {
    savingOfflineOrder.value = false
  }
}
</script>
