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
}
