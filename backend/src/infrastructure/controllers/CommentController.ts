import { Request, Response } from 'express';
import { CommentService } from '../../application/services/CommentService';
import { AuthRequest } from '../middleware/auth';

// Controller voor alle comment operaties
export class CommentController {
    private commentService = new CommentService();

    // Nieuwe comment aanmaken
    create = async (req: AuthRequest, res: Response) => {
        try {
            const { moduleId, description } = req.body;
            const userId = req.userId;
            const userName = req.userName;

            if (!userId || !userName) {
                return res.status(401).json({ message: 'Gebruiker niet geauthenticeerd' });
            }

            const commentData = {
                moduleId,
                userId,
                userName,
                description
            };

            const result = await this.commentService.create(commentData);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : 'Comment aanmaken mislukt' });
        }
    };

    // Alle comments voor een module ophalen
    getByModuleId = async (req: Request, res: Response) => {
        try {
            const { moduleId } = req.params;
            const comments = await this.commentService.getByModuleId(moduleId);
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'Ophalen comments mislukt' });
        }
    };
}