import React, { useState, useId } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border-b border-gray-100 dark:border-slate-800 last:border-0 transition-colors duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-3 text-left font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="text-sm group-hover:pl-1 transition-all duration-200">{title}</span>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-400 group-hover:text-blue-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        id={panelId}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 pb-3' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pl-2 border-l-2 border-gray-100 dark:border-slate-800 ml-1">
          {children}
        </div>
      </div>
    </div>
  );
};