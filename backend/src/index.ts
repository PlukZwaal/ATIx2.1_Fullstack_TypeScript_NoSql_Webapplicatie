/**
 * Entry point backend.
 * Gaat er vanuit dat benodigde environment variabelen correct aanwezig zijn.
 */
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
// Controllers & middleware
import { AuthController } from './infrastructure/controllers/AuthController';
import { authMiddleware } from './infrastructure/middleware/auth';
// Express applicatie
const app = express();
if (!process.env.PORT) throw new Error('PORT ontbreekt in .env');
if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI ontbreekt in .env');
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET ontbreekt in .env');
const PORT = process.env.PORT;

// Basis middleware (CORS + JSON body parsing)
app.use(cors());
app.use(express.json());

// Verbind direct met MongoDB (verwacht dat MONGODB_URI gezet is)
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB verbonden'))
    .catch(err => console.error('MongoDB fout:', err));

// Initialiseer controllers
const authController = new AuthController();

// Publieke authenticatie routes
app.post('/api/auth/register', authController.register); 
app.post('/api/auth/login', authController.login);      

// Voorbeeld van een beveiligde route
app.get('/api/user/profile', authMiddleware, (_req, res) => res.json({ message: 'Toegang tot beveiligd profiel' }));

// Huidige gebruiker opvragen (alleen ID uit token)
app.get('/api/auth/me', authMiddleware, (req: any, res) => res.json({ id: req.userId }));

// Start HTTP server
app.listen(PORT, () => console.log(`Server draait op http://localhost:${PORT}`));
