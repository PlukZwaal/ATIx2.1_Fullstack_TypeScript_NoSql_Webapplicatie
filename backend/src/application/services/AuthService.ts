import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserLogin, AuthResponse } from '../../core/entities/User';
import { UserModel } from '../../infrastructure/models/UserModel';

export class AuthService {
    private readonly JWT_SECRET: string;

    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    }

    async register(userData: User): Promise<AuthResponse> {
        const existingUser = await UserModel.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('Email already registered');
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
        const user = await UserModel.findOne({ email: credentials.email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials');
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
        return jwt.sign(
            { id: user.id, email: user.email },
            this.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }
}