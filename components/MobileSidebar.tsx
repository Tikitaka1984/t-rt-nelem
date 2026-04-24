import React, { useState } from 'react';
import { SidePanel, SidePanelProps } from './SidePanel';
import { Menu, X } from 'lucide-react';

type MobileSidebarProps = Omit<SidePanelProps, 'onShowJournal' | 'journalItemCount'>;

export const MobileSidebar: React.FC<MobileSidebarProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  // Wrap the handlers to close the sidebar on action
  const handleAction = (type: keyof SidePanelProps, ...args: any[]) => {
    const handler = props[type] as (...args: any[]) => void;
    if (handler) {
      handler(...args);
      setIsOpen(false);
    }
  };

  const sidePanelPropsForMobile = {
    ...props,
    onSearch: (term: string) => handleAction('onSearch', term),
    onShowEssayGenerator: () => handleAction('onShowEssayGenerator'),
    onGenerateTimeline: (topic: string) => handleAction('onGenerateTimeline', topic),
    onCompare: (c1: string, c2: string) => handleAction('onCompare', c1, c2),
    onRandomSearch: () => handleAction('onRandomSearch'),
    onExport: () => handleAction('onExport'),
  };

  return (
    <>
      {/* Floating Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-8 z-50 flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl hover:scale-110 transition-all duration-300 focus:outline-none md:hidden"
        aria-label="Menü megnyitása"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Off-canvas Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] md:hidden animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Side Panel Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white dark:bg-slate-900 z-[60] shadow-2xl transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
            <h2 className="text-lg font-bold font-serif">Menü és Eszközök</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <X className="w-6 h-6" />
            </button>
        </div>
        <SidePanel {...sidePanelPropsForMobile} />
      </div>
    </>
  );
};
