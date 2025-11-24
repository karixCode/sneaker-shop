<template>
  <div class="catalog">
    <div class="container">
      <div class="catalog-layout">
        <aside class="filters-sidebar" :class="{ open: filtersOpen }">
          <button @click="filtersOpen = false" class="close-filters">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <Filters />
        </aside>

        <main class="catalog-main">
          <div class="toolbar">
            <div class="toolbar-left">
              <button @click="filtersOpen = true" class="filters-toggle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18M8 12h8M11 18h2"/>
                </svg>
                Фильтры
              </button>
              <div class="results-count">
                Найдено: {{ filteredCount }} товаров
              </div>
            </div>

            <div class="toolbar-right">
              <div class="view-mode">
                <button
                  @click="setViewMode('grid')"
                  :class="['view-btn', { active: viewMode === 'grid' }]"
                  title="Сетка"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                  </svg>
                </button>
                <button
                  @click="setViewMode('list')"
                  :class="['view-btn', { active: viewMode === 'list' }]"
                  title="Список"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>Загрузка товаров...</p>
          </div>

          <div v-else-if="error" class="error">
            <p>{{ error }}</p>
            <button @click="fetchSneakers" class="retry-btn">Попробовать снова</button>
          </div>

          <div v-else-if="paginatedSneakers.length > 0" :class="['products-grid', viewMode]">
            <SneakerCard
              v-for="sneaker in paginatedSneakers"
              :key="sneaker.id"
              :sneaker="sneaker"
              :view-mode="viewMode"
              @add-to-cart="handleAddToCart"
            />
          </div>

          <div v-else class="no-results">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <h3>Ничего не найдено</h3>
            <p>Попробуйте изменить параметры поиска</p>
            <button @click="resetFilters" class="reset-btn">Сбросить фильтры</button>
          </div>

          <div v-if="totalPages > 1" class="pagination">
            <button
              @click="setPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="page-btn"
            >
              Назад
            </button>

            <div class="page-numbers">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="setPage(page)"
                :class="['page-btn', { active: page === currentPage }]"
              >
                {{ page }}
              </button>
            </div>

            <button
              @click="setPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="page-btn"
            >
              Вперед
            </button>
          </div>

          <section v-if="viewHistory.length > 0" class="view-history">
            <div class="section-header">
              <h2>Вы смотрели</h2>
              <button @click="clearHistory" class="clear-btn">Очистить</button>
            </div>
            <div class="history-grid">
              <SneakerCard
                v-for="sneaker in viewHistorySneakers"
                :key="sneaker.id"
                :sneaker="sneaker"
                view-mode="grid"
                @add-to-cart="handleAddToCart"
              />
            </div>
          </section>
        </main>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="quickAddModal" class="modal-overlay" @click="closeQuickAdd">
        <div class="modal-content" @click.stop>
          <button @click="closeQuickAdd" class="modal-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          <h3>Выберите размер</h3>
          <p class="modal-product">{{ quickAddModal.name }}</p>

          <div class="size-grid">
            <button
              v-for="size in quickAddModal.sizes"
              :key="size"
              @click="addToCart(quickAddModal.id, size)"
              class="size-btn"
            >
              {{ size }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useSneakersStore } from '../stores/sneakers';
import { useCartStore } from '../stores/cart';
import { useViewHistoryStore } from '../stores/viewHistory';
import Filters from '../components/Filters.vue';
import SneakerCard from '../components/SneakerCard.vue';

const sneakersStore = useSneakersStore();
const cartStore = useCartStore();
const viewHistoryStore = useViewHistoryStore();

const filtersOpen = ref(false);
const quickAddModal = ref(null);

const loading = computed(() => sneakersStore.loading);
const error = computed(() => sneakersStore.error);
const paginatedSneakers = computed(() => sneakersStore.paginatedSneakers);
const filteredCount = computed(() => sneakersStore.filteredSneakers.length);
const viewMode = computed(() => sneakersStore.viewMode);
const currentPage = computed(() => sneakersStore.currentPage);
const totalPages = computed(() => sneakersStore.totalPages);

