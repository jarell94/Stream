import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const videoService = {
  getAllVideos: (params) => api.get('/videos', { params }),
  getVideoById: (id) => api.get(`/videos/${id}`),
  getFeaturedVideos: () => api.get('/videos/featured'),
  getTrendingVideos: () => api.get('/videos/trending'),
  getVideosByCategory: (categoryId) => api.get(`/videos/by-category/${categoryId}`),
  getVideosByGenre: (genre) => api.get(`/videos/by-genre/${genre}`),
  getRelatedVideos: (id) => api.get(`/videos/${id}/related`),
  likeVideo: (id) => api.post(`/videos/${id}/like`),
  addToMyList: (id) => api.post(`/videos/${id}/add-to-list`),
  removeFromMyList: (id) => api.delete(`/videos/${id}/remove-from-list`)
};

export const categoryService = {
  getAllCategories: () => api.get('/categories'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  getCategoryBySlug: (slug) => api.get(`/categories/slug/${slug}`)
};

export const userService = {
  getMyList: () => api.get('/users/my-list'),
  getRecommendations: () => api.get('/users/recommendations'),
  updatePreferences: (preferences) => api.put('/users/preferences', preferences)
};

export const watchHistoryService = {
  getWatchHistory: () => api.get('/watch-history'),
  addToWatchHistory: (data) => api.post('/watch-history', data),
  updateProgress: (videoId, data) => api.put(`/watch-history/${videoId}`, data),
  removeFromHistory: (videoId) => api.delete(`/watch-history/${videoId}`),
  clearHistory: () => api.delete('/watch-history'),
  getContinueWatching: () => api.get('/watch-history/continue-watching')
};

export const searchService = {
  search: (query, filters) => api.get(`/search?q=${query}`, { params: filters }),
  autocomplete: (query) => api.get(`/search/autocomplete?q=${query}`)
};

export default api;
