import { _ as __nuxt_component_0 } from "./nuxt-link-CuTev4Jq.js";
import { _ as __nuxt_component_1 } from "./client-only-CUemHDvz.js";
import { defineComponent, ref, mergeProps, withCtx, openBlock, createBlock, createVNode, createTextVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { a as useSeoMeta } from "../server.mjs";
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
  __name: "orders",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Pesanan Saya — MINTS" });
    const phoneInput = ref("");
    const phoneVerified = ref(false);
    const loading = ref(false);
    const orders = ref([]);
    function statusLabel(status) {
      const map = {
        PENDING_PAYMENT: "Menunggu Bayar",
        PAID: "Dibayar",
        IN_PRODUCTION: "Diproses",
        READY_TO_SHIP: "Siap Kirim",
        CANCELLED: "Dibatalkan",
        REFUNDED: "Dikembalikan"
      };
      return map[status] || status;
    }
    function statusStyle(status) {
      const map = {
        PENDING_PAYMENT: "background:rgba(250,188,63,0.18);color:#090b0c",
        PAID: "background:rgba(34,197,94,0.12);color:rgb(22,163,74)",
        IN_PRODUCTION: "background:rgba(59,130,246,0.12);color:rgb(37,99,235)",
        READY_TO_SHIP: "background:rgba(99,102,241,0.12);color:rgb(67,56,202)",
        CANCELLED: "background:rgba(239,68,68,0.1);color:rgb(185,28,28)",
        REFUNDED: "background:rgba(9,11,12,0.06);color:rgba(9,11,12,0.55)"
      };
      return map[status] || "background:rgba(9,11,12,0.06);color:rgba(9,11,12,0.5)";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ClientOnly = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "min-h-screen antialiased",
        style: { "background": "#f5f5f2", "color": "#090b0c", "font-family": "'Inter Tight',system-ui,sans-serif" }
      }, _attrs))}><header class="sticky top-0 z-40 px-5 py-4 md:px-12" style="${ssrRenderStyle({ "background": "rgba(245,245,242,0.88)", "backdrop-filter": "blur(12px)", "border-bottom": "1px solid rgba(9,11,12,0.06)" })}"><div class="relative flex h-10 items-center max-w-3xl mx-auto">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2 text-sm transition-opacity hover:opacity-60",
        style: { "color": "#090b0c" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"${_scopeId}><path d="M19 12H5M12 5l-7 7 7 7"${_scopeId}></path></svg> Beranda `);
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
              createTextVNode(" Beranda ")
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
      _push(`</div></header><main class="mx-auto max-w-3xl px-5 py-10 md:px-12"><div class="mb-8"><div class="flex items-center gap-3 mb-3"><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}"></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Pembeli</span></div><h2 class="text-[2rem] font-normal leading-tight tracking-tight">Pesanan Saya</h2></div>`);
      if (!unref(phoneVerified)) {
        _push(`<div class="max-w-md space-y-5"><p class="text-sm leading-6" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.55)" })}">Masukkan nomor HP yang kamu gunakan saat checkout untuk melihat status pesanan.</p><div class="space-y-3"><input${ssrRenderAttr("value", unref(phoneInput))} type="tel" placeholder="08xxxxxxxxxx" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="${ssrRenderStyle({ "background": "white", "border": "1px solid rgba(9,11,12,0.12)", "color": "#090b0c" })}"><button class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity" style="${ssrRenderStyle(unref(phoneInput).trim() ? "background:#090b0c;color:white" : "background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed")}"${ssrIncludeBooleanAttr(!unref(phoneInput).trim() || unref(loading)) ? " disabled" : ""}>${ssrInterpolate(unref(loading) ? "Mencari…" : "Cari Pesanan")}</button></div></div>`);
      } else {
        _push(`<!--[--><button class="text-sm mb-6 underline underline-offset-4" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">Ganti nomor HP</button>`);
        if (!unref(orders).length) {
          _push(`<div class="text-center py-24"><p class="text-5xl font-normal">○</p><p class="mt-4 text-sm" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Tidak ada pesanan ditemukan untuk nomor ini.</p></div>`);
        } else {
          _push(`<div class="space-y-4"><!--[-->`);
          ssrRenderList(unref(orders), (order) => {
            _push(`<div class="rounded-3xl p-5" style="${ssrRenderStyle({ "background": "white" })}"><div class="flex gap-4"><div class="w-20 h-20 rounded-2xl overflow-hidden shrink-0" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.05)" })}"><img${ssrRenderAttr("src", order.product.imageUrl)}${ssrRenderAttr("alt", order.product.title)} class="w-full h-full object-cover"></div><div class="flex-1 min-w-0"><p class="text-sm font-normal leading-snug truncate">${ssrInterpolate(order.product.title)}</p><p class="text-xs mt-1 tabular-nums" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">#${ssrInterpolate(order.id.slice(0, 8).toUpperCase())}</p><div class="flex flex-wrap gap-2 mt-2"><span class="text-xs px-3 py-1 rounded-full font-normal" style="${ssrRenderStyle(statusStyle(order.status))}">${ssrInterpolate(statusLabel(order.status))}</span>`);
            if (order.payment?.status === "paid") {
              _push(`<span class="text-xs px-3 py-1 rounded-full font-normal" style="${ssrRenderStyle({ "background": "rgba(34,197,94,0.12)", "color": "rgb(22,163,74)" })}">Lunas</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div></div>`);
            if (order.shipment?.trackingNo) {
              _push(`<div class="mt-4 pt-4 flex items-center justify-between text-xs" style="${ssrRenderStyle({ "border-top": "1px solid rgba(9,11,12,0.08)", "color": "rgba(9,11,12,0.45)" })}"><span><strong style="${ssrRenderStyle({ "color": "#090b0c" })}">${ssrInterpolate(order.shipment.courier?.toUpperCase())}</strong> · Resi ${ssrInterpolate(order.shipment.trackingNo)}</span>`);
              _push(ssrRenderComponent(_component_NuxtLink, {
                to: `/track?no=${order.shipment.trackingNo}&courier=${order.shipment.courier}`,
                class: "rounded-full px-3 py-1 text-xs font-normal transition-opacity hover:opacity-85",
                style: { "background": "#090b0c", "color": "white" }
              }, {
                default: withCtx((_, _push2, _parent2, _scopeId) => {
                  if (_push2) {
                    _push2(`Lacak`);
                  } else {
                    return [
                      createTextVNode("Lacak")
                    ];
                  }
                }),
                _: 2
              }, _parent));
              _push(`</div>`);
            } else {
              _push(`<!---->`);
            }
            if (order.status === "PENDING_PAYMENT" && order.payment?.paymentUrl) {
              _push(`<div class="mt-4"><a${ssrRenderAttr("href", order.payment.paymentUrl)} class="block w-full text-center rounded-full py-3 text-sm font-normal" style="${ssrRenderStyle({ "background": "#090b0c", "color": "white" })}">Bayar Sekarang</a></div>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`<!--]-->`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/orders.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=orders-CuUqQ-Zm.js.map
