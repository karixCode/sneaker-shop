import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as api from '../api';
import { useCartStore } from './cart';
import { useSneakersStore } from './sneakers';

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchOrders = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.getOrders();
      orders.value = response.data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  const createOrder = async (customerData) => {
    loading.value = true;
    error.value = null;
    try {
      const cartStore = useCartStore();
      const sneakersStore = useSneakersStore();

      const items = cartStore.cartItems.map(item => {
        const sneaker = sneakersStore.sneakers.find(s => s.id === item.sneakerId);
        return {
          sneakerId: item.sneakerId,
          size: item.size,
          quantity: item.quantity,
          price: sneaker ? sneaker.price : 0,
        };
      });

      const order = {
        items,
        totalAmount: cartStore.totalAmount,
        status: 'pending',
        customer: customerData,
        createdAt: new Date().toISOString(),
      };

      const response = await api.createOrder(order);
      orders.value.push(response.data);

      await cartStore.clearCart();

      return response.data;
    } catch (err) {
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    createOrder,
  };
});

