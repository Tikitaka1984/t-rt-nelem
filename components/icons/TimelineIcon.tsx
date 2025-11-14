import React from 'react';

export const TimelineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        {...props}
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M3 3v1.5M3 21v-1.5m18 1.5V18M21 3V4.5M3 12h18M3 12a9 9 0 0 0-9 9m18-9a9 9 0 0 1-9 9m-9-9a9 9 0 0 1 9-9m9 9a9 9 0 0 0-9-9" 
        />
        <circle cx="8" cy="12" r="1.5" fill="currentColor" />
        <circle cx="16" cy="12" r="1.5" fill="currentColor" />
    </svg>
);
