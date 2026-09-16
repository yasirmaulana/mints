import { _ as __nuxt_component_0 } from "./nuxt-link-CuTev4Jq.js";
import { _ as __nuxt_component_1 } from "./client-only-CUemHDvz.js";
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, openBlock, createBlock, createVNode, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { u as useHead } from "../server.mjs";
import { u as useAuth } from "./useAuth-CCe8xS6q.js";
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
import "./cookie-Dh-9PoSj.js";
import "/home/yasir/Documents/Project/mints/node_modules/nuxt/node_modules/cookie-es/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/destr/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/ohash/dist/index.mjs";
import "./ssr-D-29j6RL.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "tentang-kami",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Tentang Kami — Mints" });
    const { isLoggedIn } = useAuth();
    const { itemCount } = useCart();
    const mobileMenuOpen = ref(false);
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
            _push2(`<svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"${_scopeId}><circle cx="9" cy="21" r="1"${_scopeId}></circle><circle cx="20" cy="21" r="1"${_scopeId}></circle><path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6"${_scopeId}></path></svg> Keranjang `);
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
      _push(`<button class="md:hidden flex items-center justify-center w-9 h-9 rounded-full" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.06)" })}" aria-label="Menu">`);
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
      _push(`</header><section class="relative overflow-hidden flex flex-col items-center justify-end px-5 md:px-12" style="${ssrRenderStyle({ "background": "#090b0c", "min-height": "60vh", "padding-top": "120px", "padding-bottom": "80px" })}"><div class="absolute inset-0 z-0 opacity-30" style="${ssrRenderStyle({ "background-image": "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.4%22/%3E%3C/svg%3E')", "background-size": "200px" })}"></div><div class="relative z-10 max-w-4xl mx-auto text-center"><div class="mb-5 inline-flex items-center gap-2 rounded-full py-1.5 pl-5 pr-2 text-sm" style="${ssrRenderStyle({ "background": "rgba(255,255,255,0.1)", "color": "rgba(255,255,255,0.7)", "backdrop-filter": "blur(8px)" })}"> Berdiri sejak 2021 <span class="flex h-6 w-6 items-center justify-center rounded-full text-xs" style="${ssrRenderStyle({ "background": "#fabc3f", "color": "#090b0c" })}">✦</span></div><h1 class="text-[3rem] font-normal leading-[0.94] tracking-tight text-white sm:text-[4.5rem] md:text-[6rem]"> Tentang<br><em style="${ssrRenderStyle({ "font-style": "italic", "opacity": "0.6" })}">Kami</em></h1><p class="mt-6 text-base leading-relaxed max-w-xl mx-auto" style="${ssrRenderStyle({ "color": "rgba(255,255,255,0.5)" })}"> Modest Fashion Premium — Elegan. Syar&#39;i. Dibuat Sepenuh Hati. </p></div></section><section class="px-5 py-24 md:px-12" style="${ssrRenderStyle({ "background": "#f5f5f2" })}"><div class="mx-auto max-w-5xl"><div class="grid gap-16 md:grid-cols-2 md:gap-24 items-start"><div><div class="mb-5 flex items-center gap-3"><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}"></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Kisah Kami</span></div><h2 class="text-[2.2rem] font-normal leading-tight tracking-tight md:text-[3rem]"> Lahir dari<br><em style="${ssrRenderStyle({ "font-style": "italic", "opacity": "0.5" })}">sebuah komitmen</em></h2></div><div class="space-y-6 pt-2 md:pt-16"><p class="text-base leading-[1.8]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.7)" })}"> Mints adalah wujud dari komitmen kami untuk menghadirkan busana muslim yang tidak hanya santun, namun juga merepresentasikan gaya hidup modern dan elegan. </p><p class="text-base leading-[1.8]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.7)" })}"> Mints selalu berusaha menjembatani kebutuhan akan pakaian yang <em>modest</em> (tertutup) dengan tren fesyen kontemporer. Kami percaya bahwa setiap wanita berhak tampil percaya diri, anggun, dan nyaman dalam setiap balutan kain. </p></div></div></div></section><div class="px-5 md:px-12" style="${ssrRenderStyle({ "background": "#f5f5f2" })}"><div class="mx-auto max-w-5xl border-t border-b py-10 grid grid-cols-3 text-center gap-4" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.1)" })}"><div><p class="text-[2.5rem] font-normal tracking-tight leading-none tabular-nums">2021</p><p class="mt-2 text-[10px] uppercase tracking-[0.14em]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">Tahun Berdiri</p></div><div><p class="text-[2.5rem] font-normal tracking-tight leading-none">100%</p><p class="mt-2 text-[10px] uppercase tracking-[0.14em]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">Syar&#39;i &amp; Halal</p></div><div><p class="text-[2.5rem] font-normal tracking-tight leading-none">🇮🇩</p><p class="mt-2 text-[10px] uppercase tracking-[0.14em]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.45)" })}">Produk Lokal</p></div></div></div><section class="px-5 py-24 md:px-12" style="${ssrRenderStyle({ "background": "#f5f5f2" })}"><div class="mx-auto max-w-5xl"><div class="mb-12 flex items-center gap-3"><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}"></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Filosofi Kami</span></div><div class="grid gap-6 sm:grid-cols-3"><div class="rounded-3xl p-8" style="${ssrRenderStyle({ "background": "white" })}"><div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-6" style="${ssrRenderStyle({ "background": "#090b0c" })}"><svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"></path><path d="M12 6v6l4 2"></path></svg></div><h3 class="text-lg font-normal tracking-tight mb-3">Material Berkualitas</h3><p class="text-sm leading-[1.8]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.55)" })}">Material berkualitas tinggi, siluet yang terstruktur, dan palet warna yang membumi adalah DNA dari setiap koleksi kami.</p></div><div class="rounded-3xl p-8" style="${ssrRenderStyle({ "background": "white" })}"><div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-6" style="${ssrRenderStyle({ "background": "#090b0c" })}"><svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path></svg></div><h3 class="text-lg font-normal tracking-tight mb-3">Teknik Penuh Cinta</h3><p class="text-sm leading-[1.8]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.55)" })}">Kami secara teliti memadukan teknik jahitan klasik dengan sentuhan modern untuk menciptakan karya yang timeless.</p></div><div class="rounded-3xl p-8" style="${ssrRenderStyle({ "background": "#fabc3f" })}"><div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-6" style="${ssrRenderStyle({ "background": "#090b0c" })}"><svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg></div><h3 class="text-lg font-normal tracking-tight mb-3">Untuk Setiap Wanita</h3><p class="text-sm leading-[1.8]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.65)" })}">Kami percaya bahwa setiap wanita berhak tampil percaya diri, anggun, dan nyaman dalam setiap balutan kain.</p></div></div></div></section><section class="px-5 py-24 md:px-12" style="${ssrRenderStyle({ "background": "#090b0c" })}"><div class="mx-auto max-w-5xl"><div class="mb-5 flex items-center gap-3"><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(255,255,255,0.4)" })}"></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(255,255,255,0.4)" })}">Misi Kami</span></div><h2 class="text-[2rem] font-normal leading-[1.1] tracking-tight text-white mb-8 max-w-2xl md:text-[3rem]"> Memberdayakan wanita muslim di seluruh Indonesia. </h2><div class="grid gap-8 md:grid-cols-2 max-w-3xl"><p class="text-base leading-[1.8]" style="${ssrRenderStyle({ "color": "rgba(255,255,255,0.5)" })}"> Melalui desain yang inovatif, fungsional, dan berkualitas tinggi, kami hadir untuk setiap momen — dari keseharian hingga hari istimewa. </p><p class="text-base leading-[1.8]" style="${ssrRenderStyle({ "color": "rgba(255,255,255,0.5)" })}"> Kami berkomitmen untuk terus berinovasi dan tumbuh bersama komunitas Mints, mendengarkan setiap kebutuhan, dan menyempurnakannya di setiap koleksi baru. </p></div><div class="mt-14">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/koleksi",
        class: "inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-normal transition-opacity hover:opacity-85",
        style: { "background": "white", "color": "#090b0c" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Lihat Koleksi Kami <span class="flex h-5 w-5 items-center justify-center rounded-full text-xs" style="${ssrRenderStyle({ "background": "#090b0c", "color": "white" })}"${_scopeId}>→</span>`);
          } else {
            return [
              createTextVNode(" Lihat Koleksi Kami "),
              createVNode("span", {
                class: "flex h-5 w-5 items-center justify-center rounded-full text-xs",
                style: { "background": "#090b0c", "color": "white" }
              }, "→")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section><footer class="overflow-hidden px-5 pt-20 pb-10 md:px-12" style="${ssrRenderStyle({ "background": "#f5f5f2", "border-top": "1px solid rgba(9,11,12,0.08)" })}"><div class="mx-auto max-w-5xl"><div class="grid gap-12 sm:grid-cols-3 mb-12"><div><p class="font-black text-xl tracking-tighter mb-3" style="${ssrRenderStyle({ "font-family": "'Inter Tight',sans-serif", "letter-spacing": "-0.04em" })}">MINTS</p><p class="text-sm leading-6" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Elegan. Syar&#39;i.<br>Dibuat Sepenuh Hati.</p></div><div><p class="mb-4 text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">Belanja</p><ul class="space-y-3 text-sm" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}"><li>`);
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
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tentang-kami.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=tentang-kami-C-j3-lOy.js.map
