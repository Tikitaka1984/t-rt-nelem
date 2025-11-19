
import React, { useState, useEffect } from 'react';
import { Quest } from '../../types/gamification';
import { CheckIcon } from '../icons/CheckIcon';
import { ArrowRightIcon } from '../icons/ArrowRightIcon';

interface QuestModeProps {
  quests: Quest[];
  completedQuestIds: string[];
  onCompleteStep: (points: number) => void;
  onCompleteQuest: (questId: string, badgeId: string) => void;
}

export const QuestMode: React.FC<QuestModeProps> = ({ quests, completedQuestIds, onCompleteStep, onCompleteQuest }) => {
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());

  useEffect(() => {
    if (activeQuest) {
      setStepStartTime(Date.now());
    }
  }, [activeQuest, currentStepIndex]);

  const handleStartQuest = (quest: Quest) => {
    setActiveQuest(quest);
    setCurrentStepIndex(0);
  };

  const handleNextStep = () => {
    if (!activeQuest) return;

    // Calculate points based on speed (simple logic: < 10 seconds = bonus)
    const timeTaken = (Date.now() - stepStartTime) / 1000;
    let points = 10; // Base points
    if (timeTaken < 15) points += 5; // Speed bonus

    onCompleteStep(points);

    if (currentStepIndex < activeQuest.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Quest Completed
      onCompleteQuest(activeQuest.id, activeQuest.badgeId);
      setActiveQuest(null);
    }
  };

  if (!activeQuest) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
          <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100 mb-2">📜 Történelmi Missziók</h2>
          <p className="text-amber-800 dark:text-amber-200">Válassz egy küldetést és éld át a történelem sorsfordító pillanatait! Teljesíts minden lépést a kitűzőkért.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {quests.map(quest => {
            const isCompleted = completedQuestIds.includes(quest.id);
            return (
              <button
                key={quest.id}
                onClick={() => handleStartQuest(quest)}
                disabled={isCompleted}
                className={`relative text-left p-5 rounded-xl border transition-all hover:shadow-md group ${
                  isCompleted 
                    ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800 opacity-80' 
                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600'
                }`}
              >
                {isCompleted && (
                  <div className="absolute top-3 right-3 text-green-600 dark:text-green-400">
                    <CheckIcon className="w-6 h-6" />
                  </div>
                )}
                <span className={`inline-block px-2 py-1 text-[10px] uppercase font-bold rounded mb-2 ${
                    quest.difficulty === 'Könnyű' ? 'bg-green-100 text-green-700' :
                    quest.difficulty === 'Közepes' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                    {quest.difficulty}
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {quest.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{quest.description}</p>
                <div className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                    {quest.steps.length} Lépés • Kategória: {quest.category}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Quest View
  const step = activeQuest.steps[currentStepIndex];
  const progress = ((currentStepIndex) / activeQuest.steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header with Progress */}
      <div className="mb-8">
        <button 
            onClick={() => setActiveQuest(null)}
            className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 mb-4"
        >
            ← Vissza a listához
        </button>
        <div className="flex justify-between items-end mb-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{activeQuest.title}</h2>
            <span className="text-sm font-mono text-blue-600 dark:text-blue-400">{currentStepIndex + 1} / {activeQuest.steps.length}</span>
        </div>
        <div className="h-2 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
      </div>

      {/* Step Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
            <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold mb-2">
                {step.date}
            </div>
            <h3 className="text-2xl font-bold">{step.title}</h3>
        </div>
        
        <div className="p-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                {step.description}
            </p>
            
            <div className="flex justify-end">
                <button
                    onClick={handleNextStep}
                    className="group flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:scale-105 hover:shadow-lg transition-all"
                >
                    {currentStepIndex === activeQuest.steps.length - 1 ? 'Küldetés Befejezése' : 'Tovább a következőre'}
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
