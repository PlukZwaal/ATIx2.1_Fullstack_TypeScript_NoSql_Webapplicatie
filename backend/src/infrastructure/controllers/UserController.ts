import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/UserModel';

/**
 * Controller voor gebruikersgerelateerde operaties
 * Beheert HTTP requests voor favorieten functionaliteit
 */
export class UserController {
    /**
     * Voegt een module toe aan of verwijdert deze uit favorieten
     * POST /api/users/favorites/:moduleId
     * @param {AuthRequest} req - Express request object met geauthenticeerde user ID en module ID in params
     * @param {Response} res - Express response object
     * @returns {Promise<void>} JSON response met favoriet status en lijst of error
     */
    toggleFavorite = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;
            const { moduleId } = req.params;

            // Check of gebruiker is ingelogd
            if (!userId) {
                return res.status(401).json({ message: 'Niet geauthenticeerd' });
            }

            // Zoek gebruiker in database
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Gebruiker niet gevonden' });
            }

            // Zorg dat favorites array bestaat
            if (!user.favorites) {
                user.favorites = [];
            }

            // Check of module al favoriet is
            const favoriteIndex = user.favorites.indexOf(moduleId);
            let isFavorite: boolean;

            if (favoriteIndex > -1) {
                // Module is favoriet, verwijder uit lijst
                user.favorites.splice(favoriteIndex, 1);
                isFavorite = false;
            } else {
                // Module is geen favoriet, voeg toe aan lijst
                user.favorites.push(moduleId);
                isFavorite = true;
            }

            // Sla wijzigingen op in database
            await user.save();

            res.status(200).json({
                isFavorite,
                favorites: user.favorites,
            });
        } catch (error) {
            res.status(400).json({
                message: error instanceof Error ? error.message : 'Fout bij bijwerken favoriet'
            });
        }
    };

    /**
     * Haalt de lijst met favoriete modules van de ingelogde gebruiker op
     * GET /api/users/favorites
     * @param {AuthRequest} req - Express request object met geauthenticeerde user ID
     * @param {Response} res - Express response object
     * @returns {Promise<void>} JSON response met array van favoriete module IDs of error
     */
    getFavorites = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            // Check of gebruiker is ingelogd
            if (!userId) {
                return res.status(401).json({ message: 'Niet geauthenticeerd' });
            }

            // Zoek gebruiker in database
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Gebruiker niet gevonden' });
            }

            res.status(200).json({
                favorites: user.favorites || [],
            });
        } catch (error) {
            res.status(400).json({
                message: error instanceof Error ? error.message : 'Fout bij ophalen favorieten'
            });
        }
    };
}
