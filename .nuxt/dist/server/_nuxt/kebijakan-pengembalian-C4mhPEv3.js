import { _ as __nuxt_component_0 } from "./nuxt-link-CuTev4Jq.js";
import { _ as __nuxt_component_1 } from "./client-only-CUemHDvz.js";
import { defineComponent, ref, mergeProps, withCtx, createTextVNode, unref, openBlock, createBlock, createVNode, toDisplayString, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
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
  __name: "kebijakan-pengembalian",
  __ssrInlineRender: true,
  setup(__props) {
    useHead({ title: "Kebijakan Pengembalian — Mints" });
    const { isLoggedIn } = useAuth();
    const { itemCount } = useCart();
    const mobileMenuOpen = ref(false);
    const conditions = [
      "Klaim penukaran maksimal <strong>7 (tujuh) hari kalender</strong> sejak pesanan diterima.",
      "Pakaian harus dalam keadaan bersih, belum pernah dicuci, belum dipakai untuk acara, tidak dipermak, dan <strong>label merek masih utuh</strong>.",
      "Biaya pengiriman pengembalian dan pengiriman ulang ditanggung oleh pembeli, <strong>kecuali terjadi cacat produk</strong> yang lolos dari quality control kami.",
      "Penukaran barang <strong>tidak berlaku</strong> untuk produk promo / diskon lebih dari 30%."
    ];
    const steps = [
      {
        title: "Hubungi Customer Service",
        desc: "Kirimkan pesan via WhatsApp atau email hello@mints.id dengan menyertakan data yang diperlukan."
      },
      {
        title: "Tunggu Konfirmasi",
        desc: "Alamat pengiriman retur akan dikirimkan dalam 1×24 jam setelah pesan Anda diterima dan dikonfirmasi."
      },
      {
        title: "Kirimkan Paket",
        desc: "Kirimkan paket ke alamat yang diberikan. Simpan bukti pengiriman sebagai referensi."
      }
    ];
    const fields = [
      "Nama lengkap",
      "Nomor pesanan",
      "Alasan retur / ukuran pengganti"
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ClientOnly = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "min-h-screen antialiased",
        style: { "background": "#f5f5f2", "font-family": "'Inter Tight',system-ui,sans-serif", "color": "#090b0c" }
      }, _attrs))}><header class="fixed left-0 right-0 z-50 px-4 py-4 md:px-8" style="${ssrRenderStyle({ "background": "rgba(245,245,242,0.9)", "backdrop-filter": "blur(12px)", "border-bottom": "1px solid rgba(9,11,12,0.06)" })}"><div class="relative flex h-10 items-center max-w-6xl mx-auto">`);
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
      _push(`</header><div style="${ssrRenderStyle({ "padding-top": "88px" })}"><div class="px-5 py-16 md:px-12" style="${ssrRenderStyle({ "border-bottom": "1px solid rgba(9,11,12,0.08)" })}"><div class="mx-auto max-w-5xl"><div class="mb-4 flex items-center gap-3"><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}"></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Kebijakan</span></div><h1 class="text-[2.5rem] font-normal leading-tight tracking-tight md:text-[4rem]"> Pengiriman &amp;<br><em style="${ssrRenderStyle({ "font-style": "italic", "opacity": "0.5" })}">Pengembalian</em></h1><p class="mt-4 text-sm max-w-md leading-relaxed" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.55)" })}"> Informasi mengenai pengiriman pesanan dan prosedur penukaran barang Anda. </p></div></div><section class="px-5 py-16 md:px-12"><div class="mx-auto max-w-5xl"><div class="mb-8 flex items-center gap-3"><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}"></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Pengiriman</span></div><div class="grid gap-5 sm:grid-cols-3"><div class="rounded-3xl p-8" style="${ssrRenderStyle({ "background": "white" })}"><div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-6" style="${ssrRenderStyle({ "background": "#090b0c" })}"><svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><rect x="1" y="3" width="15" height="13"></rect><path d="M16 8h4l3 3v5h-7V8z"></path><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></div><h3 class="text-base font-semibold tracking-tight mb-3">Hari Kerja</h3><p class="text-sm leading-[1.8]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.55)" })}">Pesanan diproses dan dikirim pada hari kerja (Senin–Jumat). Pesanan yang dikonfirmasi sebelum pukul 14.00 WIB diproses di hari yang sama.</p></div><div class="rounded-3xl p-8" style="${ssrRenderStyle({ "background": "white" })}"><div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-6" style="${ssrRenderStyle({ "background": "#090b0c" })}"><svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path><circle cx="12" cy="9" r="2.5"></circle></svg></div><h3 class="text-base font-semibold tracking-tight mb-3">Estimasi Tiba</h3><p class="text-sm leading-[1.8]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.55)" })}"><strong class="font-semibold" style="${ssrRenderStyle({ "color": "#090b0c" })}">Jabodetabek:</strong> 2–3 hari kerja.<br><strong class="font-semibold" style="${ssrRenderStyle({ "color": "#090b0c" })}">Luar Jabodetabek:</strong> 3–7 hari kerja, tergantung lokasi tujuan. </p></div><div class="rounded-3xl p-8" style="${ssrRenderStyle({ "background": "#fabc3f" })}"><div class="w-10 h-10 rounded-2xl flex items-center justify-center mb-6" style="${ssrRenderStyle({ "background": "#090b0c" })}"><svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div><h3 class="text-base font-semibold tracking-tight mb-3">Nomor Resi</h3><p class="text-sm leading-[1.8]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.65)" })}">Nomor resi akan dikirimkan ke email Anda setelah paket diserahkan ke pihak logistik.</p></div></div></div></section><section class="px-5 pb-16 md:px-12"><div class="mx-auto max-w-5xl"><div class="mb-8 flex items-center gap-3"><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}"></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Kebijakan Retur / Penukaran</span></div><div class="rounded-3xl overflow-hidden" style="${ssrRenderStyle({ "background": "white" })}"><div class="px-8 py-6" style="${ssrRenderStyle({ "border-bottom": "1px solid rgba(9,11,12,0.06)" })}"><p class="text-sm leading-[1.8]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.7)" })}"> Kami memberikan garansi penukaran ukuran dengan syarat dan ketentuan berikut: </p></div><ul class="divide-y" style="${ssrRenderStyle({ "--tw-divide-opacity": "1" })}"><!--[-->`);
      ssrRenderList(conditions, (cond, i) => {
        _push(`<li class="px-8 py-5 flex items-start gap-4" style="${ssrRenderStyle({ "border-color": "rgba(9,11,12,0.06)" })}"><span class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5" style="${ssrRenderStyle({ "background": "#090b0c", "color": "white" })}">${ssrInterpolate(i + 1)}</span><p class="text-sm leading-[1.8]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.7)" })}">${cond ?? ""}</p></li>`);
      });
      _push(`<!--]--></ul></div></div></section><section class="px-5 pb-20 md:px-12"><div class="mx-auto max-w-5xl"><div class="mb-8 flex items-center gap-3"><div class="h-px w-5" style="${ssrRenderStyle({ "background": "rgba(9,11,12,0.6)" })}"></div><span class="text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Prosedur Retur</span></div><div class="grid gap-6 md:grid-cols-2 items-start"><div class="space-y-4"><!--[-->`);
      ssrRenderList(steps, (step, i) => {
        _push(`<div class="rounded-3xl p-7 flex items-start gap-4" style="${ssrRenderStyle({ "background": "white" })}"><span class="flex-shrink-0 w-8 h-8 rounded-2xl flex items-center justify-center text-sm font-bold" style="${ssrRenderStyle({ "background": "#f5f5f2", "color": "#090b0c" })}">${ssrInterpolate(i + 1)}</span><div><h4 class="font-semibold text-sm mb-1">${ssrInterpolate(step.title)}</h4><p class="text-sm leading-[1.8]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.55)" })}">${ssrInterpolate(step.desc)}</p></div></div>`);
      });
      _push(`<!--]--></div><div class="rounded-3xl p-8" style="${ssrRenderStyle({ "background": "#090b0c" })}"><p class="text-xs uppercase tracking-widest mb-5" style="${ssrRenderStyle({ "color": "rgba(255,255,255,0.4)" })}">Data yang diperlukan</p><ul class="space-y-3 mb-8"><!--[-->`);
      ssrRenderList(fields, (field) => {
        _push(`<li class="flex items-center gap-3"><span class="w-1.5 h-1.5 rounded-full flex-shrink-0" style="${ssrRenderStyle({ "background": "#fabc3f" })}"></span><span class="text-sm" style="${ssrRenderStyle({ "color": "rgba(255,255,255,0.75)" })}">${ssrInterpolate(field)}</span></li>`);
      });
      _push(`<!--]--></ul><div class="space-y-3"><a href="https://wa.me/6281234567890" target="_blank" rel="noopener" class="flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm transition-opacity hover:opacity-85" style="${ssrRenderStyle({ "background": "rgba(255,255,255,0.1)", "color": "white" })}"><svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path></svg> WhatsApp </a><a href="mailto:hello@mints.id" class="flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm transition-opacity hover:opacity-85" style="${ssrRenderStyle({ "background": "rgba(255,255,255,0.1)", "color": "white" })}"><svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> hello@mints.id </a></div><p class="mt-5 text-xs" style="${ssrRenderStyle({ "color": "rgba(255,255,255,0.35)" })}">Alamat pengiriman retur akan dikirimkan dalam 1×24 jam setelah konfirmasi.</p></div></div></div></section><section class="px-5 pb-24 md:px-12"><div class="mx-auto max-w-5xl"><div class="rounded-3xl px-10 py-14 text-center" style="${ssrRenderStyle({ "background": "#090b0c" })}"><p class="text-xs uppercase tracking-widest mb-3" style="${ssrRenderStyle({ "color": "rgba(255,255,255,0.4)" })}">Ada pertanyaan lain?</p><h2 class="text-2xl font-normal tracking-tight text-white mb-6 md:text-3xl">Kami siap membantu Anda.</h2><a href="https://wa.me/6281234567890" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-normal transition-opacity hover:opacity-85" style="${ssrRenderStyle({ "background": "white", "color": "#090b0c" })}"> Hubungi Kami <span class="flex h-5 w-5 items-center justify-center rounded-full text-xs" style="${ssrRenderStyle({ "background": "#090b0c", "color": "white" })}">→</span></a></div></div></section></div><footer class="overflow-hidden px-5 pt-20 pb-10 md:px-12" style="${ssrRenderStyle({ "background": "#f5f5f2", "border-top": "1px solid rgba(9,11,12,0.08)" })}"><div class="mx-auto max-w-5xl"><div class="grid gap-12 sm:grid-cols-3 mb-12"><div><p class="font-black text-xl tracking-tighter mb-3" style="${ssrRenderStyle({ "font-family": "'Inter Tight',sans-serif", "letter-spacing": "-0.04em" })}">MINTS</p><p class="text-sm leading-6" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.5)" })}">Elegan. Syar&#39;i.<br>Dibuat Sepenuh Hati.</p></div><div><p class="mb-4 text-xs font-normal uppercase tracking-[0.16rem]" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.4)" })}">Belanja</p><ul class="space-y-3 text-sm" style="${ssrRenderStyle({ "color": "rgba(9,11,12,0.6)" })}"><li>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/kebijakan-pengembalian.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=kebijakan-pengembalian-C4mhPEv3.js.map
