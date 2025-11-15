import React, { useState, useCallback, useEffect } from 'react';
import { Article, EventDetail, TimelineEvent, JournalEntry } from './types';
import { fetchConcept, fetchTimelineEvents, fetchEventDetail, fetchShortDefinition } from './services/geminiService';
import { SearchBar } from './components/SearchBar';
import { ArticleView } from './components/ArticleView';
import { LoadingSpinner } from './components/LoadingSpinner';
import { HistoryIcon } from './components/icons/HistoryIcon';
import { SidePanel } from './components/SidePanel';
import { ExportModal } from './components/ExportModal';
import { TimelineView } from './components/TimelineView';
import { EventDetailView } from './components/EventDetailView';
import { JournalModal } from './components/JournalModal';
import { Toast } from './components/Toast';
import { MobileSidebar } from './components/MobileSidebar';
import EssayGenerator from './components/EssayGenerator';

type Content =
  | { type: 'initial' }
  | { type: 'loading', message: string }
  | { type: 'error', message: string }
  | { type: 'article', data: Article }
  | { type: 'essayGenerator' }
  | { type: 'timeline', data: { topic: string, events: TimelineEvent[] } }
  | { type: 'eventDetail', data: EventDetail };


const App: React.FC = () => {
  const [content, setContent] = useState<Content>({ type: 'initial' });
  const [isExportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [isJournalModalOpen, setJournalModalOpen] = useState<boolean>(false);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleSearch = useCallback(async (term: string) => {
    if (content.type === 'loading') return;
    
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
    } catch (err) {
      setContent({ type: 'error', message: 'Hiba történt a fogalom keresése közben. Kérjük, próbálja újra.' });
      console.error(err);
    }
  }, [content]);
  
  const handleShowEssayGenerator = useCallback(() => {
    setContent({ type: 'essayGenerator' });
  }, []);

  const handleGenerateTimeline = useCallback(async (topic: string) => {
    if (content.type === 'loading') return;
    setContent({ type: 'loading', message: 'Idővonal létrehozása...' });
     try {
      const result = await fetchTimelineEvents(topic);
      setContent({ type: 'timeline', data: { topic, events: result } });
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
    } catch (err) {
        setContent({ type: 'error', message: 'Hiba történt az esemény részleteinek lekérése közben. Kérjük, próbálja újra.' });
        console.error(err);
    }
  }, [content]);

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
            setToastMessage(`A fogalom bekerült a naplódba. Jelenlegi elemek: ${newJournal.length}.`);
            return newJournal;
        });
    } catch (error) {
        console.error("Failed to add to journal:", error);
        setToastMessage("Hiba történt a fogalom hozzáadása közben.");
    }
}, [journal]);

  const handleShowJournal = () => {
      setJournalModalOpen(true);
  };

  const handleExport = () => {
    if (content.type === 'article' || content.type === 'timeline') {
      setExportModalOpen(true);
    }
  };

  const renderMainContent = () => {
    switch (content.type) {
      case 'initial':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 p-8 min-h-[50vh]">
            <HistoryIcon className="w-24 h-24 mb-4" />
            <h2 className="text-2xl font-semibold">Üdv a Történelmi Tudástár+ felületén!</h2>
            <p className="max-w-md mt-2">
              Kezdje a tanulást egy fogalom beírásával a fenti keresőmezőbe, vagy használja a jobb oldali menü eszközeit.
            </p>
          </div>
        );
      case 'loading':
        return <div className="flex items-center justify-center h-full min-h-[50vh]"><LoadingSpinner message={content.message} /></div>;
      case 'error':
        return (
          <div className="p-8 h-full flex items-center justify-center min-h-[50vh]">
            <div className="p-6 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-700 rounded-lg shadow-lg text-red-800 dark:text-red-200">
              <h3 className="font-bold mb-2">Hiba!</h3>
              <p>{content.message}</p>
            </div>
          </div>
        );
      case 'article':
        return <ArticleView key={content.data.id} article={content.data} onTermClick={handleSearch} onAddToJournal={handleAddToJournal} />;
      case 'essayGenerator':
        return <EssayGenerator />;
      case 'timeline':
        return <TimelineView topic={content.data.topic} events={content.data.events} onEventClick={handleEventClick} />;
      case 'eventDetail':
        return <EventDetailView key={content.data.id} eventDetail={content.data} onTermClick={handleSearch} onAddToJournal={handleAddToJournal} />;
    }
  };
  
  const sidePanelProps = {
      onSearch: handleSearch,
      onShowEssayGenerator: handleShowEssayGenerator,
      onGenerateTimeline: handleGenerateTimeline,
      onShowJournal: handleShowJournal,
      journalItemCount: journal.length,
      onExport: handleExport,
      isActionDisabled: content.type === 'loading',
      isExportDisabled: content.type !== 'article' && content.type !== 'timeline'
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      <header className="flex-shrink-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">
            Történelmi Tudástár+
          </h1>
          <SearchBar onSearch={handleSearch} isLoading={content.type === 'loading'} />
        </div>
      </header>

      <div className="flex-grow overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">

          <section className="lg:grid lg:grid-cols-[2fr,1fr] lg:gap-6">
            <main className="lg:col-span-1 mb-8 lg:mb-0">
              {renderMainContent()}
            </main>

            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                  <SidePanel {...sidePanelProps} />
                </div>
              </div>
            </aside>
          </section>
          
          <section className="lg:hidden mt-6">
             <MobileSidebar {...sidePanelProps} />
          </section>

        </div>
      </div>

      {isExportModalOpen && (content.type === 'article' || content.type === 'timeline') && (
        <ExportModal content={content.data} type={content.type} onClose={() => setExportModalOpen(false)} />
      )}
      {isJournalModalOpen && (
        <JournalModal journal={journal} onClose={() => setJournalModalOpen(false)} />
      )}
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
};

export default App;