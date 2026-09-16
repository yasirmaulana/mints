import { _ as __nuxt_component_0 } from "./nuxt-link-CuTev4Jq.js";
import { _ as __nuxt_component_1 } from "./client-only-CUemHDvz.js";
import { defineComponent, ref, withAsyncContext, watch, computed, mergeProps, withCtx, createTextVNode, unref, openBlock, createBlock, createVNode, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderTeleport, ssrRenderClass } from "vue/server-renderer";
import { u as useHead, c as useRoute } from "../server.mjs";
import { u as useAuth } from "./useAuth-CCe8xS6q.js";
import { u as useCart } from "./useCart-C8uxK576.js";
import { u as useFetch } from "./fetch-CA9qG_rp.js";
import "/home/yasir/Documents/Project/mints/node_modules/ufo/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/defu/dist/defu.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/hookable/dist/index.mjs";
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
const perPage = 12;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "koleksi",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useHead({ title: "Koleksi — Mints" });
    const { isLoggedIn } = useAuth();
    const { itemCount } = useCart();
    const mobileMenuOpen = ref(false);
    const { data: products, pending } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/products",
      "$TZNLaRD4pY"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const { data: categories } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/categories",
      "$bCK6XcwaXe"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const search = ref("");
    const activeCategory = ref(null);
    const priceMin = ref(null);
    const priceMax = ref(null);
    const sortBy = ref("newest");
    const mobileFilter = ref(false);
    const currentPage = ref(1);
    watch([search, activeCategory, priceMin, priceMax, sortBy], () => {
      currentPage.value = 1;
    });
    const totalCount = computed(() => products.value?.length ?? 0);
    const filteredProducts = computed(() => {
      let list = [...products.value ?? []];
      if (activeCategory.value) list = list.filter((p) => p.categoryId === activeCategory.value);
      if (search.value.trim()) {
        const q = search.value.trim().toLowerCase();
        list = list.filter((p) => p.title.toLowerCase().includes(q) || p.category?.name?.toLowerCase().includes(q));
      }
      if (priceMin.value) list = list.filter((p) => Number(p.price) >= priceMin.value);
      if (priceMax.value) list = list.filter((p) => Number(p.price) <= priceMax.value);
      if (sortBy.value === "price_asc") list.sort((a, b) => Number(a.price) - Number(b.price));
      else if (sortBy.value === "price_desc") list.sort((a, b) => Number(b.price) - Number(a.price));
      else if (sortBy.value === "name_asc") list.sort((a, b) => a.title.localeCompare(b.title));
      else list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      return list;
    });
    const totalPages = computed(() => Math.ceil(filteredProducts.value.length / perPage));
    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * perPage;
      return filteredProducts.value.slice(start, start + perPage);
    });
    const pageNumbers = computed(() => {
      const total = totalPages.value;
      const cur = currentPage.value;
      if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
      const pages = [1];
      if (cur > 3) pages.push("...");
      for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
      if (cur < total - 2) pages.push("...");
      pages.push(total);
      return pages;
    });
    function formatPrice(price) {
      return Number(price).toLocaleString("id-ID");
    }
    function isNew(product) {
      return Date.now() - new Date(product.createdAt).getTime() < 14 * 24 * 60 * 60 * 1e3;
    }
    useRoute();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ClientOnly = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "min-h-screen antialiased",
        style: { "background": "#f5f5f2", "font-family": "'Inter Tight',system-ui,sans-serif", "color": "#090b0c" }
      }, _attrs))}><header class="fixed left-0 right-0 z-50 px-4 py-4 md:px-8 transition-colors duration-300" style="${ssrRenderStyle({ "background": "rgba(245,245,242,0.9)", "backdrop-filter": "blur(12px)", "border-bottom": "1px solid rgba(9,11,12,0.06)" })}"><div class="relative flex h-10 items-center max-w-6xl mx-auto">`);
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
      _push(`<nav class="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border px-2 py-1.5 backdrop-blur-md md:flex" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.08)", "background": "rgba(255,255,255,0.7)" })}">`);
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
        class: "rounded-full px-4 py-2 text-sm font-medium transition-colors",
        style: { "background": "rgba(9,11,12,0.07)", "color": "#090b0c" }
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
      _push(`</nav><div class="ml-auto flex items-center gap-2">`);
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
        class: "relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-normal transition-opacity hover:opacity-85",
        style: { "background": "#090b0c", "color": "white" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${_scopeId}><circle cx="9" cy="21" r="1"${_scopeId}></circle><circle cx="20" cy="21" r="1"${_scopeId}></circle><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"${_scopeId}></path></svg><span class="hidden sm:inline"${_scopeId}>Keranjang</span>`);
            if (unref(itemCount) > 0) {
              _push2(`<span class="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1" style="${ssrRenderStyle({ "background": "#fabc3f", "color": "#090b0c" })}"${_scopeId}>${ssrInterpolate(unref(itemCount))}</span>`);
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
      _push(`<button class="flex items-center justify-center w-9 h-9 rounded-full md:hidden" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.06)" })}" aria-label="Menu">`);
      if (!unref(mobileMenuOpen)) {
        _push(`<svg class="w-4 h-4" style="${ssrRenderStyle({ "color": "#090b0c" })}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`);
      } else {
        _push(`<svg class="w-4 h-4" style="${ssrRenderStyle({ "color": "#090b0c" })}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`);
      }
      _push(`</button></div></div>`);
      if (unref(mobileMenuOpen)) {
        _push(`<div class="md:hidden mt-3 rounded-2xl p-4 flex flex-col gap-1" style="${ssrRenderStyle({ "background": "rgba(255,255,255,0.96)", "backdrop-filter": "blur(16px)", "border": "1px solid rgba(9,11,12,0.08)" })}">`);
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
        _push(`<div class="my-1 border-t" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.08)" })}"></div>`);
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
      _push(`</header><div class="mx-auto max-w-6xl px-5 pb-24 md:px-10" style="${ssrRenderStyle({ "padding-top": "88px" })}"><div class="mb-8 pt-2"><h1 class="text-[2.2rem] font-normal tracking-tight leading-tight md:text-[3rem]">Koleksi</h1><p class="mt-1 text-sm" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">${ssrInterpolate(unref(totalCount))} produk tersedia</p></div><div class="flex gap-8"><aside class="hidden lg:block w-56 flex-shrink-0 space-y-8"><div><p class="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">Cari</p><div class="relative"><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Cari produk..." class="w-full rounded-none border-0 border-b py-2 pr-8 text-sm bg-transparent focus:outline-none placeholder:text-sm" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.2)", "color": "#090b0c" })}"><svg class="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg></div></div><div><p class="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">Kategori</p><div class="space-y-1"><button class="w-full flex items-center gap-2.5 py-1.5 text-sm text-left transition-colors group"><span class="w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors" style="${ssrRenderStyle(unref(activeCategory) === null ? "border-color:#090b0c;background:#090b0c" : "border-color:rgba(9,11,12,0.3)")}">`);
      if (unref(activeCategory) === null) {
        _push(`<span class="w-1.5 h-1.5 rounded-full bg-white"></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</span><span class="font-medium" style="${ssrRenderStyle(unref(activeCategory) === null ? "color:#090b0c" : "color:rgba(9,11,12,0.65)")}">Lihat Semua</span><span class="ml-auto text-xs tabular-nums" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.35)" })}">${ssrInterpolate(unref(totalCount))}</span></button><!--[-->`);
      ssrRenderList(unref(categories), (cat) => {
        _push(`<button class="w-full flex items-center gap-2.5 py-1.5 text-sm text-left transition-colors"><span class="w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center transition-colors" style="${ssrRenderStyle(unref(activeCategory) === cat.id ? "border-color:#090b0c;background:#090b0c" : "border-color:rgba(9,11,12,0.3)")}">`);
        if (unref(activeCategory) === cat.id) {
          _push(`<span class="w-1.5 h-1.5 rounded-full bg-white"></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</span><span style="${ssrRenderStyle(unref(activeCategory) === cat.id ? "color:#090b0c;font-weight:500" : "color:rgba(9,11,12,0.65)")}">${ssrInterpolate(cat.name)}</span><span class="ml-auto text-xs tabular-nums" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.35)" })}">${ssrInterpolate(cat._count?.products ?? 0)}</span></button>`);
      });
      _push(`<!--]--></div></div><div><p class="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">Harga</p><div class="flex items-center gap-2"><div class="flex-1"><span class="text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">Rp</span><input${ssrRenderAttr("value", unref(priceMin))} type="number" placeholder="Min" class="w-full border-0 border-b py-1.5 text-sm bg-transparent focus:outline-none mt-0.5" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.2)" })}"></div><span class="text-xs mb-1" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.3)" })}">–</span><div class="flex-1"><span class="text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">Rp</span><input${ssrRenderAttr("value", unref(priceMax))} type="number" placeholder="Max" class="w-full border-0 border-b py-1.5 text-sm bg-transparent focus:outline-none mt-0.5" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.2)" })}"></div></div></div></aside><div class="flex-1 min-w-0"><div class="flex items-center justify-between mb-5 gap-3"><button class="lg:hidden flex items-center gap-2 text-sm rounded-full px-4 py-2 border transition-colors" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.15)", "background": "white" })}"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="8" y1="12" x2="16" y2="12"></line><line x1="11" y1="18" x2="13" y2="18"></line></svg> Filter `);
      if (unref(activeCategory) || unref(priceMin) || unref(priceMax)) {
        _push(`<span class="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</button><div class="relative flex-1 lg:hidden"><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Cari produk..." class="w-full rounded-full border py-2 pl-4 pr-9 text-sm focus:outline-none" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.15)", "background": "white" })}"><svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.35)" })}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg></div><div class="flex items-center gap-2 ml-auto"><span class="text-xs uppercase tracking-widest hidden sm:block" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">Urutkan:</span><select class="text-sm font-medium bg-transparent border-0 focus:outline-none cursor-pointer appearance-none pr-5" style="${ssrRenderStyle({ "color": "#090b0c", "background-image": "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23090b0c%22 stroke-width=%222%22%3E%3Cpolyline points=%226 9 12 15 18 9%22/%3E%3C/svg%3E')", "background-repeat": "no-repeat", "background-position": "right 0 center" })}"><option value="newest"${ssrIncludeBooleanAttr(Array.isArray(unref(sortBy)) ? ssrLooseContain(unref(sortBy), "newest") : ssrLooseEqual(unref(sortBy), "newest")) ? " selected" : ""}>Terbaru</option><option value="price_asc"${ssrIncludeBooleanAttr(Array.isArray(unref(sortBy)) ? ssrLooseContain(unref(sortBy), "price_asc") : ssrLooseEqual(unref(sortBy), "price_asc")) ? " selected" : ""}>Harga Terendah</option><option value="price_desc"${ssrIncludeBooleanAttr(Array.isArray(unref(sortBy)) ? ssrLooseContain(unref(sortBy), "price_desc") : ssrLooseEqual(unref(sortBy), "price_desc")) ? " selected" : ""}>Harga Tertinggi</option><option value="name_asc"${ssrIncludeBooleanAttr(Array.isArray(unref(sortBy)) ? ssrLooseContain(unref(sortBy), "name_asc") : ssrLooseEqual(unref(sortBy), "name_asc")) ? " selected" : ""}>Nama A–Z</option></select></div></div>`);
      if (unref(activeCategory) || unref(priceMin) || unref(priceMax) || unref(search)) {
        _push(`<div class="flex flex-wrap gap-2 mb-5">`);
        if (unref(activeCategory)) {
          _push(`<button class="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs border transition-colors hover:bg-black/5" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.2)" })}">${ssrInterpolate(unref(categories)?.find((c) => c.id === unref(activeCategory))?.name)} <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"></path></svg></button>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(priceMin)) {
          _push(`<button class="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs border transition-colors hover:bg-black/5" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.2)" })}"> Min Rp ${ssrInterpolate(formatPrice(unref(priceMin)))} <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"></path></svg></button>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(priceMax)) {
          _push(`<button class="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs border transition-colors hover:bg-black/5" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.2)" })}"> Max Rp ${ssrInterpolate(formatPrice(unref(priceMax)))} <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"></path></svg></button>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(search)) {
          _push(`<button class="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs border transition-colors hover:bg-black/5" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.2)" })}"> &quot;${ssrInterpolate(unref(search))}&quot; <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"></path></svg></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="text-xs mb-5 hidden sm:block" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}"> Menampilkan ${ssrInterpolate(unref(paginatedProducts).length ? (unref(currentPage) - 1) * perPage + 1 : 0)}–${ssrInterpolate(Math.min(unref(currentPage) * perPage, unref(filteredProducts).length))} dari ${ssrInterpolate(unref(filteredProducts).length)} hasil </p>`);
      if (unref(pending)) {
        _push(`<div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"><!--[-->`);
        ssrRenderList(perPage, (i) => {
          _push(`<div class="rounded-2xl animate-pulse" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.06)", "aspect-ratio": "3/4" })}"></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (!unref(filteredProducts).length) {
        _push(`<div class="py-32 text-center"><p class="text-3xl mb-3" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.2)" })}">○</p><p class="text-base font-normal" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">Tidak ada produk ditemukan</p><button class="mt-3 text-sm underline underline-offset-4" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">Reset filter</button></div>`);
      } else {
        _push(`<div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8"><!--[-->`);
        ssrRenderList(unref(paginatedProducts), (product) => {
          _push(`<div class="group cursor-pointer"><div class="relative overflow-hidden rounded-2xl aspect-[3/4]" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.05)" })}"><img${ssrRenderAttr("src", product.imageUrl)}${ssrRenderAttr("alt", product.title)} class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy">`);
          if (product.status === "SOLD_OUT") {
            _push(`<div class="absolute inset-0 flex items-center justify-center" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.45)" })}"><span class="rounded-full px-3 py-1 text-[10px] uppercase tracking-widest font-normal" style="${ssrRenderStyle({ "background": "rgba(255,255,255,0.15)", "color": "white", "backdrop-filter": "blur(8px)" })}">Habis</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="absolute top-2.5 left-2.5 flex flex-col gap-1">`);
          if (product.productType === "PRE_ORDER") {
            _push(`<span class="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style="${ssrRenderStyle({ "background": "#090b0c", "color": "white" })}">Pre-Order</span>`);
          } else {
            _push(`<!---->`);
          }
          if (isNew(product)) {
            _push(`<span class="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style="${ssrRenderStyle({ "background": "#fabc3f", "color": "#090b0c" })}">Baru</span>`);
          } else {
            _push(`<!---->`);
          }
          if (product.sessionId) {
            _push(`<span class="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style="${ssrRenderStyle({ "background": "#ef4444", "color": "white" })}">Flash Sale</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div><div class="mt-3 text-center"><p class="text-[10px] uppercase tracking-widest mb-1" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">${ssrInterpolate(product.category?.name ?? "")}</p><p class="text-sm font-normal leading-snug tracking-tight">${ssrInterpolate(product.title)}</p><div class="mt-1.5 flex items-center justify-center gap-2"><p class="text-sm font-medium tabular-nums">Rp ${ssrInterpolate(formatPrice(product.price))}</p>`);
          if (product.originalPrice) {
            _push(`<p class="text-[11px] line-through tabular-nums" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">Rp ${ssrInterpolate(formatPrice(product.originalPrice))}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      if (unref(totalPages) > 1) {
        _push(`<div class="mt-12 flex items-center justify-center gap-1.5"><button class="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30" style="${ssrRenderStyle({ "border": "1px solid rgba(9,11,12,0.15)" })}"${ssrIncludeBooleanAttr(unref(currentPage) === 1) ? " disabled" : ""}><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg></button><!--[-->`);
        ssrRenderList(unref(pageNumbers), (p) => {
          _push(`<!--[-->`);
          if (p === "...") {
            _push(`<span class="w-8 h-8 flex items-center justify-center text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.3)" })}">…</span>`);
          } else {
            _push(`<button class="w-8 h-8 rounded-full text-sm transition-colors" style="${ssrRenderStyle(unref(currentPage) === p ? "background:#090b0c;color:white" : "border:1px solid rgba(9,11,12,0.15);color:rgba(9,11,12,0.7)")}">${ssrInterpolate(p)}</button>`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--><button class="w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-30" style="${ssrRenderStyle({ "border": "1px solid rgba(9,11,12,0.15)" })}"${ssrIncludeBooleanAttr(unref(currentPage) === unref(totalPages)) ? " disabled" : ""}><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><footer class="overflow-hidden px-5 pt-20 pb-10 md:px-12" style="${ssrRenderStyle({ "background": "#f5f5f2", "border-top": "1px solid rgba(9,11,12,0.08)" })}"><div class="mx-auto max-w-5xl"><div class="grid gap-12 sm:grid-cols-3 mb-12"><div><p class="font-black text-xl tracking-tighter mb-3" style="${ssrRenderStyle({ "font-family": "'Inter Tight',sans-serif", "letter-spacing": "-0.04em" })}">MINTS</p><p class="text-sm leading-6" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Elegan. Syar&#39;i.<br>Dibuat Sepenuh Hati.</p></div><div><p class="mb-4 text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">Belanja</p><ul class="space-y-3 text-sm" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}"><li>`);
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
      _push(`</li><li>`);
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
      _push(`</li><li>`);
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
      _push(`</li><li>`);
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
      _push(`</li></ul></div><div><p class="mb-4 text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">Perusahaan</p><ul class="space-y-3 text-sm" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}"><li>`);
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
      _push(`</li><li>`);
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
      _push(`</li><li>`);
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
      _push(`</li><li>`);
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
      _push(`</li></ul></div></div><div class="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.1)" })}"><p class="text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">© 2026 Mints. Semua hak dilindungi.</p><p class="text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.3)" })}">Powered by <a href="https://otomatisin.web.id" target="_blank" rel="noopener" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)", "text-decoration": "underline", "text-underline-offset": "3px" })}">Otomatisin</a></p><div class="flex gap-4 text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">`);
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
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(mobileFilter)) {
          _push2(`<div class="fixed inset-0 z-50 flex lg:hidden"><div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div><div class="relative ml-auto w-72 h-full bg-white shadow-2xl overflow-y-auto p-6 space-y-8"><div class="flex items-center justify-between"><p class="font-semibold text-sm">Filter</p><button class="p-1 rounded-full hover:bg-gray-100"><svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"></path></svg></button></div><div><p class="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">Cari</p><div class="relative"><input${ssrRenderAttr("value", unref(search))} type="text" placeholder="Cari produk..." class="w-full rounded-full border py-2 pl-4 pr-9 text-sm focus:outline-none" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.2)" })}"><svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.35)" })}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg></div></div><div><p class="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">Kategori</p><div class="space-y-1"><button class="w-full flex items-center gap-2.5 py-1.5 text-sm text-left"><span class="w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center" style="${ssrRenderStyle(unref(activeCategory) === null ? "border-color:#090b0c;background:#090b0c" : "border-color:rgba(9,11,12,0.3)")}">`);
          if (unref(activeCategory) === null) {
            _push2(`<span class="w-1.5 h-1.5 rounded-full bg-white"></span>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</span><span class="${ssrRenderClass(unref(activeCategory) === null ? "font-medium" : "")}">Lihat Semua</span><span class="ml-auto text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.35)" })}">${ssrInterpolate(unref(totalCount))}</span></button><!--[-->`);
          ssrRenderList(unref(categories), (cat) => {
            _push2(`<button class="w-full flex items-center gap-2.5 py-1.5 text-sm text-left"><span class="w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center" style="${ssrRenderStyle(unref(activeCategory) === cat.id ? "border-color:#090b0c;background:#090b0c" : "border-color:rgba(9,11,12,0.3)")}">`);
            if (unref(activeCategory) === cat.id) {
              _push2(`<span class="w-1.5 h-1.5 rounded-full bg-white"></span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</span><span class="${ssrRenderClass(unref(activeCategory) === cat.id ? "font-medium" : "")}">${ssrInterpolate(cat.name)}</span><span class="ml-auto text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.35)" })}">${ssrInterpolate(cat._count?.products ?? 0)}</span></button>`);
          });
          _push2(`<!--]--></div></div><div><p class="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">Harga</p><div class="flex items-center gap-2"><input${ssrRenderAttr("value", unref(priceMin))} type="number" placeholder="Min" class="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.2)" })}"><span class="text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.3)" })}">–</span><input${ssrRenderAttr("value", unref(priceMax))} type="number" placeholder="Max" class="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.2)" })}"></div></div><button class="w-full rounded-full py-3 text-sm font-medium transition-opacity hover:opacity-85" style="${ssrRenderStyle({ "background": "#090b0c", "color": "white" })}"> Tampilkan Hasil </button></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/koleksi.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=koleksi-Ch95-PWX.js.map
