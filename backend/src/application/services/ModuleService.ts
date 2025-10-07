import { Module } from '../../core/entities/Module';
import { ModuleModel } from '../../infrastructure/models/ModuleModel';

// Service voor alle module operaties
export class ModuleService {
    // Velden die verplicht zijn bij het aanmaken/updaten van modules
    private readonly REQUIRED_FIELDS = [
        { key: 'name', name: 'Module naam' },
        { key: 'shortdescription', name: 'Korte beschrijving' },
        { key: 'description', name: 'Beschrijving' },
        { key: 'content', name: 'Inhoud' },
        { key: 'location', name: 'Locatie' },
        { key: 'level', name: 'Niveau' },
        { key: 'learningoutcomes', name: 'Leeruitkomsten' }
    ] as const;

    // Controleer of alle verplichte velden zijn ingevuld
    private validateModule(data: Partial<Module>, isUpdate = false): void {
        // Valideer string velden
        for (const field of this.REQUIRED_FIELDS) {
            const value = (data as any)[field.key];
            if ((!isUpdate && !value?.trim()) || (isUpdate && value !== undefined && !value.trim())) {
                throw new Error(`${field.name} ${isUpdate ? 'kan niet leeg zijn' : 'is verplicht'}`);
            }
        }

        // Valideer studiecredits
        if (data.studycredit !== undefined && data.studycredit < 1) {
            throw new Error('Studiecredits moeten minimaal 1 zijn');
        }
    }

    // Converteer database document naar Module object
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

    // Verwijder extra spaties uit alle string velden
    private cleanStringFields(data: any): any {
        const cleanData: any = {};
        Object.keys(data).forEach(key => {
            const value = data[key];
            cleanData[key] = typeof value === 'string' ? value.trim() : value;
        });
        return cleanData;
    }

    // Maak nieuwe module aan
    async create(moduleData: Module): Promise<Module> {
        this.validateModule(moduleData);
        const cleanData = this.cleanStringFields(moduleData);
        const module = await ModuleModel.create(cleanData);
        return this.mapToModule(module);
    }

    // Haal alle modules op
    async getAll(): Promise<Module[]> {
        const modules = await ModuleModel.find();
        return modules.map(module => this.mapToModule(module));
    }

    // Haal één module op op basis van ID
    async getById(id: string): Promise<Module | null> {
        const module = await ModuleModel.findById(id);
        return module ? this.mapToModule(module) : null;
    }

    // Update bestaande module
    async update(id: string, moduleData: Partial<Module>): Promise<Module | null> {
        this.validateModule(moduleData, true);
        const cleanData = this.cleanStringFields(moduleData);
        const module = await ModuleModel.findByIdAndUpdate(id, cleanData, { new: true });
        return module ? this.mapToModule(module) : null;
    }

    // Verwijder module
    async delete(id: string): Promise<boolean> {
        const result = await ModuleModel.findByIdAndDelete(id);
        return Boolean(result);
    }

    // Haal alle unieke filter opties op (voor dropdown menus)
    async getFilterOptions() {
        // Functie om te tellen hoeveel modules er zijn per waarde
        const aggregateField = (field: string) => ModuleModel.aggregate([
            { $group: { _id: `$${field}`, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        // Haal alle unieke waarden op voor locatie, studiecredits en niveau
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

    // Haal modules op met filters
    async getFiltered(filters: {locations?: string[], studyCredits?: number[], levels?: string[], search?: string}): Promise<Module[]> {
        const query: any = {};

        // Zoek op naam als search is ingevuld
        if (filters.search?.trim()) {
            query.name = { $regex: filters.search.trim(), $options: 'i' };
        }
        
        // Filter op locaties
        if (filters.locations?.length) query.location = { $in: filters.locations };
        
        // Filter op studiecredits
        if (filters.studyCredits?.length) query.studycredit = { $in: filters.studyCredits };
        
        // Filter op niveau
        if (filters.levels?.length) query.level = { $in: filters.levels };

        const modules = await ModuleModel.find(query);
        return modules.map(module => this.mapToModule(module));
    }
}
