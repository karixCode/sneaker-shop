import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as api from '../api';

export const useReviewsStore = defineStore('reviews', () => {
  const reviews = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Computed
  const reviewsBySneaker = computed(() => {
    return (sneakerId) => reviews.value.filter(r => r.sneakerId === sneakerId);
  });

  const averageRating = computed(() => {
    return (sneakerId) => {
      const sneakerReviews = reviews.value.filter(r => r.sneakerId === sneakerId);
      if (sneakerReviews.length === 0) return 0;
      const sum = sneakerReviews.reduce((acc, r) => acc + r.rating, 0);
      return (sum / sneakerReviews.length).toFixed(1);
    };
  });

  // Actions
  const fetchReviews = async (sneakerId) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.getReviews(sneakerId);
      // Merge with existing reviews
      const newReviews = response.data.filter(
        newReview => !reviews.value.some(r => r.id === newReview.id)
      );
      reviews.value = [...reviews.value, ...newReviews];
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching reviews:', err);
    } finally {
      loading.value = false;
    }
  };

  const addReview = async (sneakerId, userName, rating, comment) => {
    loading.value = true;
    error.value = null;
    try {
      const newReview = {
        sneakerId,
        userName,
        rating,
        comment,
        createdAt: new Date().toISOString(),
      };
      const response = await api.addReview(newReview);
      reviews.value.push(response.data);
      return true;
    } catch (err) {
      error.value = err.message;
      console.error('Error adding review:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    reviews,
    loading,
    error,
    reviewsBySneaker,
    averageRating,
    fetchReviews,
    addReview,
  };
});

