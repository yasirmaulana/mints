import { e as useState, n as navigateTo } from "../server.mjs";
import { u as useCookie } from "./cookie-Dh-9PoSj.js";
import { computed } from "vue";
const useAuth = () => {
  const user = useState("buyer", () => null);
  const authFlag = useCookie("buyer_auth");
  const isLoggedIn = computed(() => !!authFlag.value && !!user.value);
  async function fetchMe() {
    if (!authFlag.value) {
      user.value = null;
      return;
    }
    try {
      user.value = await $fetch("/api/auth/me");
    } catch {
      user.value = null;
      authFlag.value = null;
    }
  }
  async function logout(redirectTo = "/login") {
    await $fetch("/api/auth/logout", { method: "POST" });
    authFlag.value = null;
    user.value = null;
    navigateTo(redirectTo);
  }
  return { user, isLoggedIn, fetchMe, logout };
};
export {
  useAuth as u
};
//# sourceMappingURL=useAuth-CCe8xS6q.js.map
