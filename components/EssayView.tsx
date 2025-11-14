import React from 'react';

interface EssayViewProps {
  topic: string;
  text: string;
}

export const EssayView: React.FC<EssayViewProps> = ({ topic, text }) => {
  return (
    <div className="h-full bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 md:p-8 animate-fade-in">
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-full flex flex-col">
        <div className="flex-grow overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-2 border-b-2 border-green-500">{topic}</h2>
          
          <div className="space-y-4 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            {text.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
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
      </article>
    </div>
  );
};
