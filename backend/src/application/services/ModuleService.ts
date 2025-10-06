import { Module } from '../../core/entities/Module';
import { ModuleModel } from '../../infrastructure/models/ModuleModel';

export class ModuleService {
    async create(moduleData: Module): Promise<Module> {
        // Simpele validatie
        if (!moduleData.name?.trim()) {
            throw new Error('Module naam is verplicht');
        }
        if (!moduleData.shortdescription?.trim()) {
            throw new Error('Korte beschrijving is verplicht');
        }
        if (!moduleData.description?.trim()) {
            throw new Error('Beschrijving is verplicht');
        }
        if (!moduleData.content?.trim()) {
            throw new Error('Inhoud is verplicht');
        }
        if (!moduleData.location?.trim()) {
            throw new Error('Locatie is verplicht');
        }
        if (!moduleData.level?.trim()) {
            throw new Error('Niveau is verplicht');
        }
        if (moduleData.studycredit < 0) {
            throw new Error('Studiecredits kunnen niet negatief zijn');
        }
        if (!moduleData.learningoutcomes?.trim()) {
            throw new Error('Leeruitkomsten zijn verplicht');
        }

        const module = await ModuleModel.create({
            name: moduleData.name.trim(),
            shortdescription: moduleData.shortdescription.trim(),
            description: moduleData.description.trim(),
            content: moduleData.content.trim(),
            studycredit: moduleData.studycredit,
            location: moduleData.location.trim(),
            level: moduleData.level.trim(),
            learningoutcomes: moduleData.learningoutcomes.trim()
        });
        
        return {
            id: module._id.toString(),
            name: module.name,
            shortdescription: module.shortdescription,
            description: module.description,
            content: module.content,
            studycredit: module.studycredit,
            location: module.location,
            level: module.level,
            learningoutcomes: module.learningoutcomes
        };
    }

    async getAll(): Promise<Module[]> {
        const modules = await ModuleModel.find();
        return modules.map(module => ({
            id: module._id.toString(),
            name: module.name,
            shortdescription: module.shortdescription,
            description: module.description,
            content: module.content,
            studycredit: module.studycredit,
            location: module.location,
            level: module.level,
            learningoutcomes: module.learningoutcomes
        }));
    }

    async getById(id: string): Promise<Module | null> {
        const module = await ModuleModel.findById(id);
        if (!module) return null;
        
        return {
            id: module._id.toString(),
            name: module.name,
            shortdescription: module.shortdescription,
            description: module.description,
            content: module.content,
            studycredit: module.studycredit,
            location: module.location,
            level: module.level,
            learningoutcomes: module.learningoutcomes
        };
    }

    async update(id: string, moduleData: Partial<Module>): Promise<Module | null> {
        // Validatie voor update velden
        if (moduleData.studycredit !== undefined && moduleData.studycredit < 0) {
            throw new Error('Studiecredits kunnen niet negatief zijn');
        }
        if (moduleData.name !== undefined && !moduleData.name.trim()) {
            throw new Error('Module naam kan niet leeg zijn');
        }
        if (moduleData.shortdescription !== undefined && !moduleData.shortdescription.trim()) {
            throw new Error('Korte beschrijving kan niet leeg zijn');
        }
        if (moduleData.description !== undefined && !moduleData.description.trim()) {
            throw new Error('Beschrijving kan niet leeg zijn');
        }
        if (moduleData.content !== undefined && !moduleData.content.trim()) {
            throw new Error('Inhoud kan niet leeg zijn');
        }
        if (moduleData.location !== undefined && !moduleData.location.trim()) {
            throw new Error('Locatie kan niet leeg zijn');
        }
        if (moduleData.level !== undefined && !moduleData.level.trim()) {
            throw new Error('Niveau kan niet leeg zijn');
        }
        if (moduleData.learningoutcomes !== undefined && !moduleData.learningoutcomes.trim()) {
            throw new Error('Leeruitkomsten kunnen niet leeg zijn');
        }

        // Normaliseer strings
        const cleanData: any = {};
        Object.keys(moduleData).forEach(key => {
            const value = (moduleData as any)[key];
            if (typeof value === 'string') {
                cleanData[key] = value.trim();
            } else {
                cleanData[key] = value;
            }
        });

        const module = await ModuleModel.findByIdAndUpdate(id, cleanData, { new: true });
        if (!module) return null;
        
        return {
            id: module._id.toString(),
            name: module.name,
            shortdescription: module.shortdescription,
            description: module.description,
            content: module.content,
            studycredit: module.studycredit,
            location: module.location,
            level: module.level,
            learningoutcomes: module.learningoutcomes
        };
    }

    async delete(id: string): Promise<boolean> {
        const result = await ModuleModel.findByIdAndDelete(id);
        return result !== null;
    }

    async getFilterOptions(): Promise<{locations: {value: string, count: number}[], studyCredits: {value: number, count: number}[], levels: {value: string, count: number}[]}> {
        // Aggregatie voor locaties met aantallen
        const locationCounts = await ModuleModel.aggregate([
            { $group: { _id: '$location', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        // Aggregatie voor studiepunten met aantallen
        const studyCreditCounts = await ModuleModel.aggregate([
            { $group: { _id: '$studycredit', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        // Aggregatie voor levels met aantallen
        const levelCounts = await ModuleModel.aggregate([
            { $group: { _id: '$level', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        return {
            locations: locationCounts.map(item => ({ value: item._id, count: item.count })),
            studyCredits: studyCreditCounts.map(item => ({ value: item._id, count: item.count })),
            levels: levelCounts.map(item => ({ value: item._id, count: item.count }))
        };
    }

    async getFiltered(filters: {locations?: string[], studyCredits?: number[], levels?: string[], search?: string}): Promise<Module[]> {
        const query: any = {};

        // Filter op zoekterm (naam)
        if (filters.search && filters.search.trim()) {
            query.name = { $regex: filters.search.trim(), $options: 'i' };
        }

        // Filter op locaties
        if (filters.locations && filters.locations.length > 0) {
            query.location = { $in: filters.locations };
        }

        // Filter op studiepunten
        if (filters.studyCredits && filters.studyCredits.length > 0) {
            query.studycredit = { $in: filters.studyCredits };
        }

        // Filter op levels
        if (filters.levels && filters.levels.length > 0) {
            query.level = { $in: filters.levels };
        }

        const modules = await ModuleModel.find(query);
        return modules.map(module => ({
            id: module._id.toString(),
            name: module.name,
            shortdescription: module.shortdescription,
            description: module.description,
            content: module.content,
            studycredit: module.studycredit,
            location: module.location,
            level: module.level,
            learningoutcomes: module.learningoutcomes
        }));
    }
}
