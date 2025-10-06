// ModuleController krijgt HTTP requests voor modules en geeft ze door aan ModuleService
import { Request, Response } from 'express';
import { ModuleService } from '../../application/services/ModuleService';
import { Module } from '../../core/entities/Module';

export class ModuleController {
    private moduleService: ModuleService;
    
    constructor() { 
        this.moduleService = new ModuleService(); 
    }

    // Module maken: laat service alle validatie en aanmaak doen
    create = async (req: Request, res: Response) => {
        try {
            const result = await this.moduleService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : 'Module aanmaken mislukt' });
        }
    };

    // Alle modules ophalen: check of er filters zijn (locatie, credits, niveau, zoekterm), parse ze en geef door aan service
    getAll = async (req: Request, res: Response) => {
        try {
            const { locations, studyCredits, levels, search } = req.query;
            
            if (locations || studyCredits || levels || search) {
                const filters: {locations?: string[], studyCredits?: number[], levels?: string[], search?: string} = {};
                
                if (search) {
                    filters.search = search as string;
                }
                if (locations) {
                    filters.locations = Array.isArray(locations) ? locations as string[] : [locations as string];
                }
                if (studyCredits) {
                    const credits = Array.isArray(studyCredits) ? studyCredits : [studyCredits];
                    filters.studyCredits = credits.map(c => parseInt(c as string)).filter(c => !isNaN(c));
                }
                if (levels) {
                    filters.levels = Array.isArray(levels) ? levels as string[] : [levels as string];
                }
                
                const modules = await this.moduleService.getFiltered(filters);
                res.status(200).json(modules);
            } else {
                const modules = await this.moduleService.getAll();
                res.status(200).json(modules);
            }
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'Ophalen modules mislukt' });
        }
    };

    // Specifieke module ophalen: pak ID uit URL, haal op via service, check of bestaat en stuur terug
    getById = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const module = await this.moduleService.getById(id);
            
            if (!module) {
                return res.status(404).json({ message: 'Module niet gevonden' });
            }
            
            res.status(200).json(module);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'Ophalen module mislukt' });
        }
    };

    // Module bijwerken: laat service alle validatie en update doen
    update = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const result = await this.moduleService.update(id, req.body);
            
            if (!result) {
                return res.status(404).json({ message: 'Module niet gevonden' });
            }
            
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : 'Module bijwerken mislukt' });
        }
    };

    // Functie om alle filter opties op te halen voor de sidebar
    // Filter opties ophalen: unieke locaties, credits en niveaus voor dropdown filters
    getFilterOptions = async (_req: Request, res: Response) => {
        try {
            const filterOptions = await this.moduleService.getFilterOptions();
            res.status(200).json(filterOptions);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'Ophalen filter opties mislukt' });
        }
    };

    // Module verwijderen: pak ID, probeer te verwijderen via service, bevestig succes
    delete = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const success = await this.moduleService.delete(id);
            
            if (!success) {
                return res.status(404).json({ message: 'Module niet gevonden' });
            }
            
            res.status(200).json({ message: 'Module succesvol verwijderd' });
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'Module verwijderen mislukt' });
        }
    };
}
