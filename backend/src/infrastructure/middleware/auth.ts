import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Interface voor request met gebruikers ID
export interface AuthRequest extends Request {
    userId?: string;
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be defined in environment variables');
}

// Middleware voor JWT authenticatie
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Haal token uit Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authenticatie vereist' });
        }

        // Verifieer token en voeg gebruikers ID toe aan request
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Ongeldige token' });
    }
};