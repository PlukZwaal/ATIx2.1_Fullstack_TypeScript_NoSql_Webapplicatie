import { Request, Response } from 'express';
import { ModuleService } from '../../application/services/ModuleService';
import { Module } from '../../core/entities/Module';

export class ModuleController {
    private moduleService: ModuleService;
    constructor() { this.moduleService = new ModuleService(); }

    create = async (req: Request, res: Response) => {
        try {
            const moduleData: Module = req.body;
            
            // Basis validatie
            if (!moduleData.name || !moduleData.shortdescription || !moduleData.description || 
                !moduleData.content || !moduleData.location || !moduleData.level ||
                moduleData.studycredit === undefined || !moduleData.learningoutcomes) {
                return res.status(400).json({ 
                    message: 'Alle velden zijn verplicht: name, shortdescription, description, content, studycredit, location, level, learningoutcomes' 
                });
            }

            if (moduleData.studycredit < 0) {
                return res.status(400).json({ message: 'Studiecredits moeten 0 of hoger zijn' });
            }

            if (!Array.isArray(moduleData.learningoutcomes) || moduleData.learningoutcomes.length === 0) {
                return res.status(400).json({ message: 'Er moet minimaal één leeruitkomst worden opgegeven' });
            }

            const result = await this.moduleService.create(moduleData);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error instanceof Error ? error.message : 'Module aanmaken mislukt' });
        }
    };

    getAll = async (_req: Request, res: Response) => {
        try {
            const modules = await this.moduleService.getAll();
            res.status(200).json(modules);
        } catch (error) {
            res.status(500).json({ message: error instanceof Error ? error.message : 'Ophalen modules mislukt' });
        }
    };
}
