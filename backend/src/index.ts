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
import { CommentController } from './infrastructure/controllers/CommentController';
import { authMiddleware } from './infrastructure/middleware/auth';

const app = express();

// Validatie kritieke env vars (JWT_SECRET verplicht, rest tolerant)
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET ontbreekt (stel deze in Azure App Settings)');
}

const HAS_MONGODB_URI = Boolean(process.env.MONGODB_URI);
let dbConnected = false;

// Middleware om JSON te accepteren en CORS toe te staan
app.use(cors());
app.use(express.json());

// Verbind met MongoDB (niet fataal bij fout zodat health endpoint blijft werken)
if (HAS_MONGODB_URI) {
    mongoose
        .connect(process.env.MONGODB_URI as string)
        .then(() => {
            dbConnected = true;
            console.log('MongoDB verbonden');
        })
        .catch(err => {
            console.error('MongoDB verbindingsfout (server blijft draaien):', err.message);
        });
} else {
    console.warn('MONGODB_URI ontbreekt – database functies niet beschikbaar.'); 
}

// Middleware die DB vereist voor bepaalde routes
const requireDb: import('express').RequestHandler = (_req, res, next) => {
    if (!dbConnected) {
        return res.status(503).json({ message: 'Database niet beschikbaar', hasMongoUri: HAS_MONGODB_URI, dbConnected });
    }
    next();
};

// Maak controllers aan
const authController = new AuthController();
const moduleController = new ModuleController();
const userController = new UserController();
const commentController = new CommentController();

// Publieke routes (geen login nodig)
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', authMiddleware, (req: any, res) => res.json({ id: req.userId }));

// Module routes (login verplicht via authMiddleware)
app.post('/api/modules', authMiddleware, requireDb, moduleController.create);
app.get('/api/modules', authMiddleware, requireDb, moduleController.getAll);
app.get('/api/modules/filter-options', authMiddleware, requireDb, moduleController.getFilterOptions);
app.get('/api/modules/:id', authMiddleware, requireDb, moduleController.getById);
app.put('/api/modules/:id', authMiddleware, requireDb, moduleController.update);
app.delete('/api/modules/:id', authMiddleware, requireDb, moduleController.delete);

// Favorieten routes (login verplicht)
app.post('/api/favorites/:moduleId', authMiddleware, requireDb, userController.toggleFavorite);
app.get('/api/favorites', authMiddleware, requireDb, userController.getFavorites);

// Comment routes (login verplicht)
app.post('/api/comments', authMiddleware, requireDb, commentController.create);
app.get('/api/comments/:moduleId', authMiddleware, requireDb, commentController.getByModuleId);
app.delete('/api/comments/:id', authMiddleware, requireDb, commentController.delete);

// Health endpoint
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        port: process.env.PORT || '(not provided)',
        db: {
            hasMongoUri: HAS_MONGODB_URI,
            connected: dbConnected,
            state: mongoose.connection?.readyState,
        },
        env: { jwtSecretPresent: Boolean(process.env.JWT_SECRET) }
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
const PORT = process.env.PORT || '4000';
app.listen(PORT, () => {
    console.log(`Server gestart op poort ${PORT}`);
    console.log('Health: GET /api/health');
    if (!HAS_MONGODB_URI) console.log('LET OP: geen MONGODB_URI ingesteld.');
});
