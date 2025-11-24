import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getSneakers = (params) => api.get('/sneakers', { params });
export const getSneakerById = (id) => api.get(`/sneakers/${id}`);

export const getReviews = (sneakerId) => api.get('/reviews', { params: { sneakerId } });
export const addReview = (review) => api.post('/reviews', review);

export const getCartItems = () => api.get('/cartItems');
export const addToCart = (item) => api.post('/cartItems', item);
export const updateCartItem = (id, item) => api.patch(`/cartItems/${id}`, item);
export const removeFromCart = (id) => api.delete(`/cartItems/${id}`);

export const getOrders = () => api.get('/orders');
export const createOrder = (order) => api.post('/orders', order);

export default api;

