// Type definities voor de hele applicatie

// Module type
export interface Module {
  id: string;
  name: string;
  shortdescription: string;
  description: string;
  content: string;
  studycredit: number;
  location: string;
  level: string;
  learningoutcomes: string;
}

// Module data zonder ID (voor create)
export type CreateModuleData = Omit<Module, 'id'>;

// Module data met optionele velden (voor update)
export type UpdateModuleData = Partial<CreateModuleData>;

// User types
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Filter types
export interface FilterOptions {
  locations: { value: string; count: number }[];
  studyCredits: { value: number; count: number }[];
  levels: { value: string; count: number }[];
}

// Comment types
export interface Comment {
  id: string;
  moduleId: string;
  userId: string;
  userName: string;
  description: string;
  createdAt: string;
}

export type CreateCommentData = Omit<Comment, 'id' | 'createdAt' | 'userId' | 'userName'> & {
  moduleId: string;
  description: string;
};

// Favorites types
export interface FavoritesResponse {
  favorites: string[];
}

export interface ToggleFavoriteResponse {
  isFavorite: boolean;
  favorites: string[];
}
