import React, { useState } from 'react';
import { Article } from '../types';
import { BookPlusIcon } from './icons/BookPlusIcon';

interface ArticleViewProps {
  article: Article;
  onTermClick: (term: string) => void;
  onAddToJournal: (term: string) => Promise<void>;
}

// Helper function to parse definition and create clickable terms
const ClickableTerm: React.FC<{ term: string, onClick: (term: string) => void }> = ({ term, onClick }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick(term);
      }}
      className="font-bold italic text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline decoration-2 underline-offset-2 transition-all"
    >
      {term}
    </button>
  );
};

const renderDefinition = (definition: string, onClick: (term: string) => void) => {
  const parts = definition.split(/(\*[^*]+\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      const term = part.slice(1, -1);
      return <ClickableTerm key={`${term}-${index}`} term={term} onClick={onClick} />;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

export const ArticleView: React.FC<ArticleViewProps> = ({ article, onTermClick, onAddToJournal }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToJournalClick = async () => {
      setIsAdding(true);
      await onAddToJournal(article.title);
      setIsAdding(false);
  }

  return (
    <div className="h-full p-1 lg:p-4 animate-fade-in">
        <article className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 h-full flex flex-col overflow-hidden">
            {/* Accent Border Left */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-cyan-500"></div>
            
            {/* Header */}
            <div className="p-8 pb-4 bg-gradient-to-r from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 border-b border-gray-100 dark:border-slate-800">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-serif tracking-tight">{article.title}</h2>
            </div>

          <div className="flex-grow overflow-y-auto p-8">
            
            <div className="mb-8">
               <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-900/30 rounded-full">
                  Definíció
              </span>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-loose font-light">
                  {renderDefinition(article.definition, onTermClick)}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-6 border border-gray-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Kapcsolódó fogalmak</h3>
              <ul className="grid gap-4 sm:grid-cols-2">
                {article.relatedConcepts.map((concept) => (
                  <li key={concept.term} className="group">
                    <button
                      onClick={() => onTermClick(concept.term)}
                      className="text-base font-bold text-blue-700 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 hover:underline decoration-2 underline-offset-2 flex items-center gap-2 transition-all"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:scale-150 transition-transform"></span>
                      {concept.term}
                    </button>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-3.5 leading-relaxed">{concept.explanation}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
           <div className="p-6 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
                <button
                    onClick={handleAddToJournalClick}
                    disabled={isAdding}
                    className="w-full flex items-center justify-center px-6 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    <BookPlusIcon className="w-5 h-5 mr-2 text-amber-500 group-hover:scale-110 transition-transform" />
                    {isAdding ? 'Hozzáadás...' : 'Mentés a fogalomnaplóba'}
                </button>
            </div>
          <style>{`
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
              animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }
          `}</style>
      </article>
    </div>
  );
};