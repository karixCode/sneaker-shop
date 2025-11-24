<template>
  <div class="product-detail">
    <div class="container">
      <button @click="$router.back()" class="back-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Назад
      </button>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Загрузка...</p>
      </div>

      <div v-else-if="sneaker" class="product-content">
        <div class="gallery">
          <div
            class="main-image"
            @mouseenter="showZoom = true"
            @mouseleave="showZoom = false"
            @mousemove="handleMouseMove"
            ref="imageContainer"
          >
            <img :src="currentImage" :alt="sneaker.name" ref="mainImage" />

            <div
              v-show="showZoom"
              class="zoom-lens"
              :style="lensStyle"
            ></div>

            <div
              v-show="showZoom"
              class="zoom-result"
              :style="zoomResultStyle"
            ></div>
          </div>
          <div class="thumbnails">
            <button
              v-for="(image, index) in sneaker.images"
              :key="index"
              @click="currentImage = image"
              :class="['thumbnail', { active: currentImage === image }]"
            >
              <img :src="image" :alt="`${sneaker.name} ${index + 1}`" />
            </button>
          </div>
        </div>

        <div class="product-info">
          <div class="brand-badge">{{ sneaker.brand }}</div>
          <h1 class="product-title">{{ sneaker.name }}</h1>

          <div class="rating-section" v-if="reviews.length > 0">
            <div class="stars">
              <svg
                v-for="i in 5"
                :key="i"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                :fill="i <= Math.round(averageRating) ? 'currentColor' : 'none'"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <span class="rating-text">{{ averageRating }} ({{ reviews.length }} отзывов)</span>
          </div>

          <div class="price">{{ formatPrice(sneaker.price) }} ₽</div>

          <div class="category-tag">{{ formatCategory(sneaker.category) }}</div>

          <div class="size-selection">
            <label class="size-label">Выберите размер:</label>
            <div class="sizes-grid">
              <button
                v-for="size in sneaker.sizes"
                :key="size"
                @click="selectedSize = size"
                :class="['size-option', { selected: selectedSize === size }]"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <button
            @click="handleAddToCart"
            :disabled="!selectedSize || addingToCart"
            class="add-to-cart-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 2L7 6H3L6 18H18L21 6H17L15 2H9Z"/>
              <circle cx="9" cy="21" r="1"/>
              <circle cx="15" cy="21" r="1"/>
            </svg>
            {{ selectedSize ? 'Добавить в корзину' : 'Выберите размер' }}
          </button>

          <div v-if="addSuccess" class="success-message">
            ✓ Товар добавлен в корзину!
          </div>
        </div>
      </div>

      <section v-if="sneaker" class="reviews-section">
        <div class="reviews-header">
          <h2>Отзывы</h2>
          <button @click="showReviewForm = !showReviewForm" class="add-review-btn">
            {{ showReviewForm ? 'Отменить' : 'Написать отзыв' }}
          </button>
        </div>

        <div v-if="showReviewForm" class="review-form">
          <h3>Ваш отзыв</h3>
          <div class="form-group">
            <label>Ваше имя</label>
            <input v-model="reviewForm.userName" type="text" placeholder="Введите ваше имя" />
          </div>

          <div class="form-group">
            <label>Оценка</label>
            <div class="rating-input">
              <button
                v-for="i in 5"
                :key="i"
                @click="reviewForm.rating = i"
                :class="['star-btn', { active: i <= reviewForm.rating }]"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Комментарий</label>
            <textarea
              v-model="reviewForm.comment"
              rows="4"
              placeholder="Поделитесь своим мнением о товаре"
            ></textarea>
          </div>

          <button @click="submitReview" :disabled="!canSubmitReview" class="submit-review-btn">
            Отправить отзыв
          </button>
        </div>

        <div class="reviews-list">
          <div v-if="reviews.length === 0" class="no-reviews">
            <p>Пока нет отзывов. Будьте первым!</p>
          </div>

          <div v-for="review in sortedReviews" :key="review.id" class="review-card">
            <div class="review-header">
              <div class="review-author">
                <div class="avatar">{{ review.userName.charAt(0) }}</div>
                <div>
                  <div class="author-name">{{ review.userName }}</div>
                  <div class="review-date">{{ formatDate(review.createdAt) }}</div>
                </div>
              </div>
              <div class="review-rating">
                <svg
                  v-for="i in 5"
                  :key="i"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  :fill="i <= review.rating ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
            </div>
            <p class="review-comment">{{ review.comment }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useSneakersStore } from '../stores/sneakers';
