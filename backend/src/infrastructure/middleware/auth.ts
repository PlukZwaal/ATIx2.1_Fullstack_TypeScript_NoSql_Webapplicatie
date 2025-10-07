import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request { userId?: string }

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'Authenticatie vereist' });
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { sub: string };
        req.userId = decoded.sub; // JWT gebruikt 'sub' (subject) voor user ID
        next();
    } catch (error) {
        res.status(401).json({ message: 'Ongeldige of verlopen token' });
    }
};