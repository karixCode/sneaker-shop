import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const STORAGE_KEY = 'sneakers_view_history';
const MAX_HISTORY_ITEMS = 10;

export const useViewHistoryStore = defineStore('viewHistory', () => {
  const viewedSneakerIds = ref([]);

  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        viewedSneakerIds.value = JSON.parse(stored);
      }
    } catch (err) {
      throw err;
    }
  };

  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(viewedSneakerIds.value));
    } catch (err) {
      throw err;
    }
  };

  const addToHistory = (sneakerId) => {
    const index = viewedSneakerIds.value.indexOf(sneakerId);
    if (index > -1) {
      viewedSneakerIds.value.splice(index, 1);
    }

    viewedSneakerIds.value.unshift(sneakerId);

    if (viewedSneakerIds.value.length > MAX_HISTORY_ITEMS) {
      viewedSneakerIds.value = viewedSneakerIds.value.slice(0, MAX_HISTORY_ITEMS);
    }

    saveToStorage();
  };

  const clearHistory = () => {
    viewedSneakerIds.value = [];
    saveToStorage();
  };

  loadFromStorage();

  return {
    viewedSneakerIds,
    addToHistory,
    clearHistory,
  };
});

