
import React from 'react';
import { BADGES } from '../../data/gameData';

interface BadgeDisplayProps {
  earnedBadgeIds: string[];
}

export const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ earnedBadgeIds }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center">
        <span className="mr-2">🏆</span> Kitűzőim & Eredmények
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {BADGES.map((badge) => {
          const isEarned = earnedBadgeIds.includes(badge.id);
          return (
            <div
              key={badge.id}
              className={`relative group flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                isEarned
                  ? `bg-gradient-to-br ${badge.colorClass} border-transparent text-white shadow-lg scale-105`
                  : 'bg-gray-100 dark:bg-slate-900 border-gray-200 dark:border-slate-700 text-gray-400 grayscale opacity-70'
              }`}
            >
              <div className="text-3xl mb-2 drop-shadow-md">{badge.icon}</div>
              <span className="text-xs font-bold text-center leading-tight">{badge.title}</span>
              
              {/* Tooltip */}
              <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 w-40 bg-black/80 text-white text-xs p-2 rounded-lg pointer-events-none transition-opacity z-10 text-center">
                {badge.description}
                {!isEarned && <div className="mt-1 text-gray-400 font-mono text-[10px] uppercase">(Zárolva)</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
