
import React, { useState } from 'react';
import { TimelineEvent } from '../types';
import { BookPlusIcon } from './icons/BookPlusIcon';

interface TimelineViewProps {
  topic: string;
  events: TimelineEvent[];
  onEventClick: (eventName: string) => void;
  onAddToJournal: (term: string, definition: string) => void;
  onDateClick: (date: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ topic, events, onEventClick, onAddToJournal, onDateClick }) => {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToJournalClick = () => {
    setIsAdding(true);
    const term = `Idővonal: ${topic}`;
    const dateRange = events.length > 0 ? `${events[0].date} - ${events[events.length - 1].date}` : '';
    const definition = `Idővonal (${events.length} esemény). Időszak: ${dateRange}. Kulcsesemények: ${events.slice(0, 3).map(e => e.title).join(', ')}...`;
    
    onAddToJournal(term, definition);
    
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="h-full p-1 lg:p-4 animate-fade-in overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto pb-12">
        <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 mb-2 text-xs font-bold tracking-wider text-purple-600 dark:text-purple-400 uppercase bg-purple-50 dark:bg-purple-900/30 rounded-full">Idővonal</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-serif">{topic}</h2>
        </div>
        
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 w-0.5 h-full bg-gradient-to-b from-purple-200 via-purple-400 to-purple-200 dark:from-purple-900 dark:via-purple-700 dark:to-purple-900 md:-translate-x-1/2"></div>

          {events.map((event, index) => (
            <div key={index} className="relative mb-10 flex flex-col md:flex-row justify-between items-center w-full group">
              
              {/* Left Side (or spacer on mobile) */}
              <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:order-1 md:text-right' : 'md:order-3'}`}>
                 {index % 2 === 0 && (
                    <div className="hidden md:block">
                       <button 
                        onClick={() => onDateClick(event.date)}
                        className="text-3xl font-black text-purple-200 dark:text-purple-900/50 absolute -top-4 right-0 opacity-50 group-hover:opacity-100 transition-all hover:text-purple-400 dark:hover:text-purple-600 cursor-pointer z-0"
                        title="Keresés erre a dátumra"
                       >
                        {event.date}
                       </button>
                       <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 relative z-10">{event.title}</h3>
                       <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{event.description}</p>
                       <button onClick={() => onEventClick(event.title)} className="mt-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">Részletek &rarr;</button>
                    </div>
                 )}
              </div>

              {/* Center Node */}
              <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 md:translate-x-[-50%] z-10 order-2 flex items-center justify-center">
                <div className="w-4 h-4 bg-purple-600 border-4 border-white dark:border-slate-950 rounded-full shadow-md group-hover:scale-150 transition-transform duration-300"></div>
              </div>

              {/* Right Side (or content on mobile) */}
              <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:order-3' : 'md:order-1'}`}>
                  {/* Mobile View (Always shows content) */}
                  <div className="md:hidden">
                        <button 
                          onClick={() => onDateClick(event.date)}
                          className="text-sm font-bold text-purple-600 dark:text-purple-400 block mb-1 hover:underline text-left"
                        >
                          {event.date}
                        </button>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{event.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{event.description}</p>
                         <button onClick={() => onEventClick(event.title)} className="mt-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">Részletek &rarr;</button>
                  </div>

                   {/* Desktop View (Right side content for odd items) */}
                  {index % 2 !== 0 && (
                    <div className="hidden md:block text-left">
                       <button 
                        onClick={() => onDateClick(event.date)}
                        className="text-3xl font-black text-purple-200 dark:text-purple-900/50 absolute -top-4 left-0 opacity-50 group-hover:opacity-100 transition-all hover:text-purple-400 dark:hover:text-purple-600 cursor-pointer z-0"
                        title="Keresés erre a dátumra"
                       >
                        {event.date}
                       </button>
                       <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 relative z-10">{event.title}</h3>
                       <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{event.description}</p>
                       <button onClick={() => onEventClick(event.title)} className="mt-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">Részletek &rarr;</button>
                    </div>
                 )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800 rounded-xl mt-8">
            <button
                onClick={handleAddToJournalClick}
                disabled={isAdding}
                className="w-full flex items-center justify-center px-6 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
                <BookPlusIcon className="w-5 h-5 mr-2 text-amber-500 group-hover:scale-110 transition-transform" />
                {isAdding ? 'Mentés...' : 'Idővonal mentése a fogalomnaplóba'}
            </button>
        </div>

      </div>
       <style>{`
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
              animation: fade-in 0.5s ease-out forwards;
            }
          `}</style>
    </div>
  );
};
