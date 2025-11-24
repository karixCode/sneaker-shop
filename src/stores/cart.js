import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as api from '../api';
import { useSneakersStore } from './sneakers';

export const useCartStore = defineStore('cart', () => {
  const cartItems = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const itemsCount = computed(() => {
    return cartItems.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  const totalAmount = computed(() => {
    const sneakersStore = useSneakersStore();
    return cartItems.value.reduce((sum, item) => {
      const sneaker = sneakersStore.sneakers.find(s => s.id === item.sneakerId);
      return sum + (sneaker ? sneaker.price * item.quantity : 0);
    }, 0);
  });

  const cartItemsWithDetails = computed(() => {
    const sneakersStore = useSneakersStore();
    return cartItems.value.map(item => {
      const sneaker = sneakersStore.sneakers.find(s => s.id === item.sneakerId);
      return {
        ...item,
        sneaker,
      };
    });
  });

  const fetchCartItems = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.getCartItems();
      cartItems.value = response.data;
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching cart:', err);
    } finally {
      loading.value = false;
    }
  };

  const addToCart = async (sneakerId, size, quantity = 1) => {
    loading.value = true;
    error.value = null;
    try {
      const existingItem = cartItems.value.find(
        item => item.sneakerId === sneakerId && item.size === size
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const response = await api.updateCartItem(existingItem.id, {
          ...existingItem,
          quantity: newQuantity,
        });
        const index = cartItems.value.findIndex(item => item.id === existingItem.id);
        cartItems.value[index] = response.data;
      } else {
        const response = await api.addToCart({
          sneakerId,
          size,
          quantity,
        });
        cartItems.value.push(response.data);
      }
      return true;
    } catch (err) {
      error.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }

    loading.value = true;
    error.value = null;
    try {
      const item = cartItems.value.find(i => i.id === itemId);
      if (item) {
        const response = await api.updateCartItem(itemId, {
          ...item,
          quantity,
        });
        const index = cartItems.value.findIndex(i => i.id === itemId);
        cartItems.value[index] = response.data;
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const removeFromCart = async (itemId) => {
    loading.value = true;
    error.value = null;
    try {
      await api.removeFromCart(itemId);
      cartItems.value = cartItems.value.filter(item => item.id !== itemId);
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const clearCart = async () => {
    loading.value = true;
    error.value = null;
    try {
      await Promise.all(cartItems.value.map(item => api.removeFromCart(item.id)));
      cartItems.value = [];
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    cartItems,
    loading,
    error,
    itemsCount,
    totalAmount,
    cartItemsWithDetails,
    fetchCartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  };
});

