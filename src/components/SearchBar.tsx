import React from 'react';
import { Search, X, Plus, ChevronDown } from 'lucide-react';
import type { FilterState } from '../types';

interface SearchBarProps {
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
  genres: string[];
  onAddClick: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  filterState,
  setFilterState,
  genres,
  onAddClick,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterState((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterState((prev) => ({ ...prev, genre: e.target.value }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterState((prev) => ({
      ...prev,
      sortBy: e.target.value as FilterState['sortBy'],
    }));
  };

  const clearSearch = () => {
    setFilterState((prev) => ({ ...prev, search: '' }));
  };

  return (
    <div className="glass-panel rounded-2xl p-5 mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between shadow-lg">
      
      {/* Search Input Box */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={filterState.search}
          onChange={handleSearchChange}
          placeholder="Search by title or author..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-input placeholder-slate-400 text-sm focus:ring-2 focus:ring-indigo-500/50"
        />
        {filterState.search && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center gap-3 md:flex-nowrap">
        
        {/* Genre Selector */}
        <div className="relative flex-1 md:flex-initial">
          <select
            value={filterState.genre}
            onChange={handleGenreChange}
            className="w-full md:w-48 pl-3 pr-8 py-2.5 rounded-xl glass-input text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <ChevronDown size={14} />
          </div>
        </div>

        {/* Sort Selector */}
        <div className="relative flex-1 md:flex-initial">
          <select
            value={filterState.sortBy}
            onChange={handleSortChange}
            className="w-full md:w-48 pl-3 pr-8 py-2.5 rounded-xl glass-input text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500/50"
          >
            <option value="year_desc">Newest Releases</option>
            <option value="year_asc">Oldest Releases</option>
            <option value="title_asc">Title: A to Z</option>
            <option value="title_desc">Title: Z to A</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <ChevronDown size={14} />
          </div>
        </div>

        {/* Add Book Trigger Button */}
        <button
          onClick={onAddClick}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95 duration-200 cursor-pointer w-full md:w-auto"
        >
          <Plus size={16} />
          <span>Add Book</span>
        </button>
      </div>

    </div>
  );
};