import { useCartStore } from '../stores/cart';
import { useReviewsStore } from '../stores/reviews';
import { useViewHistoryStore } from '../stores/viewHistory';

const route = useRoute();
const sneakersStore = useSneakersStore();
const cartStore = useCartStore();
const reviewsStore = useReviewsStore();
const viewHistoryStore = useViewHistoryStore();

const loading = ref(false);
const sneaker = ref(null);
const currentImage = ref('');
const selectedSize = ref(null);
const addingToCart = ref(false);
const addSuccess = ref(false);
const showReviewForm = ref(false);

const showZoom = ref(false);
const imageContainer = ref(null);
const mainImage = ref(null);
const lensPosition = ref({ x: 0, y: 0 });
const zoomLevel = 2.5;

const reviewForm = ref({
  userName: '',
  rating: 5,
  comment: '',
});

const reviews = computed(() => {
  if (!sneaker.value) return [];
  return reviewsStore.reviewsBySneaker(sneaker.value.id);
});

const sortedReviews = computed(() => {
  return [...reviews.value].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  );
});

const averageRating = computed(() => {
  if (!sneaker.value) return 0;
  return parseFloat(reviewsStore.averageRating(sneaker.value.id));
});

const canSubmitReview = computed(() => {
  return reviewForm.value.userName.trim() &&
         reviewForm.value.rating > 0 &&
         reviewForm.value.comment.trim();
});

const lensStyle = computed(() => {
  return {
    left: `${lensPosition.value.x}px`,
    top: `${lensPosition.value.y}px`,
  };
});

