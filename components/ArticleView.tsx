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
      className="font-semibold italic text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-sm"
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
    <div className="h-full bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 md:p-8 animate-fade-in">
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-full flex flex-col">
          <div className="flex-grow overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b-2 border-blue-500">{article.title}</h2>
            
            <div className="mb-6 space-y-3 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Definíció</h3>
              <p>{renderDefinition(article.definition, onTermClick)}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Kapcsolódó fogalmak</h3>
              <ul className="space-y-4">
                {article.relatedConcepts.map((concept) => (
                  <li key={concept.term}>
                    <button
                      onClick={() => onTermClick(concept.term)}
                      className="font-semibold text-left text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-sm"
                    >
                      {concept.term}
                    </button>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{concept.explanation}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
           <div className="flex-shrink-0 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={handleAddToJournalClick}
                    disabled={isAdding}
                    className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-teal-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <BookPlusIcon className="w-5 h-5 mr-2" />
                    {isAdding ? 'Hozzáadás...' : 'Hozzáadás a fogalomnaplóhoz'}
                </button>
            </div>
          <style>{`
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
              animation: fade-in 0.4s ease-out forwards;
            }
          `}</style>
      </article>
    </div>
  );
};