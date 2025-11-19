
import React, { useState } from 'react';
import { BadgeDisplay } from './BadgeDisplay';
import { QuestMode } from './QuestMode';
import { DetectiveMode } from './DetectiveMode';
import { UserProgress } from '../../types/gamification';
import { QUESTS, DETECTIVE_CHALLENGES, BADGES } from '../../data/gameData';
import { TrophyIcon } from '../icons/TrophyIcon';
import { GamepadIcon } from '../icons/GamepadIcon';

interface GameHubProps {
  userProgress: UserProgress;
  onUpdateProgress: (newProgress: UserProgress) => void;
}

export const GameHub: React.FC<GameHubProps> = ({ userProgress, onUpdateProgress }) => {
  const [activeTab, setActiveTab] = useState<'quests' | 'detective'>('quests');

  const handleQuestStepComplete = (points: number) => {
    onUpdateProgress({
      ...userProgress,
      totalPoints: userProgress.totalPoints + points,
    });
  };

  const handleQuestComplete = (questId: string, badgeId: string) => {
    const newBadges = [...userProgress.earnedBadgeIds];
    if (!newBadges.includes(badgeId)) {
      newBadges.push(badgeId);
    }

    const newCompletedQuests = [...userProgress.completedQuestIds];
    if (!newCompletedQuests.includes(questId)) {
      newCompletedQuests.push(questId);
    }

    onUpdateProgress({
      ...userProgress,
      totalPoints: userProgress.totalPoints + 50, // Bonus for finishing quest
      earnedBadgeIds: newBadges,
      completedQuestIds: newCompletedQuests,
    });
  };

  const handleDetectiveScore = (points: number, isCorrect: boolean) => {
    let newStreak = isCorrect ? userProgress.detectiveStreak + 1 : 0;
    let newBadges = [...userProgress.earnedBadgeIds];

    // Check for Detective Master badge (3 streak)
    if (newStreak >= 3 && !newBadges.includes('detective_master')) {
        newBadges.push('detective_master');
    }
    
    // Check for Novice Historian badge (50 points)
    if (userProgress.totalPoints + points >= 50 && !newBadges.includes('novice_historian')) {
         if (!newBadges.includes('novice_historian')) newBadges.push('novice_historian');
    }

    onUpdateProgress({
      ...userProgress,
      totalPoints: userProgress.totalPoints + points,
      detectiveStreak: newStreak,
      earnedBadgeIds: newBadges,
    });
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      {/* Game Header */}
      <div className="bg-white dark:bg-slate-900 p-6 border-b border-gray-200 dark:border-slate-800 mb-6">
         <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg">
                        <GamepadIcon className="w-6 h-6" />
                    </div>
                    Történelmi Játékzóna
                </h1>
            </div>
            
            {/* Points Display */}
            <div className="flex items-center gap-4 bg-gray-100 dark:bg-slate-800 rounded-full px-6 py-2 border border-gray-200 dark:border-slate-700">
                <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Összpontszám</span>
                    <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{userProgress.totalPoints.toLocaleString()}</span>
                </div>
                <TrophyIcon className="w-8 h-8 text-amber-500" />
            </div>
         </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 pb-12 flex-grow flex flex-col gap-8">
        
        {/* Badge Showcase */}
        <BadgeDisplay earnedBadgeIds={userProgress.earnedBadgeIds} />

        {/* Game Mode Switcher */}
        <div className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-800 overflow-hidden min-h-[500px]">
            <div className="flex border-b border-gray-200 dark:border-slate-800">
                <button
                    onClick={() => setActiveTab('quests')}
                    className={`flex-1 py-4 text-center font-bold transition-colors ${
                        activeTab === 'quests' 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500' 
                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                >
                    🎮 Történelmi Missziók
                </button>
                <button
                    onClick={() => setActiveTab('detective')}
                    className={`flex-1 py-4 text-center font-bold transition-colors ${
                        activeTab === 'detective' 
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' 
                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800'
                    }`}
                >
                    🔎 Valódi vagy Hamis?
                </button>
            </div>

            <div className="p-6 md:p-8 flex-grow">
                {activeTab === 'quests' ? (
                    <QuestMode 
                        quests={QUESTS} 
                        completedQuestIds={userProgress.completedQuestIds}
                        onCompleteStep={handleQuestStepComplete}
                        onCompleteQuest={handleQuestComplete}
                    />
                ) : (
                    <DetectiveMode 
                        challenges={DETECTIVE_CHALLENGES}
                        onScore={handleDetectiveScore}
                    />
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
