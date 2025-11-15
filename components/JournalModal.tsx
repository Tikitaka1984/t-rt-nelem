import React, { useState, useEffect, useId } from 'react';
import { JournalEntry } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { CopyIcon } from './icons/CopyIcon';

interface JournalModalProps {
  journal: JournalEntry[];
  onClose: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({ journal, onClose }) => {
  const [hasCopied, setHasCopied] = useState(false);
  const titleId = useId();

  const getJournalText = () => {
    if (journal.length === 0) {
      return "A fogalomnapló üres.";
    }
    let text = "Fogalomnapló\n\n";
    journal.forEach((entry, index) => {
      text += `${index + 1}. ${entry.term} – ${entry.shortDefinition}\n`;
    });
    return text;
  };

  const handleCopy = () => {
    if (journal.length > 0) {
      navigator.clipboard.writeText(getJournalText());
      setHasCopied(true);
    }
  };
  
  useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasCopied]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl m-4 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 id={titleId} className="text-xl font-semibold">Fogalomnapló</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Bezárás">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          
          {journal.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">A fogalomnaplód jelenleg üres. Keress rá egy fogalomra és add hozzá, hogy itt megjelenjen!</p>
          ) : (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Másold ki ezt a listát, és illeszd be Word dokumentumba vagy Google Docs-ba, ha el szeretnéd menteni.</p>
              <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-md max-h-96 overflow-y-auto whitespace-pre-wrap text-sm">
                <ol className="list-decimal list-inside space-y-2">
                  {journal.map((entry, index) => (
                    <li key={index}>
                      <span className="font-semibold">{entry.term}</span> – {entry.shortDefinition}
                    </li>
                  ))}
                </ol>
              </div>
              <button
                onClick={handleCopy}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors"
              >
                <CopyIcon className="w-5 h-5 mr-2" />
                {hasCopied ? 'Másolva!' : 'Másolás vágólapra'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
