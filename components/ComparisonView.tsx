
import React, { useState } from 'react';
import { ComparisonData } from '../types';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { BookPlusIcon } from './icons/BookPlusIcon';

const ItemCard: React.FC<{ item: ComparisonData['item1'], bgColor: string, darkBgColor: string, darkBorderColor: string }> = ({ item, bgColor, darkBgColor, darkBorderColor }) => (
    <div className={`p-6 rounded-2xl shadow-lg ${bgColor} ${darkBgColor} h-full flex flex-col border ${darkBorderColor} transition-colors duration-300`}>
        <h3 className="text-2xl font-bold mb-2 text-gray-800 dark:text-[#e0e0e0]">{item.title}</h3>
        {item.date && <p className="font-semibold text-gray-600 dark:text-gray-300 mb-3">{item.date}</p>}
        <div className="flex-grow space-y-4 text-gray-700 dark:text-gray-400">
            <p>{item.description}</p>
            <p><span className="font-bold text-gray-800 dark:text-[#e0e0e0]">Jelentőség:</span> {item.significance}</p>
        </div>
    </div>
);

const Section: React.FC<{ title: string, children: React.ReactNode, className?: string }> = ({ title, children, className = '' }) => (
    <div className={`p-6 rounded-2xl shadow-lg ${className} transition-colors duration-300`}>
        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-[#e0e0e0]">{title}</h3>
        {children}
    </div>
);

interface ComparisonViewProps {
    comparison: ComparisonData;
    onAddToJournal: (term: string, definition: string) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ comparison, onAddToJournal }) => {
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToJournalClick = () => {
        setIsAdding(true);
        const term = `Összehasonlítás: ${comparison.item1.title} vs ${comparison.item2.title}`;
        const definition = `Összehasonlítás. Hasonlóságok: ${comparison.similarities.length} db, Különbségek: ${comparison.differences.length} db. Kapcsolat: ${comparison.temporalRelation}`;
        
        onAddToJournal(term, definition);
        
        setTimeout(() => setIsAdding(false), 1000);
    };

    return (
        <div className="p-2 sm:p-4 md:p-6 animate-fade-in space-y-8">
             <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 dark:text-[#e0e0e0]">{`Összehasonlítás`}</h2>
            </div>
            {/* Item Details */}
            <div className="grid md:grid-cols-2 gap-8">
                <ItemCard item={comparison.item1} bgColor="bg-blue-50" darkBgColor="dark:bg-[#16213e]" darkBorderColor="dark:border-blue-700" />
                <ItemCard item={comparison.item2} bgColor="bg-green-50" darkBgColor="dark:bg-[#16213e]" darkBorderColor="dark:border-green-700" />
            </div>

            {/* Similarities & Differences */}
            <div className="grid lg:grid-cols-2 gap-8">
                <Section title="Hasonlóságok" className="bg-teal-50 dark:bg-[#16213e] border border-teal-200 dark:border-teal-700">
                    <ul className="space-y-3 list-disc list-inside text-gray-700 dark:text-gray-300">
                        {comparison.similarities.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </Section>
                 <Section title="Különbségek" className="bg-rose-50 dark:bg-[#16213e] border border-rose-200 dark:border-rose-700">
                    <ul className="space-y-3 list-disc list-inside text-gray-700 dark:text-gray-300">
                        {comparison.differences.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                </Section>
            </div>

            {/* Deeper Analysis */}
            <Section title="Összefüggések Elemzése" className="bg-gray-100 dark:bg-[#16213e]">
                <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-lg mb-2 text-gray-800 dark:text-[#e0e0e0]">Időbeli Kapcsolat</h4>
                        <p className="text-gray-600 dark:text-gray-400">{comparison.temporalRelation}</p>
                    </div>
                     <div className="border-t border-gray-200 dark:border-[#2a2a4e] pt-6">
                        <h4 className="font-semibold text-lg mb-2 text-gray-800 dark:text-[#e0e0e0]">Történelmi Kontextus</h4>
                        <p className="text-gray-600 dark:text-gray-400">{comparison.historicalContext}</p>
                    </div>
                     <div className="border-t border-gray-200 dark:border-[#2a2a4e] pt-6">
                        <h4 className="font-semibold text-lg mb-2 flex items-center text-gray-800 dark:text-[#e0e0e0]">
                            <ArrowRightIcon className="w-5 h-5 mr-2 text-indigo-500" />
                            Ok-okozati viszony és hatások
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">{comparison.causality}</p>
                    </div>
                </div>
            </Section>
            
            <div className="p-6 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800 rounded-xl">
                <button
                    onClick={handleAddToJournalClick}
                    disabled={isAdding}
                    className="w-full flex items-center justify-center px-6 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    <BookPlusIcon className="w-5 h-5 mr-2 text-amber-500 group-hover:scale-110 transition-transform" />
                    {isAdding ? 'Mentés...' : 'Összehasonlítás mentése a fogalomnaplóba'}
                </button>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
