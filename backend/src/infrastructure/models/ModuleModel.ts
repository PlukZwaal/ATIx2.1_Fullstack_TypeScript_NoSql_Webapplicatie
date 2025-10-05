import mongoose from 'mongoose';
import { Module } from '../../core/entities/Module';

// Mongoose schema voor modules
const moduleSchema = new mongoose.Schema<Module>({
    name: {
        type: String,
        required: true,
    },
    shortdescription: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    studycredit: {
        type: Number,
        required: true,
        min: 0,
    },
    location: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    learningoutcomes: {
        type: [String],
        required: true,
        validate: {
            validator: function(v: string[]) {
                return v && v.length > 0;
            },
            message: 'Er moet minimaal één leeruitkomst zijn gedefinieerd'
        }
    }
});

export const ModuleModel = mongoose.model<Module>('Module', moduleSchema);
