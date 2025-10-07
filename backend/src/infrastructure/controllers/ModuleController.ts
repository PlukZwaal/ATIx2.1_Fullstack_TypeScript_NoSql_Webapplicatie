import { Request, Response } from 'express';
import { ModuleService } from '../../application/services/ModuleService';

// Controller voor alle module operaties (CRUD)
export class ModuleController {
    private moduleService = new ModuleService();

    // Nieuwe module aanmaken
    create = async (req: Request, res: Response) => {
        try {
            const result = await this.moduleService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : 'Module aanmaken mislukt' });
        }
    };

    // Alle modules ophalen (met optionele filters)
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

    // Eén specifieke module ophalen op basis van ID
    getById = async (req: Request, res: Response) => {
        try {
            const module = await this.moduleService.getById(req.params.id);
            if (!module) return res.status(404).json({ message: 'Module niet gevonden' });
            res.status(200).json(module);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'Ophalen module mislukt' });
        }
    };

    // Module bijwerken
    update = async (req: Request, res: Response) => {
        try {
            const result = await this.moduleService.update(req.params.id, req.body);
            if (!result) return res.status(404).json({ message: 'Module niet gevonden' });
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : 'Module bijwerken mislukt' });
        }
    };

    // Alle beschikbare filter opties ophalen (voor dropdown menus)
    getFilterOptions = async (_req: Request, res: Response) => {
        try {
            const filterOptions = await this.moduleService.getFilterOptions();
            res.status(200).json(filterOptions);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'Ophalen filter opties mislukt' });
        }
    };

    // Module verwijderen
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
