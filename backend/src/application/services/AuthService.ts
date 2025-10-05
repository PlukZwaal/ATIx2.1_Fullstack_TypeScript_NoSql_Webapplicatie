import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserLogin, AuthResponse } from '../../core/entities/User';
import { UserModel } from '../../infrastructure/models/UserModel';
import { validateRegisterInput, validateLoginInput, normalizeRegisterInput, normalizeLoginInput } from '../utils/validation';

export class AuthService {
    constructor() {
        if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET ontbreekt in .env');
    }

    async register(userData: User): Promise<AuthResponse> {
        // Centraliseer normalisatie via utils (naam + email)
        userData = normalizeRegisterInput(userData as any) as User;
        const regValidation = validateRegisterInput(userData.name, userData.email, userData.password);
        if (!regValidation.valid) {
            throw new Error(regValidation.message);
        }
        const existingUser = await UserModel.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('E-mailadres is al geregistreerd');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await UserModel.create({
            ...userData,
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

    async login(credentials: UserLogin): Promise<AuthResponse> {
    credentials = normalizeLoginInput(credentials as any) as UserLogin;
        const loginValidation = validateLoginInput(credentials.email, credentials.password);
        if (!loginValidation.valid) {
            throw new Error(loginValidation.message);
        }
        const user = await UserModel.findOne({ email: credentials.email });
        if (!user) {
            throw new Error('Ongeldige inloggegevens');
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
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

    private generateToken(user: User): string {
        return jwt.sign({ sub: user.id }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
    }
}