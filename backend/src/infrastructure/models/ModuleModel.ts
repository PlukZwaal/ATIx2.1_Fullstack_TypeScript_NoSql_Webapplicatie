import mongoose from 'mongoose';
import { Module } from '../../core/entities/Module';

/**
 * Mongoose schema voor modules
 * Definieert de database structuur voor Module entiteiten
 */
const moduleSchema = new mongoose.Schema<Module>({
    /**
     * Naam van de module
     */
    name: {
        type: String,
        required: true,
    },
    /**
     * Korte beschrijving van de module
     */
    shortdescription: {
        type: String,
        required: true,
    },
    /**
     * Uitgebreide beschrijving van de module
     */
    description: {
        type: String,
        required: true,
    },
    /**
     * Inhoudelijke informatie van de module
     */
    content: {
        type: String,
        required: true,
    },
    /**
     * Aantal studiepunten (ECTS)
     */
    studycredit: {
        type: Number,
        required: true,
        min: 0,
    },
    /**
     * Locatie waar de module wordt aangeboden
     */
    location: {
        type: String,
        required: true,
    },
    /**
     * Niveau van de module (bijv. bachelor, master)
     */
    level: {
        type: String,
        required: true,
    },
    /**
     * Leeruitkomsten van de module
     */
    learningoutcomes: {
        type: String,
        required: true,
        validate: {
            validator: function(v: string): boolean {
                return !!(v && v.trim().length > 0);
            },
            message: 'Leeruitkomsten zijn verplicht'
        }
    }
});

/**
 * Mongoose model voor Module entiteiten
 * Biedt database operaties voor modules
 */
export const ModuleModel = mongoose.model<Module>('Module', moduleSchema);
