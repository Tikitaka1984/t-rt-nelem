
import React, { useState } from 'react';
import { TOPICS, TOP_CONCEPTS } from '../constants';
import { AccordionItem } from './AccordionItem';
import { DiceIcon } from './icons/DiceIcon';
import { FeatherIcon } from './icons/FeatherIcon';
import { TimelineIcon } from './icons/TimelineIcon';
import { ScaleIcon } from './icons/ScaleIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { GamepadIcon } from './icons/GamepadIcon';

export interface SidePanelProps {
  onSearch: (term: string) => void;
  onShowEssayGenerator: () => void;
  onGenerateTimeline: (topic: string) => void;
  onShowGameHub: () => void; // New Prop
  onExport: () => void;
  isActionDisabled: boolean;
  isExportDisabled: boolean;
  onCompare: (concept1: string, concept2: string) => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
  userPoints: number; // New Prop
}

const getTopicColorClass = (topic: string): string => {
  if (['Ókor', 'Őskor'].some(t => topic.includes(t))) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
  if (topic.includes('Középkor')) return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800';
  if (topic.includes('Újkor')) return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  if (topic.includes('20. század')) return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  if (topic.includes('Magyar')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800';
  return 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300 border-gray-200 dark:border-slate-700';
};

export const SidePanel: React.FC<SidePanelProps> = ({ 
    onSearch, 
    onShowEssayGenerator, 
    onGenerateTimeline, 
    onShowGameHub,
    onExport, 
    isActionDisabled, 
    isExportDisabled,
    onCompare,
    onToggleDarkMode, 
    isDarkMode,
    userPoints,
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
    <div className="p-5 space-y-8">
      
      {/* Témakörök Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
           <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
           <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Történelmi Korszakok</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(TOPICS).map(topic => {
            const colorClass = getTopicColorClass(topic);
            const isActive = activeTopic === topic;
            return (
              <button
                key={topic}
                onClick={() => handleTopicClick(topic)}
                disabled={isActionDisabled}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 disabled:opacity-50 ${
                  isActive 
                    ? 'ring-2 ring-offset-1 ring-blue-400 dark:ring-offset-slate-900 scale-105 shadow-sm ' + colorClass
                    : 'hover:scale-105 hover:shadow-sm ' + colorClass
                }`}
              >
                {topic}
              </button>
            )
          })}
        </div>
        
        {/* Subtopics Dropdown */}
        <div className={`mt-3 overflow-hidden transition-all duration-300 ease-in-out ${activeTopic ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
             {activeTopic && (
              <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-slate-700 overflow-y-auto max-h-60 custom-scrollbar">
                <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2 uppercase">Fogalmak: {activeTopic}</h4>
                <ul className="space-y-1">
                  {(TOPICS[activeTopic as keyof typeof TOPICS]).map(term => (
                    <li key={term}>
                      <button
                        onClick={() => onSearch(term)}
                        disabled={isActionDisabled}
                        className="group flex items-center w-full text-left px-2 py-1.5 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 hover:shadow-sm transition-all"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-300 dark:bg-blue-700 mr-2 group-hover:bg-blue-500 transition-colors"></span>
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </section>

      {/* Top 100 Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
           <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
           <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Top 100 Érettségi Fogalom</h3>
        </div>
        <div className="space-y-2">
          {TOP_CONCEPTS.map(group => (
            <AccordionItem key={group.category} title={group.category}>
              <ul className="pt-2 space-y-1">
                {group.concepts.map(term => (
                  <li key={term}>
                    <button
                      onClick={() => onSearch(term)}
                      disabled={isActionDisabled}
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-slate-800 text-sm w-full text-left px-2 py-1.5 rounded transition-colors disabled:opacity-50"
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
          <div className="flex items-center gap-2 mb-4">
             <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
             <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Eszközök</h3>
          </div>
          
          <div className="space-y-4">

            {/* GAME BUTTON (FEATURED) */}
            <button 
                onClick={onShowGameHub}
                disabled={isActionDisabled}
                className="w-full relative overflow-hidden p-4 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all group text-left"
            >
                 <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
                 <div className="flex items-center justify-between relative z-10">
                    <div>
                        <h4 className="font-bold text-lg">Játékzóna</h4>
                        <p className="text-xs text-violet-100 opacity-90">Missziók & Kvíz</p>
                    </div>
                    <GamepadIcon className="w-8 h-8 text-white opacity-90 group-hover:rotate-12 transition-transform" />
                 </div>
                 {userPoints > 0 && (
                    <div className="mt-2 inline-block px-2 py-0.5 bg-black/20 rounded text-xs font-mono">
                        🏆 Pontjaid: {userPoints}
                    </div>
                 )}
            </button>

            {/* Comparison Tool */}
            <div className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                    <ScaleIcon className="w-4 h-4 text-cyan-500" />
                    <span>Összehasonlítás</span>
                </div>
                <form onSubmit={handleComparisonSubmit} className="space-y-2">
                    <input
                        type="text"
                        value={concept1}
                        onChange={(e) => setConcept1(e.target.value)}
                        placeholder="1. fogalom"
                        disabled={isActionDisabled}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                    />
                    <input
                        type="text"
                        value={concept2}
                        onChange={(e) => setConcept2(e.target.value)}
                        placeholder="2. fogalom"
                        disabled={isActionDisabled}
                        className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                    />
                    <button type="submit" disabled={isActionDisabled || !concept1.trim() || !concept2.trim()} className="w-full text-xs font-medium py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 text-cyan-600 dark:text-cyan-400 rounded-lg transition-all disabled:opacity-50">
                        Mehet
                    </button>
                </form>
            </div>

            {/* Timeline Tool */}
            <form onSubmit={handleTimelineSubmit} className="relative">
               <input
                type="text"
                value={timelineTopic}
                onChange={(e) => setTimelineTopic(e.target.value)}
                placeholder="Idővonal témája..."
                disabled={isActionDisabled}
                className="w-full pl-3 pr-10 py-2.5 text-sm bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={isActionDisabled || !timelineTopic.trim()}
                className="absolute right-1 top-1 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 dark:disabled:bg-slate-600"
              >
                <TimelineIcon className="w-4 h-4" />
              </button>
            </form>
            
            <div className="grid grid-cols-2 gap-2">
                 <button 
                    onClick={onShowEssayGenerator} 
                    disabled={isActionDisabled} 
                    className="flex flex-col items-center justify-center p-3 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                    <FeatherIcon className="w-6 h-6 text-green-600 dark:text-green-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold text-green-700 dark:text-green-300">Esszémotor</span>
                </button>
                
                 <button 
                    onClick={handleRandomConcept} 
                    disabled={isActionDisabled} 
                    className="flex flex-col items-center justify-center p-3 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                    <DiceIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mb-1 group-hover:rotate-180 transition-transform duration-500" />
                    <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">Random</span>
                </button>
            </div>
            
            <button 
                onClick={onExport} 
                disabled={isExportDisabled} 
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isExportDisabled 
                    ? 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                    : 'bg-gray-800 dark:bg-slate-700 text-white hover:bg-gray-900 dark:hover:bg-slate-600 shadow-md hover:shadow-lg'
                }`}
            >
                 <DownloadIcon className="w-5 h-5" /> Exportálás
            </button>
          </div>
      </section>
    </div>
  );
};
