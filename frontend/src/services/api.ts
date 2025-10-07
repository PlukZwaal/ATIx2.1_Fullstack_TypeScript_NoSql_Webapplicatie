import axios from 'axios';

// Configureer axios instance met baseURL
const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL || 'http://localhost:4000',
});

// Interceptor voor het toevoegen van auth token aan elke request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Favorieten API functies
export const toggleFavorite = async (moduleId: string) => {
  const response = await api.post(`/api/favorites/${moduleId}`);
  return response.data;
};

export const getFavorites = async () => {
  const response = await api.get('/api/favorites');
  return response.data;
};

export default api;
