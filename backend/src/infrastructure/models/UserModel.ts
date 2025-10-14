import mongoose from 'mongoose';
import { User } from '../../core/entities/User';

/**
 * Mongoose schema voor gebruikers
 * Definieert de database structuur voor User entiteiten
 */
const userSchema = new mongoose.Schema<User>({
    /**
     * Volledige naam van de gebruiker
     */
    name: {
        type: String,
        required: true,
    },
    /**
     * Email adres van de gebruiker (uniek, lowercase)
     */
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    /**
     * Gehashte wachtwoord van de gebruiker
     */
    password: {
        type: String,
        required: true,
    },
    /**
     * Array van favoriete module IDs
     */
    favorites: {
        type: [String],
        default: [],
    }
});

/**
 * Mongoose model voor User entiteiten
 * Biedt database operaties voor gebruikers
 */
export const UserModel = mongoose.model<User>('User', userSchema);