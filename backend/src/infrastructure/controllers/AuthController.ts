import { Request, Response } from 'express';
import { AuthService } from '../../application/services/AuthService';

export class AuthController {
    private authService = new AuthService();

    register = async (req: Request, res: Response) => {
        try {
            const result = await this.authService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : 'Registratie mislukt' });
        }
    };

    login = async (req: Request, res: Response) => {
        try {
            const result = await this.authService.login(req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(401).json({ message: error instanceof Error ? error.message : 'Login mislukt' });
        }
    };
}