import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, AlertCircle } from 'lucide-react';
import type { Book, BookInput } from '../types';

interface BookFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: BookInput) => Promise<void>;
  book?: Book | null;
}

const GRADIENT_SWATCHES = [
  { name: 'Midnight', class: 'from-indigo-600 to-purple-800' },
  { name: 'Forest', class: 'from-emerald-600 to-teal-800' },
  { name: 'Ocean', class: 'from-blue-600 to-cyan-800' },
  { name: 'Crimson', class: 'from-rose-600 to-pink-800' },
  { name: 'Sunset', class: 'from-orange-500 to-red-700' },
  { name: 'Nebula', class: 'from-violet-600 to-fuchsia-800' },
  { name: 'Amber', class: 'from-amber-600 to-orange-800' },
  { name: 'Obsidian', class: 'from-slate-700 to-zinc-900' },
];

const POPULAR_GENRES = [
  'Fiction', 'Sci-Fi', 'Biography', 'History', 
  'Psychology', 'Self-Help', 'Mystery', 'Fantasy', 'Business'
];

export const BookFormDrawer: React.FC<BookFormDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  book,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [publicationYear, setPublicationYear] = useState<number>(new Date().getFullYear());
  const [description, setDescription] = useState('');
  const [coverColor, setCoverColor] = useState(GRADIENT_SWATCHES[0].class);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync form states when editing a book
  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setGenre(book.genre);
      setPublicationYear(book.publicationYear);
      setDescription(book.description || '');
      setCoverColor(book.coverColor);
    } else {
      // Reset form for adding new book
      setTitle('');
      setAuthor('');
      setGenre('');
      setPublicationYear(new Date().getFullYear());
      setDescription('');
      setCoverColor(GRADIENT_SWATCHES[Math.floor(Math.random() * GRADIENT_SWATCHES.length)].class);
    }
    setErrors({});
  }, [book, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const currentYear = new Date().getFullYear();

    if (!title.trim()) newErrors.title = 'Title is required';
    if (!author.trim()) newErrors.author = 'Author is required';
    if (!genre.trim()) newErrors.genre = 'Genre is required';
    
    if (!publicationYear) {
      newErrors.publicationYear = 'Publication year is required';
    } else if (publicationYear < 0) {
      newErrors.publicationYear = 'Year cannot be negative';
    } else if (publicationYear > currentYear) {
      newErrors.publicationYear = `Year cannot be in the future (Max: ${currentYear})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const input: BookInput = {
        title: title.trim(),
        author: author.trim(),
        genre: genre.trim(),
        publicationYear,
        description: description.trim(),
        coverColor,
      };
      await onSubmit(input);
      onClose();
    } catch (err: any) {
      setErrors({ global: err.message || 'An error occurred while saving.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Fading Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
          />

          {/* Sliding Side Panel Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-lg bg-slate-900 border-l border-slate-800 z-50 flex flex-col h-full shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {book ? 'Edit Book Details' : 'Add New Book'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {book ? 'Update book metadata and styling' : 'Catalog a new book in the dashboard database'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {errors.global && (
                <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-sm">
                  <AlertCircle size={16} />
                  <span>{errors.global}</span>
                </div>
              )}

              {/* Dynamic Visual Cover Preview Section */}
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  Live Cover Preview
                </span>
                <div className="h-44 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {/* Subtle Grid Background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-30" />
                  
                  {/* Mini Visual Book */}
                  <div
                    className={`relative w-24 h-34 rounded-r bg-gradient-to-br ${coverColor} shadow-[0_10px_20px_rgba(0,0,0,0.6)] flex flex-col justify-between p-2.5 border-l-2 border-black/25 overflow-hidden transition-all duration-300`}
                  >
                    <div className="absolute top-0 left-0 right-0 h-full w-[35%] bg-gradient-to-r from-white/10 to-transparent" />
                    
                    <span className="text-[7px] uppercase tracking-wider font-semibold text-white/60 bg-white/10 px-1 py-0.2 rounded w-max">
                      {genre || 'Genre'}
                    </span>
                    
                    <span className="text-[9px] font-bold text-white text-center line-clamp-2 px-0.5 leading-tight">
                      {title || 'Untitled Book'}
                    </span>
                    
                    <span className="text-[8px] text-white/70 text-center font-medium truncate w-full border-t border-white/10 pt-1">
                      {author || 'Unknown Author'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Input fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Book Title <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Sapiens"
                    className={`w-full px-4 py-2.5 rounded-xl glass-input text-sm ${
                      errors.title ? 'border-rose-500/60 focus:ring-rose-500/20' : ''
                    }`}
                  />
                  {errors.title && (
                    <span className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.title}
                    </span>
                  )}
                </div>

                {/* Author */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Author Name <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Yuval Noah Harari"
                    className={`w-full px-4 py-2.5 rounded-xl glass-input text-sm ${
                      errors.author ? 'border-rose-500/60 focus:ring-rose-500/20' : ''
                    }`}
                  />
                  {errors.author && (
                    <span className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.author}
                    </span>
                  )}
                </div>

                {/* Genre (with quick select buttons) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Genre / Category <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    placeholder="e.g. History, Sci-Fi"
                    className={`w-full px-4 py-2.5 rounded-xl glass-input text-sm ${
                      errors.genre ? 'border-rose-500/60 focus:ring-rose-500/20' : ''
                    }`}
                  />
                  {errors.genre && (
                    <span className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.genre}
                    </span>
                  )}

                  {/* Popular genres suggestions */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {POPULAR_GENRES.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGenre(g)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-all cursor-pointer ${
                          genre.toLowerCase() === g.toLowerCase()
                            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700/60 hover:text-white hover:border-slate-600'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Publication Year */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Publication Year <span className="text-indigo-400">*</span>
                  </label>
                  <input
                    type="number"
                    value={publicationYear || ''}
                    onChange={(e) => setPublicationYear(parseInt(e.target.value) || 0)}
                    placeholder="e.g. 2011"
                    className={`w-full px-4 py-2.5 rounded-xl glass-input text-sm ${
                      errors.publicationYear ? 'border-rose-500/60 focus:ring-rose-500/20' : ''
                    }`}
                  />
                  {errors.publicationYear && (
                    <span className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.publicationYear}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Description / Overview
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write a brief overview of the book's contents, plots, or key take-aways..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm resize-none"
                  />
                </div>

                {/* Book Cover Design Swatches */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Cover Design Theme
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {GRADIENT_SWATCHES.map((swatch, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCoverColor(swatch.class)}
                        className={`h-10 rounded-lg bg-gradient-to-br ${swatch.class} relative border transition-all cursor-pointer ${
                          coverColor === swatch.class
                            ? 'border-white scale-105 shadow-md shadow-black/40 ring-2 ring-indigo-500/30'
                            : 'border-slate-800 hover:border-slate-600 hover:scale-102'
                        }`}
                        title={swatch.name}
                      >
                        {coverColor === swatch.class && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
                            <div className="w-1.5 h-1.5 rounded-full bg-white shadow" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

              </form>
            </div>

            {/* Drawer Actions Footer */}
            <div className="p-6 border-t border-slate-800 bg-slate-900/90 backdrop-blur flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 py-3 text-center border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl text-sm transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold rounded-xl text-sm shadow-lg shadow-indigo-500/20 transition-all hover:scale-102 active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>{book ? 'Save Changes' : 'Catalog Book'}</span>
                  </>
                )}
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
