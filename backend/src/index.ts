// Laad environment variabelen uit .env bestand
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import packages
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { AuthController } from './infrastructure/controllers/AuthController';
import { ModuleController } from './infrastructure/controllers/ModuleController';
import { UserController } from './infrastructure/controllers/UserController';
import { authMiddleware } from './infrastructure/middleware/auth';

const app = express();

// Validatie verplichte environment variabelen (PORT is optioneel: Azure levert die zelf aan)
const missing: string[] = [];
if (!process.env.MONGODB_URI) missing.push('MONGODB_URI');
if (!process.env.JWT_SECRET) missing.push('JWT_SECRET');

let dbConnected = false;

if (missing.length) {
    console.error('Ontbrekende environment variabelen (server start in degraded mode):', missing.join(', '));
} else {
    // Verbind met MongoDB database alleen als alles aanwezig is
    mongoose
        .connect(process.env.MONGODB_URI!)
        .then(() => {
            dbConnected = true;
            console.log('MongoDB verbonden');
        })
        .catch(err => {
            console.error('MongoDB verbindingsfout (server blijft draaien):', err);
        });
}

// Middleware om JSON te accepteren en CORS toe te staan
app.use(cors());
app.use(express.json());

// (Database connect verplaatst naar boven zodat we niet hard stoppen bij fouten)

// Maak controllers aan
const authController = new AuthController();
const moduleController = new ModuleController();
const userController = new UserController();

// Publieke routes (geen login nodig)
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', authMiddleware, (req: any, res) => res.json({ id: req.userId }));

// Module routes (login verplicht via authMiddleware)
app.post('/api/modules', authMiddleware, moduleController.create);
app.get('/api/modules', authMiddleware, moduleController.getAll);
app.get('/api/modules/filter-options', authMiddleware, moduleController.getFilterOptions);
app.get('/api/modules/:id', authMiddleware, moduleController.getById);
app.put('/api/modules/:id', authMiddleware, moduleController.update);
app.delete('/api/modules/:id', authMiddleware, moduleController.delete);

// Favorieten routes (login verplicht)
app.post('/api/favorites/:moduleId', authMiddleware, userController.toggleFavorite);
app.get('/api/favorites', authMiddleware, userController.getFavorites);

// Root & health endpoints
app.get('/', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'backend', time: new Date().toISOString() });
});
app.get('/health', (_req: Request, res: Response) => {
    const status = missing.length === 0 && dbConnected;
    res.status(status ? 200 : 503).json({
        healthy: status,
        dbConnected,
        missingEnv: missing,
        uptime: process.uptime(),
        timestamp: Date.now()
    });
});

// 404 handler - alle routes die niet bestaan
app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: 'Route niet gevonden' });
});

// Globale error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Er is iets misgegaan op de server' });
});

// Start de server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server draait op http://localhost:${PORT}`));
