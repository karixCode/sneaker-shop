import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const STORAGE_KEY = 'sneakers_view_history';
const MAX_HISTORY_ITEMS = 10;

export const useViewHistoryStore = defineStore('viewHistory', () => {
  const viewedSneakerIds = ref([]);

  // Load from localStorage
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        viewedSneakerIds.value = JSON.parse(stored);
      }
    } catch (err) {
      console.error('Error loading view history:', err);
    }
  };

  // Save to localStorage
  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedSneakerIds.value));
    } catch (err) {
      console.error('Error saving view history:', err);
    }
  };

  // Actions
  const addToHistory = (sneakerId) => {
    // Remove if already exists
    const index = viewedSneakerIds.value.indexOf(sneakerId);
    if (index > -1) {
      viewedSneakerIds.value.splice(index, 1);
    }

    // Add to beginning
    viewedSneakerIds.value.unshift(sneakerId);

    // Limit size
    if (viewedSneakerIds.value.length > MAX_HISTORY_ITEMS) {
      viewedSneakerIds.value = viewedSneakerIds.value.slice(0, MAX_HISTORY_ITEMS);
    }

    saveToStorage();
  };

  const clearHistory = () => {
    viewedSneakerIds.value = [];
    saveToStorage();
  };

  // Initialize
  loadFromStorage();

  return {
    viewedSneakerIds,
    addToHistory,
    clearHistory,
  };
});

