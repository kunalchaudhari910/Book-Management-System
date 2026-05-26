export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  publicationYear: number;
  description?: string;
  coverColor: string; // Tailwind class string for gradient, e.g. 'from-cyan-500 to-blue-600'
  createdAt: string;
}

export type BookInput = Omit<Book, 'id' | 'createdAt'>;

export interface FilterState {
  search: string;
  genre: string;
  sortBy: 'title_asc' | 'title_desc' | 'year_desc' | 'year_asc';
}

export interface DashboardStats {
  totalBooks: number;
  totalGenres: number;
  earliestYear: number | null;
  latestYear: number | null;
}

export interface ToastType {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
