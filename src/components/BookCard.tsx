import React from 'react';
import { motion } from 'framer-motion';
import { Edit3, Trash2, Calendar, User, Bookmark } from 'lucide-react';
import type { Book } from '../types';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="glass-panel rounded-2xl overflow-hidden flex flex-col sm:flex-row h-full border border-slate-700/40 shadow-xl group hover:border-indigo-500/30 transition-all duration-300"
    >
      {/* 3D-ish Visual Book Cover Column */}
      <div className="relative w-full sm:w-44 h-56 sm:h-auto min-h-[220px] bg-slate-950 flex-shrink-0 flex items-center justify-center p-4">
        {/* Physical Book Spine & Shadow Effect */}
        <div
          className={`relative w-28 h-40 rounded-r-md bg-gradient-to-br ${book.coverColor} shadow-[10px_10px_20px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-2 overflow-hidden flex flex-col justify-between p-3 border-l-4 border-black/25`}
        >
          {/* Cover Highlights / Glossy Reflection */}
          <div className="absolute top-0 left-0 right-0 h-full w-[35%] bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />

          {/* Genre Label mini */}
          <span className="text-[9px] uppercase tracking-wider font-semibold text-white/70 bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded w-max">
            {book.genre}
          </span>

          {/* Book Title inside Cover */}
          <div className="flex-1 flex items-center justify-center py-2">
            <h4 className="text-white text-center font-bold text-xs leading-tight tracking-tight line-clamp-3 px-1 drop-shadow-md">
              {book.title}
            </h4>
          </div>

          {/* Author inside Cover */}
          <span className="text-[10px] text-white/80 font-medium truncate w-full text-center drop-shadow-sm border-t border-white/10 pt-1.5">
            {book.author}
          </span>
        </div>
      </div>

      {/* Book Metadata & Description Column */}
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          {/* Genre and Year Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Bookmark size={12} />
              {book.genre}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 border border-slate-700/50">
              <Calendar size={12} />
              {book.publicationYear}
            </span>
          </div>

          {/* Book Title */}
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors duration-200 line-clamp-1">
            {book.title}
          </h3>

          {/* Book Author */}
          <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-3">
            <User size={14} className="text-indigo-400/80" />
            <span>{book.author}</span>
          </div>

          {/* Short Description */}
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
            {book.description || 'No description provided for this book. Open the edit menu to add an overview of its contents.'}
          </p>
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
          <button
            onClick={() => onEdit(book)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-indigo-600 hover:text-white border border-slate-700 text-slate-300 text-xs font-medium transition-all cursor-pointer"
            title="Edit Details"
          >
            <Edit3 size={14} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(book.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-600 hover:text-white border border-slate-700 text-slate-300 text-xs font-medium transition-all cursor-pointer"
            title="Delete Book"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
