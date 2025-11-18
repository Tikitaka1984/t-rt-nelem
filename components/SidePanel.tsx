import React, { useState } from 'react';
import { TOPICS, TOP_CONCEPTS } from '../constants';
import { AccordionItem } from './AccordionItem';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { DiceIcon } from './icons/DiceIcon';
import { FeatherIcon } from './icons/FeatherIcon';
import { TimelineIcon } from './icons/TimelineIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { ScaleIcon } from './icons/ScaleIcon';

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
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}

export const SidePanel: React.FC<SidePanelProps> = ({ 
    onSearch, 
    onShowEssayGenerator, 
    onGenerateTimeline, 
    onShowJournal,
    journalItemCount,
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
    // FIX: Corrected typo from TOP_CONCEPts to TOP_CONCEPTS.
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
    <div className="p-6 space-y-8">
      {/* Theme Toggle Section */}
      <section>
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-[#e0e0e0]">Téma váltása</h3>
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center justify-between px-4 py-3 bg-gray-200 dark:bg-[#16213e] hover:bg-gray-300 dark:hover:bg-[#2a2a4e] font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[#0f3460] focus:ring-blue-500 transition-colors"
          aria-label="Téma váltása"
        >
          <span>{isDarkMode ? 'Világos mód' : 'Sötét mód'}</span>
          {isDarkMode ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-indigo-400" />}
        </button>
      </section>

      {/* Témakörök Section */}
      <section>
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-[#e0e0e0]">Témakörök</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.keys(TOPICS).map(topic => (
            <button
              key={topic}
              onClick={() => handleTopicClick(topic)}
              disabled={isActionDisabled}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[#0f3460] focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                activeTopic === topic
                  ? 'bg-blue-600 text-white dark:bg-[#16c784]'
                  : 'bg-gray-200 dark:bg-[#16213e] hover:bg-gray-300 dark:hover:bg-[#2a2a4e]'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
        {activeTopic && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-[#16213e]/50 rounded-lg max-h-48 overflow-y-auto">
            <ul className="space-y-2">
              {(TOPICS[activeTopic as keyof typeof TOPICS]).map(term => (
                <li key={term}>
                  <button
                    onClick={() => onSearch(term)}
                    disabled={isActionDisabled}
                    className="text-blue-600 dark:text-blue-400 hover:underline w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
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
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-[#e0e0e0]">Top 100 érettségi fogalom</h3>
        <div className="space-y-2">
          {TOP_CONCEPTS.map(group => (
            <AccordionItem key={group.category} title={group.category}>
              <ul className="pt-2 space-y-1">
                {group.concepts.map(term => (
                  <li key={term}>
                    <button
                      onClick={() => onSearch(term)}
                      disabled={isActionDisabled}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm w-full text-left p-1 rounded disabled:opacity-50"
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
      
      {/* Random Concept Section */}
      <section>
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-[#e0e0e0]">Random fogalom gyakorlása</h3>
          <button
            onClick={handleRandomConcept}
            disabled={isActionDisabled}
            className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[#0f3460] focus:ring-indigo-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <DiceIcon className="w-5 h-5 mr-2" />
            Adj egy véletlen érettségi fogalmat
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">Írd le saját szavaiddal a fogalmat, majd hasonlítsd össze a definícióval!</p>
      </section>

      {/* Journal Section */}
      <section>
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-[#e0e0e0]">Fogalomnapló</h3>
        <button
          onClick={onShowJournal}
          disabled={isActionDisabled}
          className="w-full relative flex items-center justify-center px-4 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[#0f3460] focus:ring-amber-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <BookOpenIcon className="w-5 h-5 mr-2" />
          Fogalomnapló megjelenítése
          {journalItemCount > 0 && (
            <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-600 rounded-full">
              {journalItemCount}
            </span>
          )}
        </button>
      </section>
      
      {/* Essay Generator Section */}
      <section>
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-[#e0e0e0]">Érettségi Esszémotor (AI)</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Indítsd el a mesterséges intelligencia alapú esszéíró modult, ahol részletes beállításokkal készíthetsz vázlatot, teljes esszét vagy forráselemzést.</p>
        <button
            onClick={onShowEssayGenerator}
            disabled={isActionDisabled}
            className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[#0f3460] focus:ring-green-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
            <FeatherIcon className="w-5 h-5 mr-2" />
            Esszémotor indítása
        </button>
      </section>

      {/* Timeline Generator Section */}
      <section>
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-[#e0e0e0]">Interaktív Idővonal</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Generálj vizuális idővonalat egy történelmi korszak vagy eseménysorozat legfontosabb pontjaiból.</p>
        <form onSubmit={handleTimelineSubmit} className="flex gap-2">
          <input
            type="text"
            value={timelineTopic}
            onChange={(e) => setTimelineTopic(e.target.value)}
            placeholder="Téma, pl. 'Francia forradalom'"
            disabled={isActionDisabled}
            className="flex-grow px-3 py-2 bg-gray-50 dark:bg-[#16213e] border border-gray-300 dark:border-[#2a2a4e] rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm"
          />
          <button
            type="submit"
            disabled={isActionDisabled || !timelineTopic.trim()}
            className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[#0f3460] focus:ring-purple-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
             <TimelineIcon className="w-5 h-5" />
          </button>
        </form>
      </section>

      {/* Comparison Section */}
      <section>
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-[#e0e0e0]">Fogalmak Összehasonlítása</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Hasonlíts össze két történelmi fogalmat, eseményt vagy személyt.</p>
        <form onSubmit={handleComparisonSubmit} className="space-y-3">
          <input
            type="text"
            value={concept1}
            onChange={(e) => setConcept1(e.target.value)}
            placeholder="1. fogalom, pl. 'Jakobinus diktatúra'"
            disabled={isActionDisabled}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-[#16213e] border border-gray-300 dark:border-[#2a2a4e] rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm"
          />
          <input
            type="text"
            value={concept2}
            onChange={(e) => setConcept2(e.target.value)}
            placeholder="2. fogalom, pl. 'Sztálini diktatúra'"
            disabled={isActionDisabled}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-[#16213e] border border-gray-300 dark:border-[#2a2a4e] rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm"
          />
          <button
            type="submit"
            disabled={isActionDisabled || !concept1.trim() || !concept2.trim()}
            className="w-full flex items-center justify-center px-4 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[#0f3460] focus:ring-cyan-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
             <ScaleIcon className="w-5 h-5 mr-2" />
             Hasonlítsd össze!
          </button>
        </form>
      </section>

      {/* Export Section */}
      <section>
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-[#e0e0e0]">Exportálás</h3>
        <button
          onClick={onExport}
          disabled={isExportDisabled}
          className="w-full px-4 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-[#0f3460] focus:ring-gray-500 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed"
        >
          Exportálás / másolás Word számára
        </button>
      </section>
    </div>
  );
};