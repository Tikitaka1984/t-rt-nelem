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
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholderText}
          disabled={isLoading}
          className={`w-full px-5 py-3 text-lg bg-gray-50 dark:bg-gray-700 border rounded-full focus:ring-2 focus:outline-none transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 ${
            isCompareMode 
            ? 'border-indigo-400 dark:border-indigo-500 focus:ring-indigo-500' 
            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400'
          }`}
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="absolute top-1/2 right-3 -translate-y-1/2 p-2 rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
          aria-label="Keresés"
        >
          <SearchIcon className="w-6 h-6" />
        </button>
      </form>
      {isCompareMode && (
        <button
          onClick={onCancelCompare}
          className="absolute top-1/2 right-16 -translate-y-1/2 p-1.5 rounded-full text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          aria-label="Összehasonlítás megszakítása"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
