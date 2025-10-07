import axios from 'axios';
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  Module,
  CreateModuleData,
  UpdateModuleData,
  FilterOptions,
  FavoritesResponse,
  ToggleFavoriteResponse
} from '../types';
import { STORAGE_KEYS } from '../constants';

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  // Optioneel: gooi een foutmelding als de variabele niet is ingesteld
  console.error("Omgevingsvariabele VITE_API_URL is niet ingesteld!");
  // Of stel een fallback in als dat nodig is
  // throw new Error("API URL missing!");
}

const api = axios.create({ baseURL });
console.log('API base URL:', baseURL);
// Voeg automatisch JWT token toe aan elke request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== AUTH API ====================

// Registreer nieuwe gebruiker
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/register', data);
  return response.data;
};

// Log gebruiker in
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/login', credentials);
  return response.data;
};

// ==================== MODULES API ====================

// Haal alle modules op (met optionele filters)
export const getModules = async (params?: URLSearchParams): Promise<Module[]> => {
  const url = params ? `/api/modules?${params.toString()}` : '/api/modules';
  const response = await api.get<Module[]>(url);
  return response.data;
};

// Haal één module op
export const getModuleById = async (id: string): Promise<Module> => {
  const response = await api.get<Module>(`/api/modules/${id}`);
  return response.data;
};

// Maak nieuwe module aan
export const createModule = async (data: CreateModuleData): Promise<Module> => {
  const response = await api.post<Module>('/api/modules', data);
  return response.data;
};

// Update bestaande module
export const updateModule = async (id: string, data: UpdateModuleData): Promise<Module> => {
  const response = await api.put<Module>(`/api/modules/${id}`, data);
  return response.data;
};

// Verwijder module
export const deleteModule = async (id: string): Promise<void> => {
  await api.delete(`/api/modules/${id}`);
};

// Haal filter opties op
export const getFilterOptions = async (): Promise<FilterOptions> => {
  const response = await api.get<FilterOptions>('/api/modules/filter-options');
  return response.data;
};

// ==================== FAVORIETEN API ====================

// Voeg module toe of verwijder uit favorieten
export const toggleFavorite = async (moduleId: string): Promise<ToggleFavoriteResponse> => {
  const response = await api.post<ToggleFavoriteResponse>(`/api/favorites/${moduleId}`);
  return response.data;
};

// Haal alle favorieten op
export const getFavorites = async (): Promise<FavoritesResponse> => {
  const response = await api.get<FavoritesResponse>('/api/favorites');
  return response.data;
};

export default api;
