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
     * Haalt alle modules op met optionele filtering
     * GET /api/modules
     * @param {Request} req - Express request object met query parameters voor filtering
     * @param {Response} res - Express response object
     * @returns {Promise<void>} JSON response met array van modules of error
     */
    getAll = async (req: Request, res: Response) => {
        try {
            const { locations, studyCredits, levels, search } = req.query;

            // Als er filters zijn meegegeven, gebruik dan gefilterde zoekfunctie
            if (locations || studyCredits || levels || search) {
                const filters: {locations?: string[], studyCredits?: number[], levels?: string[], search?: string} = {};

                // Voeg zoekopdracht toe als aanwezig
                if (search) filters.search = search as string;

                // Converteer locations naar array
                if (locations) filters.locations = Array.isArray(locations) ? locations as string[] : [locations as string];

                // Converteer studyCredits naar array van nummers
                if (studyCredits) {
                    const credits = Array.isArray(studyCredits) ? studyCredits : [studyCredits];
                    filters.studyCredits = credits.map(c => parseInt(c as string)).filter(c => !isNaN(c));
                }

                // Converteer levels naar array
                if (levels) filters.levels = Array.isArray(levels) ? levels as string[] : [levels as string];

                const modules = await this.moduleService.getFiltered(filters);
                res.status(200).json(modules);
            } else {
                // Geen filters, haal alle modules op
                const modules = await this.moduleService.getAll();
                res.status(200).json(modules);
            }
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
     * Haalt alle beschikbare filter opties op voor dropdown menus
     * GET /api/modules/filters
     * @param {Request} _req - Express request object (niet gebruikt)
     * @param {Response} res - Express response object
     * @returns {Promise<void>} JSON response met filter opties of error
     */
    getFilterOptions = async (_req: Request, res: Response) => {
        try {
            const filterOptions = await this.moduleService.getFilterOptions();
            res.status(200).json(filterOptions);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'Ophalen filter opties mislukt' });
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
