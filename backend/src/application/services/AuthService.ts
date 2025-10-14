import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserLogin, AuthResponse } from '../../core/entities/User';
import { UserModel } from '../../infrastructure/models/UserModel';

// Service voor authenticatie (registreren en inloggen)
export class AuthService {
    constructor() {
        if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET ontbreekt');
    }

    // Registreer nieuwe gebruiker
    async register(userData: User): Promise<AuthResponse> {
        // Valideer naam
        if (!userData.name?.trim() || userData.name.trim().length < 2) {
            throw new Error('Naam moet minimaal 2 karakters bevatten');
        }
        
        // Valideer email
        if (!userData.email.includes('@') || !userData.email.includes('.')) {
            throw new Error('Ongeldig e-mailadres');
        }
        
        // Valideer wachtwoord
        if (userData.password.length < 6) {
            throw new Error('Wachtwoord moet minimaal 6 karakters bevatten');
        }
        
        const email = userData.email.trim().toLowerCase();
        const name = userData.name.trim();
        
        // Check of email al bestaat
        if (await UserModel.findOne({ email })) {
            throw new Error('E-mailadres is al geregistreerd');
        }

        // Maak nieuwe gebruiker aan met gehashed wachtwoord
        const user = await UserModel.create({
            name,
            email,
            password: await bcrypt.hash(userData.password, 10), 
        });

        // Genereer JWT token en stuur terug
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

    // Log gebruiker in
    async login(credentials: UserLogin): Promise<AuthResponse> {
        // Valideer email
        if (!credentials.email.includes('@') || !credentials.email.includes('.')) {
            throw new Error('Ongeldig e-mailadres');
        }
        
        // Check of wachtwoord is ingevuld
        if (!credentials.password) {
            throw new Error('Wachtwoord is verplicht');
        }
        
        // Zoek gebruiker in database
        const user = await UserModel.findOne({ email: credentials.email.trim().toLowerCase() });
        
        // Check of gebruiker bestaat en wachtwoord klopt
        if (!user || !await bcrypt.compare(credentials.password, user.password)) {
            throw new Error('Ongeldige inloggegevens');
        }

        // Genereer JWT token en stuur terug
        return {
            token: this.generateToken(user),
            user: { id: user.id, name: user.name, email: user.email },
        };
    }

    // Maak JWT token aan (geldig voor 24 uur)
    private generateToken(user: User): string {
        return jwt.sign({ sub: user.id, name: user.name }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
    }
}