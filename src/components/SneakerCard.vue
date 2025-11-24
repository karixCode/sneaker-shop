<template>
  <div :class="['sneaker-card', viewMode]" @click="goToDetail">
    <div class="card-image">
      <img :src="sneaker.images[0]" :alt="sneaker.name" />
      <button
        @click.stop="addToCartHandler"
        class="quick-add-btn"
        title="Добавить в корзину"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 2L7 6H3L6 18H18L21 6H17L15 2H9Z"/>
          <circle cx="9" cy="21" r="1"/>
          <circle cx="15" cy="21" r="1"/>
        </svg>
      </button>
    </div>

    <div class="card-content">
      <div class="card-brand">{{ sneaker.brand }}</div>
      <h3 class="card-title">{{ sneaker.name }}</h3>

      <div class="card-meta">
        <div class="card-rating" v-if="rating > 0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
          <span>{{ rating }}</span>
        </div>
        <div class="card-category">{{ formatCategory(sneaker.category) }}</div>
      </div>

      <div class="card-footer">
        <div class="card-price">{{ formatPrice(sneaker.price) }} ₽</div>
        <div class="card-sizes">
          <span class="sizes-label">Размеры:</span>
          <span class="sizes-range">{{ sizesRange }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useReviewsStore } from '../stores/reviews';

const props = defineProps({
  sneaker: {
    type: Object,
    required: true,
  },
  viewMode: {
    type: String,
    default: 'grid',
  },
});

const emit = defineEmits(['add-to-cart']);

const router = useRouter();
const reviewsStore = useReviewsStore();

const rating = computed(() => reviewsStore.averageRating(props.sneaker.id));

const sizesRange = computed(() => {
  const sizes = props.sneaker.sizes;
  if (sizes.length === 0) return '-';
  const min = Math.min(...sizes);
  const max = Math.max(...sizes);
  return `${min}-${max}`;
});

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const formatCategory = (category) => {
  const map = {
    running: 'Для бега',
    lifestyle: 'Повседневные',
    basketball: 'Баскетбол',
    training: 'Тренировки',
  };
  return map[category] || category;
};

const goToDetail = () => {
  router.push({ name: 'ProductDetail', params: { id: props.sneaker.id } });
};

const addToCartHandler = () => {
  emit('add-to-cart', props.sneaker);
};
</script>

<style scoped>
.sneaker-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sneaker-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.sneaker-card.grid {
  display: flex;
  flex-direction: column;
}

.sneaker-card.list {
  display: flex;
  flex-direction: row;
}

.card-image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: #f3f4f6;
  overflow: hidden;
}

.sneaker-card.list .card-image {
  width: 200px;
  min-width: 200px;
  padding-top: 0;
  height: 200px;
}

.card-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.sneaker-card:hover .card-image img {
  transform: scale(1.05);
}

.quick-add-btn {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: #fff;
  border: none;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
}

.sneaker-card:hover .quick-add-btn {
  opacity: 1;
  transform: translateY(0);
}

.quick-add-btn:hover {
  background: #2563eb;
  color: #fff;
}

.card-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.card-brand {
  font-size: 0.75rem;
  color: #2563eb;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-title {
  margin: 0;
  font-size: 1rem;
  color: #333;
  font-weight: 600;
  line-height: 1.3;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #666;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #fbbf24;
}

.card-category {
  font-size: 0.75rem;
}

.card-footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
}

.card-sizes {
  font-size: 0.75rem;
  color: #666;
}

.sizes-label {
  margin-right: 0.25rem;
}

.sizes-range {
  font-weight: 600;
  color: #333;
}

@media (max-width: 768px) {
  .sneaker-card.list {
    flex-direction: column;
  }

  .sneaker-card.list .card-image {
    width: 100%;
    padding-top: 100%;
    height: auto;
  }
}
</style>

