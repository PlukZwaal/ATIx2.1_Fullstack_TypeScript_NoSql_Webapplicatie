import { defineStore } from 'pinia';
import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Type: user payload uit backend
interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
}

// Types voor login & registratie data
interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData extends LoginCredentials {
    name: string;
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
      token: localStorage.getItem('token'),
      user: JSON.parse(localStorage.getItem('user') || 'null'),
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
                saveUserData(token: string, user: User) {
                    this.token = token;
                    this.user = user;
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                },

                async login(credentials: LoginCredentials) {
                    const normalizedEmail = credentials.email.trim().toLowerCase();
                    const response = await api.post('/login', { ...credentials, email: normalizedEmail });
                    this.saveUserData(response.data.token, response.data.user);
                    return response.data;
                },

                async register(data: RegisterData) {
                    const normalizedEmail = data.email.trim().toLowerCase();
                    const response = await api.post('/register', { ...data, email: normalizedEmail });
                    this.saveUserData(response.data.token, response.data.user);
                    return response.data;
                },

                logout() {
                    this.token = null;
                    this.user = null;
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                },
    },
});