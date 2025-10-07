import { defineStore } from 'pinia';
import api from '../services/api';

// Type definitie voor gebruiker
interface User {
    id: string;
    name: string;
    email: string;
}

// State van de auth store
interface AuthState {
    token: string | null;
    user: User | null;
}

// Type voor login gegevens
interface LoginCredentials {
    email: string;
    password: string;
}

// Type voor registratie gegevens
interface RegisterData extends LoginCredentials {
    name: string;
}

// Auth store voor inloggen, registreren en uitloggen
export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
      token: localStorage.getItem('token'),
      user: JSON.parse(localStorage.getItem('user') || 'null'),
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
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        },

        // Log gebruiker in
        async login(credentials: LoginCredentials) {
            const normalizedEmail = credentials.email.trim().toLowerCase();
            const response = await api.post('/api/auth/login', { ...credentials, email: normalizedEmail });
            this.saveUserData(response.data.token, response.data.user);
            return response.data;
        },

        // Registreer nieuwe gebruiker
        async register(data: RegisterData) {
            const normalizedEmail = data.email.trim().toLowerCase();
            const response = await api.post('/api/auth/register', { ...data, email: normalizedEmail });
            this.saveUserData(response.data.token, response.data.user);
            return response.data;
        },

        // Log gebruiker uit
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
});