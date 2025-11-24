<template>
  <header class="header">
    <div class="container">
      <div class="header-content">
        <router-link to="/" class="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M8 24L16 8L24 24H8Z" fill="currentColor"/>
            <path d="M12 20L16 12L20 20H12Z" fill="#fff"/>
          </svg>
          <span>SneakerShop</span>
        </router-link>

        <nav class="nav">
          <router-link to="/" class="nav-link">Каталог</router-link>
          <router-link to="/orders" class="nav-link">Заказы</router-link>
        </nav>

        <div class="header-actions">
          <router-link to="/" class="icon-btn" title="Поиск">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </router-link>

          <router-link to="/cart" class="icon-btn cart-btn" title="Корзина">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 2L7 6H3L6 18H18L21 6H17L15 2H9Z"/>
              <circle cx="9" cy="21" r="1"/>
              <circle cx="15" cy="21" r="1"/>
            </svg>
            <span v-if="cartItemsCount > 0" class="cart-badge">{{ cartItemsCount }}</span>
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useCartStore } from '../stores/cart';

const cartStore = useCartStore();
const cartItemsCount = computed(() => cartStore.itemsCount);
</script>

<style scoped>
.header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  gap: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
}

.logo:hover {
  color: #2563eb;
}

.logo svg {
  color: #2563eb;
}

.nav {
  display: flex;
  gap: 2rem;
  flex: 1;
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  position: relative;
}

.nav-link:hover {
  color: #2563eb;
}

.nav-link.router-link-active {
  color: #2563eb;
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  right: 0;
  height: 2px;
  background: #2563eb;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #666;
  transition: color 0.3s;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  color: #2563eb;
}

.cart-btn {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.125rem 0.375rem;
  border-radius: 999px;
  min-width: 1.25rem;
  text-align: center;
}

@media (max-width: 768px) {
  .nav {
    gap: 1rem;
  }

  .nav-link {
    font-size: 0.875rem;
  }

  .logo span {
    display: none;
  }
}
</style>

