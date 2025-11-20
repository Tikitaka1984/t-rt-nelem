
import React, { useState, useMemo } from 'react';
import { TimelineEvent, EventCategory } from '../types';
import { BookPlusIcon } from './icons/BookPlusIcon';
import { SearchIcon } from './icons/SearchIcon';

interface TimelineViewProps {
  topic: string;
  events: TimelineEvent[];
  onEventClick: (eventName: string) => void;
  onAddToJournal: (term: string, definition: string) => void;
  onDateClick: (date: string) => void;
}

const getCategoryColor = (category?: EventCategory) => {
    switch (category) {
        case 'politikai': return 'bg-blue-500 text-white border-blue-600';
        case 'katonai': return 'bg-red-600 text-white border-red-700';
        case 'gazdasagi': return 'bg-green-600 text-white border-green-700';
        case 'kulturalis': return 'bg-purple-500 text-white border-purple-600';
        case 'vallasi': return 'bg-amber-500 text-white border-amber-600';
        default: return 'bg-gray-500 text-white border-gray-600';
    }
};

const getCategoryLabel = (category?: EventCategory) => {
    switch (category) {
        case 'politikai': return 'Politikai';
        case 'katonai': return 'Katonai';
        case 'gazdasagi': return 'Gazdasági';
        case 'kulturalis': return 'Kulturális';
        case 'vallasi': return 'Vallási';
        default: return 'Egyéb';
    }
};

export const TimelineView: React.FC<TimelineViewProps> = ({ topic, events, onEventClick, onAddToJournal, onDateClick }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | 'all'>('all');

  const filteredEvents = useMemo(() => {
      if (selectedCategory === 'all') return events;
      return events.filter(e => (e.category || 'egyeb') === selectedCategory);
  }, [events, selectedCategory]);

  const handleAddToJournalClick = () => {
    setIsAdding(true);
    const term = `Idővonal: ${topic}`;
    const dateRange = events.length > 0 ? `${events[0].date} - ${events[events.length - 1].date}` : '';
    const definition = `Idővonal (${events.length} esemény). Időszak: ${dateRange}. Kulcsesemények: ${events.slice(0, 3).map(e => e.title).join(', ')}...`;
    
    onAddToJournal(term, definition);
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="h-full flex flex-col animate-fade-in bg-gray-50 dark:bg-slate-950 overflow-hidden">
      
      {/* Header & Filters */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <span className="inline-block px-3 py-1 mb-2 text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-900/30 rounded-full">
                        Történelmi Idővonal
                    </span>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-serif">{topic}</h2>
                </div>
                <div className="text-right hidden md:block">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                        {events.length > 0 ? `${events[0].date} — ${events[events.length - 1].date}` : ''}
                    </span>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                {['all', 'politikai', 'katonai', 'gazdasagi', 'kulturalis', 'vallasi', 'egyeb'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat as any)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                            selectedCategory === cat
                            ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 dark:bg-slate-800 dark:text-gray-300 dark:border-slate-700'
                        }`}
                    >
                        {cat === 'all' ? 'Minden esemény' : getCategoryLabel(cat as EventCategory)}
                    </button>
                ))}
            </div>
          </div>
      </div>

      {/* Scrollable Timeline Area */}
      <div className="flex-grow overflow-y-auto custom-scrollbar p-4 md:p-8 relative">
         <div className="max-w-4xl mx-auto relative">
             {/* Continuous Center Line */}
             <div className="absolute left-4 md:left-1/2 w-0.5 h-full bg-gray-200 dark:bg-slate-800 md:-translate-x-1/2 rounded-full"></div>

             {filteredEvents.length === 0 ? (
                 <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-900 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
                     Nincs a szűrésnek megfelelő esemény ebben a kategóriában.
                 </div>
             ) : (
                filteredEvents.map((event, index) => {
                    const isLeft = index % 2 === 0;
                    const importance = event.importance || 5;
                    const isImportant = importance >= 8;
                    
                    return (
                        <div key={index} className={`relative mb-12 flex flex-col md:flex-row items-center w-full group ${isImportant ? 'md:mb-16' : ''}`}>
                            
                            {/* Left Side */}
                            <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${isLeft ? 'md:text-right md:pr-8' : 'md:hidden'}`}>
                                {isLeft && <EventCard event={event} onEventClick={onEventClick} onDateClick={onDateClick} isImportant={isImportant} />}
                            </div>

                            {/* Center Node */}
                            <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 z-20 flex items-center justify-center">
                                <div className={`
                                    rounded-full shadow-lg border-4 border-white dark:border-slate-950 transition-all duration-300 group-hover:scale-125
                                    ${getCategoryColor(event.category)}
                                    ${isImportant ? 'w-6 h-6 ring-4 ring-opacity-30 ring-yellow-400' : 'w-4 h-4'}
                                `}></div>
                            </div>

                            {/* Right Side */}
                            <div className={`w-full md:w-5/12 pl-12 md:pl-0 ${!isLeft ? 'md:text-left md:pl-8' : 'md:hidden'}`}>
                                {!isLeft && <EventCard event={event} onEventClick={onEventClick} onDateClick={onDateClick} isImportant={isImportant} />}
                            </div>
                            
                            {/* Mobile View (Always rendered for right side logic simplification, but visible based on flex order in mobile) */}
                             <div className="md:hidden w-full pl-12 mt-2">
                                <EventCard event={event} onEventClick={onEventClick} onDateClick={onDateClick} isImportant={isImportant} />
                            </div>

                        </div>
                    );
                })
             )}
         </div>
         
          <div className="max-w-2xl mx-auto mt-12 mb-8">
            <button
                onClick={handleAddToJournalClick}
                disabled={isAdding}
                className="w-full flex items-center justify-center px-6 py-4 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-semibold rounded-2xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
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

const EventCard: React.FC<{ 
    event: TimelineEvent, 
    onEventClick: (n: string) => void, 
    onDateClick: (d: string) => void,
    isImportant: boolean
}> = ({ event, onEventClick, onDateClick, isImportant }) => {
    return (
        <div className={`
            relative bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md
            ${isImportant 
                ? 'border-l-4 border-l-yellow-400 border-y-gray-200 border-r-gray-200 dark:border-y-slate-700 dark:border-r-slate-700' 
                : 'border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
            }
        `}>
            {isImportant && (
                <div className="absolute -top-3 -right-2">
                    <span className="text-lg animate-pulse" title="Kiemelt esemény">🌟</span>
                </div>
            )}
            
            <div className="flex items-center justify-between mb-2">
                 <button 
                    onClick={(e) => { e.stopPropagation(); onDateClick(event.date); }}
                    className="flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-2 py-1 rounded-md transition-colors -ml-2"
                    title={`Keresés: ${event.date}`}
                >
                    <SearchIcon className="w-3 h-3" />
                    {event.date}
                </button>
                {event.category && (
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${getCategoryColor(event.category)} bg-opacity-10 text-opacity-100 !bg-transparent border !text-gray-500 dark:!text-gray-400`}>
                        {getCategoryLabel(event.category)}
                    </span>
                )}
            </div>
            
            <h3 className={`font-bold text-gray-900 dark:text-gray-100 mb-2 leading-tight ${isImportant ? 'text-xl' : 'text-lg'}`}>
                {event.title}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all">
                {event.description}
            </p>
            
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-end">
                <button 
                    onClick={() => onEventClick(event.title)}
                    className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
                >
                    Részletes elemzés →
                </button>
            </div>
        </div>
    );
};
