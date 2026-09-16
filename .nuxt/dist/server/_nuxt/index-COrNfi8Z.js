import { _ as __nuxt_component_0 } from "./nuxt-link-CuTev4Jq.js";
import { _ as __nuxt_component_1 } from "./client-only-CUemHDvz.js";
import { defineComponent, withAsyncContext, ref, computed, mergeProps, unref, withCtx, createTextVNode, openBlock, createBlock, createVNode, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from "vue/server-renderer";
import { publicAssetsURL } from "#internal/nuxt/paths";
import { a as useSeoMeta, b as useRuntimeConfig, _ as _export_sfc } from "../server.mjs";
import { u as useCart } from "./useCart-C8uxK576.js";
import { u as useAuth } from "./useAuth-CCe8xS6q.js";
import { u as useFetch } from "./fetch-CA9qG_rp.js";
import "/home/yasir/Documents/Project/mints/node_modules/ufo/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/defu/dist/defu.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/hookable/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/ofetch/dist/node.mjs";
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
const _imports_0 = publicAssetsURL("/uploads/hero_video.mp4");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useSeoMeta({
      title: "MINTS — Modest Fashion Premium",
      description: "Koleksi pakaian muslimah premium. Elegan. Syar'i. Dibuat Sepenuh Hati."
    });
    const { itemCount } = useCart();
    const { isLoggedIn } = useAuth();
    const { data: categories } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/categories",
      "$b3lh2xsnBe"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: products, pending } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/products",
      "$rhGx8E2UCp"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const search = ref("");
    const activeCategory = ref(null);
    const activeType = ref("ALL");
    const scrolled = ref(false);
    const mobileMenuOpen = ref(false);
    ref(1024);
    const freeShippingMin = useRuntimeConfig().public.freeShippingMin;
    const freeShippingLabel = `Min. Rp ${parseInt(String(freeShippingMin)).toLocaleString("id-ID")}`;
    const stats = computed(() => [
      { label: "Gratis Ongkir " + freeShippingLabel, sub: "Berlaku untuk pengiriman seluruh Indonesia" },
      { label: "Kualitas Premium", sub: "Bahan eksklusif yang nyaman & syar'i" },
      { label: "Pembayaran Aman", sub: "Transaksi aman didukung Duitku" }
    ]);
    const typeFilters = [
      { value: "ALL", label: "Semua" },
      { value: "REGULAR", label: "Tersedia" },
      { value: "PRE_ORDER", label: "Pre-Order" }
    ];
    const filteredProducts = computed(() => {
      let list = products.value ?? [];
      if (activeCategory.value) list = list.filter((p) => p.categoryId === activeCategory.value);
      if (activeType.value !== "ALL") list = list.filter((p) => p.productType === activeType.value);
      if (search.value.trim()) {
        const q = search.value.toLowerCase();
        list = list.filter((p) => p.title.toLowerCase().includes(q));
      }
      return list;
    });
    function isNew(product) {
      return Date.now() - new Date(product.createdAt).getTime() < 14 * 24 * 60 * 60 * 1e3;
    }
    function formatPrice(price) {
      return Number(price).toLocaleString("id-ID");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ClientOnly = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "min-h-screen antialiased",
        style: { "background": "#f5f5f2", "color": "#090b0c", "font-family": "'Inter Tight',system-ui,sans-serif" }
      }, _attrs))} data-v-ff838a1d><header class="fixed left-0 right-0 z-50 px-4 py-4 md:px-8 transition-colors duration-300" style="${ssrRenderStyle(unref(scrolled) ? "background:rgba(245,245,242,0.9);backdrop-filter:blur(12px);border-bottom:1px solid rgba(9,11,12,0.06)" : "background:transparent")}" data-v-ff838a1d><div class="relative flex h-10 items-center max-w-6xl mx-auto" data-v-ff838a1d>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center font-black text-xl tracking-tighter transition-colors duration-300",
        style: `font-family:'Inter Tight',sans-serif;letter-spacing:-0.04em;color:${unref(scrolled) ? "#090b0c" : "white"}`
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
      _push(`<nav class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-md md:flex" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.08)", "background": "rgba(255,255,255,0.7)" })}" data-v-ff838a1d><a href="#" class="rounded-full px-4 py-2 text-sm transition-colors" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.7)" })}" data-v-ff838a1d>Beranda</a>`);
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
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/flash_sale",
        class: "rounded-full px-4 py-2 text-sm transition-colors",
        style: { "color": "rgba(9,11,12,0.7)" },
        onMouseover: ($event) => $event.currentTarget.style.background = "rgba(0,0,0,0.05)",
        onMouseleave: ($event) => $event.currentTarget.style.background = "transparent"
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
      _push(`</nav><div class="ml-auto flex items-center gap-2" data-v-ff838a1d>`);
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
            _push2(`<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-ff838a1d${_scopeId}><circle cx="9" cy="21" r="1" data-v-ff838a1d${_scopeId}></circle><circle cx="20" cy="21" r="1" data-v-ff838a1d${_scopeId}></circle><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6" data-v-ff838a1d${_scopeId}></path></svg><span class="hidden sm:inline" data-v-ff838a1d${_scopeId}>Keranjang</span>`);
            if (unref(itemCount) > 0) {
              _push2(`<span class="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1" style="${ssrRenderStyle({ "background": "#fabc3f", "color": "#090b0c" })}" data-v-ff838a1d${_scopeId}>${ssrInterpolate(unref(itemCount))}</span>`);
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
      _push(`<button class="flex md:hidden items-center justify-center w-9 h-9 rounded-full transition-colors" style="${ssrRenderStyle(unref(scrolled) ? "background:rgba(9,11,12,0.06)" : "background:rgba(255,255,255,0.15)")}" aria-label="Menu" data-v-ff838a1d>`);
      if (!unref(mobileMenuOpen)) {
        _push(`<svg class="w-4 h-4" style="${ssrRenderStyle(unref(scrolled) ? "color:#090b0c" : "color:white")}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-ff838a1d><line x1="3" y1="6" x2="21" y2="6" data-v-ff838a1d></line><line x1="3" y1="12" x2="21" y2="12" data-v-ff838a1d></line><line x1="3" y1="18" x2="21" y2="18" data-v-ff838a1d></line></svg>`);
      } else {
        _push(`<svg class="w-4 h-4" style="${ssrRenderStyle(unref(scrolled) ? "color:#090b0c" : "color:white")}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-ff838a1d><line x1="18" y1="6" x2="6" y2="18" data-v-ff838a1d></line><line x1="6" y1="6" x2="18" y2="18" data-v-ff838a1d></line></svg>`);
      }
      _push(`</button></div></div>`);
      if (unref(mobileMenuOpen)) {
        _push(`<div class="md:hidden mt-3 rounded-2xl p-4 flex flex-col gap-1" style="${ssrRenderStyle({ "background": "rgba(255,255,255,0.96)", "backdrop-filter": "blur(16px)", "border": "1px solid rgba(9,11,12,0.08)" })}" data-v-ff838a1d><a href="#" class="rounded-xl px-4 py-3 text-sm font-normal transition-colors" style="${ssrRenderStyle({ "color": "#090b0c" })}" data-v-ff838a1d>Beranda</a>`);
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
        _push(`<div class="my-1 border-t" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.08)" })}" data-v-ff838a1d></div>`);
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
      _push(`</header><section class="relative min-h-screen overflow-hidden" style="${ssrRenderStyle({ "background": "#090b0c" })}" data-v-ff838a1d><video class="absolute inset-0 w-full h-full object-cover z-0"${ssrRenderAttr("src", _imports_0)} autoplay loop muted playsinline data-v-ff838a1d></video><div class="absolute inset-0 z-[1]" style="${ssrRenderStyle({ "background": "linear-gradient(to bottom,rgba(0,0,0,.55) 0%,rgba(0,0,0,.1) 50%,rgba(0,0,0,.6) 100%)" })}" data-v-ff838a1d></div><div class="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 pb-20 pt-32 text-center" data-v-ff838a1d><div class="mb-6 flex items-center gap-2 rounded-full py-1.5 pl-6 pr-2 text-sm font-normal" style="${ssrRenderStyle({ "background": "rgba(255,255,255,0.12)", "color": "white", "backdrop-filter": "blur(8px)" })}" data-v-ff838a1d> Modest Fashion Premium <span class="flex h-6 w-6 items-center justify-center rounded-full text-xs" style="${ssrRenderStyle({ "background": "#fabc3f", "color": "#090b0c" })}" data-v-ff838a1d>✦</span></div><h1 class="text-[3.5rem] font-normal leading-[0.94] tracking-tight text-white sm:text-[5.5rem] md:text-[7rem]" style="${ssrRenderStyle({ "max-width": "900px" })}" data-v-ff838a1d> Elegan.<br data-v-ff838a1d><em class="not-italic" style="${ssrRenderStyle({ "font-style": "italic", "opacity": "0.75" })}" data-v-ff838a1d>Syar&#39;i.</em><br data-v-ff838a1d> Dibuat Sepenuh Hati. </h1><div class="mt-10 flex flex-wrap items-center justify-center gap-3" data-v-ff838a1d><a href="#produk" class="rounded-full px-7 py-3.5 text-sm font-normal transition-opacity hover:opacity-85" style="${ssrRenderStyle({ "background": "white", "color": "#090b0c" })}" data-v-ff838a1d> Belanja Sekarang </a><a href="#kategori" class="rounded-full px-7 py-3.5 text-sm font-normal transition-colors" style="${ssrRenderStyle({ "background": "rgba(255,255,255,0.12)", "color": "white", "backdrop-filter": "blur(8px)" })}" data-v-ff838a1d> Lihat Kategori </a></div></div></section><section style="${ssrRenderStyle({ "background": "#f5f5f2", "border-bottom": "1px solid rgba(9,11,12,0.1)" })}" class="overflow-hidden px-5 py-8 md:px-12" data-v-ff838a1d><div class="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x" style="${ssrRenderStyle({ "--tw-divide-opacity": "1", "divide-color": "rgba(9,11,12,0.12)" })}" data-v-ff838a1d><!--[-->`);
      ssrRenderList(unref(stats), (s) => {
        _push(`<div class="flex flex-col items-center justify-center text-center px-6 py-4 sm:py-2 gap-1" data-v-ff838a1d><p class="text-xs font-bold uppercase tracking-widest" style="${ssrRenderStyle({ "color": "#090b0c", "letter-spacing": "0.12em" })}" data-v-ff838a1d>${ssrInterpolate(s.label)}</p><p class="text-sm" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}" data-v-ff838a1d>${ssrInterpolate(s.sub)}</p></div>`);
      });
      _push(`<!--]--></div></section><section id="kategori" style="${ssrRenderStyle({ "background": "#f5f5f2" })}" class="overflow-hidden px-5 py-20 md:px-12" data-v-ff838a1d><div class="mx-auto max-w-5xl" data-v-ff838a1d><div class="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between" data-v-ff838a1d><div data-v-ff838a1d><div class="mb-4 flex items-center gap-3" data-v-ff838a1d><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}" data-v-ff838a1d></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}" data-v-ff838a1d>Kategori</span></div><h2 class="text-[2.5rem] font-normal leading-[0.94] tracking-tight md:text-[3.5rem]" data-v-ff838a1d> Temukan<br data-v-ff838a1d><em style="${ssrRenderStyle({ "font-style": "italic", "opacity": "0.6" })}" data-v-ff838a1d>koleksi favoritmu</em></h2></div><p class="max-w-xs text-sm leading-6" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.55)", "text-align": "right" })}" data-v-ff838a1d> Dari gamis hingga abaya — semua dirancang untuk kenyamanan sehari-hari. </p></div>`);
      if (unref(categories)?.length) {
        _push(`<div class="flex flex-wrap gap-2" data-v-ff838a1d><button class="rounded-full px-5 py-2.5 text-sm font-normal transition-all duration-200 flex items-center gap-2" style="${ssrRenderStyle(unref(activeCategory) === null ? "background:#090b0c;color:white" : "background:white;color:#090b0c;border:1px solid rgba(9,11,12,0.12)")}" data-v-ff838a1d> Semua <span class="text-xs tabular-nums" style="${ssrRenderStyle(unref(activeCategory) === null ? "color:rgba(255,255,255,0.5)" : "color:rgba(9,11,12,0.35)")}" data-v-ff838a1d>${ssrInterpolate(unref(products)?.length ?? 0)}</span></button><!--[-->`);
        ssrRenderList(unref(categories), (cat) => {
          _push(`<button class="rounded-full px-5 py-2.5 text-sm font-normal transition-all duration-200 flex items-center gap-2" style="${ssrRenderStyle(unref(activeCategory) === cat.id ? "background:#090b0c;color:white" : "background:white;color:#090b0c;border:1px solid rgba(9,11,12,0.12)")}" data-v-ff838a1d>${ssrInterpolate(cat.name)} <span class="text-xs tabular-nums" style="${ssrRenderStyle(unref(activeCategory) === cat.id ? "color:rgba(255,255,255,0.5)" : "color:rgba(9,11,12,0.35)")}" data-v-ff838a1d>${ssrInterpolate(cat._count?.products ?? 0)}</span></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="flex flex-wrap gap-2" data-v-ff838a1d><!--[-->`);
        ssrRenderList(5, (i) => {
          _push(`<div class="h-10 w-28 rounded-full animate-pulse" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.06)" })}" data-v-ff838a1d></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></section><section id="produk" style="${ssrRenderStyle({ "background": "#f5f5f2" })}" class="overflow-hidden px-5 pb-24 md:px-12" data-v-ff838a1d><div class="mx-auto max-w-5xl" data-v-ff838a1d><div class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" data-v-ff838a1d><div data-v-ff838a1d><div class="mb-3 flex items-center gap-3" data-v-ff838a1d><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}" data-v-ff838a1d></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}" data-v-ff838a1d>${ssrInterpolate(unref(activeCategory) ? unref(categories)?.find((c) => c.id === unref(activeCategory))?.name ?? "Produk" : "Semua Produk")}</span></div><h2 class="text-[2rem] font-normal leading-tight tracking-tight md:text-[2.5rem]" data-v-ff838a1d>${ssrInterpolate(unref(search) ? `Hasil "${unref(search)}"` : "Koleksi Terkini")}</h2></div><div class="flex flex-wrap items-center gap-2 w-full sm:w-auto" data-v-ff838a1d><div class="relative flex-1 sm:flex-none sm:w-[180px]" data-v-ff838a1d><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Cari produk..." class="h-9 rounded-full border pl-9 pr-4 text-sm focus:outline-none" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.15)", "background": "white", "color": "#090b0c", "min-width": "0", "width": "100%", "max-width": "180px" })}" data-v-ff838a1d><svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-ff838a1d><circle cx="11" cy="11" r="8" data-v-ff838a1d></circle><path d="M21 21l-4.35-4.35" data-v-ff838a1d></path></svg></div><div class="flex gap-1 rounded-full p-1" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.08)" })}" data-v-ff838a1d><!--[-->`);
      ssrRenderList(typeFilters, (f) => {
        _push(`<button class="rounded-full px-3 py-1 text-xs font-normal transition-all" style="${ssrRenderStyle(unref(activeType) === f.value ? "background:#090b0c;color:white" : "color:rgba(9,11,12,0.6)")}" data-v-ff838a1d>${ssrInterpolate(f.label)}</button>`);
      });
      _push(`<!--]--></div></div></div>`);
      if (unref(pending)) {
        _push(`<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-v-ff838a1d><!--[-->`);
        ssrRenderList(8, (i) => {
          _push(`<div class="rounded-3xl aspect-[3/4] animate-pulse" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.06)" })}" data-v-ff838a1d></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!unref(filteredProducts).length) {
        _push(`<div class="py-24 text-center" data-v-ff838a1d><p class="text-4xl mb-3" data-v-ff838a1d>○</p><p class="text-lg font-normal tracking-tight" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}" data-v-ff838a1d>Tidak ada produk ditemukan</p><button class="mt-4 text-sm underline underline-offset-4" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}" data-v-ff838a1d>Reset filter</button></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-v-ff838a1d><!--[-->`);
        ssrRenderList(unref(filteredProducts), (product) => {
          _push(`<div class="group cursor-pointer" data-v-ff838a1d><div class="relative overflow-hidden rounded-3xl aspect-[3/4]" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.05)" })}" data-v-ff838a1d><img${ssrRenderAttr("src", product.imageUrl)}${ssrRenderAttr("alt", product.title)} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-v-ff838a1d>`);
          if (product.status === "SOLD_OUT") {
            _push(`<div class="absolute inset-0 flex items-center justify-center" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.55)" })}" data-v-ff838a1d><span class="rounded-full px-4 py-1.5 text-xs font-normal tracking-widest uppercase" style="${ssrRenderStyle({ "background": "rgba(255,255,255,0.15)", "color": "white", "backdrop-filter": "blur(8px)" })}" data-v-ff838a1d>Habis</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="absolute top-3 left-3 flex flex-col gap-1.5" data-v-ff838a1d>`);
          if (product.productType === "PRE_ORDER") {
            _push(`<span class="rounded-full px-3 py-1 text-[10px] font-normal tracking-wide" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.75)", "color": "white", "backdrop-filter": "blur(8px)" })}" data-v-ff838a1d>Pre-Order</span>`);
          } else {
            _push(`<!---->`);
          }
          if (isNew(product)) {
            _push(`<span class="rounded-full px-3 py-1 text-[10px] font-normal tracking-wide" style="${ssrRenderStyle({ "background": "#fabc3f", "color": "#090b0c" })}" data-v-ff838a1d>Baru</span>`);
          } else {
            _push(`<!---->`);
          }
          if (product.sessionId) {
            _push(`<span class="rounded-full px-3 py-1 text-[10px] font-normal tracking-wide" style="${ssrRenderStyle({ "background": "#ef4444", "color": "white" })}" data-v-ff838a1d>Flash Sale</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="mt-3 px-1" data-v-ff838a1d><div class="flex items-start justify-between gap-2" data-v-ff838a1d><div class="min-w-0" data-v-ff838a1d><p class="text-sm font-normal leading-snug tracking-tight truncate" data-v-ff838a1d>${ssrInterpolate(product.title)}</p>`);
          if (product.category) {
            _push(`<p class="mt-0.5 text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}" data-v-ff838a1d>${ssrInterpolate(product.category.name)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="shrink-0 text-right" data-v-ff838a1d><p class="text-sm font-normal tabular-nums" data-v-ff838a1d>Rp ${ssrInterpolate(formatPrice(product.price))}</p>`);
          if (product.originalPrice) {
            _push(`<p class="text-[11px] line-through tabular-nums" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}" data-v-ff838a1d>Rp ${ssrInterpolate(formatPrice(product.originalPrice))}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
          if (product.variants?.length) {
            _push(`<div class="mt-2 flex flex-wrap gap-1" data-v-ff838a1d><!--[-->`);
            ssrRenderList(product.variants.slice(0, 5), (v) => {
              _push(`<span class="rounded-full px-2 py-0.5 text-[10px]" style="${ssrRenderStyle(v.stock > 0 ? "background:rgba(9,11,12,0.07);color:rgba(9,11,12,0.7)" : "background:rgba(9,11,12,0.03);color:rgba(9,11,12,0.25);text-decoration:line-through")}" data-v-ff838a1d>${ssrInterpolate(v.size)}</span>`);
            });
            _push(`<!--]-->`);
            if (product.variants.length > 5) {
              _push(`<span class="rounded-full px-2 py-0.5 text-[10px]" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.04)", "color": "rgba(9,11,12,0.3)" })}" data-v-ff838a1d>+${ssrInterpolate(product.variants.length - 5)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></section><section class="overflow-hidden px-5 py-5 md:px-12" style="${ssrRenderStyle({ "background": "#f5f5f2" })}" data-v-ff838a1d><div class="mx-auto max-w-5xl overflow-hidden rounded-3xl relative" style="${ssrRenderStyle({ "background": "#090b0c", "min-height": "280px" })}" data-v-ff838a1d><div class="px-10 py-14 relative z-10 flex flex-col items-start justify-center h-full" data-v-ff838a1d><div class="mb-4 flex items-center gap-3" data-v-ff838a1d><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(255,255,255,0.3)" })}" data-v-ff838a1d></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(255,255,255,0.4)" })}" data-v-ff838a1d>Koleksi Terbaru</span></div><h3 class="text-[2.5rem] font-normal leading-[0.94] tracking-tight text-white md:text-[3.5rem]" data-v-ff838a1d> Lebaran<br data-v-ff838a1d><em style="${ssrRenderStyle({ "font-style": "italic", "color": "rgba(255,255,255,0.55)" })}" data-v-ff838a1d>Collection 2026</em></h3><p class="mt-4 text-sm" style="${ssrRenderStyle({ "color": "rgba(255,255,255,0.5)" })}" data-v-ff838a1d>Kemurnian dalam Balutan Kesederhanaan</p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/koleksi",
        class: "mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-normal transition-opacity hover:opacity-85",
        style: { "background": "white", "color": "#090b0c" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Eksplor Koleksi <span class="flex h-5 w-5 items-center justify-center rounded-full text-xs" style="${ssrRenderStyle({ "background": "#090b0c", "color": "white" })}" data-v-ff838a1d${_scopeId}>→</span>`);
          } else {
            return [
              createTextVNode(" Eksplor Koleksi "),
              createVNode("span", {
                class: "flex h-5 w-5 items-center justify-center rounded-full text-xs",
                style: { "background": "#090b0c", "color": "white" }
              }, "→")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="absolute -right-20 -bottom-20 w-80 h-80 rounded-full opacity-5" style="${ssrRenderStyle({ "background": "#fabc3f" })}" data-v-ff838a1d></div><div class="absolute right-20 top-10 w-32 h-32 rounded-full opacity-5" style="${ssrRenderStyle({ "background": "#fabc3f" })}" data-v-ff838a1d></div></div></section><footer class="overflow-hidden px-5 pt-20 pb-10 md:px-12" style="${ssrRenderStyle({ "background": "#f5f5f2" })}" data-v-ff838a1d><div class="mx-auto max-w-5xl" data-v-ff838a1d><div class="mb-16 grid gap-10 sm:grid-cols-3" data-v-ff838a1d><div data-v-ff838a1d><p class="font-black text-xl tracking-tighter mb-3" style="${ssrRenderStyle({ "font-family": "'Inter Tight',sans-serif", "letter-spacing": "-0.04em" })}" data-v-ff838a1d>MINTS</p><p class="text-sm leading-6" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}" data-v-ff838a1d>Elegan. Syar&#39;i.<br data-v-ff838a1d>Dibuat Sepenuh Hati.</p></div><div data-v-ff838a1d><p class="mb-4 text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}" data-v-ff838a1d>Belanja</p><ul class="space-y-3 text-sm" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}" data-v-ff838a1d><li data-v-ff838a1d>`);
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
      _push(`</li><li data-v-ff838a1d>`);
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
      _push(`</li><li data-v-ff838a1d>`);
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
      _push(`</li><li data-v-ff838a1d>`);
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
      _push(`</li></ul></div><div data-v-ff838a1d><p class="mb-4 text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}" data-v-ff838a1d>Perusahaan</p><ul class="space-y-3 text-sm" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}" data-v-ff838a1d><li data-v-ff838a1d>`);
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
      _push(`</li><li data-v-ff838a1d>`);
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
      _push(`</li><li data-v-ff838a1d>`);
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
      _push(`</li><li data-v-ff838a1d>`);
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
      _push(`</li></ul></div></div><div class="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.1)" })}" data-v-ff838a1d><p class="text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}" data-v-ff838a1d>© 2026 Mints. Semua hak dilindungi.</p><p class="text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.3)" })}" data-v-ff838a1d>Powered by <a href="https://otomatisin.web.id" target="_blank" rel="noopener" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)", "text-decoration": "underline", "text-underline-offset": "3px" })}" data-v-ff838a1d>Otomatisin</a></p><div class="flex gap-4 text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}" data-v-ff838a1d>`);
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
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ff838a1d"]]);
export {
  index as default
};
//# sourceMappingURL=index-COrNfi8Z.js.map
