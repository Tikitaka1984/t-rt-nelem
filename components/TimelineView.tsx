import React from 'react';
import { TimelineEvent } from '../types';

interface TimelineViewProps {
  topic: string;
  events: TimelineEvent[];
  onEventClick: (eventName: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ topic, events, onEventClick }) => {
  return (
    <div className="h-full bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 md:p-8 animate-fade-in overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8 pb-3 border-b-2 border-purple-500">{topic}</h2>
        
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 w-0.5 h-full bg-gray-300 dark:bg-gray-600 -translate-x-1/2"></div>

          {events.map((event, index) => (
            <div key={index} className="relative mb-8 flex justify-between items-center w-full">
              {/* Left or Right alignment */}
              <div className={`w-5/12 ${index % 2 === 0 ? 'order-1' : 'order-3'}`}></div>
              <div className="z-10 order-2">
                <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
              </div>
              <button
                onClick={() => onEventClick(event.title)}
                className={`w-5/12 p-4 rounded-lg shadow-lg text-left bg-white dark:bg-gray-800 hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${index % 2 === 0 ? 'order-3' : 'order-1'}`}
              >
                <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-1">{event.date}</p>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{event.description}</p>
              </button>
            </div>
          ))}
        </div>
      </div>
       <style>{`
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in {
              animation: fade-in 0.4s ease-out forwards;
            }
          `}</style>
    </div>
  );
};