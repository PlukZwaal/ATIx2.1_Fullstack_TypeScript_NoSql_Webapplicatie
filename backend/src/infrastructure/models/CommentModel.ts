import mongoose from 'mongoose';
import { Comment } from '../../core/entities/Comment';

// Mongoose schema voor comments
const commentSchema = new mongoose.Schema<Comment>({
    moduleId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
        validate: {
            validator: function(v: string): boolean {
                return !!(v && v.trim().length > 0);
            },
            message: 'Comment description is verplicht'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

// Index voor sneller ophalen van comments per module
commentSchema.index({ moduleId: 1, createdAt: -1 });

export const CommentModel = mongoose.model<Comment>('Comment', commentSchema);