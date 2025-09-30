import { Request, Response } from 'express';
import { AuthService } from '../../application/services/AuthService';
import { User, UserLogin } from '../../core/entities/User';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    register = async (req: Request, res: Response) => {
        try {
            const userData: User = req.body;
            const result = await this.authService.register(userData);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : 'Registration failed' });
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const credentials: UserLogin = req.body;
            const result = await this.authService.login(credentials);
            res.status(200).json(result);
        } catch (error) {
            res.status(401).json({ message: error instanceof Error ? error.message : 'Login failed' });
        }
    };
}