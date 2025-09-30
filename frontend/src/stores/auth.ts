import { defineStore } from 'pinia';
import axios from 'axios';


// API configuratie
const API_URL = import.meta.env.API_URL;

// Axios instantie met auth header
const api = axios.create({
    baseURL: API_URL
});

// Voeg auth token toe aan requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Types voor gebruiker en authenticatie
interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
}

// Types voor login en registratie
interface LoginCredentials {
    email: string;
    password: string;
}

interface RegisterData extends LoginCredentials {
    name: string;
}

// Auth store definitie
export const useAuthStore = defineStore('auth', {
    // Initiële state met localStorage waarden
    state: (): AuthState => ({
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user') || 'null'),
    }),

    getters: {
        isAuthenticated: (state) => !!state.token,
    },

    actions: {
        // Sla gebruikersgegevens op in localStorage en state
        saveUserData(token: string, user: User) {
            this.token = token;
            this.user = user;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        },

        // Login functie
        async login(credentials: LoginCredentials) {
            const response = await axios.post(`${API_URL}/login`, credentials);
            this.saveUserData(response.data.token, response.data.user);
            return response.data;
        },

        // Registreer functie
        async register(data: RegisterData) {
            const response = await axios.post(`${API_URL}/register`, data);
            this.saveUserData(response.data.token, response.data.user);
            return response.data;
        },

        // Uitlog functie
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
    },
});