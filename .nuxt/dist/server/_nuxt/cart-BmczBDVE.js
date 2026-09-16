import { _ as __nuxt_component_0 } from "./nuxt-link-CuTev4Jq.js";
import { _ as __nuxt_component_1 } from "./client-only-CUemHDvz.js";
import { defineComponent, ref, watch, mergeProps, withCtx, createTextVNode, unref, openBlock, createBlock, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { a as useSeoMeta } from "../server.mjs";
import { u as useCart } from "./useCart-C8uxK576.js";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cart",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Keranjang — MINTS" });
    const { cartItems, itemCount, subtotal, freeShippingProgress, freeShippingRemaining, updateQty } = useCart();
    function formatPrice(n) {
      return n.toLocaleString("id-ID");
    }
    const stockMap = ref({});
    async function fetchStock() {
      const ids = cartItems.value.map((i) => i.variantId).filter(Boolean);
      if (!ids.length) return;
      const data = await $fetch("/api/products/stock", {
        query: { variantIds: ids.join(",") }
      });
      stockMap.value = data;
      for (const item of cartItems.value) {
        if (item.variantId && data[item.variantId] !== void 0 && item.qty > data[item.variantId]) {
          updateQty(item.productId, item.variantId, data[item.variantId]);
        }
      }
    }
    watch(cartItems, fetchStock, { deep: false });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ClientOnly = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "min-h-screen antialiased",
        style: { "background": "#f5f5f2", "color": "#090b0c", "font-family": "'Inter Tight',system-ui,sans-serif" }
      }, _attrs))}><header class="sticky top-0 z-40 px-5 py-4 md:px-12" style="${ssrRenderStyle({ "background": "rgba(245,245,242,0.88)", "backdrop-filter": "blur(12px)", "border-bottom": "1px solid rgba(9,11,12,0.06)" })}"><div class="relative flex h-10 items-center max-w-5xl mx-auto"><button class="flex items-center gap-2 text-sm transition-opacity hover:opacity-60" style="${ssrRenderStyle({ "color": "#090b0c" })}"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 12H5M12 5l-7 7 7 7"></path></svg> Lanjut Belanja </button>`);
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
      _push(`<p class="ml-auto text-sm font-normal tabular-nums" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">${ssrInterpolate(unref(itemCount))} item</p></div></header><main class="mx-auto max-w-5xl px-5 py-10 md:px-12">`);
      if (!unref(cartItems).length) {
        _push(`<div class="flex flex-col items-center justify-center py-40 gap-5"><svg class="w-12 h-12" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.2)" })}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"></path></svg><div class="text-center"><p class="text-lg font-normal tracking-tight">Keranjangmu masih kosong</p><p class="mt-1 text-sm" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">Temukan produk yang kamu suka</p></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "rounded-full px-7 py-3 text-sm font-normal transition-opacity hover:opacity-85",
          style: { "background": "#090b0c", "color": "white" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Lihat Produk`);
            } else {
              return [
                createTextVNode("Lihat Produk")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="grid gap-6 lg:grid-cols-[1fr_320px] lg:gap-10"><div class="space-y-3"><div class="flex items-center gap-3 mb-6"><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}"></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Produk Dipilih</span></div><!--[-->`);
        ssrRenderList(unref(cartItems), (item) => {
          _push(`<div class="flex gap-4 rounded-3xl p-4" style="${ssrRenderStyle({ "background": "white" })}"><div class="shrink-0 w-20 h-20 rounded-2xl overflow-hidden" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.05)" })}"><img${ssrRenderAttr("src", item.imageUrl)}${ssrRenderAttr("alt", item.title)} class="w-full h-full object-cover"></div><div class="flex-1 min-w-0"><p class="text-sm font-normal leading-snug tracking-tight line-clamp-2">${ssrInterpolate(item.title)}</p>`);
          if (item.size) {
            _push(`<p class="mt-1 text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">Ukuran: ${ssrInterpolate(item.size)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<p class="mt-2 text-sm font-normal tabular-nums">Rp ${ssrInterpolate(formatPrice(item.price * item.qty))}</p></div><div class="flex flex-col items-end justify-between shrink-0">`);
          if (item.variantId && unref(stockMap)[item.variantId] !== void 0 && item.qty >= unref(stockMap)[item.variantId]) {
            _push(`<p class="text-[10px] mb-1 text-right" style="${ssrRenderStyle({ "color": "rgb(220,38,38)" })}">Stok tersisa ${ssrInterpolate(unref(stockMap)[item.variantId])}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex items-center rounded-full overflow-hidden" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.06)" })}"><button class="w-8 h-8 flex items-center justify-center text-lg leading-none transition-colors hover:bg-black/10" style="${ssrRenderStyle({ "color": "#090b0c" })}">−</button><span class="w-7 text-center text-sm tabular-nums font-normal">${ssrInterpolate(item.qty)}</span><button class="w-8 h-8 flex items-center justify-center text-lg leading-none transition-colors hover:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed" style="${ssrRenderStyle({ "color": "#090b0c" })}"${ssrIncludeBooleanAttr(item.variantId ? item.qty >= (unref(stockMap)[item.variantId] ?? Infinity) : false) ? " disabled" : ""}>+</button></div><button class="text-xs transition-opacity hover:opacity-100 opacity-40" style="${ssrRenderStyle({ "color": "#090b0c" })}">Hapus</button></div></div>`);
        });
        _push(`<!--]--></div><div class="space-y-4"><div class="flex items-center gap-3 mb-6"><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}"></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Ringkasan</span></div><div class="rounded-3xl p-6 space-y-5" style="${ssrRenderStyle({ "background": "white" })}"><div class="space-y-2"><div class="flex items-center justify-between"><span class="text-xs" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Gratis ongkir</span><span class="text-xs font-normal" style="${ssrRenderStyle(unref(freeShippingRemaining) === 0 ? "color:rgb(22,163,74)" : "color:rgba(9,11,12,0.5)")}">${ssrInterpolate(unref(freeShippingRemaining) === 0 ? "Kamu dapat gratis ongkir!" : `kurang Rp ${formatPrice(unref(freeShippingRemaining))}`)}</span></div><div class="h-1.5 rounded-full overflow-hidden" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.08)" })}"><div class="h-full rounded-full transition-all duration-500" style="${ssrRenderStyle(`width:${Math.min(unref(freeShippingProgress) * 100, 100)}%;background:${unref(freeShippingRemaining) === 0 ? "rgb(22,163,74)" : "#090b0c"}`)}"></div></div></div><div class="border-t pt-4 space-y-3" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.08)" })}"><div class="flex justify-between text-sm"><span style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Subtotal (${ssrInterpolate(unref(itemCount))} item)</span><span class="tabular-nums font-normal">Rp ${ssrInterpolate(formatPrice(unref(subtotal)))}</span></div><div class="flex justify-between text-sm"><span style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Ongkir</span><span style="${ssrRenderStyle(unref(freeShippingRemaining) === 0 ? "color:rgb(22,163,74)" : "color:rgba(9,11,12,0.35)")}">${ssrInterpolate(unref(freeShippingRemaining) === 0 ? "GRATIS" : "dihitung saat checkout")}</span></div></div><div class="border-t pt-4 flex justify-between" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.08)" })}"><span class="text-sm font-normal tracking-tight">Total</span><span class="text-lg font-normal tabular-nums tracking-tight">Rp ${ssrInterpolate(formatPrice(unref(subtotal)))}</span></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/checkout",
          class: "flex items-center justify-center gap-2 w-full rounded-full py-3.5 text-sm font-normal transition-opacity hover:opacity-85",
          style: { "background": "#090b0c", "color": "white" }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Lanjut ke Checkout <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${_scopeId}><path d="M5 12h14M12 5l7 7-7 7"${_scopeId}></path></svg>`);
            } else {
              return [
                createTextVNode(" Lanjut ke Checkout "),
                (openBlock(), createBlock("svg", {
                  class: "w-3.5 h-3.5",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2"
                }, [
                  createVNode("path", { d: "M5 12h14M12 5l7 7-7 7" })
                ]))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="flex items-start gap-3 rounded-2xl px-4 py-3" style="${ssrRenderStyle({ "background": "rgba(250,188,63,0.12)" })}"><svg class="w-4 h-4 shrink-0 mt-0.5" style="${ssrRenderStyle({ "color": "#090b0c" })}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg><p class="text-xs leading-5" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.65)" })}">Gratis ongkir ke seluruh Indonesia untuk pembelian min. <strong style="${ssrRenderStyle({ "color": "#090b0c" })}">Rp 500.000</strong></p></div></div></div>`);
      }
      _push(`</main>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cart.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=cart-BmczBDVE.js.map
