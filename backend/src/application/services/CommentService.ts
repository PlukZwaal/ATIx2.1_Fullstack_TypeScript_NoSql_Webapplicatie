import { Comment, CreateCommentData } from '../../core/entities/Comment';
import { CommentModel } from '../../infrastructure/models/CommentModel';

// Service voor alle comment operaties
export class CommentService {
    // Controleer of alle verplichte velden zijn ingevuld
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

    // Converteer database document naar Comment object
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

    // Verwijder extra spaties uit alle string velden
    private cleanStringFields(data: any): any {
        const cleanData: any = {};
        Object.keys(data).forEach(key => {
            const value = data[key];
            cleanData[key] = typeof value === 'string' ? value.trim() : value;
        });
        return cleanData;
    }

    // Maak nieuwe comment aan
    async create(commentData: CreateCommentData): Promise<Comment> {
        this.validateComment(commentData);
        const cleanData = this.cleanStringFields(commentData);
        const comment = await CommentModel.create(cleanData);
        return this.mapToComment(comment);
    }

    // Haal alle comments voor een module op
    async getByModuleId(moduleId: string): Promise<Comment[]> {
        const comments = await CommentModel.find({ moduleId }).sort({ createdAt: -1 });
        return comments.map(comment => this.mapToComment(comment));
    }

    // Verwijder comment
    async delete(id: string, userId: string): Promise<boolean> {
        const result = await CommentModel.findOneAndDelete({ _id: id, userId });
        return Boolean(result);
    }
}