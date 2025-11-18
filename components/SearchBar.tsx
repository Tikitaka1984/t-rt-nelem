import React, { useState, useEffect } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { CloseIcon } from './icons/CloseIcon';

interface SearchBarProps {
  onSearch: (term: string) => void;
  isLoading: boolean;
  isCompareMode: boolean;
  item1Title: string;
  onCancelCompare: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  isLoading, 
  isCompareMode, 
  item1Title, 
  onCancelCompare 
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    // Clear query when entering compare mode
    if (isCompareMode) {
      setQuery('');
    }
  }, [isCompareMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  const placeholderText = isCompareMode
    ? `Hasonlítsd össze ezzel: "${item1Title}". Add meg a második fogalmat...`
    : "Keress egy történelmi fogalmat...";

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholderText}
          disabled={isLoading}
          className={`w-full pl-11 pr-16 py-3 text-lg bg-white dark:bg-slate-800 border rounded-lg focus:ring-2 focus:outline-none transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-400 disabled:opacity-50 ${
            isCompareMode 
            ? 'border-cyan-500 focus:border-cyan-500 focus:ring-cyan-200 dark:focus:ring-cyan-500/50' 
            : 'border-gray-300 dark:border-slate-600 focus:border-blue-500 focus:ring-blue-200 dark:focus:ring-blue-500/50'
          }`}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute top-1/2 right-2 -translate-y-1/2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all font-semibold hover:shadow-md"
          aria-label="Keresés"
        >
          Keresés
        </button>
      </form>
      {isCompareMode && (
        <button
          onClick={onCancelCompare}
          className="absolute top-1/2 right-28 -translate-y-1/2 p-1.5 rounded-full text-gray-500 dark:text-gray-300 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
          aria-label="Összehasonlítás megszakítása"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
