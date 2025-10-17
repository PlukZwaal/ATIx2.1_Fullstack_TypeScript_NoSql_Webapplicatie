import { Module } from '../../core/entities/Module';
import { ModuleModel } from '../../infrastructure/models/ModuleModel';

/**
 * Service voor module operaties
 * Beheert CRUD operaties voor modules
 */
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

    /**
     * Valideert module data (privé methode)
     * Controleert of alle verplichte velden zijn ingevuld
     * @private
     * @param {Partial<Module>} data - Module data om te valideren
     * @param {boolean} isUpdate - Of dit een update operatie is
     * @throws {Error} Als validatie faalt
     */
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

    /**
     * Converteert database document naar Module object (privé methode)
     * @private
     * @param {any} doc - MongoDB document
     * @returns {Module} Module object
     */
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

    /**
     * Verwijdert extra spaties uit alle string velden (privé methode)
     * @private
     * @param {any} data - Data object om schoon te maken
     * @returns {any} Geschoonde data
     */
    private cleanStringFields(data: any): any {
        const cleanData: any = {};
        Object.keys(data).forEach(key => {
            const value = data[key];
            cleanData[key] = typeof value === 'string' ? value.trim() : value;
        });
        return cleanData;
    }

    /**
     * Creëert een nieuwe module
     * @param {Module} moduleData - Module data voor creatie
     * @returns {Promise<Module>} Aangemaakte module
     * @throws {Error} Als validatie faalt
     */
    async create(moduleData: Module): Promise<Module> {
        this.validateModule(moduleData);
        const cleanData = this.cleanStringFields(moduleData);
        const module = await ModuleModel.create(cleanData);
        return this.mapToModule(module);
    }

    /**
     * Haalt alle modules op
     * @returns {Promise<Module[]>} Array van alle modules
     */
    async getAll(): Promise<Module[]> {
        const modules = await ModuleModel.find();
        return modules.map(module => this.mapToModule(module));
    }

    /**
     * Haalt één module op op basis van ID
     * @param {string} id - Module ID
     * @returns {Promise<Module | null>} Module object of null als niet gevonden
     */
    async getById(id: string): Promise<Module | null> {
        const module = await ModuleModel.findById(id);
        return module ? this.mapToModule(module) : null;
    }

    /**
     * Update een bestaande module
     * @param {string} id - Module ID
     * @param {Partial<Module>} moduleData - Data om bij te werken
     * @returns {Promise<Module | null>} Bijgewerkte module of null als niet gevonden
     * @throws {Error} Als validatie faalt
     */
    async update(id: string, moduleData: Partial<Module>): Promise<Module | null> {
        this.validateModule(moduleData, true);
        const cleanData = this.cleanStringFields(moduleData);
        const module = await ModuleModel.findByIdAndUpdate(id, cleanData, { new: true });
        return module ? this.mapToModule(module) : null;
    }

    /**
     * Verwijdert een module
     * @param {string} id - Module ID om te verwijderen
     * @returns {Promise<boolean>} True als verwijderd, false als niet gevonden
     */
    async delete(id: string): Promise<boolean> {
        const result = await ModuleModel.findByIdAndDelete(id);
        return Boolean(result);
    }
}
