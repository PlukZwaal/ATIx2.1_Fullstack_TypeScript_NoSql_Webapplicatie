import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { UserModel } from '../models/UserModel';

export class UserController {
    // Toggle favorite: voeg toe of verwijder module uit favorieten
    toggleFavorite = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;
            const { moduleId } = req.params;

            if (!userId) {
                return res.status(401).json({ message: 'Niet geauthenticeerd' });
            }

            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Gebruiker niet gevonden' });
            }

            // Initialiseer favorites als deze niet bestaat
            if (!user.favorites) {
                user.favorites = [];
            }

            const favoriteIndex = user.favorites.indexOf(moduleId);
            let isFavorite: boolean;

            if (favoriteIndex > -1) {
                // Module staat in favorites, verwijder
                user.favorites.splice(favoriteIndex, 1);
                isFavorite = false;
            } else {
                // Module staat niet in favorites, voeg toe
                user.favorites.push(moduleId);
                isFavorite = true;
            }

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

    // Haal alle favorieten op van de ingelogde gebruiker
    getFavorites = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.userId;

            if (!userId) {
                return res.status(401).json({ message: 'Niet geauthenticeerd' });
            }

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
