import { _ as __nuxt_component_0 } from "./nuxt-link-CuTev4Jq.js";
import { _ as __nuxt_component_1 } from "./client-only-CUemHDvz.js";
import { defineComponent, withAsyncContext, computed, ref, mergeProps, withCtx, createTextVNode, unref, openBlock, createBlock, createVNode, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { c as useRoute, a as useSeoMeta, _ as _export_sfc } from "../server.mjs";
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
import "/home/yasir/Documents/Project/mints/node_modules/ohash/dist/index.mjs";
import "@vue/shared";
import "./ssr-D-29j6RL.js";
import "./asyncData-BjQpEgQd.js";
import "/home/yasir/Documents/Project/mints/node_modules/perfect-debounce/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const { itemCount } = useCart();
    const { data: product, pending } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      `/api/products/${route.params.id}`,
      "$FYKhlVBAYv"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    useSeoMeta({ title: computed(() => product.value ? `${product.value.title} — MINTS` : "MINTS") });
    const activeImg = ref(0);
    const gallery = computed(() => product.value ? [product.value.imageUrl, ...product.value.images ?? []].filter(Boolean) : []);
    const selectedVariant = ref(null);
    ref(null);
    const addedToCart = ref(false);
    function variantStyle(v) {
      if (selectedVariant.value?.id === v.id) return "background:#090b0c;color:white";
      if (v.stock === 0 && product.value?.productType !== "PRE_ORDER") {
        return "background:rgba(9,11,12,0.03);color:rgba(9,11,12,0.25);text-decoration:line-through;cursor:not-allowed";
      }
      return "background:white;color:#090b0c";
    }
    const ctaDisabled = computed(() => {
      if (!product.value) return true;
      return addedToCart.value || product.value.status === "SOLD_OUT" || product.value.variants?.length > 0 && !selectedVariant.value;
    });
    const ctaStyle = computed(() => {
      if (addedToCart.value) return "background:rgba(34,197,94,0.15);color:rgb(22,163,74)";
      if (ctaDisabled.value) return "background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.4);cursor:not-allowed";
      return "background:#090b0c;color:white";
    });
    function formatPrice(price) {
      return Number(price).toLocaleString("id-ID");
    }
    function formatDate(iso) {
      return new Date(iso).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ClientOnly = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "min-h-screen antialiased",
        style: { "background": "#f5f5f2", "color": "#090b0c", "font-family": "'Inter Tight',system-ui,sans-serif" }
      }, _attrs))} data-v-dabfeb03><header class="sticky top-0 z-40 px-5 py-4 md:px-12" style="${ssrRenderStyle({ "background": "rgba(245,245,242,0.88)", "backdrop-filter": "blur(12px)", "border-bottom": "1px solid rgba(9,11,12,0.06)" })}" data-v-dabfeb03><div class="relative flex h-10 items-center max-w-5xl mx-auto" data-v-dabfeb03><button class="flex items-center gap-2 text-sm transition-opacity hover:opacity-60" style="${ssrRenderStyle({ "color": "#090b0c" })}" data-v-dabfeb03><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-dabfeb03><path d="M19 12H5M12 5l-7 7 7 7" data-v-dabfeb03></path></svg> Kembali </button>`);
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
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/cart",
        class: "ml-auto relative flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-normal transition-opacity hover:opacity-85",
        style: { "background": "#090b0c", "color": "white" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" data-v-dabfeb03${_scopeId}><circle cx="9" cy="21" r="1" data-v-dabfeb03${_scopeId}></circle><circle cx="20" cy="21" r="1" data-v-dabfeb03${_scopeId}></circle><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6" data-v-dabfeb03${_scopeId}></path></svg> Keranjang `);
            if (unref(itemCount) > 0) {
              _push2(`<span class="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-[10px] font-bold flex items-center justify-center px-1" style="${ssrRenderStyle({ "background": "#fabc3f", "color": "#090b0c" })}" data-v-dabfeb03${_scopeId}>${ssrInterpolate(unref(itemCount))}</span>`);
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
              createTextVNode(" Keranjang "),
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
      _push(`</div></header>`);
      if (unref(pending)) {
        _push(`<div class="flex flex-col items-center justify-center py-40 gap-4" data-v-dabfeb03><div class="w-8 h-8 rounded-full border-2 animate-spin" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.15)", "border-top-color": "#090b0c" })}" data-v-dabfeb03></div><p class="text-sm" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}" data-v-dabfeb03>Memuat produk…</p></div>`);
      } else if (!unref(product)) {
        _push(`<div class="flex flex-col items-center justify-center py-40 gap-4" data-v-dabfeb03><p class="text-5xl font-normal tracking-tight" data-v-dabfeb03>○</p><p class="text-lg font-normal" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}" data-v-dabfeb03>Produk tidak ditemukan</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "mt-2 rounded-full px-6 py-2.5 text-sm font-normal transition-opacity hover:opacity-85",
          style: { "background": "#090b0c", "color": "white" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Kembali ke Beranda`);
            } else {
              return [
                createTextVNode("Kembali ke Beranda")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<main class="mx-auto max-w-5xl px-5 py-10 md:px-12" data-v-dabfeb03><div class="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-14" data-v-dabfeb03><div class="space-y-3" data-v-dabfeb03><div class="relative overflow-hidden rounded-3xl aspect-[4/5] cursor-zoom-in" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.05)" })}" data-v-dabfeb03><img${ssrRenderAttr("src", unref(gallery)[unref(activeImg)])}${ssrRenderAttr("alt", unref(product).title)} class="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.02]" data-v-dabfeb03>`);
        if (unref(gallery).length > 1) {
          _push(`<!--[--><button class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-lg" style="${ssrRenderStyle({ "background": "rgba(255,255,255,0.85)", "color": "#090b0c", "backdrop-filter": "blur(8px)" })}" data-v-dabfeb03>‹</button><button class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-lg" style="${ssrRenderStyle({ "background": "rgba(255,255,255,0.85)", "color": "#090b0c", "backdrop-filter": "blur(8px)" })}" data-v-dabfeb03>›</button><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        if (unref(product).status === "SOLD_OUT") {
          _push(`<div class="absolute inset-0 flex items-center justify-center" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.5)" })}" data-v-dabfeb03><span class="rounded-full px-5 py-2 text-sm font-normal tracking-widest uppercase" style="${ssrRenderStyle({ "background": "rgba(255,255,255,0.15)", "color": "white", "backdrop-filter": "blur(8px)" })}" data-v-dabfeb03>Habis Terjual</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(gallery).length > 1) {
          _push(`<div class="flex gap-2 overflow-x-auto pb-1" data-v-dabfeb03><!--[-->`);
          ssrRenderList(unref(gallery), (img, i) => {
            _push(`<button class="shrink-0 w-16 h-16 rounded-2xl overflow-hidden transition-all" style="${ssrRenderStyle(i === unref(activeImg) ? "outline:2px solid #090b0c;outline-offset:2px" : "outline:2px solid transparent;opacity:0.55")}" data-v-dabfeb03><img${ssrRenderAttr("src", img)} class="w-full h-full object-cover" data-v-dabfeb03></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex flex-col gap-5" data-v-dabfeb03><div class="flex flex-wrap items-center gap-2" data-v-dabfeb03>`);
        if (unref(product).productType === "PRE_ORDER") {
          _push(`<span class="rounded-full px-3 py-1 text-xs font-normal tracking-wide" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.08)", "color": "#090b0c" })}" data-v-dabfeb03>Pre-Order</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(product).category) {
          _push(`<span class="rounded-full px-3 py-1 text-xs font-normal" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.05)", "color": "rgba(9,11,12,0.5)" })}" data-v-dabfeb03>${ssrInterpolate(unref(product).category.name)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="rounded-full px-3 py-1 text-xs font-normal" style="${ssrRenderStyle(unref(product).status === "AVAILABLE" ? "background:rgba(34,197,94,0.12);color:rgb(22,163,74)" : "background:rgba(9,11,12,0.05);color:rgba(9,11,12,0.4)")}" data-v-dabfeb03>${ssrInterpolate(unref(product).status === "AVAILABLE" ? "Tersedia" : "Habis")}</span></div><div class="border-b pb-5" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.1)" })}" data-v-dabfeb03><h1 class="text-[2rem] font-normal leading-[1.1] tracking-tight md:text-[2.5rem]" data-v-dabfeb03>${ssrInterpolate(unref(product).title)}</h1><div class="mt-3 flex flex-wrap items-end gap-3" data-v-dabfeb03><p class="text-[1.75rem] font-normal tabular-nums tracking-tight" data-v-dabfeb03>Rp ${ssrInterpolate(formatPrice(unref(product).price))}</p>`);
        if (unref(product).originalPrice) {
          _push(`<p class="text-base line-through tabular-nums" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}" data-v-dabfeb03>Rp ${ssrInterpolate(formatPrice(unref(product).originalPrice))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (unref(product).productType === "PRE_ORDER") {
          _push(`<div class="rounded-2xl p-4 border" style="${ssrRenderStyle({ "background": "rgba(250,188,63,0.1)", "border-color": "rgba(250,188,63,0.3)" })}" data-v-dabfeb03><p class="text-sm font-normal tracking-tight" style="${ssrRenderStyle({ "color": "#090b0c" })}" data-v-dabfeb03>Produk Pre-Order</p><p class="mt-1 text-sm" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}" data-v-dabfeb03>`);
          if (unref(product).estimatedReadyDate) {
            _push(`<!--[-->Estimasi selesai: <strong data-v-dabfeb03>${ssrInterpolate(formatDate(unref(product).estimatedReadyDate))}</strong><!--]-->`);
          } else {
            _push(`<!--[-->Estimasi produksi dikonfirmasi setelah pemesanan.<!--]-->`);
          }
          _push(`</p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(product).variants?.length) {
          _push(`<div class="space-y-3" data-v-dabfeb03><div class="flex items-center justify-between" data-v-dabfeb03><p class="text-sm font-normal" data-v-dabfeb03>Pilih Ukuran</p>`);
          if (unref(selectedVariant)) {
            _push(`<p class="text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}" data-v-dabfeb03>${ssrInterpolate(unref(selectedVariant).size)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="flex flex-wrap gap-2" data-v-dabfeb03><!--[-->`);
          ssrRenderList(unref(product).variants, (v) => {
            _push(`<button class="relative rounded-2xl px-5 py-2.5 text-sm font-normal transition-all" style="${ssrRenderStyle(variantStyle(v))}"${ssrIncludeBooleanAttr(v.stock === 0 && unref(product).productType !== "PRE_ORDER") ? " disabled" : ""} data-v-dabfeb03>${ssrInterpolate(v.size)} `);
            if (v.stock > 0 && v.stock <= 3) {
              _push(`<span class="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-[9px] font-normal flex items-center justify-center px-1" style="${ssrRenderStyle({ "background": "#fabc3f", "color": "#090b0c" })}" data-v-dabfeb03>${ssrInterpolate(v.stock)}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</button>`);
          });
          _push(`<!--]--></div><p class="text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}" data-v-dabfeb03>Angka kuning = sisa stok terbatas</p></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(product).material) {
          _push(`<div class="flex items-start gap-3 py-3 border-t" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.08)" })}" data-v-dabfeb03><div class="h-px w-5 mt-2 shrink-0" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.3)" })}" data-v-dabfeb03></div><div data-v-dabfeb03><p class="text-xs font-normal uppercase tracking-[0.12rem] mb-1" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}" data-v-dabfeb03>Bahan</p><p class="text-sm" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.7)" })}" data-v-dabfeb03>${ssrInterpolate(unref(product).material)}</p></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(product).description) {
          _push(`<p class="text-sm leading-7 whitespace-pre-line" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}" data-v-dabfeb03>${ssrInterpolate(unref(product).description)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex gap-3 pt-2" data-v-dabfeb03><button class="flex-1 rounded-full py-3.5 text-sm font-normal transition-all" style="${ssrRenderStyle(unref(ctaStyle))}"${ssrIncludeBooleanAttr(unref(ctaDisabled)) ? " disabled" : ""} data-v-dabfeb03>`);
        if (unref(addedToCart)) {
          _push(`<span data-v-dabfeb03>✓ Ditambahkan ke Keranjang</span>`);
        } else if (unref(product).status === "SOLD_OUT") {
          _push(`<span data-v-dabfeb03>Habis Terjual</span>`);
        } else if (unref(product).variants?.length > 0 && !unref(selectedVariant)) {
          _push(`<span data-v-dabfeb03>Pilih Ukuran Dulu</span>`);
        } else {
          _push(`<span data-v-dabfeb03>Tambah ke Keranjang</span>`);
        }
        _push(`</button>`);
        if (unref(itemCount) > 0) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/cart",
            class: "shrink-0 rounded-full px-5 py-3.5 text-sm font-normal border transition-opacity hover:opacity-70",
            style: { "border-color": "rgba(9,11,12,0.2)", "color": "#090b0c" }
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Lihat Keranjang`);
              } else {
                return [
                  createTextVNode("Lihat Keranjang")
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex items-center gap-2 rounded-2xl px-4 py-3" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.04)" })}" data-v-dabfeb03><svg class="w-4 h-4 shrink-0" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-v-dabfeb03><path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 10a2 2 0 002 2h8a2 2 0 002-2L19 8" data-v-dabfeb03></path></svg><p class="text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}" data-v-dabfeb03>Gratis ongkir untuk pembelian min. <strong style="${ssrRenderStyle({ "color": "#090b0c" })}" data-v-dabfeb03>Rp 500.000</strong></p></div></div></div></main>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/products/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _id_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-dabfeb03"]]);
export {
  _id_ as default
};
//# sourceMappingURL=_id_-t9I6s1le.js.map
