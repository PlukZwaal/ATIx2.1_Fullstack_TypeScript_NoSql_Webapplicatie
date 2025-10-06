// AuthService doet alle echte werk voor inloggen en registreren - wachtwoorden hashen, tokens maken, validaties checken
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserLogin, AuthResponse } from '../../core/entities/User';
import { UserModel } from '../../infrastructure/models/UserModel';

// Simpele validatie helpers
const isValidEmail = (email: string): boolean => {
  return email.includes('@') && email.includes('.');
};

const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export class AuthService {
    constructor() {
        if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET ontbreekt in .env');
    }

    // Nieuwe gebruiker registreren: valideer input, check of email al bestaat, hash wachtwoord en maak token
    async register(userData: User): Promise<AuthResponse> {
        // Simpele validatie
        if (!userData.name?.trim() || userData.name.trim().length < 2) {
            throw new Error('Naam moet minimaal 2 karakters bevatten');
        }
        if (!isValidEmail(userData.email)) {
            throw new Error('Ongeldig e-mailadres');
        }
        if (!isValidPassword(userData.password)) {
            throw new Error('Wachtwoord moet minimaal 6 karakters bevatten');
        }
        
        // Normaliseer data
        const email = userData.email.trim().toLowerCase();
        const name = userData.name.trim();
        
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new Error('E-mailadres is al geregistreerd');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = this.generateToken(user);
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }

    // Gebruiker inloggen: valideer input, zoek gebruiker, vergelijk wachtwoord en geef token terug
    async login(credentials: UserLogin): Promise<AuthResponse> {
        // Simpele validatie
        if (!isValidEmail(credentials.email)) {
            throw new Error('Ongeldig e-mailadres');
        }
        if (!credentials.password) {
            throw new Error('Wachtwoord is verplicht');
        }
        
        const email = credentials.email.trim().toLowerCase();
        
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw new Error('Ongeldige inloggegevens');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new Error('Ongeldige inloggegevens');
        }

        const token = this.generateToken(user);
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }

    // JWT token maken met gebruiker ID, geldig voor 24 uur
    private generateToken(user: User): string {
        return jwt.sign({ sub: user.id }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
    }
}