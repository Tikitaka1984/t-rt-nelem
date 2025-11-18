import React from 'react';
import { TimelineEvent } from '../types';

interface TimelineViewProps {
  topic: string;
  events: TimelineEvent[];
  onEventClick: (eventName: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ topic, events, onEventClick }) => {
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
                       <span className="text-3xl font-black text-purple-200 dark:text-purple-900/50 select-none absolute -top-4 right-0 opacity-50 group-hover:opacity-100 transition-opacity">{event.date}</span>
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
                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400 block mb-1">{event.date}</span>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{event.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{event.description}</p>
                         <button onClick={() => onEventClick(event.title)} className="mt-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">Részletek &rarr;</button>
                  </div>

                   {/* Desktop View (Right side content for odd items) */}
                  {index % 2 !== 0 && (
                    <div className="hidden md:block text-left">
                       <span className="text-3xl font-black text-purple-200 dark:text-purple-900/50 select-none absolute -top-4 left-0 opacity-50 group-hover:opacity-100 transition-opacity">{event.date}</span>
                       <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 relative z-10">{event.title}</h3>
                       <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{event.description}</p>
                       <button onClick={() => onEventClick(event.title)} className="mt-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline">Részletek &rarr;</button>
                    </div>
                 )}
              </div>
            </div>
          ))}
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