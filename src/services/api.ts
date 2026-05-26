import type { Book, BookInput } from '../types';

const STORAGE_KEY = 'bms_books_db';
const MOCK_LATENCY = 600; // milliseconds

const SEED_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Fiction',
    publicationYear: 2020,
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    coverColor: 'from-indigo-600 to-purple-800',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
  },
  {
    id: '2',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Sci-Fi',
    publicationYear: 1965,
    description: 'Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the spice.',
    coverColor: 'from-amber-600 to-amber-900',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
  },
  {
    id: '3',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    genre: 'History',
    publicationYear: 2011,
    description: 'Dr. Yuval Noah Harari spans the whole of human history, from the very first humans to walk the earth to the radical—and sometimes devastating—breakthroughs of the Cognitive, Agricultural, and Scientific Revolutions.',
    coverColor: 'from-emerald-600 to-teal-800',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  },
  {
    id: '4',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    genre: 'Psychology',
    publicationYear: 2011,
    description: 'Daniel Kahneman, recipient of the Nobel Prize in Economic Sciences, takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.',
    coverColor: 'from-blue-600 to-cyan-800',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: '5',
    title: 'Educated',
    author: 'Tara Westover',
    genre: 'Biography',
    publicationYear: 2018,
    description: 'An unforgettable memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
    coverColor: 'from-rose-600 to-pink-800',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
  },
  {
    id: '6',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    publicationYear: 2018,
    description: 'No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies to form good habits and break bad ones.',
    coverColor: 'from-orange-500 to-red-700',
    createdAt: new Date().toISOString(), // today
  }
];

// Helper to get raw data
const getRawBooks = (): Book[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_BOOKS));
    return SEED_BOOKS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return SEED_BOOKS;
  }
};

// Helper to save raw data
const saveRawBooks = (books: Book[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
};

// Helper to simulate latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulated API Endpoints
export const api = {
  /**
   * Get all books
   */
  async getBooks(): Promise<Book[]> {
    await delay(MOCK_LATENCY);
    // Simulating toggleable API error (uncomment to test error scenarios)
    // if (Math.random() < 0.05) throw new Error("Failed to fetch books from the server.");
    return getRawBooks();
  },

  /**
   * Get a single book by id
   */
  async getBookById(id: string): Promise<Book> {
    await delay(MOCK_LATENCY);
    const books = getRawBooks();
    const book = books.find((b) => b.id === id);
    if (!book) throw new Error(`Book with ID ${id} not found.`);
    return book;
  },

  /**
   * Create a new book
   */
  async createBook(input: BookInput): Promise<Book> {
    await delay(MOCK_LATENCY);
    
    // Server-side validation simulation
    if (!input.title.trim()) throw new Error("Title is required.");
    if (!input.author.trim()) throw new Error("Author is required.");
    if (!input.genre.trim()) throw new Error("Genre is required.");
    if (!input.publicationYear || input.publicationYear > new Date().getFullYear()) {
      throw new Error(`Invalid publication year. Must not be in the future.`);
    }

    const books = getRawBooks();
    const newBook: Book = {
      ...input,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    
    books.unshift(newBook); // Prepend so it shows up at the top
    saveRawBooks(books);
    return newBook;
  },

  /**
   * Update an existing book
   */
  async updateBook(id: string, input: BookInput): Promise<Book> {
    await delay(MOCK_LATENCY);

    // Validation
    if (!input.title.trim()) throw new Error("Title is required.");
    if (!input.author.trim()) throw new Error("Author is required.");
    if (!input.genre.trim()) throw new Error("Genre is required.");
    if (!input.publicationYear || input.publicationYear > new Date().getFullYear()) {
      throw new Error(`Invalid publication year. Must not be in the future.`);
    }

    const books = getRawBooks();
    const index = books.findIndex((b) => b.id === id);
    if (index === -1) throw new Error(`Book with ID ${id} not found.`);

    const updatedBook: Book = {
      ...books[index],
      ...input,
    };

    books[index] = updatedBook;
    saveRawBooks(books);
    return updatedBook;
  },

  /**
   * Delete a book
   */
  async deleteBook(id: string): Promise<void> {
    await delay(MOCK_LATENCY);
    const books = getRawBooks();
    const filtered = books.filter((b) => b.id !== id);
    if (books.length === filtered.length) {
      throw new Error(`Book with ID ${id} not found.`);
    }
    saveRawBooks(filtered);
  },
};
