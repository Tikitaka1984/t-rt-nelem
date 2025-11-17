import React, { useState, useEffect } from 'react';
import { Comparison } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon'; // Assuming CheckIcon exists

const ComparisonSection: React.FC<{ title: string; children: React.ReactNode; borderColor: string; }> = ({ title, children, borderColor }) => (
    <div className={`p-6 border-2 ${borderColor} rounded-xl bg-white dark:bg-gray-800 shadow-md`}>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">{title}</h3>
        {children}
    </div>
);

const DetailCard: React.FC<{ title: string; content: string; }> = ({ title, content }) => (
    <div>
        <h4 className="font-semibold text-lg text-gray-700 dark:text-gray-300 mb-2">{title}</h4>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{content}</p>
    </div>
);

export const ComparisonView: React.FC<{ comparison: Comparison }> = ({ comparison }) => {
    const [hasCopied, setHasCopied] = useState(false);

    const generateComparisonText = () => {
        let text = `Összehasonlítás: ${comparison.concept1} vs ${comparison.concept2}\n\n`;
        text += "HASONLÓSÁGOK:\n";
        comparison.similarities.forEach(s => text += `- ${s}\n`);
        text += "\nKÜLÖNBSÉGEK:\n";
        comparison.differences.forEach(d => text += `- ${d}\n`);
        text += `\nIDŐBELI KAPCSOLATOK:\n${comparison.temporalRelations}\n`;
        text += `\nPOLITIKAI/TÁRSADALMI KONTEXTUS:\n${comparison.context}\n`;
        text += `\nHOSSZÚ TÁVÚ HATÁSOK:\n${comparison.longTermImpacts}\n`;
        return text;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateComparisonText());
        setHasCopied(true);
    };

    useEffect(() => {
        if (hasCopied) {
            const timer = setTimeout(() => setHasCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [hasCopied]);

    return (
        <div className="bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 animate-fade-in">
            <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 relative">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">{comparison.concept1}</h2>
                    <p className="text-xl text-gray-500 dark:text-gray-400 my-2">vs</p>
                    <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">{comparison.concept2}</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="p-6 rounded-xl bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700">
                        <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-4">Hasonlóságok</h3>
                        <ul className="space-y-3 list-disc list-inside text-gray-700 dark:text-gray-300">
                            {comparison.similarities.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                    <div className="p-6 rounded-xl bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
                        <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4">Különbségek</h3>
                        <ul className="space-y-3 list-disc list-inside text-gray-700 dark:text-gray-300">
                            {comparison.differences.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    </div>
                </div>

                <div className="p-6 rounded-xl bg-gray-200 dark:bg-gray-700/50 space-y-6">
                     <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-4">Mélyebb Elemzés</h3>
                    <DetailCard title="Időbeli kapcsolatok" content={comparison.temporalRelations} />
                    <DetailCard title="Politikai és társadalmi kontextus" content={comparison.context} />
                    <DetailCard title="Hosszú távú hatások" content={comparison.longTermImpacts} />
                </div>
                
                 <div className="mt-8 text-center">
                    <button
                        onClick={handleCopy}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-gray-500 transition-all duration-300"
                    >
                        {hasCopied ? <CheckIcon className="w-5 h-5 mr-2" /> : <CopyIcon className="w-5 h-5 mr-2" />}
                        {hasCopied ? 'Másolva!' : 'Összehasonlítás másolása'}
                    </button>
                </div>

            </article>
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
