import React from 'react';

interface ToastProps {
  message: string;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow-lg animate-toast-in-out">
        {message}
      </div>
       <style>{`
        @keyframes toast-in-out {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          20% {
            transform: translateY(0);
            opacity: 1;
          }
          80% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(20px);
            opacity: 0;
          }
        }
        .animate-toast-in-out {
          animation: toast-in-out 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};
