import { j as defineNuxtRouteMiddleware, n as navigateTo } from "../server.mjs";
import { u as useCookie } from "./cookie-Dh-9PoSj.js";
import "vue";
import "/home/yasir/Documents/Project/mints/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/home/yasir/Documents/Project/mints/node_modules/hookable/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/nuxt/node_modules/unctx/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/home/yasir/Documents/Project/mints/node_modules/defu/dist/defu.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/ufo/dist/index.mjs";
import "@vueuse/core";
import "tailwind-merge";
import "/home/yasir/Documents/Project/mints/node_modules/klona/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/@unhead/vue/dist/index.mjs";
import "@iconify/vue";
import "vue/server-renderer";
import "/home/yasir/Documents/Project/mints/node_modules/nuxt/node_modules/cookie-es/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/destr/dist/index.mjs";
import "/home/yasir/Documents/Project/mints/node_modules/ohash/dist/index.mjs";
import "./ssr-D-29j6RL.js";
const buyer = defineNuxtRouteMiddleware((to) => {
  const authFlag = useCookie("buyer_auth");
  if (!authFlag.value) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`);
  }
});
export {
  buyer as default
};
//# sourceMappingURL=buyer-NW-OM5YZ.js.map
