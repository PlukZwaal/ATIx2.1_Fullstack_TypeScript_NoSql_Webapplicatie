import { Module } from '../../core/entities/Module';
import { ModuleModel } from '../../infrastructure/models/ModuleModel';

export class ModuleService {
    private validateModule(data: Partial<Module>, isUpdate = false): void {
        const fields = [
            { key: 'name', name: 'Module naam' },
            { key: 'shortdescription', name: 'Korte beschrijving' },
            { key: 'description', name: 'Beschrijving' },
            { key: 'content', name: 'Inhoud' },
            { key: 'location', name: 'Locatie' },
            { key: 'level', name: 'Niveau' },
            { key: 'learningoutcomes', name: 'Leeruitkomsten' }
        ];

        for (const field of fields) {
            const value = (data as any)[field.key];
            if ((!isUpdate && !value?.trim()) || (isUpdate && value !== undefined && !value.trim())) {
                throw new Error(`${field.name} ${isUpdate ? 'kan niet leeg zijn' : 'is verplicht'}`);
            }
        }

        if (data.studycredit !== undefined && data.studycredit < 0) {
            throw new Error('Studiecredits kunnen niet negatief zijn');
        }
    }

    private mapToModule(doc: any): Module {
        return {
            id: doc._id.toString(),
            name: doc.name,
            shortdescription: doc.shortdescription,
            description: doc.description,
            content: doc.content,
            studycredit: doc.studycredit,
            location: doc.location,
            level: doc.level,
            learningoutcomes: doc.learningoutcomes
        };
    }

    async create(moduleData: Module): Promise<Module> {
        this.validateModule(moduleData);
        
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
        
        return this.mapToModule(module);
    }

    async getAll(): Promise<Module[]> {
        const modules = await ModuleModel.find();
        return modules.map(module => this.mapToModule(module));
    }

    async getById(id: string): Promise<Module | null> {
        const module = await ModuleModel.findById(id);
        return module ? this.mapToModule(module) : null;
    }

    async update(id: string, moduleData: Partial<Module>): Promise<Module | null> {
        this.validateModule(moduleData, true);

        // Normaliseer strings
        const cleanData: any = {};
        Object.keys(moduleData).forEach(key => {
            const value = (moduleData as any)[key];
            cleanData[key] = typeof value === 'string' ? value.trim() : value;
        });

        const module = await ModuleModel.findByIdAndUpdate(id, cleanData, { new: true });
        return module ? this.mapToModule(module) : null;
    }

    async delete(id: string): Promise<boolean> {
        return Boolean(await ModuleModel.findByIdAndDelete(id));
    }

    async getFilterOptions() {
        const aggregateField = (field: string) => ModuleModel.aggregate([
            { $group: { _id: `$${field}`, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const [locationCounts, studyCreditCounts, levelCounts] = await Promise.all([
            aggregateField('location'),
            aggregateField('studycredit'),
            aggregateField('level')
        ]);

        return {
            locations: locationCounts.map(item => ({ value: item._id, count: item.count })),
            studyCredits: studyCreditCounts.map(item => ({ value: item._id, count: item.count })),
            levels: levelCounts.map(item => ({ value: item._id, count: item.count }))
        };
    }

    async getFiltered(filters: {locations?: string[], studyCredits?: number[], levels?: string[], search?: string}): Promise<Module[]> {
        const query: any = {};

        if (filters.search?.trim()) {
            query.name = { $regex: filters.search.trim(), $options: 'i' };
        }
        if (filters.locations?.length) query.location = { $in: filters.locations };
        if (filters.studyCredits?.length) query.studycredit = { $in: filters.studyCredits };
        if (filters.levels?.length) query.level = { $in: filters.levels };

        const modules = await ModuleModel.find(query);
        return modules.map(module => this.mapToModule(module));
    }
}
