import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Betöltés..."}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 opacity-60">
      <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="text-lg font-medium text-gray-600 dark:text-gray-300">{message}</p>
    </div>
  );
};
