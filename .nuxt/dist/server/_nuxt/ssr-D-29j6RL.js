import "vue";
import { h as useNuxtApp } from "../server.mjs";
function useRequestEvent(nuxtApp) {
  nuxtApp ||= useNuxtApp();
  return nuxtApp.ssrContext?.event;
}
function useRequestFetch() {
  return useRequestEvent()?.$fetch || globalThis.$fetch;
}
export {
  useRequestEvent as a,
  useRequestFetch as u
};
//# sourceMappingURL=ssr-D-29j6RL.js.map
