import React, { useState } from 'react';
import { SidePanel, SidePanelProps } from './SidePanel';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

// This component uses a subset of SidePanelProps, so we Omit the ones not needed for the button itself
type MobileSidebarProps = Omit<SidePanelProps, 'onShowJournal' | 'journalItemCount'>;

export const MobileSidebar: React.FC<MobileSidebarProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-lg font-semibold p-4"
        aria-expanded={isOpen}
      >
        <span>Témakörök és eszközök</span>
        <ChevronDownIcon
          className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[3000px] border-t border-gray-200 dark:border-slate-700' : 'max-h-0'
        }`}
      >
        <SidePanel {...props} />
      </div>
    </div>
  );
};
