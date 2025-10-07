// Basis gebruiker interface
export interface User {
    id?: string;
    name: string;
    email: string;
    password: string;
    favorites?: string[]; // Array van module IDs
}

// Login gegevens interface
export interface UserLogin {
    email: string;
    password: string;
}

// Response interface voor authenticatie
export interface AuthResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}