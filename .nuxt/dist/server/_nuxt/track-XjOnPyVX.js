import { _ as __nuxt_component_0 } from "./nuxt-link-CuTev4Jq.js";
import { _ as __nuxt_component_1 } from "./client-only-CUemHDvz.js";
import { defineComponent, ref, mergeProps, withCtx, openBlock, createBlock, createVNode, createTextVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { a as useSeoMeta, c as useRoute } from "../server.mjs";
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
  __name: "track",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Lacak Paket — MINTS" });
    const route = useRoute();
    const trackingNo = ref(String(route.query.no || ""));
    const courier = ref(String(route.query.courier || "jne"));
    const loading = ref(false);
    const result = ref(null);
    const error = ref("");
    async function doTrack() {
      if (!trackingNo.value.trim()) return;
      loading.value = true;
      error.value = "";
      result.value = null;
      try {
        result.value = await $fetch("/api/track", { query: { no: trackingNo.value.trim(), courier: courier.value } });
      } catch (err) {
        error.value = err?.data?.statusMessage || "Data pengiriman tidak ditemukan";
      } finally {
        loading.value = false;
      }
    }
    if (trackingNo.value) doTrack();
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
      _push(`</div></header><main class="mx-auto max-w-3xl px-5 py-10 md:px-12"><div class="mb-8"><div class="flex items-center gap-3 mb-3"><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}"></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Pengiriman</span></div><h2 class="text-[2rem] font-normal leading-tight tracking-tight">Lacak Paket</h2></div><div class="rounded-3xl p-5 space-y-4" style="${ssrRenderStyle({ "background": "white" })}"><div class="flex flex-col sm:flex-row gap-3"><input${ssrRenderAttr("value", unref(trackingNo))} type="text" placeholder="Nomor resi..." class="flex-1 rounded-2xl px-4 py-3 text-sm focus:outline-none" style="${ssrRenderStyle({ "background": "#f5f5f2", "border": "1px solid rgba(9,11,12,0.12)", "color": "#090b0c" })}"><select class="rounded-2xl px-4 py-3 text-sm focus:outline-none" style="${ssrRenderStyle({ "background": "#f5f5f2", "border": "1px solid rgba(9,11,12,0.12)", "color": "#090b0c" })}"><option value="jne"${ssrIncludeBooleanAttr(Array.isArray(unref(courier)) ? ssrLooseContain(unref(courier), "jne") : ssrLooseEqual(unref(courier), "jne")) ? " selected" : ""}>JNE</option><option value="jnt"${ssrIncludeBooleanAttr(Array.isArray(unref(courier)) ? ssrLooseContain(unref(courier), "jnt") : ssrLooseEqual(unref(courier), "jnt")) ? " selected" : ""}>J&amp;T</option><option value="sicepat"${ssrIncludeBooleanAttr(Array.isArray(unref(courier)) ? ssrLooseContain(unref(courier), "sicepat") : ssrLooseEqual(unref(courier), "sicepat")) ? " selected" : ""}>SiCepat</option><option value="pos"${ssrIncludeBooleanAttr(Array.isArray(unref(courier)) ? ssrLooseContain(unref(courier), "pos") : ssrLooseEqual(unref(courier), "pos")) ? " selected" : ""}>POS</option><option value="tiki"${ssrIncludeBooleanAttr(Array.isArray(unref(courier)) ? ssrLooseContain(unref(courier), "tiki") : ssrLooseEqual(unref(courier), "tiki")) ? " selected" : ""}>TIKI</option></select><button class="rounded-full px-6 py-3 text-sm font-normal transition-opacity hover:opacity-85" style="${ssrRenderStyle(unref(trackingNo).trim() ? "background:#090b0c;color:white" : "background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed")}"${ssrIncludeBooleanAttr(!unref(trackingNo).trim() || unref(loading)) ? " disabled" : ""}>${ssrInterpolate(unref(loading) ? "Mencari…" : "Lacak")}</button></div></div>`);
      if (unref(error)) {
        _push(`<div class="mt-5 rounded-2xl p-4 text-sm" style="${ssrRenderStyle({ "background": "rgba(239,68,68,0.08)", "color": "rgb(185,28,28)" })}">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(result)) {
        _push(`<!--[--><div class="mt-6 rounded-3xl p-5" style="${ssrRenderStyle({ "background": "white" })}"><div class="flex items-start justify-between gap-3 mb-4"><div><p class="text-lg font-normal tracking-tight">${ssrInterpolate(unref(result).waybill_number)}</p><p class="text-sm mt-1" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">${ssrInterpolate(unref(result).summary?.courier_name)} · ${ssrInterpolate(unref(result).summary?.service_name)}</p></div><span class="text-xs px-3 py-1 rounded-full font-normal shrink-0" style="${ssrRenderStyle({ "background": "#fabc3f", "color": "#090b0c" })}">${ssrInterpolate(unref(result).delivery_status?.status || "N/A")}</span></div><div class="grid grid-cols-2 gap-4 pt-4 text-sm" style="${ssrRenderStyle({ "border-top": "1px solid rgba(9,11,12,0.08)" })}"><div><p class="text-xs uppercase tracking-[0.1rem] mb-1" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.35)" })}">Pengirim</p><p class="font-normal">${ssrInterpolate(unref(result).shipper?.name || "-")}</p><p class="text-xs mt-0.5" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">${ssrInterpolate(unref(result).origin?.city_name)}</p></div><div><p class="text-xs uppercase tracking-[0.1rem] mb-1" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.35)" })}">Penerima</p><p class="font-normal">${ssrInterpolate(unref(result).receiver?.name || "-")}</p><p class="text-xs mt-0.5" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">${ssrInterpolate(unref(result).destination?.city_name)}</p></div></div></div>`);
        if (unref(result).manifest?.length) {
          _push(`<div class="mt-6"><div class="flex items-center gap-3 mb-5"><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}"></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Riwayat Pengiriman</span></div><div class="relative space-y-6"><div class="absolute left-3 top-2 bottom-2 w-px" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.12)" })}"></div><!--[-->`);
          ssrRenderList(unref(result).manifest, (event, i) => {
            _push(`<div class="flex gap-4 relative"><div class="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center z-10" style="${ssrRenderStyle(i === 0 ? "background:#090b0c" : "background:#f5f5f2;border:1px solid rgba(9,11,12,0.15)")}"><span class="w-2 h-2 rounded-full" style="${ssrRenderStyle(i === 0 ? "background:white" : "background:rgba(9,11,12,0.3)")}"></span></div><div class="flex-1 pt-0.5"><p class="text-sm font-normal">${ssrInterpolate(event.manifest_description)}</p><p class="text-xs mt-1" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">${ssrInterpolate(event.manifest_city)} · ${ssrInterpolate(event.manifest_date)} ${ssrInterpolate(event.manifest_time)}</p></div></div>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/track.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=track-XjOnPyVX.js.map
