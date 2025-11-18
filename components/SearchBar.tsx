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
  const [isFocused, setIsFocused] = useState(false);

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
    <div className={`relative w-full max-w-3xl mx-auto transition-all duration-300 ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}>
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
        
        <div className="relative flex items-center">
            <div className="absolute left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className={`w-5 h-5 transition-colors duration-300 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`} />
            </div>
            <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholderText}
            disabled={isLoading}
            className={`w-full pl-12 pr-24 py-4 text-lg bg-white dark:bg-slate-900 border rounded-xl shadow-sm transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50 ${
                isCompareMode 
                ? 'border-cyan-300 dark:border-cyan-700 focus:ring-4 focus:ring-cyan-100 dark:focus:ring-cyan-900/30' 
                : 'border-gray-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30'
            }`}
            />
            
            <div className="absolute right-2 flex items-center gap-2">
                 {isCompareMode && (
                    <button
                    type="button"
                    onClick={onCancelCompare}
                    className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    aria-label="Összehasonlítás megszakítása"
                    >
                    <CloseIcon className="w-5 h-5" />
                    </button>
                )}
                
                <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="px-5 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 font-medium shadow-md hover:shadow-lg active:scale-95 transition-all disabled:bg-gray-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed disabled:shadow-none"
                aria-label="Keresés"
                >
                Keresés
                </button>
            </div>
        </div>
      </form>
    </div>
  );
};