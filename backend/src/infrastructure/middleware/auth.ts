import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Uitbreiding van Express Request interface om authenticatie data toe te voegen
 */
export interface AuthRequest extends Request {
    /** ID van de geauthenticeerde gebruiker */
    userId?: string;
    /** Naam van de geauthenticeerde gebruiker */
    userName?: string;
}

/**
 * Middleware die controleert of gebruiker is ingelogd via JWT token
 * Controleert Authorization header voor Bearer token en decodeert deze
 * @param {AuthRequest} req - Express request object met potentieel userId en userName
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function om door te gaan naar volgende middleware/controller
 * @returns {void} Roept next() aan bij succes, stuurt 401 response bij falen
 */
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Haal token op uit Authorization header (format: "Bearer TOKEN")
        const token = req.headers.authorization?.split(' ')[1];

        // Als er geen token is, stuur foutmelding
        if (!token) return res.status(401).json({ message: 'Authenticatie vereist' });

        // Controleer of token geldig is en decode het
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { sub: string; name: string };

        // Zet userId en userName in request object zodat controllers deze kunnen gebruiken
        req.userId = decoded.sub;
        req.userName = decoded.name;

        // Ga door naar volgende functie (controller)
        next();
    } catch (error) {
        // Token is ongeldig of verlopen
        res.status(401).json({ message: 'Ongeldige of verlopen token' });
    }
};