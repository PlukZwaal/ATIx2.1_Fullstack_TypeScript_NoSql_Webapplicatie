import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Uitbreiding van Request interface om userId en userName toe te voegen
export interface AuthRequest extends Request { userId?: string; userName?: string }

// Middleware die controleert of gebruiker is ingelogd
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