
import React, { useState } from "react";
import { generateEssay } from "../services/essayService";
import { BookPlusIcon } from "./icons/BookPlusIcon";

interface EssayGeneratorProps {
    onAddToJournal: (term: string, definition: string) => void;
}

export default function EssayGenerator({ onAddToJournal }: EssayGeneratorProps) {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("kozep");
  const [style, setStyle] = useState("tomor");
  const [mode, setMode] = useState("vazlat"); 
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResult("");
    try {
        const response = await generateEssay(topic, level, style, mode);
        setResult(response);
    } catch (error) {
        setResult("Hiba történt az esszé generálása közben. Kérjük, próbálja újra később.");
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const handleAddToJournalClick = () => {
    if (!result) return;
    setIsAdding(true);
    const term = `Esszé: ${topic}`;
    // Create a summary for the definition field
    const summary = `Típus: ${level}, ${mode}. ${result.substring(0, 150)}${result.length > 150 ? '...' : ''}`;
    
    onAddToJournal(term, summary);
    
    setTimeout(() => setIsAdding(false), 1000);
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#16213e] text-gray-900 dark:text-[#e0e0e0] p-8 shadow-xl space-y-6 animate-fade-in transition-colors duration-300">
      <h2 className="text-3xl font-bold">Érettségi Esszémotor (AI)</h2>

      {/* Téma mező */}
      <div>
        <label className="text-sm opacity-80">Esszé témája</label>
        <input
          type="text"
          placeholder="Pl.: A reformkor gazdasági és társadalmi folyamatai"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-4 py-3 rounded-xl mt-2 bg-gray-100 dark:bg-[#1a1a2e] text-gray-900 dark:text-white border border-gray-300 dark:border-[#2a2a4e]"
        />
      </div>

      {/* Szint */}
      <div>
        <label className="text-sm opacity-80">Szint</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full px-4 py-3 rounded-xl mt-2 bg-gray-100 dark:bg-[#1a1a2e] text-gray-900 dark:text-white border-gray-300 dark:border-[#2a2a4e]"
        >
          <option value="kozep">Középszint</option>
          <option value="emelt">Emelt szint</option>
        </select>
      </div>

      {/* Stílus */}
      <div>
        <label className="text-sm opacity-80">Esszé stílusa</label>
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="w-full px-4 py-3 rounded-xl mt-2 bg-gray-100 dark:bg-[#1a1a2e] text-gray-900 dark:text-white border-gray-300 dark:border-[#2a2a4e]"
        >
          <option value="tomor">Tömör</option>
          <option value="reszletes">Részletes</option>
          <option value="elemzo">Elemző</option>
        </select>
      </div>

      {/* Mód – Vázlat, Teljes esszé, Forráselemzés */}
      <div>
        <label className="text-sm opacity-80">Generálás módja</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full px-4 py-3 rounded-xl mt-2 bg-gray-100 dark:bg-[#1a1a2e] text-gray-900 dark:text-white border-gray-300 dark:border-[#2a2a4e]"
        >
          <option value="vazlat">Esszévázlat</option>
          <option value="teljes">Teljes esszé</option>
          <option value="forras">Forráselemzés</option>
        </select>
      </div>

      {/* Gomb */}
      <button
        onClick={handleGenerate}
        disabled={loading || !topic.trim()}
        className="w-full px-6 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-[#16c784] dark:hover:bg-green-500 transition font-semibold text-white disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {loading ? "Generálás..." : "Esszé készítése"}
      </button>

      {/* Eredmény */}
      {result && (
        <div className="mt-6 p-6 bg-gray-100 dark:bg-[#1a1a2e]/50 rounded-2xl whitespace-pre-line">
          <h3 className="text-xl font-bold mb-4 border-b pb-2 dark:border-[#2a2a4e]">Generált eredmény:</h3>
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none mb-8">
            {result}
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
              <button
                onClick={handleAddToJournalClick}
                disabled={isAdding}
                className="w-full flex items-center justify-center px-6 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
                <BookPlusIcon className="w-5 h-5 mr-2 text-amber-500 group-hover:scale-110 transition-transform" />
                {isAdding ? 'Mentés...' : 'Esszé mentése a fogalomnaplóba'}
            </button>
          </div>
        </div>
      )}
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
