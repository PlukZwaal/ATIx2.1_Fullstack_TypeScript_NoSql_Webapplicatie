import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { AuthController } from './infrastructure/controllers/AuthController';

// Laad environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware voor CORS en JSON parsing
app.use(cors());
app.use(express.json());

// MongoDB verbinding
mongoose.connect(process.env.DB_CONNECTION || '' )
    .then(() => console.log('Verbonden met MongoDB'))
    .catch((error) => console.error('MongoDB verbindingsfout:', error));

// Initialiseer controller
const authController = new AuthController();

// Auth routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

// Beveiligde routes met JWT authenticatie
import { authMiddleware } from './infrastructure/middleware/auth';
// Voorbeeld van een beveiligde route:
app.get('/api/user/profile', authMiddleware, (req, res) => {
    res.json({ message: 'Toegang tot beveiligd profiel' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server draait op http://localhost:${PORT}`);
});
