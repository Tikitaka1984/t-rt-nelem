import React, { useState } from 'react';
import { TOPICS, TOP_CONCEPTS } from '../constants';
import { AccordionItem } from './AccordionItem';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { DiceIcon } from './icons/DiceIcon';
import { FeatherIcon } from './icons/FeatherIcon';
import { TimelineIcon } from './icons/TimelineIcon';
import { ScaleIcon } from './icons/ScaleIcon';
import { DownloadIcon } from './icons/DownloadIcon';

export interface SidePanelProps {
  onSearch: (term: string) => void;
  onShowEssayGenerator: () => void;
  onGenerateTimeline: (topic: string) => void;
  onExport: () => void;
  isActionDisabled: boolean;
  isExportDisabled: boolean;
  onCompare: (concept1: string, concept2: string) => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}

export const SidePanel: React.FC<SidePanelProps> = ({ 
    onSearch, 
    onShowEssayGenerator, 
    onGenerateTimeline, 
    onExport, 
    isActionDisabled, 
    isExportDisabled,
    onCompare,
    onToggleDarkMode,
    isDarkMode,
}) => {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [timelineTopic, setTimelineTopic] = useState<string>('');
  const [concept1, setConcept1] = useState<string>('');
  const [concept2, setConcept2] = useState<string>('');

  const handleTopicClick = (topic: string) => {
    setActiveTopic(prev => (prev === topic ? null : topic));
  };
  
  const handleRandomConcept = () => {
    if (isActionDisabled) return;
    const allConcepts = TOP_CONCEPTS.flatMap(group => group.concepts);
    const randomConcept = allConcepts[Math.floor(Math.random() * allConcepts.length)];
    onSearch(randomConcept);
  };
  
  const handleTimelineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (timelineTopic.trim() && !isActionDisabled) {
      onGenerateTimeline(timelineTopic.trim());
      setTimelineTopic('');
    }
  }

  const handleComparisonSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (concept1.trim() && concept2.trim() && !isActionDisabled) {
      onCompare(concept1.trim(), concept2.trim());
      setConcept1('');
      setConcept2('');
    }
  };


  return (
    <div className="p-4 space-y-6">
      {/* Theme Toggle Section */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Beállítások</h3>
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 font-medium transition-colors"
          aria-label="Téma váltása"
        >
          <span>Téma váltása</span>
          {isDarkMode ? <SunIcon className="w-5 h-5 text-amber-500" /> : <MoonIcon className="w-5 h-5 text-cyan-500" />}
        </button>
      </section>

      {/* Témakörök Section */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Témakörök</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(TOPICS).map(topic => (
            <button
              key={topic}
              onClick={() => handleTopicClick(topic)}
              disabled={isActionDisabled}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                activeTopic === topic
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
        {activeTopic && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg max-h-48 overflow-y-auto">
            <ul className="space-y-1.5">
              {(TOPICS[activeTopic as keyof typeof TOPICS]).map(term => (
                <li key={term}>
                  <button
                    onClick={() => onSearch(term)}
                    disabled={isActionDisabled}
                    className="text-blue-600 dark:text-cyan-400 hover:underline text-sm w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {term}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Top 100 Section */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Top 100 érettségi fogalom</h3>
        <div className="space-y-1">
          {TOP_CONCEPTS.map(group => (
            <AccordionItem key={group.category} title={group.category}>
              <ul className="pt-2 space-y-1">
                {group.concepts.map(term => (
                  <li key={term}>
                    <button
                      onClick={() => onSearch(term)}
                      disabled={isActionDisabled}
                      className="text-blue-600 dark:text-cyan-400 hover:underline text-sm w-full text-left p-1 rounded disabled:opacity-50"
                    >
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            </AccordionItem>
          ))}
        </div>
      </section>
      
      {/* Tools Section */}
      <section>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">Eszközök</h3>
          <div className="space-y-3">
            <form onSubmit={handleComparisonSubmit} className="space-y-2">
                 <input
                    type="text"
                    value={concept1}
                    onChange={(e) => setConcept1(e.target.value)}
                    placeholder="1. fogalom"
                    disabled={isActionDisabled}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                  <input
                    type="text"
                    value={concept2}
                    onChange={(e) => setConcept2(e.target.value)}
                    placeholder="2. fogalom"
                    disabled={isActionDisabled}
                    className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                  />
                <button type="submit" disabled={isActionDisabled || !concept1.trim() || !concept2.trim()} className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 font-medium disabled:opacity-50 transition-colors">
                    <ScaleIcon className="w-5 h-5 text-cyan-500" /> Összehasonlítás
                </button>
            </form>

            <form onSubmit={handleTimelineSubmit} className="flex gap-2">
              <input
                type="text"
                value={timelineTopic}
                onChange={(e) => setTimelineTopic(e.target.value)}
                placeholder="Idővonal témája"
                disabled={isActionDisabled}
                className="flex-grow px-3 py-2 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              />
              <button
                type="submit"
                disabled={isActionDisabled || !timelineTopic.trim()}
                className="px-3 py-2 bg-blue-600 text-white font-medium rounded-lg hover:shadow-md transition-all disabled:bg-gray-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
              >
                <TimelineIcon className="w-5 h-5" />
              </button>
            </form>
            <button onClick={onShowEssayGenerator} disabled={isActionDisabled} className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 font-medium disabled:opacity-50 transition-colors">
                <FeatherIcon className="w-5 h-5 text-green-500" /> Esszémotor
            </button>
             <button onClick={handleRandomConcept} disabled={isActionDisabled} className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 font-medium disabled:opacity-50 transition-colors">
                <DiceIcon className="w-5 h-5 text-indigo-500" /> Random fogalom
            </button>
            <button onClick={onExport} disabled={isExportDisabled} className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 font-medium disabled:opacity-50 transition-colors">
                 <DownloadIcon className="w-5 h-5 text-gray-500" /> Exportálás
            </button>
          </div>
      </section>
    </div>
  );
};
