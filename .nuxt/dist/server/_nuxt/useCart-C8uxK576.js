import { computed, ref } from "vue";
function writeStorage(items) {
  return;
}
const cartItems = ref([]);
function useCart() {
  const itemCount = computed(() => cartItems.value.reduce((s, i) => s + i.qty, 0));
  const subtotal = computed(() => cartItems.value.reduce((s, i) => s + i.price * i.qty, 0));
  const freeShippingMin = 5e5;
  const freeShippingProgress = computed(() => Math.min(subtotal.value / freeShippingMin, 1));
  const freeShippingRemaining = computed(() => Math.max(freeShippingMin - subtotal.value, 0));
  function addItem(item) {
    const existing = cartItems.value.find(
      (i) => i.productId === item.productId && i.variantId === item.variantId
    );
    if (existing) {
      existing.qty++;
    } else {
      cartItems.value.push({ ...item, qty: 1 });
    }
    writeStorage(cartItems.value);
  }
  function removeItem(productId, variantId) {
    cartItems.value = cartItems.value.filter(
      (i) => !(i.productId === productId && i.variantId === variantId)
    );
    writeStorage(cartItems.value);
  }
  function updateQty(productId, variantId, qty) {
    const item = cartItems.value.find(
      (i) => i.productId === productId && i.variantId === variantId
    );
    if (!item) return;
    if (qty <= 0) {
      removeItem(productId, variantId);
      return;
    }
    item.qty = qty;
    writeStorage(cartItems.value);
  }
  function clearCart() {
    cartItems.value = [];
  }
  return { cartItems, itemCount, subtotal, freeShippingMin, freeShippingProgress, freeShippingRemaining, addItem, removeItem, updateQty, clearCart };
}
export {
  useCart as u
};
//# sourceMappingURL=useCart-C8uxK576.js.map
