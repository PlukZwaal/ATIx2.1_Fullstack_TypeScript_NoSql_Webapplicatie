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

// Resolve base URL (fallback alleen bedoeld voor local dev)
const resolvedBaseURL: string = (import.meta as any).env?.VITE_API_URL;

// Debug: expose en waarschuw in productie als localhost gebruikt wordt
if (typeof window !== 'undefined') {
  (window as any).__API_BASE__ = resolvedBaseURL;
  if (import.meta.env.PROD && resolvedBaseURL.includes('localhost')) {
    // Console warning zodat je direct ziet dat build fout is geconfigureerd
    console.warn('[API] Production build gebruikt NOG localhost als baseURL:', resolvedBaseURL);
  } else {
    console.log('[API] Base URL =', resolvedBaseURL);
  }
}

// Maak axios instance met base URL
const api = axios.create({
  baseURL: resolvedBaseURL,
});

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
