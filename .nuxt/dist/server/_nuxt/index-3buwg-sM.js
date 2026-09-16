import { _ as __nuxt_component_1 } from "./client-only-CUemHDvz.js";
import { defineComponent, ref, reactive, withAsyncContext, computed, watch, mergeProps, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderAttr, ssrRenderStyle, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import "/home/yasir/Documents/Project/mints/node_modules/hookable/dist/index.mjs";
import { u as useFetch } from "./fetch-CA9qG_rp.js";
import "../server.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/ohash/dist/index.mjs";
import "@vue/shared";
import "./ssr-D-29j6RL.js";
import "./asyncData-BjQpEgQd.js";
import "/home/yasir/Documents/Project/mints/node_modules/perfect-debounce/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/home/yasir/Documents/Project/mints/node_modules/nuxt/node_modules/unctx/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/home/yasir/Documents/Project/mints/node_modules/defu/dist/defu.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/ufo/dist/index.mjs";
import "@vueuse/core";
import "tailwind-merge";
import "/home/yasir/Documents/Project/mints/node_modules/klona/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/@unhead/vue/dist/index.mjs";
import "@iconify/vue";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const activeTab = ref("dashboard");
    const tabs = [
      { key: "dashboard", label: "Dashboard" },
      { key: "orders", label: "Pesanan" },
      { key: "products", label: "Produk" },
      { key: "categories", label: "Kategori" },
      { key: "chat", label: "Chat" },
      { key: "config", label: "Flash Sale" },
      { key: "settings", label: "Pengaturan" }
    ];
    const toast = reactive({ visible: false, type: "success", message: "" });
    const { data: orders, pending: ordersLoading, refresh: refreshOrders } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/admin/orders",
      "$JpCQHOzdav"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const notifying = ref(null);
    const cancelling = ref(null);
    const selectedOrder = ref(null);
    const shipmentModal = reactive({
      open: false,
      orderId: "",
      courier: "jne",
      trackingNo: "",
      saving: false
    });
    const { data: chatSessions, pending: chatLoading, refresh: refreshChat } = useFetch(
      "/api/admin/chat",
      { lazy: true },
      "$1TexUgw9YE"
      /* nuxt-injected */
    );
    const activeChatSession = ref(null);
    const activeChatMessages = ref([]);
    const adminReply = ref("");
    ref();
    const showProofModal = ref(false);
    const uploadingProof = ref(false);
    ref(null);
    ref(null);
    const selectedOrderIds = ref(/* @__PURE__ */ new Set());
    const bulkNotifying = ref(false);
    const productSearch = ref("");
    const productStatusFilter = ref("ALL");
    const productStatusFilters = [
      { value: "ALL", label: "Semua" },
      { value: "AVAILABLE", label: "Tersedia" },
      { value: "SOLD_OUT", label: "Sold Out" }
    ];
    const productStatusCounts = computed(() => {
      const all = products.value ?? [];
      const counts = { ALL: all.length, AVAILABLE: 0, SOLD_OUT: 0 };
      for (const p of all) counts[p.status] = (counts[p.status] ?? 0) + 1;
      return counts;
    });
    const filteredProducts = computed(() => {
      const all = products.value ?? [];
      const q = productSearch.value.trim().toLowerCase();
      return all.filter((p) => {
        if (productStatusFilter.value !== "ALL" && p.status !== productStatusFilter.value) return false;
        if (!q) return true;
        return p.title.toLowerCase().includes(q);
      });
    });
    const orderSearch = ref("");
    const orderStatusFilter = ref("ALL");
    const orderStatusFilters = [
      { value: "ALL", label: "Semua" },
      { value: "PENDING_PAYMENT", label: "Menunggu" },
      { value: "PAID", label: "Lunas" },
      { value: "IN_PRODUCTION", label: "Dikemas" },
      { value: "READY_TO_SHIP", label: "Siap Kirim" },
      { value: "SHIPPED", label: "Dikirim" },
      { value: "DELIVERED", label: "Selesai" },
      { value: "CANCELLED", label: "Dibatalkan" }
    ];
    const orderStatusCounts = computed(() => {
      const all = orders.value ?? [];
      const counts = { ALL: all.length, PENDING_PAYMENT: 0, PAID: 0, IN_PRODUCTION: 0, READY_TO_SHIP: 0, SHIPPED: 0, DELIVERED: 0, CANCELLED: 0 };
      for (const o of all) counts[o.status] = (counts[o.status] ?? 0) + 1;
      return counts;
    });
    const filteredOrders = computed(() => {
      const all = orders.value ?? [];
      const q = orderSearch.value.trim().toLowerCase();
      return all.filter((o) => {
        if (orderStatusFilter.value !== "ALL" && o.status !== orderStatusFilter.value) return false;
        if (!q) return true;
        return o.buyerName.toLowerCase().includes(q) || o.buyerPhone.includes(q) || o.product?.title?.toLowerCase().includes(q);
      });
    });
    const allowedOrderStatuses = ["PENDING_PAYMENT", "PAID", "IN_PRODUCTION", "READY_TO_SHIP", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
    const { data: products, refresh: refreshProducts } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/admin/products",
      "$wLH1kFmydb"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: categories, refresh: refreshCategories } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/admin/categories",
      "$qZKi7zhxEh"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const newCategoryName = ref("");
    const addingCategory = ref(false);
    const deletingCategory = ref(null);
    const showProductModal = ref(false);
    const savingProduct = ref(false);
    const deletingProduct = ref(null);
    const editingProduct = ref(null);
    ref(null);
    const extraFiles = ref([]);
    const PRODUCT_SIZES = ["S", "M", "L", "XL", "XXL", "XXXL", "Free Size"];
    const productForm = reactive({
      title: "",
      price: "",
      originalPrice: "",
      sessionId: "",
      description: "",
      categoryId: "",
      productType: "REGULAR",
      material: "",
      weight: "",
      estimatedReadyDate: "",
      variants: PRODUCT_SIZES.map((size) => ({ size, stock: 0 }))
    });
    const { data: sessions, pending: sessionsLoading, refresh: refreshSessions } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/admin/flash-sale/sessions",
      "$MnLKTASE2h"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const deletingSession = ref(null);
    const togglingSession = ref(null);
    const nowMs = ref(Date.now());
    const sessionsSorted = computed(
      () => [...sessions.value ?? []].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    );
    function sessionStatus(s) {
      const start = new Date(s.startTime).getTime();
      const end = new Date(s.endTime).getTime();
      if (nowMs.value >= start && nowMs.value <= end) return "active";
      if (nowMs.value < start) return "upcoming";
      return "ended";
    }
    const dashboardStats = computed(() => {
      const all = orders.value ?? [];
      const paid = all.filter((o) => o.status === "PAID");
      const pending = all.filter((o) => o.status === "PENDING_PAYMENT");
      const cancelled = all.filter((o) => o.status === "CANCELLED");
      const revenue = paid.reduce((sum, o) => sum + Number(o.product?.price || 0), 0);
      const active = all.filter((o) => o.status !== "CANCELLED");
      const offline = active.filter((o) => o.source === "OFFLINE");
      const offlinePaid = offline.filter((o) => o.status === "PAID");
      const offlineRevenue = offlinePaid.reduce((sum, o) => sum + Number(o.product?.price || 0), 0);
      const flashSale = active.filter((o) => o.source === "FLASH_SALE");
      const flashSalePaid = flashSale.filter((o) => o.status === "PAID");
      const flashSaleRevenue = flashSalePaid.reduce((sum, o) => sum + Number(o.product?.price || 0), 0);
      return {
        totalOrders: active.length,
        totalRevenue: revenue,
        pendingCount: pending.length,
        cancelledCount: cancelled.length,
        offlineCount: offline.length,
        offlineRevenue,
        flashSaleCount: flashSale.length,
        flashSaleRevenue
      };
    });
    computed(() => {
      const all = orders.value ?? [];
      const paid = all.filter((o) => o.status === "PAID").length;
      const pending = all.filter((o) => o.status === "PENDING_PAYMENT").length;
      const cancelled = all.filter((o) => o.status === "CANCELLED").length;
      return {
        labels: ["Lunas", "Menunggu", "Dibatalkan"],
        datasets: [{
          data: [paid, pending, cancelled],
          backgroundColor: ["#22c55e", "#f59e0b", "#9ca3af"],
          borderWidth: 0
        }]
      };
    });
    computed(() => {
      const all = orders.value ?? [];
      const map = /* @__PURE__ */ new Map();
      for (const o of all) {
        const sid = o.product?.sessionId || "Tanpa Sesi";
        const session = sessions.value?.find((s) => s.id === sid);
        const title = session?.title || sid;
        const cur = map.get(sid) || { title, count: 0 };
        cur.count++;
        map.set(sid, cur);
      }
      const items = Array.from(map.values());
      return {
        labels: items.map((i) => i.title),
        datasets: [{
          label: "Jumlah Pesanan",
          data: items.map((i) => i.count),
          backgroundColor: "#FABC3F",
          borderRadius: 6
        }]
      };
    });
    const configForm = reactive({ title: "Flash Sale Special", startTime: "", endTime: "" });
    const savingConfig = ref(false);
    function sessionLabel(sessionId) {
      const s = sessions.value?.find((s2) => s2.id === sessionId);
      if (!s) return sessionId;
      return `${s.title} · ${formatTime(s.startTime)}`;
    }
    function formatDateTime(iso) {
      return new Date(iso).toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    }
    function formatTime(iso) {
      return new Date(iso).toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta", hour: "2-digit", minute: "2-digit", hour12: false });
    }
    function formatPrice(price) {
      return Number(price).toLocaleString("id-ID");
    }
    function orderStatusText(status) {
      const map = {
        PENDING_PAYMENT: "Belum Bayar",
        PAID: "Lunas",
        IN_PRODUCTION: "Dikemas",
        READY_TO_SHIP: "Siap Kirim",
        SHIPPED: "Dikirim",
        DELIVERED: "Selesai",
        CANCELLED: "Dibatalkan",
        REFUNDED: "Pengembalian"
      };
      return map[status] || status;
    }
    const { data: originSettings } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/admin/settings",
      "$OBucgMeCoh"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const originCityLabel = computed(() => originSettings.value?.shipping_origin_city_label || "");
    const originSearch = ref("");
    const originCities = ref([]);
    const originSelected = ref(null);
    const originSaving = ref(false);
    const originSaved = ref(false);
    const { data: paymentSettingsData } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/admin/settings",
      {
        query: { keys: "payment_gateway_enabled,bank_accounts" }
      },
      "$GqLAU8Wiip"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const paymentGatewayEnabled = ref(paymentSettingsData.value?.payment_gateway_enabled === "true");
    const bankAccounts = ref(
      paymentSettingsData.value?.bank_accounts ? JSON.parse(paymentSettingsData.value.bank_accounts) : []
    );
    const paymentSaving = ref(false);
    const paymentSaved = ref(false);
    const { data: waTemplates, refresh: refreshTemplates } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/admin/wa-template",
      "$su0RZ3It9y"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const waSingle = ref("");
    const waBulk = ref("");
    const waTemplateSaving = ref(false);
    const waTemplateSaved = ref(false);
    ref(null);
    ref(null);
    watch(waTemplates, (val) => {
      if (val) {
        waSingle.value = val.single ?? "";
        waBulk.value = val.bulk ?? "";
      }
    }, { immediate: true });
    const { data: adminList, refresh: refreshAdmins } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/admin/admins",
      "$2vS-TN0o5B"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const adminForm = reactive({ username: "", password: "" });
    const addingAdmin = ref(false);
    const deletingAdminId = ref(null);
    const showOfflineOrderModal = ref(false);
    const savingOfflineOrder = ref(false);
    const offlineOrderForm = reactive({
      productId: "",
      buyerName: "",
      buyerPhone: "",
      paymentStatus: "PAID"
    });
    const availableProducts = computed(
      () => (products.value ?? []).filter((p) => p.status === "AVAILABLE")
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 font-body" }, _attrs))}><div class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs"><div class="flex items-center gap-3"><div class="w-8 h-8 bg-brand-400 rounded-lg flex items-center justify-center"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M13 2L4.09 12.11A1 1 0 004 13h7l-1 9 9.91-11.11A1 1 0 0020 10h-7l1-8z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div><span class="font-bold text-gray-900">Page Admin</span></div><button class="btn-secondary text-sm">Keluar</button></div><div class="max-w-5xl mx-auto px-4 py-8"><div class="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-6"><div class="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit sm:mx-auto"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass([unref(activeTab) === tab.key ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-700", "px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"])}">${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div></div>`);
      if (unref(activeTab) === "dashboard") {
        _push(`<div class="space-y-5"><div class="grid grid-cols-2 lg:grid-cols-4 gap-4"><div class="card p-4"><p class="text-xs text-gray-500 mb-1">Total Pesanan</p><p class="text-2xl font-bold text-gray-900">${ssrInterpolate(unref(dashboardStats).totalOrders)}</p></div><div class="card p-4"><p class="text-xs text-gray-500 mb-1">Total Pendapatan</p><p class="text-2xl font-bold text-green-600">Rp ${ssrInterpolate(formatPrice(unref(dashboardStats).totalRevenue))}</p></div><div class="card p-4"><p class="text-xs text-gray-500 mb-1">Menunggu Pembayaran</p><p class="text-2xl font-bold text-amber-600">${ssrInterpolate(unref(dashboardStats).pendingCount)}</p></div><div class="card p-4"><p class="text-xs text-gray-500 mb-1">Dibatalkan</p><p class="text-2xl font-bold text-gray-500">${ssrInterpolate(unref(dashboardStats).cancelledCount)}</p></div><div class="card p-4"><p class="text-xs text-gray-500 mb-1">Penjualan Flash Sale</p><p class="text-2xl font-bold text-brand-700">${ssrInterpolate(unref(dashboardStats).flashSaleCount)}</p></div><div class="card p-4"><p class="text-xs text-gray-500 mb-1">Pendapatan Flash Sale</p><p class="text-2xl font-bold text-brand-600">Rp ${ssrInterpolate(formatPrice(unref(dashboardStats).flashSaleRevenue))}</p></div><div class="card p-4"><p class="text-xs text-gray-500 mb-1">Penjualan Offline</p><p class="text-2xl font-bold text-brand-700">${ssrInterpolate(unref(dashboardStats).offlineCount)}</p></div><div class="card p-4"><p class="text-xs text-gray-500 mb-1">Pendapatan Offline</p><p class="text-2xl font-bold text-brand-600">Rp ${ssrInterpolate(formatPrice(unref(dashboardStats).offlineRevenue))}</p></div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-5"><div class="card p-4"><h3 class="text-sm font-bold text-gray-900 mb-4">Pesanan per Status</h3><div class="h-56 flex items-center justify-center">`);
        _push(ssrRenderComponent(_component_ClientOnly, null, {
          fallback: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="animate-spin h-7 w-7 rounded-full border-2 border-brand-400 border-t-transparent"${_scopeId}></div>`);
            } else {
              return [
                createVNode("div", { class: "animate-spin h-7 w-7 rounded-full border-2 border-brand-400 border-t-transparent" })
              ];
            }
          })
        }, _parent));
        _push(`</div></div><div class="card p-4"><h3 class="text-sm font-bold text-gray-900 mb-4">Pesanan per Sesi</h3><div class="h-56 flex items-center justify-center">`);
        _push(ssrRenderComponent(_component_ClientOnly, null, {
          fallback: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="animate-spin h-7 w-7 rounded-full border-2 border-brand-400 border-t-transparent"${_scopeId}></div>`);
            } else {
              return [
                createVNode("div", { class: "animate-spin h-7 w-7 rounded-full border-2 border-brand-400 border-t-transparent" })
              ];
            }
          })
        }, _parent));
        _push(`</div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "orders") {
        _push(`<div><div class="flex items-center justify-between mb-4 gap-3 flex-wrap"><h2 class="text-lg font-bold text-gray-900">Daftar Pesanan</h2><div class="flex items-center gap-2 flex-wrap">`);
        if (unref(selectedOrderIds).size > 0) {
          _push(`<button class="btn-primary text-sm"${ssrIncludeBooleanAttr(unref(bulkNotifying)) ? " disabled" : ""}>`);
          if (unref(bulkNotifying)) {
            _push(`<span class="inline-block h-3.5 w-3.5 rounded-full border-2 border-black/30 border-t-black animate-spin mr-1"></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span>Kirim WA ke ${ssrInterpolate(unref(selectedOrderIds).size)} terpilih</span></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="btn-primary text-sm"> + Pesanan Offline </button><button class="btn-secondary text-sm"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"></path><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"></path></svg> Refresh </button></div></div><div class="flex flex-col sm:flex-row gap-2 mb-4"><div class="relative flex-1"><input${ssrRenderAttr("value", unref(orderSearch))} type="text" placeholder="Cari nama, nomor HP, atau produk..." class="input-field"></div><div class="flex gap-2 overflow-x-auto pb-0.5"><!--[-->`);
        ssrRenderList(orderStatusFilters, (f) => {
          _push(`<button class="${ssrRenderClass([unref(orderStatusFilter) === f.value ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400", "px-3 py-2 rounded-lg text-xs font-semibold border transition-colors"])}">${ssrInterpolate(f.label)} <span class="${ssrRenderClass([unref(orderStatusFilter) === f.value ? "bg-white/20" : "bg-gray-100", "ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold"])}">${ssrInterpolate(unref(orderStatusCounts)[f.value] ?? 0)}</span></button>`);
        });
        _push(`<!--]--></div></div>`);
        if (unref(ordersLoading)) {
          _push(`<div class="flex justify-center py-20"><div class="animate-spin h-7 w-7 rounded-full border-2 border-brand-400 border-t-transparent"></div></div>`);
        } else if (!unref(orders)?.length) {
          _push(`<div class="card p-12 text-center text-gray-400"> Belum ada pesanan masuk </div>`);
        } else if (!unref(filteredOrders).length) {
          _push(`<div class="card p-12 text-center text-gray-400"> Tidak ada pesanan yang cocok </div>`);
        } else {
          _push(`<div class="space-y-3"><!--[-->`);
          ssrRenderList(unref(filteredOrders), (order) => {
            _push(`<div class="card p-4 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"><div class="shrink-0 w-5 flex items-center self-start sm:self-auto pt-1 sm:pt-0">`);
            if (order.status === "PENDING_PAYMENT") {
              _push(`<input type="checkbox"${ssrIncludeBooleanAttr(unref(selectedOrderIds).has(order.id)) ? " checked" : ""} class="w-4 h-4 rounded accent-amber-400 cursor-pointer">`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><div class="flex items-center gap-3 sm:flex-1 min-w-0"><img${ssrRenderAttr("src", order.product.imageUrl)}${ssrRenderAttr("alt", order.product.title)} class="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200"><div class="min-w-0"><p class="font-semibold text-gray-900 text-sm line-clamp-1">${ssrInterpolate(order.product.title)}</p><p class="text-brand-600 font-bold text-sm">Rp ${ssrInterpolate(formatPrice(order.product.price))}</p></div></div><div class="sm:flex-1 min-w-0 space-y-0.5"><p class="text-sm font-medium text-gray-800">${ssrInterpolate(order.buyerName)}</p><p class="text-xs text-gray-500 font-mono">${ssrInterpolate(order.buyerPhone)}</p>`);
            if (order.courierCode) {
              _push(`<p class="text-xs text-gray-500">${ssrInterpolate(order.courierCode.toUpperCase())} `);
              if (order.courierService) {
                _push(`<span class="text-gray-400">· ${ssrInterpolate(order.courierService)}</span>`);
              } else {
                _push(`<!---->`);
              }
              if (order.shippingCost === 0) {
                _push(`<span class="text-green-600 font-medium"> · Gratis Ongkir</span>`);
              } else if (order.shippingCost) {
                _push(`<span class="text-gray-400"> · Rp ${ssrInterpolate(formatPrice(order.shippingCost))}</span>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<p class="text-xs text-gray-400">${ssrInterpolate(formatDateTime(order.createdAt))}</p></div><div class="shrink-0 flex flex-col items-start sm:items-end gap-1.5"><div class="flex items-center gap-1.5 flex-wrap justify-end"><span class="${ssrRenderClass([order.source === "OFFLINE" ? "bg-gray-100 text-gray-600 border border-gray-300" : "bg-brand-50 text-brand-700 border border-brand-300", "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"])}">${ssrInterpolate(order.source === "OFFLINE" ? "Offline" : "Flash Sale")}</span><span class="${ssrRenderClass([{
              "bg-success-50 text-success-700 border border-success-500/30": order.status === "PAID" || order.status === "DELIVERED",
              "bg-amber-50 text-amber-700 border border-brand-300": order.status === "PENDING_PAYMENT",
              "bg-blue-50 text-blue-700 border border-blue-300": order.status === "IN_PRODUCTION" || order.status === "READY_TO_SHIP" || order.status === "SHIPPED",
              "bg-gray-100 text-gray-500 border border-gray-200": order.status === "CANCELLED" || order.status === "REFUNDED"
            }, "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"])}"><span class="${ssrRenderClass([{
              "bg-success-700": order.status === "PAID" || order.status === "DELIVERED",
              "bg-amber-700": order.status === "PENDING_PAYMENT",
              "bg-blue-700": order.status === "IN_PRODUCTION" || order.status === "READY_TO_SHIP" || order.status === "SHIPPED",
              "bg-gray-400": order.status === "CANCELLED" || order.status === "REFUNDED"
            }, "w-1.5 h-1.5 rounded-full"])}"></span> ${ssrInterpolate(orderStatusText(order.status))}</span></div>`);
            if (order.notifyCount > 0) {
              _push(`<span class="inline-flex items-center gap-1 text-[11px] text-green-700 font-medium"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.523 5.845L0 24l6.344-1.493A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.645-.52-5.148-1.424l-.369-.219-3.766.887.935-3.667-.241-.381A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path></svg> ${ssrInterpolate(order.notifyCount)}x notif </span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        if (unref(selectedOrder)) {
          _push(`<div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50"><div class="bg-white w-full sm:max-w-lg sm:rounded-2xl shadow-2xl flex flex-col max-h-[92dvh]" style="${ssrRenderStyle([{ "border-radius": "1.25rem 1.25rem 0 0" }, { "border-radius": "var(--r, 1.25rem 1.25rem 0 0)" }])}"><div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0"><div><p class="text-xs text-gray-400 font-mono">${ssrInterpolate(unref(selectedOrder).id.slice(0, 8).toUpperCase())}</p><h3 class="font-bold text-gray-900 text-base leading-tight">Detail Pesanan</h3></div><div class="flex items-center gap-2"><span class="${ssrRenderClass([{
            "bg-success-50 text-success-700 border border-success-500/30": unref(selectedOrder).status === "PAID" || unref(selectedOrder).status === "DELIVERED",
            "bg-amber-50 text-amber-700 border border-brand-300": unref(selectedOrder).status === "PENDING_PAYMENT",
            "bg-blue-50 text-blue-700 border border-blue-300": unref(selectedOrder).status === "IN_PRODUCTION" || unref(selectedOrder).status === "READY_TO_SHIP" || unref(selectedOrder).status === "SHIPPED",
            "bg-gray-100 text-gray-500 border border-gray-200": unref(selectedOrder).status === "CANCELLED" || unref(selectedOrder).status === "REFUNDED"
          }, "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"])}"><span class="${ssrRenderClass([{
            "bg-success-700": unref(selectedOrder).status === "PAID" || unref(selectedOrder).status === "DELIVERED",
            "bg-amber-700": unref(selectedOrder).status === "PENDING_PAYMENT",
            "bg-blue-700": unref(selectedOrder).status === "IN_PRODUCTION" || unref(selectedOrder).status === "READY_TO_SHIP" || unref(selectedOrder).status === "SHIPPED",
            "bg-gray-400": unref(selectedOrder).status === "CANCELLED" || unref(selectedOrder).status === "REFUNDED"
          }, "w-1.5 h-1.5 rounded-full"])}"></span> ${ssrInterpolate(orderStatusText(unref(selectedOrder).status))}</span><button class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg></button></div></div><div class="overflow-y-auto flex-1 px-5 py-4 space-y-5"><div><p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Produk</p><div class="flex gap-3"><img${ssrRenderAttr("src", unref(selectedOrder).product.imageUrl)}${ssrRenderAttr("alt", unref(selectedOrder).product.title)} class="w-16 h-16 rounded-xl object-cover shrink-0 border border-gray-100"><div class="min-w-0"><p class="font-semibold text-gray-900 text-sm leading-snug">${ssrInterpolate(unref(selectedOrder).product.title)}</p><div class="flex flex-wrap gap-2 mt-1.5">`);
          if (unref(selectedOrder).variantId) {
            _push(`<span class="inline-block text-xs px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 font-medium"> Ukuran: ${ssrInterpolate(unref(selectedOrder).product?.variants?.find((v) => v.id === unref(selectedOrder).variantId)?.size ?? "—")}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span class="inline-block text-xs px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700">Qty: ${ssrInterpolate(unref(selectedOrder).qty ?? 1)}</span><span class="inline-block text-xs px-2 py-0.5 rounded-lg bg-brand-50 text-brand-700 font-semibold">Rp ${ssrInterpolate(formatPrice(unref(selectedOrder).product.price))}</span></div><p class="text-xs text-gray-400 mt-1">${ssrInterpolate(formatDateTime(unref(selectedOrder).createdAt))}</p></div></div></div><div class="border-t border-gray-100"></div><div><p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Pembeli</p><div class="space-y-1.5 text-sm"><div class="flex gap-2"><span class="text-gray-400 w-20 shrink-0">Nama</span><span class="font-medium text-gray-800">${ssrInterpolate(unref(selectedOrder).buyerName)}</span></div><div class="flex gap-2"><span class="text-gray-400 w-20 shrink-0">HP</span><span class="font-mono text-gray-700">${ssrInterpolate(unref(selectedOrder).buyerPhone)}</span></div>`);
          if (unref(selectedOrder).address) {
            _push(`<div class="flex gap-2"><span class="text-gray-400 w-20 shrink-0">Alamat</span><span class="text-gray-700">${ssrInterpolate(unref(selectedOrder).address)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(selectedOrder).cityName) {
            _push(`<div class="flex gap-2"><span class="text-gray-400 w-20 shrink-0">Kota</span><span class="text-gray-700">${ssrInterpolate(unref(selectedOrder).cityName)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="border-t border-gray-100"></div><div><p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Pengiriman</p><div class="space-y-1.5 text-sm">`);
          if (unref(selectedOrder).courierCode) {
            _push(`<!--[--><div class="flex gap-2"><span class="text-gray-400 w-20 shrink-0">Kurir</span><span class="font-medium text-gray-800">${ssrInterpolate(unref(selectedOrder).courierCode.toUpperCase())} `);
            if (unref(selectedOrder).courierService) {
              _push(`<span class="text-gray-500 font-normal">· ${ssrInterpolate(unref(selectedOrder).courierService)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</span></div><div class="flex gap-2"><span class="text-gray-400 w-20 shrink-0">Ongkir</span>`);
            if (unref(selectedOrder).shippingCost === 0) {
              _push(`<span class="text-green-600 font-medium">Gratis Ongkir</span>`);
            } else {
              _push(`<span class="text-gray-700">Rp ${ssrInterpolate(formatPrice(unref(selectedOrder).shippingCost))}</span>`);
            }
            _push(`</div><!--]-->`);
          } else {
            _push(`<p class="text-gray-400 text-xs">Belum ada info pengiriman</p>`);
          }
          if (unref(selectedOrder).shipment?.trackingNo) {
            _push(`<!--[--><div class="flex gap-2"><span class="text-gray-400 w-20 shrink-0">Resi</span><span class="font-mono text-gray-800">${ssrInterpolate(unref(selectedOrder).shipment.trackingNo)}</span></div><div class="flex gap-2"><span class="text-gray-400 w-20 shrink-0">Status</span><span class="text-gray-700">${ssrInterpolate(unref(selectedOrder).shipment.status)}</span></div><a${ssrRenderAttr("href", `/track?no=${unref(selectedOrder).shipment.trackingNo}&courier=${unref(selectedOrder).shipment.courier}`)} target="_blank" class="inline-flex items-center gap-1 text-xs text-brand-600 font-medium hover:underline"> Lacak Paket → </a><!--]-->`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="border-t border-gray-100"></div><div><p class="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Pembayaran</p><div class="space-y-1.5 text-sm"><div class="flex gap-2"><span class="text-gray-400 w-20 shrink-0">Status</span><span class="${ssrRenderClass(unref(selectedOrder).payment?.status === "paid" ? "text-green-600 font-medium" : "text-gray-700")}">${ssrInterpolate(unref(selectedOrder).payment?.status === "paid" ? "Lunas" : unref(selectedOrder).payment?.status === "pending" ? "Menunggu" : unref(selectedOrder).payment?.status ?? "Manual")}</span></div>`);
          if (unref(selectedOrder).payment?.paidAt) {
            _push(`<div class="flex gap-2"><span class="text-gray-400 w-20 shrink-0">Dibayar</span><span class="text-gray-700">${ssrInterpolate(formatDateTime(unref(selectedOrder).payment.paidAt))}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (unref(selectedOrder).notifyCount > 0) {
            _push(`<div class="flex gap-2"><span class="text-gray-400 w-20 shrink-0">WA Notif</span><span class="text-gray-700">${ssrInterpolate(unref(selectedOrder).notifyCount)}x · terakhir ${ssrInterpolate(formatDateTime(unref(selectedOrder).lastNotifiedAt))}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (unref(selectedOrder).paymentProof) {
            _push(`<a${ssrRenderAttr("href", unref(selectedOrder).paymentProof)} target="_blank" class="mt-3 block"><img${ssrRenderAttr("src", unref(selectedOrder).paymentProof)} alt="Bukti Transfer" class="rounded-xl border border-gray-100 max-h-40 object-contain"><p class="text-xs text-brand-600 mt-1">Lihat bukti transfer →</p></a>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
          if (unref(selectedOrder).status !== "CANCELLED" && unref(selectedOrder).status !== "REFUNDED") {
            _push(`<div class="shrink-0 border-t border-gray-100 px-5 py-4 flex flex-wrap gap-2"><button class="btn-secondary text-xs px-3 py-2"${ssrIncludeBooleanAttr(unref(notifying) === unref(selectedOrder).id) ? " disabled" : ""}>`);
            if (unref(notifying) === unref(selectedOrder).id) {
              _push(`<span class="inline-block h-3 w-3 rounded-full border border-gray-400 border-t-transparent animate-spin"></span>`);
            } else {
              _push(`<span>Kirim WA</span>`);
            }
            _push(`</button>`);
            if (unref(selectedOrder).status === "PENDING_PAYMENT") {
              _push(`<button class="btn-primary text-xs px-3 py-2">Upload Bukti</button>`);
            } else {
              _push(`<!---->`);
            }
            if (unref(selectedOrder).status === "PAID" || unref(selectedOrder).status === "IN_PRODUCTION" || unref(selectedOrder).status === "READY_TO_SHIP") {
              _push(`<button class="btn-secondary text-xs px-3 py-2">${ssrInterpolate(unref(selectedOrder).shipment?.trackingNo ? "Edit Resi" : "Input Resi")}</button>`);
            } else {
              _push(`<!---->`);
            }
            if (unref(selectedOrder).status === "PENDING_PAYMENT") {
              _push(`<button class="text-xs px-3 py-2 rounded-lg border border-error-200 text-error-600 hover:bg-error-50 transition-colors"${ssrIncludeBooleanAttr(unref(cancelling) === unref(selectedOrder).id) ? " disabled" : ""}>`);
              if (unref(cancelling) === unref(selectedOrder).id) {
                _push(`<span class="inline-block h-3 w-3 rounded-full border border-error-400 border-t-transparent animate-spin"></span>`);
              } else {
                _push(`<span>Batalkan</span>`);
              }
              _push(`</button>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<select class="text-xs px-2 py-2 rounded-lg border border-gray-200 bg-white ml-auto"><!--[-->`);
            ssrRenderList(allowedOrderStatuses, (s) => {
              _push(`<option${ssrRenderAttr("value", s)}${ssrIncludeBooleanAttr(Array.isArray(unref(selectedOrder).status) ? ssrLooseContain(unref(selectedOrder).status, s) : ssrLooseEqual(unref(selectedOrder).status, s)) ? " selected" : ""}>${ssrInterpolate(orderStatusText(s))}</option>`);
            });
            _push(`<!--]--></select></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(shipmentModal).open) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"><div class="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4"><h3 class="font-bold text-gray-900">Input Nomor Resi</h3><div><label class="block text-xs font-medium text-gray-700 mb-1">Kurir</label><select class="input-field"><option value="jne"${ssrIncludeBooleanAttr(Array.isArray(unref(shipmentModal).courier) ? ssrLooseContain(unref(shipmentModal).courier, "jne") : ssrLooseEqual(unref(shipmentModal).courier, "jne")) ? " selected" : ""}>JNE</option><option value="jnt"${ssrIncludeBooleanAttr(Array.isArray(unref(shipmentModal).courier) ? ssrLooseContain(unref(shipmentModal).courier, "jnt") : ssrLooseEqual(unref(shipmentModal).courier, "jnt")) ? " selected" : ""}>J&amp;T</option><option value="sicepat"${ssrIncludeBooleanAttr(Array.isArray(unref(shipmentModal).courier) ? ssrLooseContain(unref(shipmentModal).courier, "sicepat") : ssrLooseEqual(unref(shipmentModal).courier, "sicepat")) ? " selected" : ""}>SiCepat</option><option value="pos"${ssrIncludeBooleanAttr(Array.isArray(unref(shipmentModal).courier) ? ssrLooseContain(unref(shipmentModal).courier, "pos") : ssrLooseEqual(unref(shipmentModal).courier, "pos")) ? " selected" : ""}>POS</option><option value="tiki"${ssrIncludeBooleanAttr(Array.isArray(unref(shipmentModal).courier) ? ssrLooseContain(unref(shipmentModal).courier, "tiki") : ssrLooseEqual(unref(shipmentModal).courier, "tiki")) ? " selected" : ""}>TIKI</option><option value="anteraja"${ssrIncludeBooleanAttr(Array.isArray(unref(shipmentModal).courier) ? ssrLooseContain(unref(shipmentModal).courier, "anteraja") : ssrLooseEqual(unref(shipmentModal).courier, "anteraja")) ? " selected" : ""}>AnterAja</option></select></div><div><label class="block text-xs font-medium text-gray-700 mb-1">Nomor Resi</label><input${ssrRenderAttr("value", unref(shipmentModal).trackingNo)} type="text" placeholder="Masukkan nomor resi" class="input-field"></div><div class="flex gap-2 pt-2"><button class="flex-1 btn-secondary text-sm">Batal</button><button class="flex-1 btn-primary text-sm"${ssrIncludeBooleanAttr(unref(shipmentModal).saving) ? " disabled" : ""}>`);
        if (unref(shipmentModal).saving) {
          _push(`<span class="inline-block h-3.5 w-3.5 rounded-full border-2 border-black/30 border-t-black animate-spin mr-1"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` Simpan &amp; Kirim WA </button></div></div></div>`);
      } else if (unref(activeTab) === "products") {
        _push(`<div><div class="flex items-center justify-between mb-4"><h2 class="text-lg font-bold text-gray-900">Manajemen Produk</h2><button class="btn-primary">+ Tambah Produk</button></div><div class="flex flex-col sm:flex-row gap-2 mb-4"><div class="relative flex-1"><input${ssrRenderAttr("value", unref(productSearch))} type="text" placeholder="Cari nama produk..." class="input-field"></div><div class="flex gap-2 overflow-x-auto pb-0.5"><!--[-->`);
        ssrRenderList(productStatusFilters, (f) => {
          _push(`<button class="${ssrRenderClass([unref(productStatusFilter) === f.value ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400", "px-3 py-2 rounded-lg text-xs font-semibold border transition-colors"])}">${ssrInterpolate(f.label)} <span class="${ssrRenderClass([unref(productStatusFilter) === f.value ? "bg-white/20" : "bg-gray-100", "ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold"])}">${ssrInterpolate(unref(productStatusCounts)[f.value] ?? 0)}</span></button>`);
        });
        _push(`<!--]--></div></div>`);
        if (!unref(products)?.length) {
          _push(`<div class="card p-12 text-center text-gray-400"> Belum ada produk </div>`);
        } else if (!unref(filteredProducts).length) {
          _push(`<div class="card p-12 text-center text-gray-400"> Tidak ada produk yang cocok </div>`);
        } else {
          _push(`<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"><!--[-->`);
          ssrRenderList(unref(filteredProducts), (product) => {
            _push(`<div class="card overflow-hidden"><div class="relative aspect-square bg-gray-100 overflow-hidden"><img${ssrRenderAttr("src", product.imageUrl)}${ssrRenderAttr("alt", product.title)} class="w-full h-full object-cover"><span class="${ssrRenderClass([product.status === "AVAILABLE" ? "bg-brand-400 text-black" : "bg-gray-600 text-white", "absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full"])}">${ssrInterpolate(product.status === "AVAILABLE" ? "Tersedia" : "Sold Out")}</span></div><div class="p-3"><p class="font-semibold text-sm text-gray-900 line-clamp-2 leading-tight">${ssrInterpolate(product.title)}</p><p class="text-brand-600 font-bold text-sm mt-0.5">Rp ${ssrInterpolate(formatPrice(product.price))}</p><div class="mt-1.5">`);
            if (product.sessionId) {
              _push(`<span class="inline-block text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium truncate max-w-full">${ssrInterpolate(sessionLabel(product.sessionId))}</span>`);
            } else {
              _push(`<span class="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400"> Belum ke sesi </span>`);
            }
            _push(`</div><div class="mt-2 flex flex-wrap gap-1">`);
            if (product.variants?.length) {
              _push(`<!--[-->`);
              ssrRenderList(product.variants, (v) => {
                _push(`<span class="${ssrRenderClass([v.stock > 0 ? "bg-brand-50 text-brand-700" : "bg-gray-100 text-gray-400", "text-[10px] font-bold px-1.5 py-0.5 rounded-md"])}">${ssrInterpolate(v.size)}:${ssrInterpolate(v.stock)}</span>`);
              });
              _push(`<!--]-->`);
            } else {
              _push(`<span class="text-[10px] text-gray-400">Belum ada varian</span>`);
            }
            _push(`</div><div class="flex gap-2 mt-3"><button class="btn-secondary text-xs flex-1 py-1.5">Edit</button><button class="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-error-50 text-error-600 border border-error-100 hover:bg-red-100 transition-colors"${ssrIncludeBooleanAttr(unref(deletingProduct) === product.id) ? " disabled" : ""}>`);
            if (unref(deletingProduct) === product.id) {
              _push(`<span class="inline-block h-3 w-3 rounded-full border border-error-600/40 border-t-error-600 animate-spin"></span>`);
            } else {
              _push(`<span>Hapus</span>`);
            }
            _push(`</button></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div>`);
      } else if (unref(activeTab) === "categories") {
        _push(`<div><div class="flex items-center justify-between mb-4"><h2 class="text-lg font-bold text-gray-900">Manajemen Kategori</h2></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="card p-5"><h3 class="text-sm font-bold text-gray-900 mb-3">Tambah Kategori</h3><form class="flex gap-2"><input${ssrRenderAttr("value", unref(newCategoryName))} type="text" placeholder="Nama kategori (misal: Gamis)" class="input-field flex-1" required><button type="submit" class="btn-primary shrink-0"${ssrIncludeBooleanAttr(unref(addingCategory)) ? " disabled" : ""}>`);
        if (unref(addingCategory)) {
          _push(`<span class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>`);
        } else {
          _push(`<span>Tambah</span>`);
        }
        _push(`</button></form></div><div class="card p-4 space-y-2">`);
        if (!unref(categories)?.length) {
          _push(`<p class="text-sm text-gray-400 text-center py-4">Belum ada kategori</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(categories), (cat) => {
          _push(`<div class="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"><div><p class="text-sm font-semibold text-gray-900">${ssrInterpolate(cat.name)}</p><p class="text-xs text-gray-400">${ssrInterpolate(cat._count?.products ?? 0)} produk · /${ssrInterpolate(cat.slug)}</p></div><button class="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded"${ssrIncludeBooleanAttr(unref(deletingCategory) === cat.id) ? " disabled" : ""}>`);
          if (unref(deletingCategory) === cat.id) {
            _push(`<span class="inline-block h-3 w-3 rounded-full border border-red-400 border-t-transparent animate-spin"></span>`);
          } else {
            _push(`<span>Hapus</span>`);
          }
          _push(`</button></div>`);
        });
        _push(`<!--]--></div></div></div>`);
      } else if (unref(activeTab) === "chat") {
        _push(`<div class="flex gap-4" style="${ssrRenderStyle({ "height": "600px" })}"><div class="w-64 flex-shrink-0 border rounded-xl overflow-y-auto" style="${ssrRenderStyle({ "border-color": "var(--border)" })}"><div class="p-3 border-b font-semibold text-sm" style="${ssrRenderStyle({ "border-color": "var(--border)" })}">Percakapan</div>`);
        if (unref(chatLoading)) {
          _push(`<div class="p-4 text-sm text-center" style="${ssrRenderStyle({ "color": "var(--muted-foreground)" })}">Memuat...</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(chatSessions), (sess) => {
          _push(`<div class="p-3 border-b cursor-pointer transition-colors" style="${ssrRenderStyle([unref(activeChatSession)?.id === sess.id ? "background: var(--muted)" : "", { "border-color": "var(--border)" }])}"><div class="flex justify-between items-start gap-1"><p class="text-sm font-medium truncate">${ssrInterpolate(sess.buyerName)}</p>`);
          if (!sess.isRead) {
            _push(`<span class="w-2 h-2 rounded-full flex-shrink-0 mt-1" style="${ssrRenderStyle({ "background": "var(--brand-400)" })}"></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><p class="text-xs truncate mt-0.5" style="${ssrRenderStyle({ "color": "var(--muted-foreground)" })}">${ssrInterpolate(sess.messages?.[0]?.body || "Belum ada pesan")}</p></div>`);
        });
        _push(`<!--]--></div><div class="flex-1 border rounded-xl flex flex-col overflow-hidden" style="${ssrRenderStyle({ "border-color": "var(--border)" })}">`);
        if (!unref(activeChatSession)) {
          _push(`<div class="flex-1 flex items-center justify-center text-sm" style="${ssrRenderStyle({ "color": "var(--muted-foreground)" })}">Pilih percakapan</div>`);
        } else {
          _push(`<!--[--><div class="p-3 border-b flex items-center justify-between" style="${ssrRenderStyle({ "border-color": "var(--border)" })}"><div><p class="font-semibold text-sm">${ssrInterpolate(unref(activeChatSession).buyerName)}</p><p class="text-xs" style="${ssrRenderStyle({ "color": "var(--muted-foreground)" })}">${ssrInterpolate(unref(activeChatSession).buyerPhone)}</p></div></div><div class="flex-1 overflow-y-auto p-4 space-y-2"><!--[-->`);
          ssrRenderList(unref(activeChatMessages), (msg) => {
            _push(`<div class="${ssrRenderClass([msg.sender === "admin" ? "justify-end" : "justify-start", "flex"])}"><div class="max-w-xs rounded-2xl px-3 py-2 text-sm" style="${ssrRenderStyle(msg.sender === "admin" ? "background:#090b0c;color:white;border-bottom-right-radius:4px" : "background:rgba(9,11,12,0.08);color:#090b0c;border-bottom-left-radius:4px")}">${ssrInterpolate(msg.body)} <p class="text-xs mt-0.5 opacity-60">${ssrInterpolate(new Date(msg.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }))}</p></div></div>`);
          });
          _push(`<!--]--></div><div class="p-3 border-t flex gap-2" style="${ssrRenderStyle({ "border-color": "var(--border)" })}"><input${ssrRenderAttr("value", unref(adminReply))} type="text" placeholder="Balas..." class="input-field flex-1"><button class="btn-primary text-sm px-4">Kirim</button></div><!--]-->`);
        }
        _push(`</div></div>`);
      } else if (unref(activeTab) === "config") {
        _push(`<div class="space-y-6"><div class="card p-6"><div class="mb-4"><h2 class="text-base font-bold text-gray-900">Tambah Sesi Flash Sale</h2></div><form class="space-y-4"><div class="grid grid-cols-1 sm:grid-cols-3 gap-3"><div><label class="label-text">Judul Sesi</label><input${ssrRenderAttr("value", unref(configForm).title)} type="text" placeholder="Flash Sale Pagi" class="input-field"></div><div><label class="label-text">Waktu Mulai <span class="text-error-600">*</span></label><input${ssrRenderAttr("value", unref(configForm).startTime)} type="datetime-local" class="input-field" required></div><div><label class="label-text">Waktu Selesai <span class="text-error-600">*</span></label><input${ssrRenderAttr("value", unref(configForm).endTime)} type="datetime-local" class="input-field" required></div></div><div><button type="submit" class="btn-primary"${ssrIncludeBooleanAttr(unref(savingConfig)) ? " disabled" : ""}>`);
        if (unref(savingConfig)) {
          _push(`<span class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>`);
        } else {
          _push(`<span>+ Tambah Sesi</span>`);
        }
        _push(`</button></div></form></div><div class="card p-6"><div class="flex items-center justify-between mb-4"><h2 class="text-base font-bold text-gray-900">Jadwal Sesi</h2><button class="btn-secondary text-sm"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"></path><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"></path></svg> Refresh </button></div>`);
        if (unref(sessionsLoading)) {
          _push(`<div class="flex justify-center py-12"><div class="animate-spin h-6 w-6 rounded-full border-2 border-brand-400 border-t-transparent"></div></div>`);
        } else if (!unref(sessions)?.length) {
          _push(`<div class="card p-8 text-center text-gray-400"> Belum ada sesi terjadwal </div>`);
        } else {
          _push(`<div class="space-y-3"><!--[-->`);
          ssrRenderList(unref(sessionsSorted), (session) => {
            _push(`<div class="${ssrRenderClass([sessionStatus(session) === "active" ? "border-brand-400 bg-brand-25" : "", "card p-4 flex items-center gap-4"])}"><div class="shrink-0"><span class="${ssrRenderClass([{
              "bg-brand-400": sessionStatus(session) === "active",
              "bg-gray-300": sessionStatus(session) === "upcoming" && !session.isActive,
              "bg-gray-200": sessionStatus(session) === "ended",
              "bg-blue-400": sessionStatus(session) === "upcoming" && session.isActive
            }, "inline-block w-2.5 h-2.5 rounded-full"])}"></span></div><div class="flex-1 min-w-0"><p class="font-semibold text-gray-900 text-sm">${ssrInterpolate(session.title)}</p><p class="text-xs text-gray-500 mt-0.5">${ssrInterpolate(formatDateTime(session.startTime))} – ${ssrInterpolate(formatDateTime(session.endTime))}</p><div class="flex items-center gap-2 mt-1 flex-wrap"><span class="${ssrRenderClass([{
              "bg-brand-50 text-brand-700": sessionStatus(session) === "active",
              "bg-blue-50 text-blue-700": sessionStatus(session) === "upcoming" && session.isActive,
              "bg-gray-100 text-gray-500": sessionStatus(session) === "upcoming" && !session.isActive,
              "bg-gray-100 text-gray-400": sessionStatus(session) === "ended"
            }, "text-xs font-semibold px-2 py-0.5 rounded-full"])}">${ssrInterpolate(sessionStatus(session) === "active" ? "🟢 Sedang Berjalan" : sessionStatus(session) === "ended" ? "Selesai" : session.isActive ? "🔵 Terjadwal" : "⚪ Nonaktif")}</span><span class="text-xs text-gray-400">${ssrInterpolate(session._count?.products ?? 0)} produk </span></div></div><div class="flex items-center gap-2 shrink-0">`);
            if (sessionStatus(session) !== "ended") {
              _push(`<button class="${ssrRenderClass([session.isActive ? "border-gray-200 bg-white text-gray-600 hover:bg-gray-50" : "border-brand-300 bg-brand-50 text-brand-700 hover:bg-brand-100", "text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-colors"])}"${ssrIncludeBooleanAttr(unref(togglingSession) === session.id) ? " disabled" : ""}>`);
              if (unref(togglingSession) === session.id) {
                _push(`<span class="inline-block h-3 w-3 rounded-full border border-gray-400 border-t-transparent animate-spin"></span>`);
              } else {
                _push(`<span>${ssrInterpolate(session.isActive ? "Nonaktifkan" : "Aktifkan")}</span>`);
              }
              _push(`</button>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<button class="text-xs px-2.5 py-1.5 rounded-lg border border-error-100 bg-error-50 text-error-600 font-semibold hover:bg-red-100 transition-colors"${ssrIncludeBooleanAttr(unref(deletingSession) === session.id) ? " disabled" : ""}>`);
            if (unref(deletingSession) === session.id) {
              _push(`<span class="inline-block h-3 w-3 rounded-full border border-error-600/40 border-t-error-600 animate-spin"></span>`);
            } else {
              _push(`<span>Hapus</span>`);
            }
            _push(`</button></div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "settings") {
        _push(`<div class="space-y-6"><div class="card p-6 space-y-5"><div><h2 class="text-base font-bold text-gray-900">Pengaturan Ongkir</h2><p class="text-xs text-gray-400 mt-0.5">Kota/kecamatan asal pengiriman untuk kalkulasi ongkos kirim.</p></div>`);
        if (unref(originCityLabel)) {
          _push(`<div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-50 border border-brand-200"><svg class="w-4 h-4 text-brand-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg><span class="text-sm font-medium text-brand-800">${ssrInterpolate(unref(originCityLabel))}</span></div>`);
        } else {
          _push(`<div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200"><svg class="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"></path></svg><span class="text-sm text-amber-700">Belum diatur — menggunakan default dari environment.</span></div>`);
        }
        _push(`<div class="space-y-2"><label class="label-text block">Cari Kecamatan / Kota Asal</label><div class="relative"><input${ssrRenderAttr("value", unref(originSearch))} type="text" placeholder="Ketik nama kecamatan, kota, atau provinsi..." class="input-field w-full">`);
        if (unref(originCities).length) {
          _push(`<div class="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-gray-200 shadow-lg max-h-56 overflow-y-auto" style="${ssrRenderStyle({ "border-radius": "0.75rem" })}"><!--[-->`);
          ssrRenderList(unref(originCities), (city) => {
            _push(`<button class="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"><span class="font-medium text-gray-800">${ssrInterpolate(city.label)}</span></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (unref(originSelected)) {
          _push(`<div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200"><svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4"></path><circle cx="12" cy="12" r="10"></circle></svg><span class="text-sm text-gray-700">Dipilih: <strong>${ssrInterpolate(unref(originSelected).label)}</strong></span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex items-center gap-3"><button class="btn-primary"${ssrIncludeBooleanAttr(!unref(originSelected) || unref(originSaving)) ? " disabled" : ""}>`);
        if (unref(originSaving)) {
          _push(`<span class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>`);
        } else {
          _push(`<span>Simpan Kota Asal</span>`);
        }
        _push(`</button>`);
        if (unref(originSaved)) {
          _push(`<span class="text-sm text-green-600 font-medium">Tersimpan ✓</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="card p-6 space-y-6"><div><h2 class="text-base font-bold text-gray-900">Pengaturan Pembayaran</h2><p class="text-xs text-gray-400 mt-0.5">Atur metode pembayaran yang tampil di halaman checkout.</p></div><div class="flex items-center justify-between gap-4 p-4 rounded-xl border" style="${ssrRenderStyle({ "border-color": "var(--border)" })}"><div><p class="text-sm font-medium text-gray-800">Payment Gateway (Duitku)</p><p class="text-xs text-gray-400 mt-0.5">Virtual Account, E-Wallet, dll. Butuh konfigurasi Duitku di environment.</p></div><button class="relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none" style="${ssrRenderStyle(unref(paymentGatewayEnabled) ? "background:#090b0c" : "background:#e5e7eb")}"><span class="inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5" style="${ssrRenderStyle(unref(paymentGatewayEnabled) ? "translate:1.25rem" : "translate:0.125rem")}"></span></button></div><div class="space-y-3"><div class="flex items-center justify-between"><p class="text-sm font-medium text-gray-800">Rekening Bank Manual</p><button class="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.06)", "color": "#090b0c" })}">+ Tambah Rekening</button></div>`);
        if (!unref(bankAccounts).length) {
          _push(`<div class="text-xs text-gray-400 py-3 text-center border border-dashed rounded-xl" style="${ssrRenderStyle({ "border-color": "var(--border)" })}"> Belum ada rekening. Klik &quot;+ Tambah Rekening&quot; untuk menambahkan. </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(bankAccounts), (acc, idx) => {
          _push(`<div class="flex gap-3 items-start p-4 rounded-xl border" style="${ssrRenderStyle({ "border-color": "var(--border)" })}"><div class="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2"><div><label class="label-text text-xs">Nama Bank</label><input${ssrRenderAttr("value", acc.bank)} type="text" placeholder="BCA, Mandiri, BRI…" class="input-field mt-1"></div><div><label class="label-text text-xs">Atas Nama</label><input${ssrRenderAttr("value", acc.accountName)} type="text" placeholder="Nama pemilik rekening" class="input-field mt-1"></div><div><label class="label-text text-xs">Nomor Rekening</label><input${ssrRenderAttr("value", acc.accountNumber)} type="text" placeholder="1234567890" class="input-field mt-1"></div></div><button class="mt-6 p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0" title="Hapus rekening"><svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div>`);
        });
        _push(`<!--]--></div><div class="flex items-center gap-3"><button class="btn-primary"${ssrIncludeBooleanAttr(unref(paymentSaving)) ? " disabled" : ""}>`);
        if (unref(paymentSaving)) {
          _push(`<span class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>`);
        } else {
          _push(`<span>Simpan Pengaturan Pembayaran</span>`);
        }
        _push(`</button>`);
        if (unref(paymentSaved)) {
          _push(`<span class="text-sm text-green-600 font-medium">Tersimpan ✓</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="card p-6 space-y-6"><h2 class="text-base font-bold text-gray-900">Template Pesan WA</h2><div class="space-y-2"><label class="label-text block">Pesan Satu Produk</label><div class="flex flex-wrap gap-1.5"><!--[-->`);
        ssrRenderList(["{{name}}", "{{product}}", "{{price}}", "{{bank_info}}"], (p) => {
          _push(`<code class="bg-brand-50 text-brand-700 border border-brand-200 px-1.5 py-0.5 rounded text-xs cursor-pointer hover:bg-brand-100 select-none">${ssrInterpolate(p)}</code>`);
        });
        _push(`<!--]--></div><textarea rows="9" class="input-field font-mono text-xs w-full">${ssrInterpolate(unref(waSingle))}</textarea></div><div class="space-y-2"><label class="label-text block">Pesan Bulk (banyak produk, satu nomor)</label><div class="flex flex-wrap gap-1.5"><!--[-->`);
        ssrRenderList(["{{name}}", "{{items}}", "{{total}}", "{{bank_info}}"], (p) => {
          _push(`<code class="bg-brand-50 text-brand-700 border border-brand-200 px-1.5 py-0.5 rounded text-xs cursor-pointer hover:bg-brand-100 select-none">${ssrInterpolate(p)}</code>`);
        });
        _push(`<!--]--></div><textarea rows="11" class="input-field font-mono text-xs w-full">${ssrInterpolate(unref(waBulk))}</textarea></div><div class="flex items-center gap-3"><button class="btn-primary"${ssrIncludeBooleanAttr(unref(waTemplateSaving)) ? " disabled" : ""}>`);
        if (unref(waTemplateSaving)) {
          _push(`<span class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>`);
        } else {
          _push(`<span>Simpan Template</span>`);
        }
        _push(`</button>`);
        if (unref(waTemplateSaved)) {
          _push(`<span class="text-sm text-green-600 font-medium">Tersimpan</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="card p-6 space-y-5"><h2 class="text-base font-bold text-gray-900">Kelola Admin</h2><div class="divide-y divide-gray-100"><!--[-->`);
        ssrRenderList(unref(adminList), (a) => {
          _push(`<div class="flex items-center justify-between py-3"><div><p class="text-sm font-medium text-gray-800">${ssrInterpolate(a.username)}</p><p class="text-xs text-gray-400">Dibuat ${ssrInterpolate(formatDateTime(a.createdAt))}</p></div><button class="text-xs text-red-500 hover:text-red-700 disabled:opacity-40"${ssrIncludeBooleanAttr(unref(deletingAdminId) === a.id) ? " disabled" : ""}>`);
          if (unref(deletingAdminId) === a.id) {
            _push(`<span class="inline-block h-3 w-3 rounded-full border-2 border-red-300 border-t-red-500 animate-spin"></span>`);
          } else {
            _push(`<span>Hapus</span>`);
          }
          _push(`</button></div>`);
        });
        _push(`<!--]--></div><div class="border-t pt-4 space-y-3"><p class="text-sm font-semibold text-gray-700">Tambah Admin Baru</p><div class="space-y-2"><div><label class="block text-xs text-gray-500 mb-1">Username</label><input${ssrRenderAttr("value", unref(adminForm).username)} type="text" placeholder="Masukkan username" class="input-field w-full"></div><div><label class="block text-xs text-gray-500 mb-1">Password</label><input${ssrRenderAttr("value", unref(adminForm).password)} type="password" placeholder="Min. 6 karakter" class="input-field w-full"></div></div><button class="btn-primary w-full"${ssrIncludeBooleanAttr(unref(addingAdmin) || !unref(adminForm).username || !unref(adminForm).password) ? " disabled" : ""}>`);
        if (unref(addingAdmin)) {
          _push(`<span class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>`);
        } else {
          _push(`<span>Tambah Admin</span>`);
        }
        _push(`</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(showProductModal)) {
        _push(`<div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 py-6 overflow-y-auto"><div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div><div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"><h2 class="text-lg font-bold text-gray-900 mb-4">${ssrInterpolate(unref(editingProduct) ? "Edit Produk" : "Tambah Produk")}</h2><form class="space-y-4"><div class="grid grid-cols-2 gap-3"><div class="col-span-2"><label class="label-text">Nama Produk <span class="text-error-600">*</span></label><input${ssrRenderAttr("value", unref(productForm).title)} type="text" placeholder="Gamis Kaftan Premium" class="input-field" required></div><div><label class="label-text">Harga (Rp) <span class="text-error-600">*</span></label><input${ssrRenderAttr("value", unref(productForm).price)} type="number" placeholder="350000" class="input-field" required></div><div><label class="label-text">Harga Asli (Rp) <span class="text-xs text-gray-400 font-normal">— opsional, untuk harga coret</span></label><input${ssrRenderAttr("value", unref(productForm).originalPrice)} type="number" placeholder="500000" class="input-field"></div><div><label class="label-text">Berat (gram)</label><input${ssrRenderAttr("value", unref(productForm).weight)} type="number" placeholder="500" class="input-field"></div></div><div class="grid grid-cols-2 gap-3"><div><label class="label-text">Kategori</label><select class="input-field"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(productForm).categoryId) ? ssrLooseContain(unref(productForm).categoryId, "") : ssrLooseEqual(unref(productForm).categoryId, "")) ? " selected" : ""}>— Pilih Kategori —</option><!--[-->`);
        ssrRenderList(unref(categories), (cat) => {
          _push(`<option${ssrRenderAttr("value", cat.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(productForm).categoryId) ? ssrLooseContain(unref(productForm).categoryId, cat.id) : ssrLooseEqual(unref(productForm).categoryId, cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.name)}</option>`);
        });
        _push(`<!--]--></select></div><div><label class="label-text">Tipe Produk</label><select class="input-field"><option value="REGULAR"${ssrIncludeBooleanAttr(Array.isArray(unref(productForm).productType) ? ssrLooseContain(unref(productForm).productType, "REGULAR") : ssrLooseEqual(unref(productForm).productType, "REGULAR")) ? " selected" : ""}>Reguler</option><option value="PRE_ORDER"${ssrIncludeBooleanAttr(Array.isArray(unref(productForm).productType) ? ssrLooseContain(unref(productForm).productType, "PRE_ORDER") : ssrLooseEqual(unref(productForm).productType, "PRE_ORDER")) ? " selected" : ""}>Pre-Order</option></select></div></div>`);
        if (unref(productForm).productType === "PRE_ORDER") {
          _push(`<div><label class="label-text">Estimasi Selesai Produksi</label><input${ssrRenderAttr("value", unref(productForm).estimatedReadyDate)} type="date" class="input-field"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid grid-cols-2 gap-3"><div><label class="label-text">Bahan</label><input${ssrRenderAttr("value", unref(productForm).material)} type="text" placeholder="Ceruti, Wolfis, dll." class="input-field"></div><div><label class="label-text">Daftarkan ke Flash Sale</label><select class="input-field"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(productForm).sessionId) ? ssrLooseContain(unref(productForm).sessionId, "") : ssrLooseEqual(unref(productForm).sessionId, "")) ? " selected" : ""}>— Tidak —</option><!--[-->`);
        ssrRenderList(unref(sessions), (s) => {
          _push(`<option${ssrRenderAttr("value", s.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(productForm).sessionId) ? ssrLooseContain(unref(productForm).sessionId, s.id) : ssrLooseEqual(unref(productForm).sessionId, s.id)) ? " selected" : ""}>${ssrInterpolate(s.title)}</option>`);
        });
        _push(`<!--]--></select></div></div><div><label class="label-text">Deskripsi</label><textarea rows="2" placeholder="Deskripsi produk (opsional)" class="input-field resize-none">${ssrInterpolate(unref(productForm).description)}</textarea></div><div><label class="label-text mb-2 block">Stok per Ukuran</label><div class="grid grid-cols-3 sm:grid-cols-4 gap-2"><!--[-->`);
        ssrRenderList(unref(productForm).variants, (v) => {
          _push(`<div class="${ssrRenderClass([v.stock > 0 ? "border-brand-400 bg-brand-50" : "border-gray-200", "border rounded-xl p-2.5 text-center"])}"><p class="text-xs font-bold text-gray-700 mb-1">${ssrInterpolate(v.size)}</p><input${ssrRenderAttr("value", v.stock)} type="number" min="0" class="${ssrRenderClass([v.stock > 0 ? "border-brand-300 bg-white text-brand-700" : "border-gray-200 text-gray-400", "w-full text-center text-sm font-semibold border rounded-lg px-1 py-1 focus:outline-none focus:border-brand-400"])}"></div>`);
        });
        _push(`<!--]--></div><p class="text-xs text-gray-400 mt-1.5">Pre-Order: semua ukuran otomatis tersedia tanpa stok minimum.</p></div><div><label class="label-text">${ssrInterpolate(unref(editingProduct) ? "Foto Utama (kosongkan jika tidak diubah)" : "Foto Utama *")}</label><input type="file" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"></div><div><label class="label-text">Foto Tambahan (bisa pilih beberapa)</label><input type="file" accept="image/*" multiple class="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer">`);
        if (unref(extraFiles).length) {
          _push(`<p class="text-xs text-gray-400 mt-1">${ssrInterpolate(unref(extraFiles).length)} foto dipilih</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex gap-3 pt-2"><button type="button" class="btn-secondary-full">Batal</button><button type="submit" class="btn-primary-full"${ssrIncludeBooleanAttr(unref(savingProduct)) ? " disabled" : ""}>`);
        if (unref(savingProduct)) {
          _push(`<span class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>`);
        } else {
          _push(`<span>Simpan</span>`);
        }
        _push(`</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showProofModal)) {
        _push(`<div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 py-6"><div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div><div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"><h2 class="text-lg font-bold text-gray-900 mb-1">Upload Bukti Transfer</h2><p class="text-sm text-gray-500 mb-4">Status pesanan akan otomatis berubah menjadi <strong>Lunas</strong></p><div class="space-y-4"><div><label class="label-text">File Bukti Transfer</label><input type="file" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"></div><div class="flex gap-3 pt-2"><button class="btn-secondary-full">Batal</button><button class="btn-primary-full"${ssrIncludeBooleanAttr(unref(uploadingProof)) ? " disabled" : ""}>`);
        if (unref(uploadingProof)) {
          _push(`<span class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>`);
        } else {
          _push(`<span>Konfirmasi Lunas</span>`);
        }
        _push(`</button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showOfflineOrderModal)) {
        _push(`<div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 py-6"><div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div><div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"><h2 class="text-lg font-bold text-gray-900 mb-4">Pesanan Offline</h2><form class="space-y-4"><div><label class="label-text">Produk <span class="text-error-600">*</span></label><select class="input-field" required><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(offlineOrderForm).productId) ? ssrLooseContain(unref(offlineOrderForm).productId, "") : ssrLooseEqual(unref(offlineOrderForm).productId, "")) ? " selected" : ""}>— Pilih produk tersedia —</option><!--[-->`);
        ssrRenderList(unref(availableProducts), (p) => {
          _push(`<option${ssrRenderAttr("value", p.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(offlineOrderForm).productId) ? ssrLooseContain(unref(offlineOrderForm).productId, p.id) : ssrLooseEqual(unref(offlineOrderForm).productId, p.id)) ? " selected" : ""}>${ssrInterpolate(p.title)} · Rp ${ssrInterpolate(formatPrice(p.price))}</option>`);
        });
        _push(`<!--]--></select>`);
        if (!unref(availableProducts).length) {
          _push(`<p class="text-xs text-amber-600 mt-1"> Tidak ada produk tersedia. Tambah produk di tab Produk terlebih dahulu. </p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><label class="label-text">Nama Pembeli <span class="text-error-600">*</span></label><input${ssrRenderAttr("value", unref(offlineOrderForm).buyerName)} type="text" placeholder="Nama lengkap pembeli" class="input-field" required></div><div><label class="label-text">Nomor HP <span class="text-error-600">*</span></label><input${ssrRenderAttr("value", unref(offlineOrderForm).buyerPhone)} type="tel" placeholder="08xxxxxxxxxx" class="input-field" required></div><div><label class="label-text">Status Pembayaran</label><div class="flex gap-2 mt-1"><button type="button" class="${ssrRenderClass([unref(offlineOrderForm).paymentStatus === "PAID" ? "bg-success-50 text-success-700 border-success-500/40" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400", "flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors"])}">Sudah Bayar</button><button type="button" class="${ssrRenderClass([unref(offlineOrderForm).paymentStatus === "PENDING_PAYMENT" ? "bg-amber-50 text-amber-700 border-amber-300" : "bg-white text-gray-500 border-gray-200 hover:border-gray-400", "flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors"])}">Belum Bayar</button></div></div><div class="flex gap-3 pt-2"><button type="button" class="btn-secondary-full">Batal</button><button type="submit" class="btn-primary-full"${ssrIncludeBooleanAttr(unref(savingOfflineOrder)) ? " disabled" : ""}>`);
        if (unref(savingOfflineOrder)) {
          _push(`<span class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>`);
        } else {
          _push(`<span>Simpan Pesanan</span>`);
        }
        _push(`</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(toast).visible) {
        _push(`<div class="fixed bottom-6 left-1/2 -translate-x-0.5 z-[60] w-full max-w-sm px-4"><div class="${ssrRenderClass([unref(toast).type === "success" ? "bg-success-50 border border-success-500/30 text-success-700" : "bg-error-50 border border-error-100 text-error-600", "rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 text-sm font-medium"])}"><span>${ssrInterpolate(unref(toast).type === "success" ? "✓" : "✕")}</span><span>${ssrInterpolate(unref(toast).message)}</span></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-3buwg-sM.js.map
