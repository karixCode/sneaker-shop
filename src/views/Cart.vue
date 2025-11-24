<template>
  <div class="cart-page">
    <div class="container">
      <h1>Корзина</h1>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Загрузка...</p>
      </div>

      <div v-else-if="cartItems.length === 0" class="empty-cart">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M9 2L7 6H3L6 18H18L21 6H17L15 2H9Z"/>
          <circle cx="9" cy="21" r="1"/>
          <circle cx="15" cy="21" r="1"/>
        </svg>
        <h2>Корзина пуста</h2>
        <p>Добавьте товары из каталога</p>
        <router-link to="/" class="continue-btn">Перейти в каталог</router-link>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <div v-for="item in cartItemsWithDetails" :key="item.id" class="cart-item">
            <div class="item-image">
              <router-link :to="`/product/${item.sneaker.id}`">
                <img :src="item.sneaker.images[0]" :alt="item.sneaker.name" />
              </router-link>
            </div>

            <div class="item-details">
              <router-link :to="`/product/${item.sneaker.id}`" class="item-brand">
                {{ item.sneaker.brand }}
              </router-link>
              <h3 class="item-name">{{ item.sneaker.name }}</h3>
              <div class="item-meta">
                <span class="item-size">Размер: {{ item.size }}</span>
              </div>
            </div>

            <div class="item-quantity">
              <button @click="decreaseQuantity(item)" class="qty-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button @click="increaseQuantity(item)" class="qty-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>

            <div class="item-price">
              {{ formatPrice(item.sneaker.price * item.quantity) }} ₽
            </div>

            <button @click="removeItem(item.id)" class="remove-btn" title="Удалить">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="cart-summary">
          <div class="summary-card">
            <h2>Итого</h2>

            <div class="summary-row">
              <span>Товары ({{ itemsCount }})</span>
              <span>{{ formatPrice(totalAmount) }} ₽</span>
            </div>

            <div class="summary-row">
              <span>Доставка</span>
              <span>Бесплатно</span>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-row summary-total">
              <span>Всего</span>
              <span>{{ formatPrice(totalAmount) }} ₽</span>
            </div>

            <router-link to="/checkout" class="checkout-btn">
              Оформить заказ
            </router-link>

            <button @click="clearCartHandler" class="clear-cart-btn">
              Очистить корзину
            </button>
          </div>

          <div class="payment-methods">
            <h3>Способы оплаты</h3>
            <div class="payment-icons">
              <div class="payment-icon">💳</div>
              <div class="payment-icon">💵</div>
              <div class="payment-icon">📱</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useCartStore } from '../stores/cart';

const cartStore = useCartStore();

const loading = computed(() => cartStore.loading);
const cartItems = computed(() => cartStore.cartItems);
const cartItemsWithDetails = computed(() => cartStore.cartItemsWithDetails);
const itemsCount = computed(() => cartStore.itemsCount);
const totalAmount = computed(() => cartStore.totalAmount);

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const increaseQuantity = (item) => {
  cartStore.updateQuantity(item.id, item.quantity + 1);
};

const decreaseQuantity = (item) => {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.id, item.quantity - 1);
  }
};

const removeItem = (itemId) => {
  if (confirm('Удалить товар из корзины?')) {
    cartStore.removeFromCart(itemId);
  }
};

const clearCartHandler = () => {
  if (confirm('Очистить всю корзину?')) {
    cartStore.clearCart();
  }
};
</script>

<style scoped>
.cart-page {
  min-height: calc(100vh - 4rem);
  padding: 2rem 0;
  background: #f9fafb;
}

.cart-page h1 {
  margin: 0 0 2rem;
  font-size: 2rem;
  color: #333;
}

.loading {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-cart svg {
  color: #d1d5db;
  margin: 0 auto 1.5rem;
}

.empty-cart h2 {
  margin: 0 0 0.5rem;
  color: #333;
}

.empty-cart p {
  margin: 0 0 2rem;
  color: #666;
}

.continue-btn {
  display: inline-block;
  padding: 1rem 2rem;
  background: #2563eb;
  color: #fff;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: background 0.3s;
}

.continue-btn:hover {
  background: #1d4ed8;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 120px 1fr auto auto auto;
  gap: 1.5rem;
  align-items: center;
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.cart-item:hover {
  transform: translateY(-2px);
}

.item-image {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f4f6;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item-brand {
  font-size: 0.875rem;
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.3s;
}

.item-brand:hover {
  opacity: 0.7;
}

.item-name {
  margin: 0;
  font-size: 1.125rem;
  color: #333;
}

.item-meta {
  font-size: 0.875rem;
  color: #666;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f3f4f6;
  padding: 0.5rem;
  border-radius: 8px;
}

.qty-btn {
  width: 32px;
  height: 32px;
  background: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.3s;
}

.qty-btn:hover {
  background: #2563eb;
  color: #fff;
}

.qty-value {
  min-width: 32px;
  text-align: center;
  font-weight: 600;
  color: #333;
}

.item-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
  min-width: 120px;
  text-align: right;
}

.remove-btn {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0.5rem;
  transition: opacity 0.3s;
}

.remove-btn:hover {
  opacity: 0.7;
}

.cart-summary {
  position: sticky;
  top: 5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.summary-card {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.summary-card h2 {
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
  color: #333;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: #666;
}

.summary-row span:last-child {
  font-weight: 600;
  color: #333;
}

.summary-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 1rem 0;
}

.summary-total {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
}

.checkout-btn {
  display: block;
  width: 100%;
  padding: 1rem;
  background: #2563eb;
  color: #fff;
  text-align: center;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  margin-top: 1.5rem;
  transition: background 0.3s;
}

.checkout-btn:hover {
  background: #1d4ed8;
}

.clear-cart-btn {
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: 2px solid #ef4444;
  color: #ef4444;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 0.75rem;
  transition: all 0.3s;
}

.clear-cart-btn:hover {
  background: #ef4444;
  color: #fff;
}

.payment-methods {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.payment-methods h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
  color: #333;
}

.payment-icons {
  display: flex;
  gap: 0.75rem;
}

.payment-icon {
  width: 48px;
  height: 48px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
</style>

