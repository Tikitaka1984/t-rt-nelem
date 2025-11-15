import React, { useState } from 'react';
import { SidePanel } from './SidePanel';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

// Props for MobileSidebar are the same as SidePanel
interface SidePanelProps {
  onSearch: (term: string) => void;
  onGenerateEssay: (topic: string) => void;
  onGenerateTimeline: (topic: string) => void;
  onShowJournal: () => void;
  journalItemCount: number;
  onExport: () => void;
  isActionDisabled: boolean;
  isExportDisabled: boolean;
}

export const MobileSidebar: React.FC<SidePanelProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-gray-900/80 text-white shadow-lg p-4 backdrop-blur-sm">
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
          isOpen ? 'max-h-[3000px] pt-4 mt-4 border-t border-gray-700' : 'max-h-0'
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
