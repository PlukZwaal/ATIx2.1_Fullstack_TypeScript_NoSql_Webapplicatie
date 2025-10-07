import { defineStore } from 'pinia';
import { login as apiLogin, register as apiRegister } from '../services/api';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '../types';
import { STORAGE_KEYS } from '../constants';

// State van de auth store
interface AuthState {
    token: string | null;
    user: User | null;
}

// Auth store voor inloggen, registreren en uitloggen
export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
      token: localStorage.getItem(STORAGE_KEYS.TOKEN),
      user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || 'null'),
    }),

    getters: {
        // Check of gebruiker is ingelogd
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        // Sla token en gebruiker op in state en localStorage
        saveUserData(token: string, user: User) {
            this.token = token;
            this.user = user;
            localStorage.setItem(STORAGE_KEYS.TOKEN, token);
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        },

        // Log gebruiker in
        async login(credentials: LoginCredentials): Promise<AuthResponse> {
            const normalizedEmail = credentials.email.trim().toLowerCase();
            const data = await apiLogin({ ...credentials, email: normalizedEmail });
            this.saveUserData(data.token, data.user);
            return data;
        },

        // Registreer nieuwe gebruiker
        async register(data: RegisterData): Promise<AuthResponse> {
            const normalizedEmail = data.email.trim().toLowerCase();
            const result = await apiRegister({ ...data, email: normalizedEmail });
            this.saveUserData(result.token, result.user);
            return result;
        },

        // Log gebruiker uit
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
        },
    },
});