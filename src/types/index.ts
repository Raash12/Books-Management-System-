
export type User = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  cover?: string;
  isbn?: string;
  description: string;
  genre: string[];
  publicationYear?: number;
  publisher?: string;
  pages?: number;
  language?: string;
  available: boolean;
  borrowedBy?: string;
  borrowedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type BookFormData = Omit<
  Book,
  'id' | 'available' | 'borrowedBy' | 'borrowedUntil' | 'createdAt' | 'updatedAt'
>;

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  password: string;
  name: string;
};
