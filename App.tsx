
import React, { useState, useCallback, useEffect } from 'react';
import { Article, EventDetail, TimelineEvent, JournalEntry, ComparisonData } from './types';
import { UserProgress } from './types/gamification';
import { fetchConcept, fetchTimelineEvents, fetchEventDetail, fetchShortDefinition, fetchComparison } from './services/geminiService';
import { SearchBar } from './components/SearchBar';
import { ArticleView } from './components/ArticleView';
import { LoadingSpinner } from './components/LoadingSpinner';
import { HistoryIcon } from './components/icons/HistoryIcon';
import { SidePanel } from './components/SidePanel';
import { ExportModal } from './ExportModal';
import { TimelineView } from './components/TimelineView';
import { EventDetailView } from './components/EventDetailView';
import { JournalModal } from './components/JournalModal';
import { Toast } from './components/Toast';
import { MobileSidebar } from './components/MobileSidebar';
import EssayGenerator from './components/EssayGenerator';
import { ComparisonView } from './components/ComparisonView';
import { SunIcon } from './components/icons/SunIcon';
import { MoonIcon } from './components/icons/MoonIcon';
import { BookOpenIcon } from './components/icons/BookOpenIcon';
import { GameHub } from './components/gamification/GameHub';

type Content =
  | { type: 'initial' }
  | { type: 'loading', message: string }
  | { type: 'error', message: string }
  | { type: 'article', data: Article }
  | { type: 'essayGenerator' }
  | { type: 'timeline', data: { topic: string, events: TimelineEvent[] } }
  | { type: 'eventDetail', data: EventDetail }
  | { type: 'comparison', data: ComparisonData }
  | { type: 'game' };


