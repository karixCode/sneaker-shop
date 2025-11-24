import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as api from '../api';

export const useSneakersStore = defineStore('sneakers', () => {
  // State
  const sneakers = ref([]);
  const currentSneaker = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Filters
  const searchQuery = ref('');
  const selectedBrands = ref([]);
  const selectedCategories = ref([]);
  const priceRange = ref({min: 0, max: 100000});
  const selectedSize = ref(null);

  // View mode
  const viewMode = ref('grid'); // 'grid' or 'list'

  // Pagination
  const currentPage = ref(1);
  const itemsPerPage = ref(12);

  // Computed
  const brands = computed(() => {
    const uniqueBrands = [...new Set(sneakers.value.map(s => s.brand))];
    return uniqueBrands.sort();
  });

  const categories = computed(() => {
    const uniqueCategories = [...new Set(sneakers.value.map(s => s.category))];
    return uniqueCategories.sort();
  });

  const filteredSneakers = computed(() => {
    let result = [...sneakers.value];

    // Search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(s =>
          s.name.toLowerCase().includes(query) ||
          s.brand.toLowerCase().includes(query)
      );
    }

    // Brand filter
    if (selectedBrands.value.length > 0) {
      result = result.filter(s => selectedBrands.value.includes(s.brand));
    }

    // Category filter
    if (selectedCategories.value.length > 0) {
      result = result.filter(s => selectedCategories.value.includes(s.category));
    }

    // Price filter
    result = result.filter(s =>
        s.price >= priceRange.value.min && s.price <= priceRange.value.max
    );

    // Size filter
    if (selectedSize.value) {
      result = result.filter(s => s.sizes.includes(selectedSize.value));
    }

    return result;
  });

  const paginatedSneakers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredSneakers.value.slice(start, end);
  });

  const totalPages = computed(() => {
    return Math.ceil(filteredSneakers.value.length / itemsPerPage.value);
  });

  // Actions
  const fetchSneakers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.getSneakers();
      sneakers.value = response.data;
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching sneakers:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchSneakerById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.getSneakerById(id);
      currentSneaker.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching sneaker:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const setSearchQuery = (query) => {
    searchQuery.value = query;
    currentPage.value = 1;
  };

  const toggleBrand = (brand) => {
    const index = selectedBrands.value.indexOf(brand);
    if (index > -1) {
      selectedBrands.value.splice(index, 1);
    } else {
      selectedBrands.value.push(brand);
    }
    currentPage.value = 1;
  };

  const toggleCategory = (category) => {
    const index = selectedCategories.value.indexOf(category);
    if (index > -1) {
      selectedCategories.value.splice(index, 1);
    } else {
      selectedCategories.value.push(category);
    }
    currentPage.value = 1;
  }

  const setPriceRange = (min, max) => {
    priceRange.value = { min, max };
    currentPage.value = 1;
  };

  const setSize = (size) => {
    selectedSize.value = size;
    currentPage.value = 1;
  };

  const resetFilters = () => {
    searchQuery.value = '';
    selectedBrands.value = [];
    selectedCategories.value = [];
    priceRange.value = { min: 0, max: 100000 };
    selectedSize.value = null;
    currentPage.value = 1;
  };

  const setViewMode = (mode) => {
    viewMode.value = mode;
  };

  const setPage = (page) => {
    currentPage.value = page;
  };

  return {
    // State
    sneakers,
    currentSneaker,
    loading,
    error,
    searchQuery,
    selectedBrands,
    selectedCategories,
    priceRange,
    selectedSize,
    viewMode,
    currentPage,
    itemsPerPage,

    // Computed
    brands,
    categories,
    filteredSneakers,
    paginatedSneakers,
    totalPages,

    // Actions
    fetchSneakers,
    fetchSneakerById,
    setSearchQuery,
    toggleBrand,
    toggleCategory,
    setPriceRange,
    setSize,
    resetFilters,
    setViewMode,
    setPage,
  };
});
