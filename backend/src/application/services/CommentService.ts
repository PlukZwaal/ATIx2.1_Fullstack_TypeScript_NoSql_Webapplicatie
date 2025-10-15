import { Comment, CreateCommentData } from '../../core/entities/Comment';
import { CommentModel } from '../../infrastructure/models/CommentModel';

/**
 * Service voor comment operaties
 * Beheert CRUD operaties voor comments op modules
 */
export class CommentService {
    /**
     * Valideert comment data (privé methode)
     * Controleert of alle verplichte velden zijn ingevuld
     * @private
     * @param {CreateCommentData} data - Comment data om te valideren
     * @throws {Error} Als validatie faalt
     */
    private validateComment(data: CreateCommentData): void {
        if (!data.moduleId?.trim()) {
            throw new Error('Module ID is verplicht');
        }
        if (!data.userId?.trim()) {
            throw new Error('User ID is verplicht');
        }
        if (!data.userName?.trim()) {
            throw new Error('User name is verplicht');
        }
        if (!data.description?.trim()) {
            throw new Error('Comment description is verplicht');
        }
    }

    /**
     * Converteert database document naar Comment object (privé methode)
     * @private
     * @param {any} doc - MongoDB document
     * @returns {Comment} Comment object
     */
    private mapToComment(doc: any): Comment {
        return {
            id: doc._id.toString(),
            moduleId: doc.moduleId,
            userId: doc.userId,
            userName: doc.userName,
            description: doc.description,
            createdAt: doc.createdAt
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
     * Creëert een nieuwe comment
     * @param {CreateCommentData} commentData - Comment data voor creatie
     * @returns {Promise<Comment>} Aangemaakte comment
     * @throws {Error} Als validatie faalt
     */
    async create(commentData: CreateCommentData): Promise<Comment> {
        this.validateComment(commentData);
        const cleanData = this.cleanStringFields(commentData);
        const comment = await CommentModel.create(cleanData);
        return this.mapToComment(comment);
    }

    /**
     * Haalt alle comments voor een specifieke module op
     * Comments worden gesorteerd op creatiedatum (nieuwste eerst)
     * @param {string} moduleId - ID van de module
     * @returns {Promise<Comment[]>} Array van comments voor de module
     */
    async getByModuleId(moduleId: string): Promise<Comment[]> {
        const comments = await CommentModel.find({ moduleId }).sort({ createdAt: -1 });
        return comments.map(comment => this.mapToComment(comment));
    }
}