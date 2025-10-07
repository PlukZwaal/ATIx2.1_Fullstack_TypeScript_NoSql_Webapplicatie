import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { AuthController } from './infrastructure/controllers/AuthController';
import { ModuleController } from './infrastructure/controllers/ModuleController';
import { authMiddleware } from './infrastructure/middleware/auth';

const app = express();

if (!process.env.PORT) throw new Error('PORT ontbreekt in .env');
if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI ontbreekt in .env');
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET ontbreekt in .env');

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB verbonden'))
    .catch(err => console.error('MongoDB fout:', err));

const authController = new AuthController();
const moduleController = new ModuleController();

app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', authMiddleware, (req: any, res) => res.json({ id: req.userId }));
app.get('/api/user/profile', authMiddleware, (_req, res) => res.json({ message: 'Toegang tot beveiligd profiel' }));

// Beveiligde module routes - alleen toegankelijk met geldige token
app.post('/api/modules', authMiddleware, moduleController.create);
app.get('/api/modules', authMiddleware, moduleController.getAll);
app.get('/api/modules/filter-options', authMiddleware, moduleController.getFilterOptions);
app.get('/api/modules/:id', authMiddleware, moduleController.getById);
app.put('/api/modules/:id', authMiddleware, moduleController.update);
app.delete('/api/modules/:id', authMiddleware, moduleController.delete);

app.listen(process.env.PORT, () => console.log(`Server draait op http://localhost:${process.env.PORT}`));
