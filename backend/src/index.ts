// Backend server hoofdbestand: hier laden we .env settings, starten Express server en maken MongoDB verbinding
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

// Check vereiste environment variables en stel Express middleware in (CORS + JSON parsing)
if (!process.env.PORT) throw new Error('PORT ontbreekt in .env');
if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI ontbreekt in .env');
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET ontbreekt in .env');
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// MongoDB database verbinding
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB verbonden'))
    .catch(err => console.error('MongoDB fout:', err));

// Controllers instantiëren en API routes definieren voor auth en modules
const authController = new AuthController();
const moduleController = new ModuleController();

// Auth routes (publiek toegankelijk)
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.get('/api/auth/me', authMiddleware, (req: any, res) => res.json({ id: req.userId }));
app.get('/api/user/profile', authMiddleware, (_req, res) => res.json({ message: 'Toegang tot beveiligd profiel' }));

// Module routes (CRUD operaties)
app.post('/api/modules', moduleController.create);
app.get('/api/modules', moduleController.getAll);
app.get('/api/modules/filter-options', moduleController.getFilterOptions);
app.get('/api/modules/:id', moduleController.getById);
app.put('/api/modules/:id', moduleController.update);
app.delete('/api/modules/:id', moduleController.delete);

app.listen(PORT, () => console.log(`Server draait op http://localhost:${PORT}`));
