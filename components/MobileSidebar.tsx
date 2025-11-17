import React, { useState } from 'react';
import { SidePanel } from './SidePanel';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

// Props for MobileSidebar are a subset of SidePanel props, passed from App
interface SidePanelProps {
  onSearch: (term: string) => void;
  onShowEssayGenerator: () => void;
  onGenerateTimeline: (topic: string) => void;
  onShowJournal: () => void;
  journalItemCount: number;
  onExport: () => void;
  isActionDisabled: boolean;
  isExportDisabled: boolean;
  onCompare: (concept1: string, concept2: string) => void;
}

export const MobileSidebar: React.FC<SidePanelProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-gray-900/80 dark:bg-[#0f3460]/90 text-white shadow-lg p-4 backdrop-blur-sm transition-colors duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-lg font-semibold"
        aria-expanded={isOpen}
      >
        <span>Témakörök és eszközök</span>
        <ChevronDownIcon
          className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[3000px] pt-4 mt-4 border-t border-gray-700 dark:border-[#2a2a4e]' : 'max-h-0'
        }`}
      >
        {/* Force dark theme for SidePanel content to match the container */}
        <div className="dark">
          <SidePanel {...props} />
        </div>
      </div>
    </div>
  );
};