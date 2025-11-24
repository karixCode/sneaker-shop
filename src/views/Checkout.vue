<template>
  <div class="checkout-page">
    <div class="container">
      <h1>Оформление заказа</h1>

      <div v-if="cartItems.length === 0" class="empty-cart">
        <p>Корзина пуста</p>
        <router-link to="/" class="continue-btn">Перейти в каталог</router-link>
      </div>

      <div v-else class="checkout-content">
        <div class="checkout-form">
          <div class="form-section">
            <h2>Контактные данные</h2>

            <div class="form-group">
              <label for="name">
                Имя и фамилия <span class="required">*</span>
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Иван Иванов"
                :class="{ error: errors.name }"
              />
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">
                  Email <span class="required">*</span>
                </label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  placeholder="ivan@example.com"
                  :class="{ error: errors.email }"
                />
                <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
              </div>

              <div class="form-group">
                <label for="phone">
                  Телефон <span class="required">*</span>
                </label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  :class="{ error: errors.phone }"
                />
                <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
              </div>
            </div>
          </div>

          <div class="form-section">
            <h2>Адрес доставки</h2>

            <div class="form-group">
              <label for="address">
                Адрес <span class="required">*</span>
              </label>
              <textarea
                id="address"
                v-model="form.address"
                rows="3"
                placeholder="Улица, дом, квартира"
                :class="{ error: errors.address }"
              ></textarea>
              <span v-if="errors.address" class="error-message">{{ errors.address }}</span>
            </div>
          </div>

          <div class="form-section">
            <h2>Способ оплаты</h2>

            <div class="payment-options">
              <label class="payment-option">
                <input
                  v-model="form.paymentMethod"
                  type="radio"
                  value="card"
                />
                <div class="option-content">
                  <div class="option-icon">💳</div>
                  <div class="option-text">
                    <div class="option-title">Банковская карта</div>
                    <div class="option-desc">Оплата онлайн</div>
                  </div>
                </div>
              </label>

              <label class="payment-option">
                <input
                  v-model="form.paymentMethod"
                  type="radio"
                  value="cash"
                />
                <div class="option-content">
                  <div class="option-icon">💵</div>
                  <div class="option-text">
                    <div class="option-title">Наличные</div>
                    <div class="option-desc">Оплата при получении</div>
                  </div>
                </div>
              </label>

              <label class="payment-option">
                <input
                  v-model="form.paymentMethod"
                  type="radio"
                  value="sbp"
                />
                <div class="option-content">
                  <div class="option-icon">📱</div>
                  <div class="option-text">
                    <div class="option-title">СБП</div>
                    <div class="option-desc">Система быстрых платежей</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div class="form-section">
            <label class="checkbox-label">
              <input v-model="form.agreeToTerms" type="checkbox" />
              <span>
                Я согласен с <a href="#" @click.prevent>условиями обработки персональных данных</a>
              </span>
            </label>
          </div>
        </div>

        <div class="order-summary">
          <div class="summary-card">
            <h2>Ваш заказ</h2>

            <div class="order-items">
              <div v-for="item in cartItemsWithDetails" :key="item.id" class="order-item">
                <div class="order-item-image">
                  <img :src="item.sneaker.images[0]" :alt="item.sneaker.name" />
                </div>
                <div class="order-item-details">
                  <div class="order-item-name">{{ item.sneaker.name }}</div>
                  <div class="order-item-meta">
                    Размер: {{ item.size }} × {{ item.quantity }}
                  </div>
                </div>
                <div class="order-item-price">
                  {{ formatPrice(item.sneaker.price * item.quantity) }} ₽
                </div>
              </div>
            </div>

            <div class="summary-divider"></div>

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
              <span>Итого</span>
              <span>{{ formatPrice(totalAmount) }} ₽</span>
            </div>

            <button
              @click="submitOrder"
              :disabled="!canSubmit || submitting"
              class="submit-btn"
            >
              {{ submitting ? 'Оформление...' : 'Оформить заказ' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="orderSuccess" class="modal-overlay" @click="closeSuccess">
        <div class="modal-content success-modal" @click.stop>
          <div class="success-icon">✓</div>
          <h2>Заказ успешно оформлен!</h2>
          <p>Номер заказа: <strong>#{{ orderNumber }}</strong></p>
          <p>Мы отправили подтверждение на {{ form.email }}</p>

          <div class="success-actions">
            <router-link to="/orders" class="success-btn primary">
              Мои заказы
            </router-link>
            <router-link to="/" class="success-btn">
              На главную
            </router-link>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useOrdersStore } from '../stores/orders';

const router = useRouter();
const cartStore = useCartStore();
const ordersStore = useOrdersStore();

const form = ref({
  name: '',
  email: '',
  phone: '',
  address: '',
  paymentMethod: 'card',
  agreeToTerms: false,
});

const errors = ref({});
const submitting = ref(false);
const orderSuccess = ref(false);
const orderNumber = ref(null);

const cartItems = computed(() => cartStore.cartItems);
const cartItemsWithDetails = computed(() => cartStore.cartItemsWithDetails);
const itemsCount = computed(() => cartStore.itemsCount);
const totalAmount = computed(() => cartStore.totalAmount);

const canSubmit = computed(() => {
  return form.value.name.trim() &&
         form.value.email.trim() &&
         form.value.phone.trim() &&
         form.value.address.trim() &&
         form.value.agreeToTerms;
});

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const validateForm = () => {
  errors.value = {};

  if (!form.value.name.trim()) {
    errors.value.name = 'Введите имя и фамилию';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.value.email.trim()) {
    errors.value.email = 'Введите email';
  } else if (!emailRegex.test(form.value.email)) {
    errors.value.email = 'Неверный формат email';
  }

  const phoneRegex = /^\+?[0-9\s\-()]{10,}$/;
  if (!form.value.phone.trim()) {
    errors.value.phone = 'Введите телефон';
  } else if (!phoneRegex.test(form.value.phone)) {
    errors.value.phone = 'Неверный формат телефона';
  }

  if (!form.value.address.trim()) {
    errors.value.address = 'Введите адрес';
  }

  return Object.keys(errors.value).length === 0;
};

const submitOrder = async () => {
  if (!validateForm() || !canSubmit.value) {
    return;
  }

  submitting.value = true;

  const customerData = {
    name: form.value.name,
    email: form.value.email,
    phone: form.value.phone,
    address: form.value.address,
    paymentMethod: form.value.paymentMethod,
  };

  const order = await ordersStore.createOrder(customerData);

  submitting.value = false;

  if (order) {
    orderNumber.value = order.id;
    orderSuccess.value = true;
  }
};

const closeSuccess = () => {
  orderSuccess.value = false;
  router.push('/orders');
};
</script>

<style scoped>
.checkout-page {
  min-height: calc(100vh - 4rem);
  padding: 2rem 0;
  background: #f9fafb;
}

.checkout-page h1 {
  margin: 0 0 2rem;
  font-size: 2rem;
  color: #333;
}

.empty-cart {
  text-align: center;
  padding: 4rem 2rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.checkout-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  align-items: start;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-section h2 {
  margin: 0 0 1.5rem;
  font-size: 1.25rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.required {
  color: #ef4444;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2563eb;
}

.form-group input.error,
.form-group textarea.error {
  border-color: #ef4444;
}

.error-message {
  display: block;
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-option {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-option:hover {
  border-color: #2563eb;
  background: #f0f9ff;
}

.payment-option input[type="radio"] {
  margin-right: 1rem;
  cursor: pointer;
}

.payment-option input[type="radio"]:checked + .option-content {
  color: #2563eb;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.option-icon {
  font-size: 2rem;
}

.option-text {
  flex: 1;
}

.option-title {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
}

.option-desc {
  font-size: 0.875rem;
  color: #666;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  margin-top: 0.25rem;
  cursor: pointer;
}

.checkbox-label span {
  color: #666;
  font-size: 0.875rem;
  line-height: 1.5;
}

.checkbox-label a {
  color: #2563eb;
  text-decoration: underline;
}

.order-summary {
  position: sticky;
  top: 5rem;
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

.order-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.order-item {
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: 1rem;
  align-items: center;
}

.order-item-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  background: #f3f4f6;
}

.order-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.order-item-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #333;
}

.order-item-meta {
  font-size: 0.75rem;
  color: #666;
}

.order-item-price {
  font-weight: 700;
  color: #333;
}

.summary-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 1rem 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: #666;
}

.summary-row span:last-child {
  font-weight: 600;
  color: #333;
}

.summary-total {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.submit-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  padding: 3rem 2rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  animation: modalIn 0.3s ease-out;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-icon {
  width: 80px;
  height: 80px;
  background: #10b981;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin: 0 auto 1.5rem;
}

.success-modal h2 {
  margin: 0 0 1rem;
  font-size: 1.75rem;
  color: #333;
}

.success-modal p {
  margin: 0 0 0.5rem;
  color: #666;
}

.success-modal p:last-of-type {
  margin-bottom: 2rem;
}

.success-actions {
  display: flex;
  gap: 1rem;
}

.success-btn {
  flex: 1;
  padding: 1rem;
  border: 2px solid #2563eb;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.success-btn.primary {
  background: #2563eb;
  color: #fff;
}

.success-btn.primary:hover {
  background: #1d4ed8;
}

.success-btn:not(.primary) {
  background: #fff;
  color: #2563eb;
}

.success-btn:not(.primary):hover {
  background: #f0f9ff;
}

@media (max-width: 1024px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

