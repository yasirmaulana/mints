import { _ as __nuxt_component_0 } from "./nuxt-link-CuTev4Jq.js";
import { defineComponent, reactive, ref, computed, mergeProps, withCtx, openBlock, createBlock, createVNode, createTextVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from "vue/server-renderer";
import "/home/yasir/Documents/Project/mints/node_modules/hookable/dist/index.mjs";
import { a as useSeoMeta } from "../server.mjs";
import { u as useAuth } from "./useAuth-CCe8xS6q.js";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Akun Saya — MINTS" });
    useAuth();
    const profile = reactive({ name: "", email: "", phone: "", gender: "", birthDate: "" });
    const originalProfile = reactive({ name: "", email: "", phone: "", gender: "", birthDate: "" });
    const savingProfile = ref(false);
    const profileMessage = ref(null);
    const password = reactive({ current: "", new: "" });
    const savingPassword = ref(false);
    const passwordMessage = ref(null);
    const profileChanged = computed(() => {
      return profile.name !== originalProfile.name || profile.email !== originalProfile.email || profile.phone !== originalProfile.phone || profile.gender !== originalProfile.gender || profile.birthDate !== originalProfile.birthDate;
    });
    const canChangePassword = computed(() => password.current.length >= 6 && password.new.length >= 6);
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
      _push(`<button class="ml-auto text-sm transition-opacity hover:opacity-60" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.55)" })}">Keluar</button></div></header><main class="mx-auto max-w-2xl px-5 py-10 md:px-12"><div class="mb-8"><div class="flex items-center gap-3 mb-3"><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}"></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Akun Saya</span></div><h2 class="text-[2rem] font-normal leading-tight tracking-tight">Profil</h2></div><div class="flex rounded-full p-1 mb-8" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.08)" })}">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/account",
        class: "flex-1 text-center rounded-full py-2 text-sm font-normal",
        style: { "background": "#090b0c", "color": "white" }
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
        style: { "color": "rgba(9,11,12,0.6)" }
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
      _push(`</div><div class="rounded-3xl p-6 md:p-8 space-y-6" style="${ssrRenderStyle({ "background": "white" })}"><div class="grid gap-5 sm:grid-cols-2"><div><label class="block text-sm font-normal mb-2" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}">Nama Lengkap</label><input${ssrRenderAttr("value", unref(profile).name)} type="text" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="${ssrRenderStyle({ "background": "#f5f5f2", "border": "1px solid rgba(9,11,12,0.12)", "color": "#090b0c" })}"></div><div><label class="block text-sm font-normal mb-2" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}">Email</label><input${ssrRenderAttr("value", unref(profile).email)} type="email" placeholder="Opsional" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="${ssrRenderStyle({ "background": "#f5f5f2", "border": "1px solid rgba(9,11,12,0.12)", "color": "#090b0c" })}"></div><div><label class="block text-sm font-normal mb-2" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}">Nomor HP</label><input${ssrRenderAttr("value", unref(profile).phone)} type="tel" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="${ssrRenderStyle({ "background": "#f5f5f2", "border": "1px solid rgba(9,11,12,0.12)", "color": "#090b0c" })}"></div><div><label class="block text-sm font-normal mb-2" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}">Tanggal Lahir</label><input${ssrRenderAttr("value", unref(profile).birthDate)} type="date" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="${ssrRenderStyle({ "background": "#f5f5f2", "border": "1px solid rgba(9,11,12,0.12)", "color": "#090b0c" })}"></div><div class="sm:col-span-2"><label class="block text-sm font-normal mb-2" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}">Jenis Kelamin</label><div class="flex gap-3"><button type="button" class="px-5 py-2.5 rounded-full text-sm font-normal transition-all" style="${ssrRenderStyle(unref(profile).gender === "M" ? "background:#090b0c;color:white" : "background:#f5f5f2;color:#090b0c")}">Laki-laki</button><button type="button" class="px-5 py-2.5 rounded-full text-sm font-normal transition-all" style="${ssrRenderStyle(unref(profile).gender === "F" ? "background:#090b0c;color:white" : "background:#f5f5f2;color:#090b0c")}">Perempuan</button></div></div></div><button class="w-full rounded-full py-3.5 text-sm font-normal transition-opacity" style="${ssrRenderStyle(unref(profileChanged) ? "background:#090b0c;color:white" : "background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed")}"${ssrIncludeBooleanAttr(!unref(profileChanged) || unref(savingProfile)) ? " disabled" : ""}>${ssrInterpolate(unref(savingProfile) ? "Menyimpan…" : "Simpan Profil")}</button>`);
      if (unref(profileMessage)) {
        _push(`<div class="rounded-2xl p-4 text-sm" style="${ssrRenderStyle(unref(profileMessage).type === "success" ? "background:rgba(34,197,94,0.1);color:rgb(22,163,74)" : "background:rgba(239,68,68,0.08);color:rgb(185,28,28)")}">${ssrInterpolate(unref(profileMessage).text)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="border-t pt-6" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.08)" })}"><p class="text-sm font-normal mb-4">Ubah Password</p><div class="grid gap-4 sm:grid-cols-2"><input${ssrRenderAttr("value", unref(password).current)} type="password" placeholder="Password lama" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="${ssrRenderStyle({ "background": "#f5f5f2", "border": "1px solid rgba(9,11,12,0.12)", "color": "#090b0c" })}"><input${ssrRenderAttr("value", unref(password).new)} type="password" placeholder="Password baru" class="w-full rounded-2xl px-4 py-3 text-sm focus:outline-none" style="${ssrRenderStyle({ "background": "#f5f5f2", "border": "1px solid rgba(9,11,12,0.12)", "color": "#090b0c" })}"></div><button class="w-full mt-4 rounded-full py-3.5 text-sm font-normal transition-opacity" style="${ssrRenderStyle(unref(canChangePassword) ? "background:#090b0c;color:white" : "background:rgba(9,11,12,0.08);color:rgba(9,11,12,0.35);cursor:not-allowed")}"${ssrIncludeBooleanAttr(!unref(canChangePassword) || unref(savingPassword)) ? " disabled" : ""}>${ssrInterpolate(unref(savingPassword) ? "Menyimpan…" : "Ubah Password")}</button>`);
      if (unref(passwordMessage)) {
        _push(`<div class="mt-4 rounded-2xl p-4 text-sm" style="${ssrRenderStyle(unref(passwordMessage).type === "success" ? "background:rgba(34,197,94,0.1);color:rgb(22,163,74)" : "background:rgba(239,68,68,0.08);color:rgb(185,28,28)")}">${ssrInterpolate(unref(passwordMessage).text)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/account/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-Dl89EsAE.js.map