const App: React.FC = () => {
  const [content, setContent] = useState<Content>({ type: 'initial' });
  const [isExportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [isJournalModalOpen, setJournalModalOpen] = useState<boolean>(false);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastViewedConcept, setLastViewedConcept] = useState<{ title: string } | null>(null);
  const [comparisonMode, setComparisonMode] = useState<{ active: boolean; item1: string }>({ active: false, item1: '' });
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [isThemeRotating, setIsThemeRotating] = useState(false);
  
  // Gamification State
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalPoints: 0,
    completedQuestIds: [],
    earnedBadgeIds: [],
    detectiveStreak: 0,
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsThemeRotating(true);
    setIsDarkMode(!isDarkMode);
    setTimeout(() => setIsThemeRotating(false), 500); // Reset rotation after animation
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);
  
  const handleCompareConcepts = useCallback(async (concept1: string, concept2: string) => {
    if (content.type === 'loading') return;
    setContent({ type: 'loading', message: 'Összehasonlítás készítése...' });
    try {
        const result = await fetchComparison(concept1, concept2);
        const newComparison: ComparisonData = {
            ...result,
            id: `${concept1}-${concept2}-${Date.now()}`
        };
        setContent({ type: 'comparison', data: newComparison });
        setLastViewedConcept({ title: `Összehasonlítás: ${concept1} vs ${concept2}` });
    } catch (err) {
        setContent({ type: 'error', message: 'Hiba történt az összehasonlítás közben. Próbálja újra.' });
        console.error(err);
    } finally {
        setComparisonMode({ active: false, item1: '' });
    }
  }, [content]);

  const handleSearch = useCallback(async (term: string) => {
    if (content.type === 'loading') return;
    
    if (comparisonMode.active) {
        await handleCompareConcepts(comparisonMode.item1, term);
        return;
    }

    if (content.type === 'article' && content.data.title.toLowerCase() === term.toLowerCase()) {
      return;
    }

    setContent({ type: 'loading', message: 'Fogalom keresése...' });
    try {
      const result = await fetchConcept(term);
      const newArticle: Article = {
        ...result,
        id: `${term}-${Date.now()}`
      };
      setContent({ type: 'article', data: newArticle });
      setLastViewedConcept({ title: newArticle.title });
    } catch (err) {
      setContent({ type: 'error', message: 'Hiba történt a fogalom keresése közben. Kérjük, próbálja újra.' });
      console.error(err);
    }
  }, [content, comparisonMode, handleCompareConcepts]);
  
  const handleShowEssayGenerator = useCallback(() => {
    setContent({ type: 'essayGenerator' });
  }, []);
  
  const handleShowGameHub = useCallback(() => {
    setContent({ type: 'game' });
  }, []);

  const handleGenerateTimeline = useCallback(async (topic: string) => {
    if (content.type === 'loading') return;
    setContent({ type: 'loading', message: 'Idővonal létrehozása...' });
     try {
      const result = await fetchTimelineEvents(topic);
      setContent({ type: 'timeline', data: { topic, events: result } });
      setLastViewedConcept({ title: `Idővonal: ${topic}`});
    } catch (err) {
      setContent({ type: 'error', message: 'Hiba történt az idővonal létrehozása közben. Kérjük, próbálja újra.' });
      console.error(err);
    }
  }, [content]);

  const handleEventClick = useCallback(async (eventName: string) => {
    if (content.type === 'loading') return;
    
    if (content.type === 'eventDetail' && content.data.title.toLowerCase() === eventName.toLowerCase()) {
        return;
    }

    setContent({ type: 'loading', message: 'Esemény részleteinek betöltése...' });
    try {
        const result = await fetchEventDetail(eventName);
        const newEventDetail: EventDetail = {
            ...result,
            id: `${eventName}-${Date.now()}`
        };
        setContent({ type: 'eventDetail', data: newEventDetail });
        setLastViewedConcept({ title: newEventDetail.title });
    } catch (err) {
        setContent({ type: 'error', message: 'Hiba történt az esemény részleteinek lekérése közben. Kérjük, próbálja újra.' });
        console.error(err);
    }
  }, [content]);

  // Original handler for searching and adding a term
  const handleAddToJournal = useCallback(async (term: string) => {
    if (journal.some(entry => entry.term.toLowerCase() === term.toLowerCase())) {
        setToastMessage(`"${term}" már szerepel a fogalomnaplódban.`);
        return;
    }
    try {
        const shortDefinition = await fetchShortDefinition(term);
        const newEntry: JournalEntry = { term, shortDefinition };
        setJournal(prev => {
            const newJournal = [...prev, newEntry];
            setToastMessage(`A fogalom bekerült a naplóba.`);
            return newJournal;
        });
    } catch (error) {
        console.error("Failed to add to journal:", error);
        setToastMessage("Hiba történt a fogalom hozzáadása közben.");
    }
}, [journal]);

  // New handler for saving generated content (Timeline, Essay, Comparison)
  const handleSaveToJournal = useCallback((term: string, definition: string) => {
      if (journal.some(entry => entry.term === term)) {
          setToastMessage(`Ez a bejegyzés már szerepel a naplóban.`);
          return;
      }
      const newEntry: JournalEntry = { term, shortDefinition: definition };
      setJournal(prev => [...prev, newEntry]);
      setToastMessage("Sikeresen mentve a fogalomnaplóba!");
  }, [journal]);

  const handleShowJournal = () => {
      setJournalModalOpen(true);
  };

  const handleExport = () => {
    if (content.type === 'article' || content.type === 'timeline' || content.type === 'comparison') {
      setExportModalOpen(true);
    }
  };
  
  const handleInitiateCompare = () => {
    if (lastViewedConcept) {
      setComparisonMode({ active: true, item1: lastViewedConcept.title });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleUpdateProgress = (newProgress: UserProgress) => {
    // Add specific toast if points increased
    if (newProgress.totalPoints > userProgress.totalPoints) {
        const diff = newProgress.totalPoints - userProgress.totalPoints;
        setToastMessage(`Gratulálunk! +${diff} pontot szereztél!`);
    }
    // Add toast for badge
    if (newProgress.earnedBadgeIds.length > userProgress.earnedBadgeIds.length) {
        setToastMessage("Új kitűzőt szereztél! Nézd meg a Játékzónában!");
    }
    setUserProgress(newProgress);
  };

  const renderMainContent = () => {
    switch (content.type) {
      case 'initial':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 min-h-[50vh] animate-fade-in">
             <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <HistoryIcon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
             </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 font-serif">Üdv a Történelmi Tudástár+ felületén!</h2>
            <p className="max-w-md text-gray-600 dark:text-gray-400 leading-relaxed">
              Kezdje a tanulást egy fogalom beírásával a fenti keresőmezőbe, vagy használja a jobb oldali menü eszközeit a felfedezéshez.
            </p>
          </div>
        );
      case 'loading':
        return <div className="flex items-center justify-center h-full min-h-[50vh]"><LoadingSpinner message={content.message} /></div>;
      case 'error':
        return (
          <div className="p-8 h-full flex items-center justify-center min-h-[50vh] animate-fade-in">
            <div className="p-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-lg shadow-lg text-red-800 dark:text-red-200 max-w-md">
              <h3 className="font-bold text-lg mb-2">Hiba történt</h3>
              <p>{content.message}</p>
            </div>
          </div>
        );
      case 'article':
        return <ArticleView key={content.data.id} article={content.data} onTermClick={handleSearch} onAddToJournal={handleAddToJournal} />;
      case 'essayGenerator':
        return <EssayGenerator onAddToJournal={handleSaveToJournal} />;
      case 'timeline':
        return <TimelineView topic={content.data.topic} events={content.data.events} onEventClick={handleEventClick} onAddToJournal={handleSaveToJournal} />;
      case 'eventDetail':
        return <EventDetailView key={content.data.id} eventDetail={content.data} onTermClick={handleSearch} onAddToJournal={handleAddToJournal} />;
      case 'comparison':
        return <ComparisonView key={content.data.id} comparison={content.data} onAddToJournal={handleSaveToJournal} />;
      case 'game':
        return <GameHub userProgress={userProgress} onUpdateProgress={handleUpdateProgress} />;
    }
  };
  
  const sidePanelProps = {
      onSearch: handleSearch,
      onShowEssayGenerator: handleShowEssayGenerator,
      onShowGameHub: handleShowGameHub,
      onGenerateTimeline: handleGenerateTimeline,
      onExport: handleExport,
      isActionDisabled: content.type === 'loading',
      isExportDisabled: !['article', 'timeline', 'comparison'].includes(content.type),
      onCompare: handleCompareConcepts,
      onToggleDarkMode: toggleDarkMode,
      isDarkMode: isDarkMode,
      userPoints: userProgress.totalPoints,
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 font-sans">
      {/* Hero / Header Section with Gradient */}
      <header className="relative flex-shrink-0 z-20 bg-white/80 dark:bg-slate-950/90 backdrop-blur-md border-b border-gray-200 dark:border-slate-800 transition-colors duration-300">
        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 via-transparent to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10 pointer-events-none"></div>
        
        <div className="absolute top-4 right-4 z-30">
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-500 shadow-sm hover:shadow-md ${isThemeRotating ? 'rotate-180' : ''}`}
              aria-label="Téma váltása"
            >
              {isDarkMode ? <SunIcon className="w-5 h-5 text-amber-400" /> : <MoonIcon className="w-5 h-5 text-blue-600" />}
            </button>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-8 relative">
          <div className="text-center mb-6">
             <div className="inline-flex items-center justify-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse"></div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 font-serif">
                  Történelmi Tudástár<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">+</span>
                </h1>
             </div>
             <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">
               Interaktív érettségi felkészítő
             </p>
          </div>

          <SearchBar 
            onSearch={handleSearch} 
            isLoading={content.type === 'loading'}
            isCompareMode={comparisonMode.active}
            item1Title={comparisonMode.item1}
            onCancelCompare={() => setComparisonMode({ active: false, item1: '' })}
          />
          
           {lastViewedConcept && !comparisonMode.active && content.type !== 'initial' && content.type !== 'game' && (
            <div className="text-center mt-5 animate-fade-in">
              <button 
                onClick={handleInitiateCompare}
                className="group relative inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 transition-all duration-200 bg-blue-50 dark:bg-blue-900/20 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:shadow-sm border border-blue-100 dark:border-blue-800"
              >
                <span>Összehasonlítás ezzel:</span>
                <span className="ml-1.5 font-bold">{lastViewedConcept.title}</span>
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">→</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex-grow overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto px-4 py-8">

          <section className="lg:grid lg:grid-cols-[1fr,320px] xl:grid-cols-[1fr,360px] lg:gap-8">
            <main className="lg:col-span-1 mb-8 lg:mb-0 min-h-[400px]">
              {renderMainContent()}
            </main>

            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-8">
                <div className="bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <SidePanel {...sidePanelProps} />
                </div>
              </div>
            </aside>
          </section>
          
          <section className="lg:hidden mt-8">
             <MobileSidebar {...sidePanelProps} />
          </section>

        </div>
      </div>
      
      {/* Floating Journal Button */}
      <button
        onClick={handleShowJournal}
        className="fixed bottom-8 right-8 z-40 group flex items-center justify-center w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-300 dark:focus:ring-orange-900"
        aria-label="Fogalomnapló megnyitása"
      >
        <BookOpenIcon className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
        {journal.length > 0 && (
           <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600 border-2 border-white dark:border-slate-900 items-center justify-center text-[10px] font-bold text-white">
               {journal.length}
            </span>
          </span>
        )}
      </button>

      {isExportModalOpen && (content.type === 'article' || content.type === 'timeline' || content.type === 'comparison') && (
        <ExportModal content={content.data} type={content.type} onClose={() => setExportModalOpen(false)} />
      )}
      {isJournalModalOpen && (
        <JournalModal journal={journal} onClose={() => setJournalModalOpen(false)} />
      )}
      {toastMessage && <Toast message={toastMessage} />}
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
          border: 3px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: rgba(107, 114, 128, 0.8);
        }
      `}</style>
    </div>
  );
};

export default App;
