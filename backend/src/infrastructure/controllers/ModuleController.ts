import { Request, Response } from 'express';
import { ModuleService } from '../../application/services/ModuleService';

/**
 * Controller voor module CRUD operaties
 * Beheert HTTP requests voor het beheren van modules
 */
export class ModuleController {
    private moduleService = new ModuleService();

    /**
     * Maakt een nieuwe module aan
     * POST /api/modules
     * @param {Request} req - Express request object met module data in body
     * @param {Response} res - Express response object
     * @returns {Promise<void>} JSON response met aangemaakte module of error
     */
    create = async (req: Request, res: Response) => {
        try {
            const result = await this.moduleService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : 'Module aanmaken mislukt' });
        }
    };

    /**
     * Haalt alle modules op
     * GET /api/modules
     * @param {Request} req - Express request object
     * @param {Response} res - Express response object
     * @returns {Promise<void>} JSON response met array van modules of error
     */
    getAll = async (req: Request, res: Response) => {
        try {
            const modules = await this.moduleService.getAll();
            res.status(200).json(modules);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'Ophalen modules mislukt' });
        }
    };

    /**
     * Haalt een specifieke module op basis van ID
     * GET /api/modules/:id
     * @param {Request} req - Express request object met module ID in params
     * @param {Response} res - Express response object
     * @returns {Promise<void>} JSON response met module data of 404 als niet gevonden
     */
    getById = async (req: Request, res: Response) => {
        try {
            const module = await this.moduleService.getById(req.params.id);
            if (!module) return res.status(404).json({ message: 'Module niet gevonden' });
            res.status(200).json(module);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'Ophalen module mislukt' });
        }
    };

    /**
     * Werkt een bestaande module bij
     * PUT /api/modules/:id
     * @param {Request} req - Express request object met module ID in params en update data in body
     * @param {Response} res - Express response object
     * @returns {Promise<void>} JSON response met bijgewerkte module of 404 als niet gevonden
     */
    update = async (req: Request, res: Response) => {
        try {
            const result = await this.moduleService.update(req.params.id, req.body);
            if (!result) return res.status(404).json({ message: 'Module niet gevonden' });
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : 'Module bijwerken mislukt' });
        }
    };

    /**
     * Verwijdert een module op basis van ID
     * DELETE /api/modules/:id
     * @param {Request} req - Express request object met module ID in params
     * @param {Response} res - Express response object
     * @returns {Promise<void>} JSON response met succes bericht of 404 als niet gevonden
     */
    delete = async (req: Request, res: Response) => {
        try {
            const success = await this.moduleService.delete(req.params.id);
            if (!success) return res.status(404).json({ message: 'Module niet gevonden' });
            res.status(200).json({ message: 'Module succesvol verwijderd' });
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'Module verwijderen mislukt' });
        }
    };
}
