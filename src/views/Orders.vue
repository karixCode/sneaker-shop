<template>
  <div class="orders-page">
    <div class="container">
      <h1>Мои заказы</h1>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Загрузка заказов...</p>
      </div>

      <div v-else-if="orders.length === 0" class="no-orders">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M3 3h18v18H3z"/>
          <path d="M9 9h6M9 12h6M9 15h3"/>
        </svg>
        <h2>У вас пока нет заказов</h2>
        <p>Оформите первый заказ в нашем магазине</p>
        <router-link to="/" class="continue-btn">Перейти в каталог</router-link>
      </div>

      <div v-else class="orders-list">
        <div v-for="order in sortedOrders" :key="order.id" class="order-card">
          <div class="order-header">
            <div class="order-info">
              <div class="order-number">Заказ #{{ order.id }}</div>
              <div class="order-date">{{ formatDate(order.createdAt) }}</div>
            </div>
            <div :class="['order-status', order.status]">
              {{ formatStatus(order.status) }}
            </div>
          </div>

          <div class="order-items">
            <div v-for="(item, index) in order.items" :key="index" class="order-item">
              <div class="order-item-image">
                <img :src="getSneakerImage(item.sneakerId)" :alt="getSneakerName(item.sneakerId)" />
              </div>
              <div class="order-item-details">
                <div class="order-item-name">{{ getSneakerName(item.sneakerId) }}</div>
                <div class="order-item-meta">
                  <span>Размер: {{ item.size }}</span>
                  <span>×{{ item.quantity }}</span>
                </div>
              </div>
              <div class="order-item-price">
                {{ formatPrice(item.price * item.quantity) }} ₽
              </div>
            </div>
          </div>

          <div class="order-footer">
            <div class="order-customer">
              <div class="customer-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>{{ order.customer.name }}</span>
              </div>
              <div class="customer-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <span>{{ order.customer.address }}</span>
              </div>
              <div class="customer-row">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>{{ order.customer.phone }}</span>
              </div>
            </div>

            <div class="order-total">
              <div class="total-label">Итого:</div>
              <div class="total-amount">{{ formatPrice(order.totalAmount) }} ₽</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useOrdersStore } from '../stores/orders';
import { useSneakersStore } from '../stores/sneakers';

const ordersStore = useOrdersStore();
const sneakersStore = useSneakersStore();

const loading = computed(() => ordersStore.loading);
const orders = computed(() => ordersStore.orders);

const sortedOrders = computed(() => {
  return [...orders.value].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const formatStatus = (status) => {
  const statusMap = {
    pending: 'В обработке',
    processing: 'Собирается',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменен',
  };
  return statusMap[status] || status;
};

const getSneakerImage = (sneakerId) => {
  const sneaker = sneakersStore.sneakers.find(s => s.id === sneakerId);
  return sneaker ? sneaker.images[0] : '';
};

const getSneakerName = (sneakerId) => {
  const sneaker = sneakersStore.sneakers.find(s => s.id === sneakerId);
  return sneaker ? sneaker.name : 'Товар';
};

onMounted(async () => {
  await ordersStore.fetchOrders();
  if (sneakersStore.sneakers.length === 0) {
    await sneakersStore.fetchSneakers();
  }
});
</script>

<style scoped>
.orders-page {
  min-height: calc(100vh - 4rem);
  padding: 2rem 0;
  background: #f9fafb;
}

.orders-page h1 {
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

.no-orders {
  text-align: center;
  padding: 4rem 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.no-orders svg {
  color: #d1d5db;
  margin: 0 auto 1.5rem;
}

.no-orders h2 {
  margin: 0 0 0.5rem;
  color: #333;
}

.no-orders p {
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

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-card {
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.order-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f3f4f6;
  margin-bottom: 1.5rem;
}

.order-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
}

.order-date {
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
}

.order-status {
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
}

.order-status.pending {
  background: #fef3c7;
  color: #92400e;
}

.order-status.processing {
  background: #dbeafe;
  color: #1e40af;
}

.order-status.shipped {
  background: #ddd6fe;
  color: #5b21b6;
}

.order-status.delivered {
  background: #d1fae5;
  color: #065f46;
}

.order-status.cancelled {
  background: #fee2e2;
  color: #991b1b;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.order-item {
  display: grid;
  grid-template-columns: 80px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.order-item-image {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  background: #e5e7eb;
}

.order-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.order-item-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.order-item-meta {
  font-size: 0.875rem;
  color: #666;
  display: flex;
  gap: 1rem;
}

.order-item-price {
  font-size: 1.125rem;
  font-weight: 700;
  color: #333;
}

.order-footer {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #f3f4f6;
}

.order-customer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.customer-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666;
}

.customer-row svg {
  color: #9ca3af;
}

.order-total {
  text-align: right;
}

.total-label {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
}

.total-amount {
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
}

@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .order-status {
    width: 100%;
    text-align: center;
  }

  .order-item {
    grid-template-columns: 60px 1fr;
    gap: 0.75rem;
  }

  .order-item-image {
    width: 60px;
    height: 60px;
  }

  .order-item-price {
    grid-column: 2;
    justify-self: end;
  }

  .order-footer {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .order-total {
    text-align: left;
  }
}
</style>

