import { Module } from '../../core/entities/Module';
import { ModuleModel } from '../../infrastructure/models/ModuleModel';

export class ModuleService {
    async create(moduleData: Module): Promise<Module> {
        const module = await ModuleModel.create(moduleData);
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
        const module = await ModuleModel.findByIdAndUpdate(id, moduleData, { new: true });
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

    async getFiltered(filters: {locations?: string[], studyCredits?: number[], levels?: string[]}): Promise<Module[]> {
        const query: any = {};

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
