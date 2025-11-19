
import React, { useState } from 'react';
import { DetectiveChallenge } from '../../types/gamification';
import { CheckIcon } from '../icons/CheckIcon';
import { CloseIcon } from '../icons/CloseIcon';

interface DetectiveModeProps {
  challenges: DetectiveChallenge[];
  onScore: (points: number, isCorrect: boolean) => void;
}

export const DetectiveMode: React.FC<DetectiveModeProps> = ({ challenges, onScore }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentChallenge = challenges[currentIndex % challenges.length]; // Loop through challenges

  const handleGuess = (guessTrue: boolean) => {
    if (hasGuessed) return;

    const correct = guessTrue === currentChallenge.isTrue;
    setIsCorrect(correct);
    setHasGuessed(true);
    
    // 20 points for correct answer, 0 for incorrect
    onScore(correct ? 20 : 0, correct);
  };

  const handleNext = () => {
    setHasGuessed(false);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 rounded-xl border border-indigo-200 dark:border-indigo-800 mb-8 text-center">
        <h2 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">🔎 Történelmi Nyomozó</h2>
        <p className="text-indigo-800 dark:text-indigo-200">Döntsd el az alábbi állításról, hogy <span className="font-bold">IGAZ</span> vagy <span className="font-bold">HAMIS</span>!</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700 relative min-h-[300px] flex flex-col">
        
        {/* Challenge Card */}
        <div className="p-8 flex-grow flex flex-col items-center justify-center text-center">
           <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">Ügyszám: #{currentChallenge.id.toUpperCase()}</span>
           <h3 className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-100 leading-relaxed">
             "{currentChallenge.statement}"
           </h3>
           <div className="mt-4 inline-block px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-full text-xs text-gray-500 dark:text-gray-400">
             Téma: {currentChallenge.topic}
           </div>
        </div>

        {/* Action Buttons (or Feedback) */}
        {!hasGuessed ? (
          <div className="grid grid-cols-2 border-t border-gray-100 dark:border-slate-700">
             <button
                onClick={() => handleGuess(true)}
                className="p-6 text-lg font-bold text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex flex-col items-center justify-center gap-2 border-r border-gray-100 dark:border-slate-700"
             >
                <CheckIcon className="w-8 h-8" />
                IGAZ
             </button>
             <button
                onClick={() => handleGuess(false)}
                className="p-6 text-lg font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex flex-col items-center justify-center gap-2"
             >
                <CloseIcon className="w-8 h-8" />
                HAMIS
             </button>
          </div>
        ) : (
          <div className={`p-6 animate-fade-in border-t-4 ${isCorrect ? 'bg-green-50 dark:bg-green-900/10 border-green-500' : 'bg-red-50 dark:bg-red-900/10 border-red-500'}`}>
             <div className="flex items-center gap-3 mb-3">
                {isCorrect ? (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <CheckIcon className="w-5 h-5" />
                    </div>
                ) : (
                     <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <CloseIcon className="w-5 h-5" />
                    </div>
                )}
                <h4 className={`text-xl font-bold ${isCorrect ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                    {isCorrect ? 'Helyes meglátás!' : 'Sajnos tévedtél.'}
                </h4>
             </div>
             
             <p className="text-gray-700 dark:text-gray-300 mb-6 ml-11">
                {currentChallenge.explanation}
             </p>
             
             <div className="flex justify-end">
                 <button 
                    onClick={handleNext}
                    className="px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold hover:shadow-lg transition-all"
                 >
                    Következő nyomozás →
                 </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
