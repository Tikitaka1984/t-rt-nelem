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
    <div className="border border-gray-200 dark:border-[#2a2a4e] rounded-lg transition-colors duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-3 text-left font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#16213e]/50 hover:bg-gray-100 dark:hover:bg-[#16213e] transition-colors"
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span>{title}</span>
        <ChevronDownIcon
          className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        id={panelId}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="p-3 bg-white dark:bg-[#0f3460] transition-colors duration-300">
          {children}
        </div>
      </div>
    </div>
  );
};