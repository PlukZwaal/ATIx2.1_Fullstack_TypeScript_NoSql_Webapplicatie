// Comment interface
export interface Comment {
    id?: string;
    moduleId: string;
    userId: string;
    userName: string;
    description: string;
    createdAt?: Date;
}

// Create comment data (zonder id en createdAt)
export type CreateCommentData = Omit<Comment, 'id' | 'createdAt'>;