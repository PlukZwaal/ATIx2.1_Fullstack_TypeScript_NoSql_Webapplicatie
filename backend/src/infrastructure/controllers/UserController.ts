import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/UserModel';

// Controller voor favorieten functionaliteit
export class UserController {
    // Voeg module toe of verwijder uit favorieten
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

    // Haal lijst met favorieten op
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
