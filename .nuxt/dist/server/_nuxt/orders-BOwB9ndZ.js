import { _ as __nuxt_component_0 } from "./nuxt-link-CuTev4Jq.js";
import { defineComponent, ref, watch, mergeProps, withCtx, openBlock, createBlock, createVNode, createTextVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from "vue/server-renderer";
import "/home/yasir/Documents/Project/mints/node_modules/hookable/dist/index.mjs";
import { a as useSeoMeta } from "../server.mjs";
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
  __name: "orders",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Pesanan Saya — MINTS" });
    useAuth();
    const tabs = [
      { key: "all", label: "Semua" },
      { key: "pending_payment", label: "Belum Bayar" },
      { key: "processing", label: "Sedang Dikemas" },
      { key: "shipping", label: "Dikirim" },
      { key: "completed", label: "Selesai" },
      { key: "cancelled", label: "Dibatalkan" },
      { key: "returned", label: "Pengembalian" }
    ];
    const activeTab = ref("all");
    const { data: orders, pending, refresh } = useFetch(
      () => `/api/buyer/orders?status=${activeTab.value === "all" ? "" : activeTab.value}`,
      "$aXVI5EEJck"
      /* nuxt-injected */
    );
    watch(activeTab, () => refresh());
    function statusLabel(status) {
      const map = {
        PENDING_PAYMENT: "Belum Bayar",
        PAID: "Dibayar",
        IN_PRODUCTION: "Diproses",
        READY_TO_SHIP: "Siap Kirim",
        SHIPPED: "Dikirim",
        DELIVERED: "Selesai",
        CANCELLED: "Dibatalkan",
        REFUNDED: "Pengembalian"
      };
      return map[status] || status;
    }
    function statusStyle(status) {
      const map = {
        PENDING_PAYMENT: "background:rgba(250,188,63,0.18);color:#090b0c",
        PAID: "background:rgba(34,197,94,0.12);color:rgb(22,163,74)",
        IN_PRODUCTION: "background:rgba(59,130,246,0.12);color:rgb(37,99,235)",
        READY_TO_SHIP: "background:rgba(99,102,241,0.12);color:rgb(67,56,202)",
        SHIPPED: "background:rgba(99,102,241,0.12);color:rgb(67,56,202)",
        DELIVERED: "background:rgba(34,197,94,0.12);color:rgb(22,163,74)",
        CANCELLED: "background:rgba(239,68,68,0.1);color:rgb(185,28,28)",
        REFUNDED: "background:rgba(9,11,12,0.06);color:rgba(9,11,12,0.55)"
      };
      return map[status] || "background:rgba(9,11,12,0.06);color:rgba(9,11,12,0.5)";
    }
    function formatPrice(n) {
      return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(n);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "min-h-screen antialiased",
        style: { "background": "#f5f5f2", "color": "#090b0c", "font-family": "'Inter Tight',system-ui,sans-serif" }
      }, _attrs))}><header class="sticky top-0 z-40 px-5 py-4 md:px-12" style="${ssrRenderStyle({ "background": "rgba(245,245,242,0.88)", "backdrop-filter": "blur(12px)", "border-bottom": "1px solid rgba(9,11,12,0.06)" })}"><div class="relative flex h-10 items-center max-w-5xl mx-auto">`);
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
      _push(`<button class="ml-auto text-sm transition-opacity hover:opacity-60" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.55)" })}">Keluar</button></div></header><main class="mx-auto max-w-3xl px-5 py-10 md:px-12"><div class="mb-8"><div class="flex items-center gap-3 mb-3"><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}"></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Akun Saya</span></div><h2 class="text-[2rem] font-normal leading-tight tracking-tight">Pesanan Saya</h2></div><div class="flex rounded-full p-1 mb-6" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.08)" })}">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/account",
        class: "flex-1 text-center rounded-full py-2 text-sm font-normal",
        style: { "color": "rgba(9,11,12,0.6)" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Profil`);
          } else {
            return [
              createTextVNode("Profil")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/account/orders",
        class: "flex-1 text-center rounded-full py-2 text-sm font-normal",
        style: { "background": "#090b0c", "color": "white" }
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
      _push(`</div><div class="flex gap-1 overflow-x-auto pb-2 mb-6"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="shrink-0 rounded-full px-4 py-2 text-xs font-normal transition-all" style="${ssrRenderStyle(unref(activeTab) === tab.key ? "background:#090b0c;color:white" : "background:white;color:#090b0c")}">${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div>`);
      if (unref(pending)) {
        _push(`<div class="flex flex-col items-center justify-center py-20 gap-3"><div class="w-6 h-6 rounded-full border-2 animate-spin" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.15)", "border-top-color": "#090b0c" })}"></div><p class="text-sm" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">Memuat pesanan…</p></div>`);
      } else if (!unref(orders).length) {
        _push(`<div class="text-center py-24"><p class="text-5xl font-normal">○</p><p class="mt-4 text-sm" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Belum ada pesanan di kategori ini.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "mt-5 inline-block rounded-full px-7 py-3 text-sm font-normal",
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
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(unref(orders), (order) => {
          _push(`<div class="rounded-3xl p-5" style="${ssrRenderStyle({ "background": "white" })}"><div class="flex gap-4"><div class="w-20 h-20 rounded-2xl overflow-hidden shrink-0" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.05)" })}"><img${ssrRenderAttr("src", order.product.imageUrl)}${ssrRenderAttr("alt", order.product.title)} class="w-full h-full object-cover"></div><div class="flex-1 min-w-0"><p class="text-sm font-normal leading-snug truncate">${ssrInterpolate(order.product.title)}</p><p class="text-xs mt-1 tabular-nums" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">#${ssrInterpolate(order.id.slice(0, 8).toUpperCase())}</p><span class="inline-block mt-2 text-xs px-3 py-1 rounded-full font-normal" style="${ssrRenderStyle(statusStyle(order.status))}">${ssrInterpolate(statusLabel(order.status))}</span></div></div><div class="mt-4 pt-4 border-t flex flex-wrap items-center justify-between gap-3" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.08)" })}"><p class="text-sm font-normal tabular-nums">Rp ${ssrInterpolate(formatPrice(Number(order.product.price) + (order.shippingCost || 0)))}</p><div class="flex gap-2">`);
          if (order.status === "PENDING_PAYMENT" && order.payment?.paymentUrl) {
            _push(`<a${ssrRenderAttr("href", order.payment.paymentUrl)} class="rounded-full px-4 py-2 text-xs font-normal transition-opacity hover:opacity-85" style="${ssrRenderStyle({ "background": "#090b0c", "color": "white" })}">Bayar</a>`);
          } else {
            _push(`<!---->`);
          }
          if (order.shipment?.trackingNo) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: `/track?no=${order.shipment.trackingNo}&courier=${order.shipment.courier}`,
              class: "rounded-full px-4 py-2 text-xs font-normal border transition-opacity hover:opacity-70",
              style: { "border-color": "rgba(9,11,12,0.2)", "color": "#090b0c" }
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
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/account/orders.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=orders-BOwB9ndZ.js.map