const viewHistory = computed(() => viewHistoryStore.viewedSneakerIds);
const viewHistorySneakers = computed(() => {
  return sneakersStore.sneakers.filter(sneaker => viewHistory.value.includes(Number(sneaker.id))).slice(0, 3);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const setViewMode = (mode) => {
  sneakersStore.setViewMode(mode);
};

const setPage = (page) => {
  sneakersStore.setPage(page);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const resetFilters = () => {
  sneakersStore.resetFilters();
};

const clearHistory = () => {
  viewHistoryStore.clearHistory();
};

const handleAddToCart = (sneaker) => {
  quickAddModal.value = sneaker;
};

const addToCart = async (sneakerId, size) => {
  const success = await cartStore.addToCart(sneakerId, size);
  if (success) {
    closeQuickAdd();
  }
};

const closeQuickAdd = () => {
  quickAddModal.value = null;
};

onMounted(async () => {
  await sneakersStore.fetchSneakers();
  await cartStore.fetchCartItems();
});
</script>

<style scoped>
.catalog {
  min-height: calc(100vh - 4rem);
  padding: 2rem 0;
  background: #f9fafb;
}

.catalog-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  align-items: start;
}

.filters-sidebar {
  position: relative;
}

.close-filters {
  display: none;
}

.catalog-main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.toolbar {
  background: #fff;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filters-toggle {
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.3s;
}

.filters-toggle:hover {
  background: #e5e7eb;
}

.results-count {
  font-size: 0.875rem;
  color: #666;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.view-mode {
  display: flex;
  gap: 0.5rem;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 8px;
}

.view-btn {
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn:hover {
  color: #2563eb;
}

.view-btn.active {
  background: #fff;
  color: #2563eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.loading,
.error,
.no-results {
  text-align: center;
  padding: 4rem 2rem;
  background: #fff;
  border-radius: 12px;
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

.products-grid {
  display: grid;
  gap: 1.5rem;
}

.products-grid.grid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.products-grid.list {
  grid-template-columns: 1fr;
}

.no-results svg {
  color: #d1d5db;
  margin: 0 auto 1rem;
}

.no-results h3 {
  margin: 0 0 0.5rem;
  color: #333;
}

.no-results p {
  margin: 0 0 1.5rem;
  color: #666;
}

.reset-btn,
.retry-btn {
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.reset-btn:hover,
.retry-btn:hover {
  background: #1d4ed8;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
  min-width: 2.5rem;
}

.page-btn:hover:not(:disabled) {
  border-color: #2563eb;
  color: #2563eb;
}

.page-btn.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.view-history {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.clear-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: opacity 0.3s;
}

.clear-btn:hover {
  opacity: 0.7;
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
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
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  position: relative;
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

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
  transition: color 0.3s;
}

.modal-close:hover {
  color: #333;
}

.modal-content h3 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  color: #333;
}

.modal-product {
  margin: 0 0 1.5rem;
  color: #666;
}

.size-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 0.75rem;
}

.size-btn {
  padding: 1rem;
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.size-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
  transform: translateY(-2px);
}

/* Mobile */
@media (max-width: 1024px) {
  .catalog-layout {
    grid-template-columns: 1fr;
  }

  .filters-sidebar {
    position: fixed;
    left: -100%;
    top: 0;
    bottom: 0;
    width: 80%;
    max-width: 300px;
    background: #fff;
    z-index: 999;
    transition: left 0.3s;
    overflow-y: auto;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  }

  .filters-sidebar.open {
    left: 0;
  }

  .close-filters {
    display: flex;
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #666;
    padding: 0.5rem;
    z-index: 1;
  }

  .filters-toggle {
    display: flex;
  }

  .products-grid.grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 640px) {
  .toolbar {
    flex-direction: column;
    gap: 1rem;
  }

  .toolbar-left,
  .toolbar-right {
    width: 100%;
    justify-content: space-between;
  }

  .products-grid.grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .history-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

