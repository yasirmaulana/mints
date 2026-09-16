import { _ as __nuxt_component_0 } from "./nuxt-link-CuTev4Jq.js";
import { _ as __nuxt_component_1 } from "./client-only-CUemHDvz.js";
import { defineComponent, ref, withAsyncContext, watchEffect, computed, reactive, mergeProps, withCtx, createTextVNode, unref, openBlock, createBlock, createVNode, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr } from "vue/server-renderer";
import { u as useHead, _ as _export_sfc } from "../server.mjs";
import { u as useAuth } from "./useAuth-CCe8xS6q.js";
import { u as useCart } from "./useCart-C8uxK576.js";
import { u as useFetch } from "./fetch-CA9qG_rp.js";
import "/home/yasir/Documents/Project/mints/node_modules/hookable/dist/index.mjs";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "flash_sale",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({ title: "Flash Sale — Mints" });
    const { isLoggedIn } = useAuth();
    const { itemCount } = useCart();
    const mobileMenuOpen = ref(false);
    const { data: sessions, refresh: refreshSessions } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/flash-sale/config",
      "$BGQKfl83cQ"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const selectedSessionId = ref(null);
    watchEffect(() => {
      if (!sessions.value?.length || selectedSessionId.value) return;
      const running = sessions.value.find((s) => s.isRunning);
      selectedSessionId.value = running?.id ?? sessions.value[0]?.id ?? null;
    });
    const selectedSession = computed(() => sessions.value?.find((s) => s.id === selectedSessionId.value) ?? null);
    const { data: products, pending: productsPending, refresh: refreshProducts } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      () => selectedSessionId.value ? `/api/products?sessionId=${selectedSessionId.value}` : "/api/products",
      { watch: [selectedSessionId] },
      "$haKXwskpZU"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const availableCount = computed(() => products.value?.filter((p) => p.status === "AVAILABLE").length ?? 0);
    const now = ref(0);
    computed(() => {
      const s = selectedSession.value;
      if (!s) return "";
      const target = s.isRunning ? new Date(s.endTime).getTime() : new Date(s.startTime).getTime();
      const diff = Math.max(0, target - now.value);
      const h = Math.floor(diff / 36e5).toString().padStart(2, "0");
      const m = Math.floor(diff % 36e5 / 6e4).toString().padStart(2, "0");
      const sec = Math.floor(diff % 6e4 / 1e3).toString().padStart(2, "0");
      return `${h}:${m}:${sec}`;
    });
    function formatTime(iso) {
      return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
    }
    function formatDateTime(iso) {
      return new Date(iso).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: false });
    }
    function formatPrice(price) {
      return Number(price || 0).toLocaleString("id-ID");
    }
    const showDetailModal = ref(false);
    const detailProduct = ref(null);
    const detailActiveImg = ref(0);
    ref(null);
    const detailGallery = computed(() => {
      if (!detailProduct.value) return [];
      return [detailProduct.value.imageUrl, ...detailProduct.value.images ?? []].filter(Boolean);
    });
    const soldPhones = ref({});
    const soldToastIdx = ref(0);
    const soldToastVisible = ref(false);
    computed(() => {
      if (!soldToastVisible.value) return null;
      const sold = (products.value ?? []).filter((p2) => p2.status === "SOLD_OUT" && (soldPhones.value[p2.id] ?? p2.maskedPhone));
      if (!sold.length) return null;
      const p = sold[soldToastIdx.value % sold.length];
      return { title: p.title, maskedPhone: soldPhones.value[p.id] ?? p.maskedPhone };
    });
    const toast = reactive({ visible: false, type: "success", title: "", description: "" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ClientOnly = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "min-h-screen antialiased",
        style: { "background": "#f5f5f2", "font-family": "'Inter Tight',system-ui,sans-serif", "color": "#090b0c" }
      }, _attrs))} data-v-9cbf197b><header class="fixed left-0 right-0 z-50 px-4 py-4 md:px-8" style="${ssrRenderStyle({ "background": "rgba(245,245,242,0.9)", "backdrop-filter": "blur(12px)", "border-bottom": "1px solid rgba(9,11,12,0.06)" })}" data-v-9cbf197b><div class="relative flex h-10 items-center max-w-6xl mx-auto" data-v-9cbf197b>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center font-black text-xl tracking-tighter",
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
      _push(`<nav class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-md md:flex" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.08)", "background": "rgba(255,255,255,0.7)" })}" data-v-9cbf197b>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "rounded-full px-4 py-2 text-sm transition-colors",
        style: { "color": "rgba(9,11,12,0.7)" },
        onMouseover: ($event) => $event.currentTarget.style.background = "rgba(0,0,0,0.05)",
        onMouseleave: ($event) => $event.currentTarget.style.background = "transparent"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Beranda`);
          } else {
            return [
              createTextVNode("Beranda")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/koleksi",
        class: "rounded-full px-4 py-2 text-sm transition-colors",
        style: { "color": "rgba(9,11,12,0.7)" },
        onMouseover: ($event) => $event.currentTarget.style.background = "rgba(0,0,0,0.05)",
        onMouseleave: ($event) => $event.currentTarget.style.background = "transparent"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Koleksi`);
          } else {
            return [
              createTextVNode("Koleksi")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="rounded-full px-4 py-2 text-sm font-medium" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.07)", "color": "#090b0c" })}" data-v-9cbf197b>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</span></nav><div class="ml-auto flex items-center gap-2" data-v-9cbf197b>`);
      if (unref(isLoggedIn)) {
        _push(`<!--[-->`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/account/orders",
          class: "hidden sm:block rounded-full px-4 py-2 text-sm transition-colors",
          style: { "color": "rgba(9,11,12,0.7)" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Pesanan`);
            } else {
              return [
                createTextVNode("Pesanan")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/account",
          class: "hidden sm:block rounded-full px-4 py-2 text-sm transition-colors",
          style: { "color": "rgba(9,11,12,0.7)" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Akun`);
            } else {
              return [
                createTextVNode("Akun")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<!--]-->`);
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/login",
          class: "hidden sm:block rounded-full px-5 py-2.5 text-sm font-normal transition-opacity hover:opacity-85",
          style: { "background": "#090b0c", "color": "white" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Masuk`);
            } else {
              return [
                createTextVNode("Masuk")
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/cart",
        class: "relative flex items-center gap-2 rounded-full px-3 py-2.5 text-sm font-normal transition-opacity hover:opacity-85 sm:px-5",
        style: { "background": "#090b0c", "color": "white" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-9cbf197b${_scopeId}><circle cx="9" cy="21" r="1" data-v-9cbf197b${_scopeId}></circle><circle cx="20" cy="21" r="1" data-v-9cbf197b${_scopeId}></circle><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6" data-v-9cbf197b${_scopeId}></path></svg><span class="hidden sm:inline" data-v-9cbf197b${_scopeId}>Keranjang</span>`);
            if (unref(itemCount) > 0) {
              _push2(`<span class="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1" style="${ssrRenderStyle({ "background": "#fabc3f", "color": "#090b0c" })}" data-v-9cbf197b${_scopeId}>${ssrInterpolate(unref(itemCount))}</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "w-3.5 h-3.5",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2"
              }, [
                createVNode("circle", {
                  cx: "9",
                  cy: "21",
                  r: "1"
                }),
                createVNode("circle", {
                  cx: "20",
                  cy: "21",
                  r: "1"
                }),
                createVNode("path", { d: "M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6" })
              ])),
              createVNode("span", { class: "hidden sm:inline" }, "Keranjang"),
              unref(itemCount) > 0 ? (openBlock(), createBlock("span", {
                key: 0,
                class: "absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1",
                style: { "background": "#fabc3f", "color": "#090b0c" }
              }, toDisplayString(unref(itemCount)), 1)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="flex items-center justify-center w-9 h-9 rounded-full md:hidden" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.06)" })}" aria-label="Menu" data-v-9cbf197b>`);
      if (!unref(mobileMenuOpen)) {
        _push(`<svg class="w-4 h-4" style="${ssrRenderStyle({ "color": "#090b0c" })}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-9cbf197b><line x1="3" y1="6" x2="21" y2="6" data-v-9cbf197b></line><line x1="3" y1="12" x2="21" y2="12" data-v-9cbf197b></line><line x1="3" y1="18" x2="21" y2="18" data-v-9cbf197b></line></svg>`);
      } else {
        _push(`<svg class="w-4 h-4" style="${ssrRenderStyle({ "color": "#090b0c" })}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-9cbf197b><line x1="18" y1="6" x2="6" y2="18" data-v-9cbf197b></line><line x1="6" y1="6" x2="18" y2="18" data-v-9cbf197b></line></svg>`);
      }
      _push(`</button></div></div>`);
      if (unref(mobileMenuOpen)) {
        _push(`<div class="md:hidden mt-3 rounded-2xl p-4 flex flex-col gap-1" style="${ssrRenderStyle({ "background": "rgba(255,255,255,0.96)", "backdrop-filter": "blur(16px)", "border": "1px solid rgba(9,11,12,0.08)" })}" data-v-9cbf197b>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "rounded-xl px-4 py-3 text-sm font-normal transition-colors",
          style: { "color": "#090b0c" },
          onClick: ($event) => mobileMenuOpen.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Beranda`);
            } else {
              return [
                createTextVNode("Beranda")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/koleksi",
          class: "rounded-xl px-4 py-3 text-sm font-normal transition-colors",
          style: { "color": "#090b0c" },
          onClick: ($event) => mobileMenuOpen.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Koleksi`);
            } else {
              return [
                createTextVNode("Koleksi")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/flash_sale",
          class: "rounded-xl px-4 py-3 text-sm font-normal transition-colors",
          style: { "color": "#090b0c" },
          onClick: ($event) => mobileMenuOpen.value = false
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Flash Sale`);
            } else {
              return [
                createTextVNode("Flash Sale")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="my-1 border-t" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.08)" })}" data-v-9cbf197b></div>`);
        if (unref(isLoggedIn)) {
          _push(`<!--[-->`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/account/orders",
            class: "rounded-xl px-4 py-3 text-sm font-normal",
            style: { "color": "#090b0c" },
            onClick: ($event) => mobileMenuOpen.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Pesanan Saya`);
              } else {
                return [
                  createTextVNode("Pesanan Saya")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/account",
            class: "rounded-xl px-4 py-3 text-sm font-normal",
            style: { "color": "#090b0c" },
            onClick: ($event) => mobileMenuOpen.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Akun`);
              } else {
                return [
                  createTextVNode("Akun")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<!--]-->`);
        } else {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/login",
            class: "mt-1 rounded-xl px-4 py-3 text-sm font-normal text-center transition-opacity hover:opacity-85",
            style: { "background": "#090b0c", "color": "white" },
            onClick: ($event) => mobileMenuOpen.value = false
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Masuk`);
              } else {
                return [
                  createTextVNode("Masuk")
                ];
              }
            }),
            _: 1
          }, _parent));
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header><div style="${ssrRenderStyle({ "padding-top": "74px" })}" data-v-9cbf197b><div class="px-4 py-4 md:px-8" style="${ssrRenderStyle({ "background": "#f5f5f2", "border-bottom": "1px solid rgba(9,11,12,0.08)" })}" data-v-9cbf197b><div class="max-w-6xl mx-auto" data-v-9cbf197b>`);
      if (!unref(sessions)?.length) {
        _push(`<div class="text-sm py-1" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}" data-v-9cbf197b> Tidak ada sesi aktif </div>`);
      } else {
        _push(`<div class="flex items-center gap-2 overflow-x-auto pb-0.5" style="${ssrRenderStyle({ "scrollbar-width": "none" })}" data-v-9cbf197b><!--[-->`);
        ssrRenderList(unref(sessions), (session) => {
          _push(`<button class="flex-shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-normal transition-all" style="${ssrRenderStyle(unref(selectedSessionId) === session.id ? "background:#090b0c;color:white" : "background:rgba(9,11,12,0.06);color:rgba(9,11,12,0.7)")}" data-v-9cbf197b><span class="font-mono font-bold" data-v-9cbf197b>${ssrInterpolate(formatTime(session.startTime))}</span><span class="text-xs opacity-70" data-v-9cbf197b>`);
          if (session.isRunning) {
            _push(`<!--[-->● Live<!--]-->`);
          } else {
            _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
          }
          _push(`</span></button>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div>`);
      if (unref(selectedSession)) {
        _push(`<div class="px-4 py-5 md:px-8" style="${ssrRenderStyle({ "background": "white", "border-bottom": "1px solid rgba(9,11,12,0.06)" })}" data-v-9cbf197b><div class="max-w-6xl mx-auto flex items-center justify-between gap-4" data-v-9cbf197b><div data-v-9cbf197b><div class="flex items-center gap-2 mb-1" data-v-9cbf197b>`);
        if (unref(selectedSession).isRunning) {
          _push(`<span class="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider" style="${ssrRenderStyle({ "background": "#fabc3f", "color": "#090b0c" })}" data-v-9cbf197b><span class="w-1.5 h-1.5 rounded-full bg-current animate-pulse" data-v-9cbf197b></span> Sedang Berlangsung </span>`);
        } else {
          _push(`<span class="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.07)", "color": "rgba(9,11,12,0.6)" })}" data-v-9cbf197b>Akan Datang</span>`);
        }
        _push(`</div><h2 class="text-base font-semibold tracking-tight" data-v-9cbf197b>${ssrInterpolate(unref(selectedSession).title)}</h2><p class="text-xs mt-0.5" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}" data-v-9cbf197b>${ssrInterpolate(formatDateTime(unref(selectedSession).startTime))} – ${ssrInterpolate(formatTime(unref(selectedSession).endTime))}</p></div><div class="text-right flex-shrink-0" data-v-9cbf197b><p class="text-2xl font-bold tabular-nums tracking-tight" data-v-9cbf197b>${ssrInterpolate(unref(availableCount))}</p><p class="text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}" data-v-9cbf197b>Produk tersedia</p></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="max-w-6xl mx-auto px-4 py-10 md:px-8" data-v-9cbf197b>`);
      if (unref(productsPending)) {
        _push(`<div class="flex justify-center py-24" data-v-9cbf197b><div class="w-6 h-6 rounded-full border-2 animate-spin" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.15)", "border-top-color": "#090b0c" })}" data-v-9cbf197b></div></div>`);
      } else if (!unref(products)?.length) {
        _push(`<div class="text-center py-24" data-v-9cbf197b><p class="text-sm" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}" data-v-9cbf197b>Belum ada produk di sesi ini</p></div>`);
      } else {
        _push(`<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" data-v-9cbf197b><!--[-->`);
        ssrRenderList(unref(products), (product) => {
          _push(`<div class="group rounded-3xl overflow-hidden flex flex-col" style="${ssrRenderStyle({ "background": "white" })}" data-v-9cbf197b><div class="relative aspect-square overflow-hidden" style="${ssrRenderStyle({ "background": "#f5f5f2" })}" data-v-9cbf197b><img${ssrRenderAttr("src", product.imageUrl)}${ssrRenderAttr("alt", product.title)} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" data-v-9cbf197b>`);
          if (product.status === "SOLD_OUT") {
            _push(`<div class="absolute inset-0 flex flex-col items-center justify-center gap-1.5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)", "backdrop-filter": "blur(2px)" })}" data-v-9cbf197b><span class="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest" style="${ssrRenderStyle({ "background": "#090b0c", "color": "white" })}" data-v-9cbf197b>Sold Out</span>`);
            if (unref(soldPhones)[product.id] ?? product.maskedPhone) {
              _push(`<span class="text-xs font-mono" style="${ssrRenderStyle({ "color": "rgba(255,255,255,0.6)" })}" data-v-9cbf197b>${ssrInterpolate(unref(soldPhones)[product.id] ?? product.maskedPhone)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="p-4 flex flex-col gap-3 flex-1" data-v-9cbf197b><div data-v-9cbf197b><p class="text-sm font-semibold leading-snug line-clamp-2 mb-1" data-v-9cbf197b>${ssrInterpolate(product.title)}</p><div class="flex flex-wrap items-end gap-2" data-v-9cbf197b><p class="text-base font-bold tabular-nums" style="${ssrRenderStyle({ "color": "#090b0c" })}" data-v-9cbf197b>Rp ${ssrInterpolate(formatPrice(product.price))}</p>`);
          if (product.originalPrice) {
            _push(`<p class="text-xs line-through tabular-nums" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}" data-v-9cbf197b>Rp ${ssrInterpolate(formatPrice(product.originalPrice))}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="flex gap-2 mt-auto" data-v-9cbf197b><button class="flex-1 rounded-full py-2 text-xs font-semibold transition-opacity hover:opacity-75" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.07)", "color": "#090b0c" })}" data-v-9cbf197b>Detail</button>`);
          if (unref(selectedSession)?.isRunning && product.status === "AVAILABLE") {
            _push(`<button class="flex-1 rounded-full py-2 text-xs font-semibold transition-opacity hover:opacity-85" style="${ssrRenderStyle({ "background": "#090b0c", "color": "white" })}" data-v-9cbf197b>Beli</button>`);
          } else if (unref(selectedSession)?.isRunning && product.status === "SOLD_OUT") {
            _push(`<button class="flex-1 rounded-full py-2 text-xs font-semibold opacity-40 cursor-not-allowed" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.07)", "color": "#090b0c" })}" disabled data-v-9cbf197b>Sold Out</button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div><footer class="overflow-hidden px-5 pt-20 pb-10 md:px-12" style="${ssrRenderStyle({ "background": "#f5f5f2", "border-top": "1px solid rgba(9,11,12,0.08)" })}" data-v-9cbf197b><div class="mx-auto max-w-5xl" data-v-9cbf197b><div class="grid gap-12 sm:grid-cols-3 mb-12" data-v-9cbf197b><div data-v-9cbf197b><p class="font-black text-xl tracking-tighter mb-3" style="${ssrRenderStyle({ "font-family": "'Inter Tight',sans-serif", "letter-spacing": "-0.04em" })}" data-v-9cbf197b>MINTS</p><p class="text-sm leading-6" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}" data-v-9cbf197b>Elegan. Syar&#39;i.<br data-v-9cbf197b>Dibuat Sepenuh Hati.</p></div><div data-v-9cbf197b><p class="mb-4 text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}" data-v-9cbf197b>Belanja</p><ul class="space-y-3 text-sm" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}" data-v-9cbf197b><li data-v-9cbf197b>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/koleksi",
        class: "transition-colors hover:text-[#090b0c]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Koleksi`);
          } else {
            return [
              createTextVNode("Koleksi")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-9cbf197b>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/flash_sale",
        class: "transition-colors hover:text-[#090b0c]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Flash Sale`);
          } else {
            return [
              createTextVNode("Flash Sale")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-9cbf197b>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/account/orders",
        class: "transition-colors hover:text-[#090b0c]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Pesanan Saya`);
          } else {
            return [
              createTextVNode("Pesanan Saya")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-9cbf197b>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/cart",
        class: "transition-colors hover:text-[#090b0c]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Keranjang`);
          } else {
            return [
              createTextVNode("Keranjang")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div data-v-9cbf197b><p class="mb-4 text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}" data-v-9cbf197b>Perusahaan</p><ul class="space-y-3 text-sm" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}" data-v-9cbf197b><li data-v-9cbf197b>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/tentang-kami",
        class: "transition-colors hover:text-[#090b0c]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Tentang Kami`);
          } else {
            return [
              createTextVNode("Tentang Kami")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-9cbf197b>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/panduan-ukuran",
        class: "transition-colors hover:text-[#090b0c]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Panduan Ukuran`);
          } else {
            return [
              createTextVNode("Panduan Ukuran")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-9cbf197b>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/kebijakan-pengembalian",
        class: "transition-colors hover:text-[#090b0c]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Kebijakan Pengembalian`);
          } else {
            return [
              createTextVNode("Kebijakan Pengembalian")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-9cbf197b>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/faq",
        class: "transition-colors hover:text-[#090b0c]"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`FAQ`);
          } else {
            return [
              createTextVNode("FAQ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div></div><div class="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.1)" })}" data-v-9cbf197b><p class="text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}" data-v-9cbf197b>© 2026 Mints. Semua hak dilindungi.</p><div class="flex gap-4 text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}" data-v-9cbf197b>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/privasi",
        class: "hover:text-[#090b0c] transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Privasi`);
          } else {
            return [
              createTextVNode("Privasi")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/syarat-ketentuan",
        class: "hover:text-[#090b0c] transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Syarat &amp; Ketentuan`);
          } else {
            return [
              createTextVNode("Syarat & Ketentuan")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></footer>`);
      if (unref(showDetailModal)) {
        _push(`<div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 py-6" data-v-9cbf197b><div class="absolute inset-0" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.5)", "backdrop-filter": "blur(4px)" })}" data-v-9cbf197b></div><div class="relative w-full max-w-md overflow-hidden flex flex-col rounded-3xl" style="${ssrRenderStyle({ "background": "white", "max-height": "90vh" })}" data-v-9cbf197b><div class="relative shrink-0" style="${ssrRenderStyle({ "background": "#f5f5f2" })}" data-v-9cbf197b><img${ssrRenderAttr("src", unref(detailGallery)[unref(detailActiveImg)] ?? unref(detailProduct)?.imageUrl)}${ssrRenderAttr("alt", unref(detailProduct)?.title)} class="w-full h-64 object-cover cursor-zoom-in" data-v-9cbf197b>`);
        if (unref(detailGallery).length > 1) {
          _push(`<!--[--><button class="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-opacity hover:opacity-85" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)", "color": "white" })}" data-v-9cbf197b>‹</button><button class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-opacity hover:opacity-85" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)", "color": "white" })}" data-v-9cbf197b>›</button><div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5" data-v-9cbf197b><!--[-->`);
          ssrRenderList(unref(detailGallery), (_, i) => {
            _push(`<button class="w-1.5 h-1.5 rounded-full transition-colors" style="${ssrRenderStyle(i === unref(detailActiveImg) ? "background:white" : "background:rgba(255,255,255,0.4)")}" data-v-9cbf197b></button>`);
          });
          _push(`<!--]--></div><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(detailGallery).length > 1) {
          _push(`<div class="flex gap-2 px-5 pt-4 overflow-x-auto shrink-0" data-v-9cbf197b><!--[-->`);
          ssrRenderList(unref(detailGallery), (img, i) => {
            _push(`<button class="shrink-0 w-14 h-14 rounded-2xl overflow-hidden border-2 transition-colors" style="${ssrRenderStyle(i === unref(detailActiveImg) ? "border-color:#090b0c" : "border-color:transparent")}" data-v-9cbf197b><img${ssrRenderAttr("src", img)} class="w-full h-full object-cover" data-v-9cbf197b></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="p-5 overflow-y-auto flex-1" data-v-9cbf197b><h2 class="text-base font-semibold tracking-tight mb-1" data-v-9cbf197b>${ssrInterpolate(unref(detailProduct)?.title)}</h2><p class="text-xl font-bold tabular-nums mb-4" data-v-9cbf197b>Rp ${ssrInterpolate(formatPrice(unref(detailProduct)?.price))}</p>`);
        if (unref(detailProduct)?.description) {
          _push(`<p class="text-sm leading-relaxed mb-5 whitespace-pre-line" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}" data-v-9cbf197b>${ssrInterpolate(unref(detailProduct).description)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex gap-3" data-v-9cbf197b><button class="flex-1 rounded-full py-3 text-sm font-semibold transition-opacity hover:opacity-75" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.07)", "color": "#090b0c" })}" data-v-9cbf197b>Tutup</button>`);
        if (unref(selectedSession)?.isRunning && unref(detailProduct)?.status === "AVAILABLE") {
          _push(`<button class="flex-1 rounded-full py-3 text-sm font-semibold transition-opacity hover:opacity-85" style="${ssrRenderStyle({ "background": "#090b0c", "color": "white" })}" data-v-9cbf197b>Beli Sekarang</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      if (unref(toast).visible) {
        _push(`<div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-full max-w-sm px-4" data-v-9cbf197b><div class="rounded-2xl px-4 py-3.5 flex items-center gap-3 text-sm font-medium" style="${ssrRenderStyle(unref(toast).type === "success" ? "background:#090b0c;color:white" : "background:#dc2626;color:white")}" data-v-9cbf197b><span class="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold" style="${ssrRenderStyle(unref(toast).type === "success" ? "background:#fabc3f;color:#090b0c" : "background:rgba(255,255,255,0.2);color:white")}" data-v-9cbf197b>${ssrInterpolate(unref(toast).type === "success" ? "✓" : "✕")}</span><div class="min-w-0" data-v-9cbf197b><p class="font-semibold text-sm" data-v-9cbf197b>${ssrInterpolate(unref(toast).title)}</p>`);
        if (unref(toast).description) {
          _push(`<p class="text-xs mt-0.5 opacity-75" data-v-9cbf197b>${ssrInterpolate(unref(toast).description)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/flash_sale.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const flash_sale = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-9cbf197b"]]);
export {
  flash_sale as default
};
//# sourceMappingURL=flash_sale-B7hlFUdg.js.map
