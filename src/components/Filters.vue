<template>
  <div class="filters">
    <div class="filters-header">
      <h3>Фильтры</h3>
      <button @click="resetFilters" class="reset-btn">Сбросить</button>
    </div>

    <div class="filter-group">
      <label class="filter-label">Поиск</label>
      <input
        v-model="localSearch"
        @input="onSearchChange"
        type="text"
        placeholder="Найти кроссовки..."
        class="search-input"
      />
    </div>

    <div class="filter-group">
      <label class="filter-label">Бренд</label>
      <div class="checkbox-group">
        <label v-for="brand in brands" :key="brand" class="checkbox-label">
          <input
            type="checkbox"
            :checked="selectedBrands.includes(brand)"
            @change="toggleBrand(brand)"
          />
          <span>{{ brand }}</span>
        </label>
      </div>
    </div>

    <div class="filter-group">
      <label class="filter-label">Категория</label>
      <div class="checkbox-group">
        <label v-for="category in categories" :key="category" class="checkbox-label">
          <input
            type="checkbox"
            :checked="selectedCategories.includes(category)"
            @change="toggleCategory(category)"
          />
          <span>{{ formatCategory(category) }}</span>
        </label>
      </div>
    </div>

    <div class="filter-group">
      <label class="filter-label">Цена</label>
      <div class="price-inputs">
        <input
          v-model.number="localPriceMin"
          @change="onPriceChange"
          type="number"
          placeholder="От"
          class="price-input"
        />
        <span>—</span>
        <input
          v-model.number="localPriceMax"
          @change="onPriceChange"
          type="number"
          placeholder="До"
          class="price-input"
        />
      </div>
    </div>

    <div class="filter-group">
      <label class="filter-label">Размер</label>
      <div class="size-grid">
        <button
          v-for="size in availableSizes"
          :key="size"
          @click="toggleSize(size)"
          :class="['size-btn', { active: selectedSize === size }]"
        >
          {{ size }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useSneakersStore } from '../stores/sneakers';

const sneakersStore = useSneakersStore();

const localSearch = ref(sneakersStore.searchQuery);
const localPriceMin = ref(sneakersStore.priceRange.min);
const localPriceMax = ref(sneakersStore.priceRange.max);

const brands = computed(() => sneakersStore.brands);
const categories = computed(() => sneakersStore.categories);
const selectedBrands = computed(() => sneakersStore.selectedBrands);
const selectedCategories = computed(() => sneakersStore.selectedCategories);
const selectedSize = computed(() => sneakersStore.selectedSize);

const availableSizes = computed(() => {
  const sizes = new Set();
  sneakersStore.sneakers.forEach(sneaker => {
    sneaker.sizes.forEach(size => sizes.add(size));
  });
  return Array.from(sizes).sort((a, b) => a - b);
});

const onSearchChange = () => {
  sneakersStore.setSearchQuery(localSearch.value);
};

const toggleBrand = (brand) => {
  sneakersStore.toggleBrand(brand);
};

const toggleCategory = (category) => {
  sneakersStore.toggleCategory(category);
};

const onPriceChange = () => {
  sneakersStore.setPriceRange(localPriceMin.value, localPriceMax.value);
};

const toggleSize = (size) => {
  if (selectedSize.value === size) {
    sneakersStore.setSize(null);
  } else {
    sneakersStore.setSize(size);
  }
};

const resetFilters = () => {
  sneakersStore.resetFilters();
  localSearch.value = '';
  localPriceMin.value = 0;
  localPriceMax.value = 100000;
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

watch(() => sneakersStore.searchQuery, (newVal) => {
  localSearch.value = newVal;
});

watch(() => sneakersStore.priceRange, (newVal) => {
  localPriceMin.value = newVal.min;
  localPriceMax.value = newVal.max;
});
</script>

<style scoped>
.filters {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 5rem;
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filters-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.reset-btn {
  background: none;
  border: none;
  color: #2563eb;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: opacity 0.3s;
}

.reset-btn:hover {
  opacity: 0.7;
}

.filter-group {
  margin-bottom: 1.5rem;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #333;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #2563eb;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #666;
  transition: color 0.3s;
}

.checkbox-label:hover {
  color: #333;
}

.checkbox-label input[type="checkbox"] {
  cursor: pointer;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-input {
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: border-color 0.3s;
}

.price-input:focus {
  outline: none;
  border-color: #2563eb;
}

.size-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.size-btn {
  padding: 0.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s;
}

.size-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.size-btn.active {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}

@media (max-width: 768px) {
  .filters {
    position: static;
  }
}
</style>

