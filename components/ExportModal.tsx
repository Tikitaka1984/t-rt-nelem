import React, { useState, useEffect, useId } from 'react';
import { Article, TimelineEvent, ComparisonData } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { CopyIcon } from './icons/CopyIcon';

interface ExportModalProps {
  content: Article | { topic: string, events: TimelineEvent[] } | ComparisonData;
  type: 'article' | 'timeline' | 'comparison';
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ content, type, onClose }) => {
  const [hasCopied, setHasCopied] = useState(false);
  const titleId = useId();

  const getExportText = () => {
    switch(type) {
      case 'article': {
        const article = content as Article;
        let text = `Cím: ${article.title}\n\n`;
        text += `Definíció:\n${article.definition.replace(/\*/g, '')}\n\n`;
        text += `Kapcsolódó fogalmak:\n`;
        article.relatedConcepts.forEach(c => {
          text += `- ${c.term}: ${c.explanation}\n`;
        });
        return text;
      }
      case 'timeline': {
        const timeline = content as { topic: string, events: TimelineEvent[] };
        let text = `Idővonal: ${timeline.topic}\n\n`;
        timeline.events.forEach(event => {
          text += `Dátum: ${event.date}\n`;
          text += `Esemény: ${event.title}\n`;
          text += `Leírás: ${event.description}\n\n`;
        });
        return text;
      }
      case 'comparison': {
        const comparison = content as ComparisonData;
        let text = `ÖSSZEHASONLÍTÁS: ${comparison.item1.title} vs ${comparison.item2.title}\n\n`;
        text += `========================\nHASONLÓSÁGOK\n========================\n`;
        comparison.similarities.forEach(s => text += `• ${s}\n`);
        text += `\n========================\nKÜLÖNBSÉGEK\n========================\n`;
        comparison.differences.forEach(d => text += `• ${d}\n`);
        text += `\n========================\nÖSSZEFÜGGÉSEK ELEMZÉSE\n========================\n`;
        text += `\nIdőbeli kapcsolat:\n${comparison.temporalRelation}\n`;
        text += `\nTörténelmi kontextus:\n${comparison.historicalContext}\n`;
        text += `\nOk-okozati viszony és hatások:\n${comparison.causality}\n`;
        return text;
      }
      default:
        return "Nincs exportálható tartalom.";
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportText());
    setHasCopied(true);
  };
  
  useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => setHasCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasCopied]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl m-4 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 id={titleId} className="text-xl font-semibold">Exportálás / Másolás</h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Bezárás">
              <CloseIcon className="w-6 h-6" />
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Másold ki ezt a szöveget, és illeszd be Word dokumentumba vagy Google Docs-ba.</p>
          <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-md max-h-96 overflow-y-auto whitespace-pre-wrap text-sm">
            {getExportText()}
          </div>
          <button
            onClick={handleCopy}
            className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors"
          >
            <CopyIcon className="w-5 h-5 mr-2" />
            {hasCopied ? 'Másolva!' : 'Másolás vágólapra'}
          </button>
        </div>
      </div>
    </div>
  );
};
