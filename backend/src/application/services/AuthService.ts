import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserLogin, AuthResponse } from '../../core/entities/User';
import { UserModel } from '../../infrastructure/models/UserModel';

export class AuthService {
    constructor() {
        if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET ontbreekt');
    }

    async register(userData: User): Promise<AuthResponse> {
        // Validatie
        if (!userData.name?.trim() || userData.name.trim().length < 2) {
            throw new Error('Naam moet minimaal 2 karakters bevatten');
        }
        if (!userData.email.includes('@') || !userData.email.includes('.')) {
            throw new Error('Ongeldig e-mailadres');
        }
        if (userData.password.length < 6) {
            throw new Error('Wachtwoord moet minimaal 6 karakters bevatten');
        }
        
        const email = userData.email.trim().toLowerCase();
        const name = userData.name.trim();
        
        if (await UserModel.findOne({ email })) {
            throw new Error('E-mailadres is al geregistreerd');
        }

        const user = await UserModel.create({
            name,
            email,
            password: await bcrypt.hash(userData.password, 10),
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

    async login(credentials: UserLogin): Promise<AuthResponse> {
        if (!credentials.email.includes('@') || !credentials.email.includes('.')) {
            throw new Error('Ongeldig e-mailadres');
        }
        if (!credentials.password) {
            throw new Error('Wachtwoord is verplicht');
        }
        
        const user = await UserModel.findOne({ email: credentials.email.trim().toLowerCase() });
        if (!user || !await bcrypt.compare(credentials.password, user.password)) {
            throw new Error('Ongeldige inloggegevens');
        }

        return {
            token: this.generateToken(user),
            user: { id: user.id, name: user.name, email: user.email },
        };
    }

    private generateToken(user: User): string {
        return jwt.sign({ sub: user.id }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
    }
}