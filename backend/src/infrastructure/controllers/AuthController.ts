import { Request, Response } from 'express';
import { AuthService } from '../../application/services/AuthService';

/**
 * Controller voor authenticatie endpoints
 * Beheert HTTP requests voor registratie en login
 */
export class AuthController {
    private authService = new AuthService();

    /**
     * Registreert een nieuwe gebruiker
     * POST /api/auth/register
     * @param {Request} req - Express request object met user data in body
     * @param {Response} res - Express response object
     * @returns {Promise<void>} JSON response met token en user info of error
     */
    register = async (req: Request, res: Response) => {
        try {
            const result = await this.authService.register(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : 'Registratie mislukt' });
        }
    };

    /**
     * Logt een gebruiker in
     * POST /api/auth/login
     * @param {Request} req - Express request object met login credentials in body
     * @param {Response} res - Express response object
     * @returns {Promise<void>} JSON response met token en user info of error
     */
    login = async (req: Request, res: Response) => {
        try {
            const result = await this.authService.login(req.body);
            res.status(200).json(result);
        } catch (error) {
            res.status(401).json({ message: error instanceof Error ? error.message : 'Login mislukt' });
        }
    };
}