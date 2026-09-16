import { _ as __nuxt_component_0 } from "./nuxt-link-CuTev4Jq.js";
import { defineComponent, computed, ref, reactive, mergeProps, withCtx, createTextVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { a as useSeoMeta, c as useRoute } from "../server.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/ufo/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/defu/dist/defu.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/home/yasir/Documents/Project/mints/node_modules/hookable/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/nuxt/node_modules/unctx/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/h3/dist/index.mjs";
import "vue-router";
import "@vueuse/core";
import "tailwind-merge";
import "/home/yasir/Documents/Project/mints/node_modules/klona/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/@unhead/vue/dist/index.mjs";
import "@iconify/vue";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Akun — MINTS" });
    const route = useRoute();
    computed(() => String(route.query.redirect || "/account"));
    const isLogin = ref(true);
    const loading = ref(false);
    const error = ref("");
    const success = ref("");
    const form = reactive({ name: "", email: "", phone: "", password: "" });
    const canLogin = computed(() => form.phone.trim() && form.password.trim().length >= 6);
    const canRegister = computed(() => form.name.trim().length >= 2 && form.phone.trim() && form.password.trim().length >= 6);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "min-h-screen antialiased",
        style: { "background": "#f5f5f2", "color": "#090b0c", "font-family": "'Inter Tight',system-ui,sans-serif" }
      }, _attrs))}><header class="sticky top-0 z-40 px-5 py-4 md:px-12" style="${ssrRenderStyle({ "background": "rgba(245,245,242,0.88)", "backdrop-filter": "blur(12px)", "border-bottom": "1px solid rgba(9,11,12,0.06)" })}"><div class="relative flex h-10 items-center justify-center max-w-5xl mx-auto">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "font-black text-xl tracking-tighter",
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
      _push(`</div></header><main class="mx-auto max-w-md px-5 py-14 md:px-12"><div class="text-center mb-10"><div class="flex items-center justify-center gap-3 mb-4"><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}"></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Akun</span><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}"></div></div><h2 class="text-[2rem] font-normal leading-tight tracking-tight">${ssrInterpolate(unref(isLogin) ? "Masuk" : "Daftar")}</h2></div><div class="flex rounded-full p-1 mb-8" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.08)" })}"><button class="flex-1 rounded-full py-2 text-sm font-normal transition-all" style="${ssrRenderStyle(unref(isLogin) ? "background:#090b0c;color:white" : "color:rgba(9,11,12,0.6)")}">Masuk</button><button class="flex-1 rounded-full py-2 text-sm font-normal transition-all" style="${ssrRenderStyle(!unref(isLogin) ? "background:#090b0c;color:white" : "color:rgba(9,11,12,0.6)")}">Daftar</button></div>`);
      if (unref(isLogin)) {
        _push(`<form class="space-y-4"><div><label class="block text-sm font-normal mb-2" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}">Nomor HP</label><input${ssrRenderAttr("value", unref(form).phone)} type="tel" placeholder="08xxxxxxxxxx" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="${ssrRenderStyle({ "background": "white", "border": "1px solid rgba(9,11,12,0.12)", "color": "#090b0c" })}"></div><div><label class="block text-sm font-normal mb-2" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}">Password</label><input${ssrRenderAttr("value", unref(form).password)} type="password" placeholder="Password" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="${ssrRenderStyle({ "background": "white", "border": "1px solid rgba(9,11,12,0.12)", "color": "#090b0c" })}"></div><button type="submit" class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity" style="${ssrRenderStyle(unref(canLogin) ? "background:#090b0c;color:white" : "background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed")}"${ssrIncludeBooleanAttr(!unref(canLogin) || unref(loading)) ? " disabled" : ""}>${ssrInterpolate(unref(loading) ? "Memproses…" : "Masuk")}</button></form>`);
      } else {
        _push(`<form class="space-y-4"><div><label class="block text-sm font-normal mb-2" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}">Nama Lengkap</label><input${ssrRenderAttr("value", unref(form).name)} type="text" placeholder="Nama kamu" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="${ssrRenderStyle({ "background": "white", "border": "1px solid rgba(9,11,12,0.12)", "color": "#090b0c" })}"></div><div><label class="block text-sm font-normal mb-2" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}">Email</label><input${ssrRenderAttr("value", unref(form).email)} type="email" placeholder="email@contoh.com" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="${ssrRenderStyle({ "background": "white", "border": "1px solid rgba(9,11,12,0.12)", "color": "#090b0c" })}"></div><div><label class="block text-sm font-normal mb-2" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}">Nomor HP</label><input${ssrRenderAttr("value", unref(form).phone)} type="tel" placeholder="08xxxxxxxxxx" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="${ssrRenderStyle({ "background": "white", "border": "1px solid rgba(9,11,12,0.12)", "color": "#090b0c" })}"></div><div><label class="block text-sm font-normal mb-2" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}">Password</label><input${ssrRenderAttr("value", unref(form).password)} type="password" placeholder="Min. 6 karakter" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="${ssrRenderStyle({ "background": "white", "border": "1px solid rgba(9,11,12,0.12)", "color": "#090b0c" })}"></div><button type="submit" class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity" style="${ssrRenderStyle(unref(canRegister) ? "background:#090b0c;color:white" : "background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed")}"${ssrIncludeBooleanAttr(!unref(canRegister) || unref(loading)) ? " disabled" : ""}>${ssrInterpolate(unref(loading) ? "Memproses…" : "Daftar")}</button></form>`);
      }
      if (unref(error)) {
        _push(`<div class="mt-4 rounded-2xl p-4 text-sm" style="${ssrRenderStyle({ "background": "rgba(239,68,68,0.08)", "color": "rgb(185,28,28)" })}">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(success)) {
        _push(`<div class="mt-4 rounded-2xl p-4 text-sm" style="${ssrRenderStyle({ "background": "rgba(34,197,94,0.1)", "color": "rgb(22,163,74)" })}">${ssrInterpolate(unref(success))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=login-moRLk8fr.js.map
