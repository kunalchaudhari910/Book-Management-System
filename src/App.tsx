import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';

import { api } from './services/api';
import type { Book, BookInput, FilterState, DashboardStats, ToastType } from './types';
import { StatsPanel } from './components/StatsPanel';
import { SearchBar } from './components/SearchBar';
import { BookCard } from './components/BookCard';
import { BookFormDrawer } from './components/BookFormDrawer';
import { Toast } from './components/Toast';

function App() {
  // App Core States
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter/Sort State
  const [filterState, setFilterState] = useState<FilterState>({
    search: '',
    genre: '',
    sortBy: 'year_desc',
  });

  // Drawer Controls
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Toast System State
  const [toasts, setToasts] = useState<ToastType[]>([]);

  // Toast Add Helper
  const addToast = (message: string, type: ToastType['type'] = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  // Toast Dismiss Helper
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch initial books list
  const loadBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getBooks();
      setBooks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load books. Please check your connection.');
      addToast(err.message || 'Failed to load books database.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  // CRUD Actions
  const handleCreateOrUpdateBook = async (input: BookInput) => {
    try {
      if (selectedBook) {
        // Edit Mode
        const updated = await api.updateBook(selectedBook.id, input);
        setBooks((prev) => prev.map((b) => (b.id === selectedBook.id ? updated : b)));
        addToast(`"${updated.title}" updated successfully!`, 'success');
      } else {
        // Add Mode
        const created = await api.createBook(input);
        setBooks((prev) => [created, ...prev]);
        addToast(`"${created.title}" added to your collection!`, 'success');
        
        // Celebration effect
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#6366f1', '#a855f7', '#ec4899', '#3b82f6'],
        });
      }
    } catch (err: any) {
      addToast(err.message || 'Failed to save book details.', 'error');
      throw err; // Propagate error back to form drawer to show local error
    }
  };

  const handleDeleteBook = async (id: string) => {
    const bookToDelete = books.find((b) => b.id === id);
    if (!bookToDelete) return;

    if (window.confirm(`Are you sure you want to delete "${bookToDelete.title}"?`)) {
      try {
        await api.deleteBook(id);
        setBooks((prev) => prev.filter((b) => b.id !== id));
        addToast(`"${bookToDelete.title}" has been deleted.`, 'info');
      } catch (err: any) {
        addToast(err.message || 'Failed to delete book.', 'error');
      }
    }
  };

  // Open Drawer trigger (Add)
  const openAddDrawer = () => {
    setSelectedBook(null);
    setIsDrawerOpen(true);
  };

  // Open Drawer trigger (Edit)
  const openEditDrawer = (book: Book) => {
    setSelectedBook(book);
    setIsDrawerOpen(true);
  };

  // Compute unique genres dynamically
  const uniqueGenres = useMemo(() => {
    const genresSet = new Set(books.map((b) => b.genre.trim()));
    return Array.from(genresSet).filter(Boolean).sort();
  }, [books]);

  // Compute Dashboard statistics dynamically
  const stats = useMemo<DashboardStats>(() => {
    if (books.length === 0) {
      return { totalBooks: 0, totalGenres: 0, earliestYear: null, latestYear: null };
    }
    const years = books.map((b) => b.publicationYear).filter((y) => !isNaN(y));
    const genresSet = new Set(books.map((b) => b.genre.trim()));
    
    return {
      totalBooks: books.length,
      totalGenres: genresSet.size,
      earliestYear: years.length > 0 ? Math.min(...years) : null,
      latestYear: years.length > 0 ? Math.max(...years) : null,
    };
  }, [books]);

  // Compute filtered & sorted books in memory
  const processedBooks = useMemo(() => {
    let result = [...books];

    // 1. Text Filter (search term)
    if (filterState.search.trim()) {
      const query = filterState.search.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(query) ||
          b.author.toLowerCase().includes(query)
      );
    }

    // 2. Genre Filter
    if (filterState.genre) {
      const selectedGenre = filterState.genre.toLowerCase();
      result = result.filter((b) => b.genre.toLowerCase() === selectedGenre);
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (filterState.sortBy === 'title_asc') {
        return a.title.localeCompare(b.title);
      }
      if (filterState.sortBy === 'title_desc') {
        return b.title.localeCompare(a.title);
      }
      if (filterState.sortBy === 'year_asc') {
        return a.publicationYear - b.publicationYear;
      }
      if (filterState.sortBy === 'year_desc') {
        return b.publicationYear - a.publicationYear;
      }
      return 0;
    });

    return result;
  }, [books, filterState]);

  return (
    <div className="min-h-screen px-4 py-8 md:px-8 max-w-7xl mx-auto flex flex-col justify-between">
      <div>
        
        {/* Navbar / Top Header Section */}
        <header className="flex items-center justify-between mb-8 pb-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                BOOK<span className="text-indigo-400 font-light">MANAGEMENT SYSTEM</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Book Management & Analytics Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadBooks}
              disabled={isLoading}
              className="p-2.5 rounded-xl bg-slate-800/85 hover:bg-slate-700/80 border border-slate-700/40 text-slate-400 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
              title="Sync Database"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        {/* Dashboard Statistics */}
        <StatsPanel stats={stats} />

        {/* Toolbar (Search, Filter, Sort, Add) */}
        <SearchBar
          filterState={filterState}
          setFilterState={setFilterState}
          genres={uniqueGenres}
          onAddClick={openAddDrawer}
        />

        {/* Content Body */}
        {error && !isLoading && (
          <div className="glass-panel border-rose-500/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center max-w-xl mx-auto my-12 shadow-2xl">
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Connection Problem</h3>
            <p className="text-sm text-slate-400 mb-6">{error}</p>
            <button
              onClick={loadBooks}
              className="px-6 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-semibold rounded-xl text-sm transition-all cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        )}

        {!error && (
          <>
            {/* Grid List View */}
            {isLoading ? (
              // Skeletal Loader Grid
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                {[1, 2, 4, 5].map((idx) => (
                  <div
                    key={idx}
                    className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row h-52 animate-pulse border border-slate-800"
                  >
                    <div className="w-full sm:w-32 h-40 sm:h-full bg-slate-800 rounded-xl mb-4 sm:mb-0 flex-shrink-0" />
                    <div className="sm:ml-6 flex-grow space-y-3 pt-2">
                      <div className="h-4 bg-slate-800 rounded w-1/3" />
                      <div className="h-6 bg-slate-800 rounded w-3/4" />
                      <div className="h-4 bg-slate-800 rounded w-1/2" />
                      <div className="space-y-1.5 pt-2">
                        <div className="h-3 bg-slate-800 rounded w-full" />
                        <div className="h-3 bg-slate-800 rounded w-5/6" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : processedBooks.length > 0 ? (
              // Real Data Grid
              <motion.div
                layout
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12"
              >
                <AnimatePresence mode="popLayout">
                  {processedBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onEdit={openEditDrawer}
                      onDelete={handleDeleteBook}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              // Empty State Illustration
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel border-dashed border-slate-700/60 rounded-2xl p-12 text-center max-w-md mx-auto my-12 shadow-xl"
              >
                <div className="w-16 h-16 bg-slate-800/80 border border-slate-700/65 rounded-2xl flex items-center justify-center mx-auto text-slate-400 mb-5">
                  <Layers size={28} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">No Books Cataloged</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {filterState.search || filterState.genre
                    ? 'No books match your current search queries or genre selection filter.'
                    : 'Your library database is empty. Get started by adding your first book!'}
                </p>
                {filterState.search || filterState.genre ? (
                  <button
                    onClick={() => setFilterState({ search: '', genre: '', sortBy: 'year_desc' })}
                    className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Clear Filter Queries
                  </button>
                ) : (
                  <button
                    onClick={openAddDrawer}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    Catalog First Book
                  </button>
                )}
              </motion.div>
            )}
          </>
        )}

      </div>

      {/* Footer Section */}
      <footer className="text-center py-6 border-t border-slate-800/50 mt-12 text-slate-500 text-xs font-medium">
        <p>&copy; {new Date().getFullYear()}Book Management System</p>
      </footer>

      {/* Slide-over Drawer for add/edit book forms */}
      <BookFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleCreateOrUpdateBook}
        book={selectedBook}
      />

      {/* Toast Alert overlay notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />

    </div>
  );
}

export default App;
