import { _ as __nuxt_component_0 } from "./nuxt-link-CuTev4Jq.js";
import { defineComponent, ref, reactive, withAsyncContext, computed, mergeProps, withCtx, openBlock, createBlock, createVNode, createTextVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import "/home/yasir/Documents/Project/mints/node_modules/hookable/dist/index.mjs";
import { a as useSeoMeta, d as useRouter } from "../server.mjs";
import { u as useCart } from "./useCart-C8uxK576.js";
import { u as useAuth } from "./useAuth-CCe8xS6q.js";
import { u as useFetch } from "./fetch-CA9qG_rp.js";
import "/home/yasir/Documents/Project/mints/node_modules/ufo/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/defu/dist/defu.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/home/yasir/Documents/Project/mints/node_modules/nuxt/node_modules/unctx/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/h3/dist/index.mjs";
import "vue-router";
import "@vueuse/core";
import "tailwind-merge";
import "/home/yasir/Documents/Project/mints/node_modules/klona/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/@unhead/vue/dist/index.mjs";
import "@iconify/vue";
import "./cookie-Dh-9PoSj.js";
import "/home/yasir/Documents/Project/mints/node_modules/nuxt/node_modules/cookie-es/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/destr/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/ohash/dist/index.mjs";
import "./ssr-D-29j6RL.js";
import "@vue/shared";
import "./asyncData-BjQpEgQd.js";
import "/home/yasir/Documents/Project/mints/node_modules/perfect-debounce/dist/index.mjs";
import "./client-only-CUemHDvz.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "checkout",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useSeoMeta({ title: "Checkout — MINTS" });
    const { cartItems, itemCount, subtotal, freeShippingMin } = useCart();
    useAuth();
    useRouter();
    const steps = [
      { key: "buyer", label: "Data Pembeli" },
      { key: "address", label: "Alamat" },
      { key: "shipping", label: "Pengiriman" },
      { key: "payment", label: "Pembayaran" },
      { key: "review", label: "Review" }
    ];
    const step = ref(0);
    const form = reactive({
      buyerName: "",
      buyerPhone: "",
      address: "",
      cityId: "",
      cityName: "",
      courierCode: "jne",
      courierService: "",
      paymentMethod: ""
    });
    const citySearch = ref("");
    const cities = ref([]);
    const showCityDropdown = ref(false);
    const shippingServices = ref([]);
    const selectedService = ref(null);
    const loadingShipping = ref(false);
    const placing = ref(false);
    const orderError = ref("");
    const soldOutError = ref("");
    const couriers = ["jne", "jnt", "sicepat", "pos", "tiki"];
    const GATEWAY_METHODS = [
      { code: "VC", name: "Virtual Account BCA", description: "Transfer via Virtual Account BCA" },
      { code: "M2", name: "Virtual Account Mandiri", description: "Transfer via Virtual Account Mandiri" },
      { code: "BT", name: "Virtual Account BRI", description: "Transfer via Virtual Account BRI" },
      { code: "B1", name: "Virtual Account BNI", description: "Transfer via Virtual Account BNI" },
      { code: "OV", name: "OVO", description: "Bayar dengan OVO" },
      { code: "DA", name: "DANA", description: "Bayar dengan DANA" },
      { code: "SP", name: "ShopeePay", description: "Bayar dengan ShopeePay" },
      { code: "I1", name: "BCA KlikPay", description: "Bayar dengan BCA KlikPay" }
    ];
    const { data: paymentConfig } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/payment/settings",
      "$jelrcM7UeT"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const paymentMethods = computed(() => {
      const methods = [];
      if (paymentConfig.value?.gatewayEnabled) methods.push(...GATEWAY_METHODS);
      const banks = paymentConfig.value?.bankAccounts ?? [];
      if (banks.length) methods.push({ code: "FT", name: "Transfer Bank Manual", description: `Transfer ke rekening ${banks[0].bank}${banks.length > 1 ? ` (+${banks.length - 1} lainnya)` : ""}` });
      return methods;
    });
    const canStep0 = computed(() => form.buyerName.trim().length >= 3 && /^(08|628|\+628)\d{8,12}$/.test(form.buyerPhone));
    const canStep1 = computed(() => form.address.trim().length >= 10 && !!form.cityId);
    const canStep2 = computed(() => subtotal.value >= freeShippingMin.value || !!selectedService.value);
    const finalShippingCost = computed(() => {
      if (subtotal.value >= freeShippingMin.value) return 0;
      return selectedService.value?.cost?.[0]?.value || 0;
    });
    const shippingLabel = computed(() => {
      if (subtotal.value >= freeShippingMin.value) return "Gratis Ongkir";
      if (!selectedService.value) return "-";
      return `${form.courierCode.toUpperCase()} ${selectedService.value.service}`;
    });
    const shippingCostDisplay = computed(() => finalShippingCost.value === 0 ? "GRATIS" : formatPrice(finalShippingCost.value));
    const selectedPaymentMethodLabel = computed(() => paymentMethods.value.find((p) => p.code === form.paymentMethod)?.name || "-");
    computed(() => cartItems.value.reduce((sum, item) => sum + item.qty * 300, 0));
    function formatPrice(n) {
      return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "min-h-screen antialiased",
        style: { "background": "#f5f5f2", "color": "#090b0c", "font-family": "'Inter Tight',system-ui,sans-serif" }
      }, _attrs))}><header class="sticky top-0 z-40 px-5 py-4 md:px-12" style="${ssrRenderStyle({ "background": "rgba(245,245,242,0.88)", "backdrop-filter": "blur(12px)", "border-bottom": "1px solid rgba(9,11,12,0.06)" })}"><div class="relative flex h-10 items-center max-w-3xl mx-auto">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/cart",
        class: "flex items-center gap-2 text-sm transition-opacity hover:opacity-60",
        style: { "color": "#090b0c" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"${_scopeId}><path d="M19 12H5M12 5l-7 7 7 7"${_scopeId}></path></svg> Keranjang `);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "w-4 h-4",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "1.5"
              }, [
                createVNode("path", { d: "M19 12H5M12 5l-7 7 7 7" })
              ])),
              createTextVNode(" Keranjang ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "absolute left-1/2 -translate-x-1/2 font-black text-xl tracking-tighter",
        style: { "font-family": "'Inter Tight',sans-serif", "color": "#090b0c", "letter-spacing": "-0.04em" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`MINTS`);
          } else {
            return [
              createTextVNode("MINTS")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></header><div class="px-5 md:px-12" style="${ssrRenderStyle({ "border-bottom": "1px solid rgba(9,11,12,0.06)" })}"><div class="max-w-3xl mx-auto py-4 flex items-center gap-1 overflow-x-auto"><!--[-->`);
      ssrRenderList(steps, (s, i) => {
        _push(`<!--[--><button class="flex items-center gap-2 text-sm whitespace-nowrap transition-opacity rounded-full px-3 py-1.5" style="${ssrRenderStyle(unref(step) === i ? "background:#090b0c;color:white" : unref(step) > i ? "color:rgba(9,11,12,0.7)" : "color:rgba(9,11,12,0.3)")}"><span class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-normal shrink-0" style="${ssrRenderStyle(unref(step) >= i ? "background:rgba(255,255,255,0.25)" : "background:rgba(9,11,12,0.08)")}">${ssrInterpolate(unref(step) > i ? "✓" : i + 1)}</span> ${ssrInterpolate(s.label)}</button>`);
        if (i < steps.length - 1) {
          _push(`<div class="w-4 h-px shrink-0" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.15)" })}"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div></div><div class="mx-auto max-w-3xl px-5 py-8 md:px-12">`);
      if (!unref(cartItems).length) {
        _push(`<div class="flex flex-col items-center justify-center py-32 gap-4"><p class="text-5xl font-normal">○</p><p class="text-lg font-normal" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Keranjang kosong</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "rounded-full px-7 py-3 text-sm font-normal transition-opacity hover:opacity-85",
          style: { "background": "#090b0c", "color": "white" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Belanja Sekarang`);
            } else {
              return [
                createTextVNode("Belanja Sekarang")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!--[-->`);
        if (unref(step) === 0) {
          _push(`<div class="space-y-5"><div class="mb-8"><div class="flex items-center gap-3 mb-3"><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}"></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Langkah 1</span></div><h2 class="text-2xl font-normal tracking-tight">Data Pembeli</h2></div><div class="space-y-4"><div><label class="block text-sm font-normal mb-2" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}">Nama Lengkap</label><input${ssrRenderAttr("value", unref(form).buyerName)} type="text" placeholder="Nama penerima" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="${ssrRenderStyle({ "background": "white", "border": "1px solid rgba(9,11,12,0.12)", "color": "#090b0c" })}"></div><div><label class="block text-sm font-normal mb-2" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}">Nomor HP (WhatsApp)</label><input${ssrRenderAttr("value", unref(form).buyerPhone)} type="tel" placeholder="08xxxxxxxxxx" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="${ssrRenderStyle({ "background": "white", "border": "1px solid rgba(9,11,12,0.12)", "color": "#090b0c" })}"><p class="text-xs mt-2" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">Digunakan untuk konfirmasi pesanan via WhatsApp</p></div></div><button class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity" style="${ssrRenderStyle(unref(canStep0) ? "background:#090b0c;color:white" : "background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed")}"${ssrIncludeBooleanAttr(!unref(canStep0)) ? " disabled" : ""}>Lanjut ke Alamat</button></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(step) === 1) {
          _push(`<div class="space-y-5"><div class="mb-8"><div class="flex items-center gap-3 mb-3"><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}"></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Langkah 2</span></div><h2 class="text-2xl font-normal tracking-tight">Alamat Pengiriman</h2></div><div class="space-y-4"><div><label class="block text-sm font-normal mb-2" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}">Alamat Lengkap</label><textarea rows="3" placeholder="Jl. Contoh No. 1, RT/RW, Kelurahan, Kecamatan" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none resize-none" style="${ssrRenderStyle({ "background": "white", "border": "1px solid rgba(9,11,12,0.12)", "color": "#090b0c" })}">${ssrInterpolate(unref(form).address)}</textarea></div><div><label class="block text-sm font-normal mb-2" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}">Kota / Kabupaten</label><div class="relative"><input${ssrRenderAttr("value", unref(citySearch))} type="text" placeholder="Cari kota..." class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="${ssrRenderStyle({ "background": "white", "border": "1px solid rgba(9,11,12,0.12)", "color": "#090b0c" })}">`);
          if (unref(showCityDropdown) && unref(cities).length) {
            _push(`<div class="absolute z-10 w-full mt-2 shadow-lg max-h-56 overflow-y-auto" style="${ssrRenderStyle({ "background": "white", "border": "1px solid rgba(9,11,12,0.1)", "border-radius": "1rem" })}"><!--[-->`);
            ssrRenderList(unref(cities), (city) => {
              _push(`<button class="w-full text-left px-4 py-2.5 text-sm transition-colors" style="${ssrRenderStyle({ "color": "#090b0c" })}">${ssrInterpolate(city.label || `${city.type} ${city.city_name}, ${city.province}`)}</button>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
          if (unref(form).cityName) {
            _push(`<p class="text-xs mt-2 font-normal" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Dipilih: ${ssrInterpolate(unref(form).cityName)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><button class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity" style="${ssrRenderStyle(unref(canStep1) ? "background:#090b0c;color:white" : "background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed")}"${ssrIncludeBooleanAttr(!unref(canStep1)) ? " disabled" : ""}>Cek Ongkir</button></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(step) === 2) {
          _push(`<div class="space-y-5"><div class="mb-8"><div class="flex items-center gap-3 mb-3"><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}"></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Langkah 3</span></div><h2 class="text-2xl font-normal tracking-tight">Pilih Pengiriman</h2></div>`);
          if (unref(loadingShipping)) {
            _push(`<div class="flex items-center gap-3 py-8"><div class="w-5 h-5 rounded-full border-2 animate-spin" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.15)", "border-top-color": "#090b0c" })}"></div><p class="text-sm" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">Memuat ongkos kirim…</p></div>`);
          } else {
            _push(`<!--[-->`);
            if (unref(subtotal) >= unref(freeShippingMin)) {
              _push(`<div class="rounded-2xl p-4" style="${ssrRenderStyle({ "background": "rgba(34,197,94,0.1)", "border": "1px solid rgba(34,197,94,0.25)" })}"><p class="text-sm font-normal" style="${ssrRenderStyle({ "color": "rgb(22,163,74)" })}">Selamat! Kamu mendapat gratis ongkir ke seluruh Indonesia.</p></div>`);
            } else {
              _push(`<!--[--><div><p class="text-sm font-normal mb-3" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}">Pilih Kurir</p><div class="flex flex-wrap gap-2"><!--[-->`);
              ssrRenderList(couriers, (c) => {
                _push(`<button class="px-4 py-2 rounded-full text-sm font-normal transition-all" style="${ssrRenderStyle(unref(form).courierCode === c ? "background:#090b0c;color:white" : "background:white;color:#090b0c")}">${ssrInterpolate(c.toUpperCase())}</button>`);
              });
              _push(`<!--]--></div></div><div class="space-y-2"><!--[-->`);
              ssrRenderList(unref(shippingServices), (svc) => {
                _push(`<div class="flex items-center justify-between rounded-2xl p-4 cursor-pointer transition-all" style="${ssrRenderStyle(unref(selectedService)?.service === svc.service ? "background:#090b0c;color:white" : "background:white;color:#090b0c")}"><div><p class="text-sm font-normal">${ssrInterpolate(unref(form).courierCode.toUpperCase())} ${ssrInterpolate(svc.service)}</p><p class="text-xs mt-0.5" style="${ssrRenderStyle(unref(selectedService)?.service === svc.service ? "color:rgba(255,255,255,0.55)" : "color:rgba(9,11,12,0.4)")}">${ssrInterpolate(svc.description)} · Est. ${ssrInterpolate(svc.cost[0]?.etd || "?")} hari</p></div><p class="text-sm font-normal tabular-nums shrink-0">${ssrInterpolate(formatPrice(svc.cost[0]?.value || 0))}</p></div>`);
              });
              _push(`<!--]-->`);
              if (!unref(shippingServices).length) {
                _push(`<div class="text-center py-8 text-sm" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">Tidak ada layanan tersedia untuk rute ini</div>`);
              } else {
                _push(`<!---->`);
              }
              _push(`</div><!--]-->`);
            }
            _push(`<button class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity" style="${ssrRenderStyle(unref(canStep2) ? "background:#090b0c;color:white" : "background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed")}"${ssrIncludeBooleanAttr(!unref(canStep2)) ? " disabled" : ""}>Lanjut ke Pembayaran</button><!--]-->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(step) === 3) {
          _push(`<div class="space-y-5"><div class="mb-8"><div class="flex items-center gap-3 mb-3"><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}"></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Langkah 4</span></div><h2 class="text-2xl font-normal tracking-tight">Metode Pembayaran</h2></div><div class="space-y-2"><!--[-->`);
          ssrRenderList(unref(paymentMethods), (pm) => {
            _push(`<button class="w-full flex items-center gap-4 rounded-2xl p-4 transition-all" style="${ssrRenderStyle(unref(form).paymentMethod === pm.code ? "background:#090b0c;color:white" : "background:white;color:#090b0c")}"><span class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0" style="${ssrRenderStyle(unref(form).paymentMethod === pm.code ? "border-color:rgba(255,255,255,0.6)" : "border-color:rgba(9,11,12,0.2)")}">`);
            if (unref(form).paymentMethod === pm.code) {
              _push(`<span class="w-2 h-2 rounded-full" style="${ssrRenderStyle({ "background": "white" })}"></span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</span><div class="text-left"><p class="text-sm font-normal">${ssrInterpolate(pm.name)}</p><p class="text-xs mt-0.5" style="${ssrRenderStyle(unref(form).paymentMethod === pm.code ? "color:rgba(255,255,255,0.5)" : "color:rgba(9,11,12,0.4)")}">${ssrInterpolate(pm.description)}</p></div></button>`);
          });
          _push(`<!--]--></div><button class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity" style="${ssrRenderStyle(unref(form).paymentMethod ? "background:#090b0c;color:white" : "background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed")}"${ssrIncludeBooleanAttr(!unref(form).paymentMethod) ? " disabled" : ""}>Lanjut ke Review</button></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(step) === 4) {
          _push(`<div class="space-y-5"><div class="mb-8"><div class="flex items-center gap-3 mb-3"><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}"></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Langkah 5</span></div><h2 class="text-2xl font-normal tracking-tight">Review Pesanan</h2></div><div class="rounded-3xl overflow-hidden" style="${ssrRenderStyle({ "background": "white" })}"><div class="p-5 border-b" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.06)" })}"><p class="text-xs font-normal uppercase tracking-[0.12rem] mb-3" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">Data Pembeli</p><p class="text-sm font-normal">${ssrInterpolate(unref(form).buyerName)}</p><p class="text-sm mt-0.5" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">${ssrInterpolate(unref(form).buyerPhone)}</p></div><div class="p-5 border-b" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.06)" })}"><p class="text-xs font-normal uppercase tracking-[0.12rem] mb-3" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">Alamat Pengiriman</p><p class="text-sm font-normal">${ssrInterpolate(unref(form).address)}</p><p class="text-sm mt-1 font-normal">${ssrInterpolate(unref(form).cityName)}</p></div><div class="p-5 border-b" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.06)" })}"><p class="text-xs font-normal uppercase tracking-[0.12rem] mb-3" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">Pengiriman</p><p class="text-sm font-normal">${ssrInterpolate(unref(shippingLabel))}</p><p class="text-sm mt-0.5" style="${ssrRenderStyle(unref(finalShippingCost) === 0 ? "color:rgb(22,163,74)" : "color:rgba(9,11,12,0.5)")}">${ssrInterpolate(unref(shippingCostDisplay))}</p></div><div class="p-5"><p class="text-xs font-normal uppercase tracking-[0.12rem] mb-3" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">Metode Pembayaran</p><p class="text-sm font-normal">${ssrInterpolate(unref(selectedPaymentMethodLabel))}</p>`);
          if (unref(form).paymentMethod === "FT" && unref(paymentConfig)?.bankAccounts?.length) {
            _push(`<div class="mt-3 space-y-2"><p class="text-xs font-medium uppercase tracking-wide" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">Rekening Tujuan</p><!--[-->`);
            ssrRenderList(unref(paymentConfig).bankAccounts, (acc) => {
              _push(`<div class="flex items-start gap-3 p-3 rounded-xl" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.03)", "border": "1px solid rgba(9,11,12,0.06)" })}"><div class="flex-1"><p class="text-sm font-semibold">${ssrInterpolate(acc.bank)}</p><p class="text-sm mt-0.5" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.7)" })}">${ssrInterpolate(acc.accountNumber)}</p><p class="text-xs mt-0.5" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">a.n. ${ssrInterpolate(acc.accountName)}</p></div></div>`);
            });
            _push(`<!--]--></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="rounded-3xl overflow-hidden" style="${ssrRenderStyle({ "background": "white" })}"><div class="px-5 py-4 border-b" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.06)" })}"><p class="text-xs font-normal uppercase tracking-[0.12rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">Produk (${ssrInterpolate(unref(itemCount))} item)</p></div><!--[-->`);
          ssrRenderList(unref(cartItems), (item) => {
            _push(`<div class="flex gap-4 px-5 py-4 border-b last:border-b-0" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.06)" })}"><div class="w-14 h-14 rounded-2xl overflow-hidden shrink-0" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.05)" })}"><img${ssrRenderAttr("src", item.imageUrl)}${ssrRenderAttr("alt", item.title)} class="w-full h-full object-cover"></div><div class="flex-1 min-w-0"><p class="text-sm font-normal truncate">${ssrInterpolate(item.title)}</p>`);
            if (item.size) {
              _push(`<p class="text-xs mt-0.5" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">Ukuran: ${ssrInterpolate(item.size)}</p>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<p class="text-xs mt-1" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">${ssrInterpolate(item.qty)}× ${ssrInterpolate(formatPrice(item.price))}</p></div><p class="text-sm font-normal tabular-nums shrink-0">${ssrInterpolate(formatPrice(item.price * item.qty))}</p></div>`);
          });
          _push(`<!--]--></div><div class="rounded-3xl p-5 space-y-3" style="${ssrRenderStyle({ "background": "white" })}"><div class="flex justify-between text-sm"><span style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Subtotal</span><span class="tabular-nums">${ssrInterpolate(formatPrice(unref(subtotal)))}</span></div><div class="flex justify-between text-sm"><span style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Ongkos kirim</span><span class="tabular-nums" style="${ssrRenderStyle(unref(finalShippingCost) === 0 ? "color:rgb(22,163,74)" : "")}">${ssrInterpolate(unref(finalShippingCost) === 0 ? "GRATIS" : formatPrice(unref(finalShippingCost)))}</span></div><div class="flex justify-between pt-3 border-t" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.08)" })}"><span class="text-sm font-normal">Total</span><span class="text-lg font-normal tabular-nums tracking-tight">${ssrInterpolate(formatPrice(unref(subtotal) + unref(finalShippingCost)))}</span></div></div>`);
          if (unref(soldOutError)) {
            _push(`<div class="rounded-2xl overflow-hidden" style="${ssrRenderStyle({ "border": "1px solid rgba(239,68,68,0.2)" })}"><div class="px-5 pt-5 pb-4 space-y-1" style="${ssrRenderStyle({ "background": "rgba(239,68,68,0.05)" })}"><div class="flex items-center gap-2"><svg class="w-5 h-5 shrink-0" style="${ssrRenderStyle({ "color": "rgb(185,28,28)" })}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"></path></svg><p class="text-sm font-semibold" style="${ssrRenderStyle({ "color": "rgb(185,28,28)" })}">Stok habis saat checkout</p></div><p class="text-sm pl-7" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}"><strong style="${ssrRenderStyle({ "color": "rgb(153,27,27)" })}">${ssrInterpolate(unref(soldOutError))}</strong> sudah terjual oleh pembeli lain sesaat sebelum pesananmu diproses. </p></div><div class="px-5 py-4 space-y-2" style="${ssrRenderStyle({ "background": "white" })}"><p class="text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">Item tersebut sudah dihapus dari keranjang. Silakan pilih produk lain.</p><div class="flex flex-col sm:flex-row gap-2 pt-1">`);
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: "/koleksi",
              class: "flex-1 rounded-full py-2.5 text-sm font-medium text-center transition-colors",
              style: { "background": "#090b0c", "color": "white" }
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Lihat Koleksi `);
                } else {
                  return [
                    createTextVNode(" Lihat Koleksi ")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: "/flash_sale",
              class: "flex-1 rounded-full py-2.5 text-sm font-medium text-center transition-colors",
              style: { "background": "rgba(9,11,12,0.06)", "color": "#090b0c" }
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Flash Sale `);
                } else {
                  return [
                    createTextVNode(" Flash Sale ")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: "/",
              class: "flex-1 rounded-full py-2.5 text-sm font-medium text-center transition-colors",
              style: { "background": "rgba(9,11,12,0.06)", "color": "#090b0c" }
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(` Beranda `);
                } else {
                  return [
                    createTextVNode(" Beranda ")
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(`</div></div></div>`);
          } else {
            _push(`<!--[--><button class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity" style="${ssrRenderStyle(unref(placing) ? "background:rgba(9,11,12,0.4);color:white;cursor:not-allowed" : "background:#090b0c;color:white")}"${ssrIncludeBooleanAttr(unref(placing)) ? " disabled" : ""}>${ssrInterpolate(unref(placing) ? "Memproses…" : "Buat Pesanan & Bayar")}</button>`);
            if (unref(orderError)) {
              _push(`<div class="rounded-2xl p-4 text-sm" style="${ssrRenderStyle({ "background": "rgba(239,68,68,0.08)", "color": "rgb(185,28,28)" })}">${ssrInterpolate(unref(orderError))}</div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<!--]-->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/checkout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=checkout-D13F1HUa.js.map