const zoomResultStyle = computed(() => {
  if (!imageContainer.value) return {};

  const lensSize = 150;
  const backgroundX = -lensPosition.value.x * zoomLevel + lensSize / 2;
  const backgroundY = -lensPosition.value.y * zoomLevel + lensSize / 2;

  return {
    backgroundImage: `url(${currentImage.value})`,
    backgroundPosition: `${backgroundX}px ${backgroundY}px`,
    backgroundSize: `${imageContainer.value.offsetWidth * zoomLevel}px ${imageContainer.value.offsetHeight * zoomLevel}px`,
  };
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const handleAddToCart = async () => {
  if (!selectedSize.value) return;

  addingToCart.value = true;
  addSuccess.value = false;

  const success = await cartStore.addToCart(sneaker.value.id, selectedSize.value);

  if (success) {
    addSuccess.value = true;
    setTimeout(() => {
      addSuccess.value = false;
    }, 3000);
  }

  addingToCart.value = false;
};

const submitReview = async () => {
  if (!canSubmitReview.value) return;

  const success = await reviewsStore.addReview(
    sneaker.value.id,
    reviewForm.value.userName,
    reviewForm.value.rating,
    reviewForm.value.comment
  );

  if (success) {
    reviewForm.value = {
      userName: '',
      rating: 5,
      comment: '',
    };
    showReviewForm.value = false;
  }
};

const handleMouseMove = (e) => {
  if (!imageContainer.value) return;

  const containerRect = imageContainer.value.getBoundingClientRect();
  const lensSize = 150;

  let x = e.clientX - containerRect.left;
  let y = e.clientY - containerRect.top;

  x = Math.max(lensSize / 2, Math.min(x, containerRect.width - lensSize / 2));
  y = Math.max(lensSize / 2, Math.min(y, containerRect.height - lensSize / 2));

  lensPosition.value = {
    x: x - lensSize / 2,
    y: y - lensSize / 2,
  };
};

onMounted(async () => {
  loading.value = true;
  const id = parseInt(route.params.id);

  sneaker.value = await sneakersStore.fetchSneakerById(id);

  if (sneaker.value) {
    currentImage.value = sneaker.value.images[0];
    viewHistoryStore.addToHistory(id);
    await reviewsStore.fetchReviews(id);
  }

  loading.value = false;
});
</script>

<style scoped>
.product-detail {
  min-height: calc(100vh - 4rem);
  padding: 2rem 0;
  background: #f9fafb;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
  transition: color 0.3s;
}

.back-btn:hover {
  color: #2563eb;
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

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  width: 100%;
  padding-top: 100%;
  position: relative;
  background: #f3f4f6;
  border-radius: 12px;
  overflow: visible;
  cursor: crosshair;
}

.main-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.zoom-lens {
  position: absolute;
  width: 150px;
  height: 150px;
  border: 3px solid #2563eb;
  border-radius: 50%;
  pointer-events: none;
  background: rgba(37, 99, 235, 0.15);
  backdrop-filter: blur(1px);
  box-shadow: 0 0 20px rgba(37, 99, 235, 0.4),
              inset 0 0 20px rgba(255, 255, 255, 0.3);
  transition: opacity 0.2s ease;
  z-index: 10;
}

.zoom-result {
  position: absolute;
  top: 0;
  left: calc(100% + 2rem);
  width: 100%;
  height: 100%;
  border: 3px solid #2563eb;
  border-radius: 12px;
  background-color: #fff;
  background-repeat: no-repeat;
  pointer-events: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 20;
  overflow: hidden;
  animation: zoomIn 0.2s ease-out;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.thumbnails {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
}

.thumbnail {
  padding: 0;
  border: 3px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  background: #f3f4f6;
  transition: border-color 0.3s;
  aspect-ratio: 1;
}

.thumbnail:hover {
  border-color: #d1d5db;
}

.thumbnail.active {
  border-color: #2563eb;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.brand-badge {
  display: inline-block;
  background: #dbeafe;
  color: #2563eb;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
}

.product-title {
  margin: 0;
  font-size: 2rem;
  color: #333;
  line-height: 1.2;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stars {
  display: flex;
  gap: 0.25rem;
  color: #fbbf24;
}

.rating-text {
  font-size: 0.875rem;
  color: #666;
}

.price {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
}

.category-tag {
  display: inline-block;
  background: #f3f4f6;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #666;
  width: fit-content;
}

.size-selection {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.size-label {
  font-weight: 600;
  color: #333;
}

.sizes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 0.75rem;
}

.size-option {
  padding: 1rem;
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.size-option:hover {
  border-color: #2563eb;
  color: #2563eb;
  transform: translateY(-2px);
}

.size-option.selected {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}

.add-to-cart-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #1d4ed8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.add-to-cart-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.success-message {
  background: #d1fae5;
  color: #065f46;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reviews-section {
  background: #fff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.reviews-header h2 {
  margin: 0;
  font-size: 1.75rem;
  color: #333;
}

.add-review-btn {
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.add-review-btn:hover {
  background: #1d4ed8;
}

.review-form {
  background: #f9fafb;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
}

.review-form h3 {
  margin: 0 0 1.5rem;
  font-size: 1.25rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
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

.rating-input {
  display: flex;
  gap: 0.5rem;
}

.star-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #d1d5db;
  transition: color 0.3s;
  padding: 0;
}

.star-btn.active,
.star-btn:hover {
  color: #fbbf24;
}

.submit-review-btn {
  padding: 0.75rem 2rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.submit-review-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.submit-review-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.no-reviews {
  text-align: center;
  padding: 3rem 0;
  color: #666;
}

.review-card {
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.review-author {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.avatar {
  width: 48px;
  height: 48px;
  background: #2563eb;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
}

.author-name {
  font-weight: 600;
  color: #333;
}

.review-date {
  font-size: 0.875rem;
  color: #666;
}

.review-rating {
  display: flex;
  gap: 0.25rem;
  color: #fbbf24;
}

.review-comment {
  margin: 0;
  color: #666;
  line-height: 1.6;
}
</style>

