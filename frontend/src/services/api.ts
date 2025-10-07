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

export default api;
