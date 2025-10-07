import mongoose from 'mongoose';
import { User } from '../../core/entities/User';

// Mongoose schema voor gebruikers
const userSchema = new mongoose.Schema<User>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    favorites: {
        type: [String],
        default: [],
    }
});

export const UserModel = mongoose.model<User>('User', userSchema);