import axios from 'axios';

// Maak axios instance met base URL
const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL || 'http://localhost:4000',
});

// Voeg automatisch JWT token toe aan elke request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Voeg module toe of verwijder uit favorieten
export const toggleFavorite = async (moduleId: string) => {
  const response = await api.post(`/api/favorites/${moduleId}`);
  return response.data;
};

// Haal alle favorieten op
export const getFavorites = async () => {
  const response = await api.get('/api/favorites');
  return response.data;
};

export default api;
