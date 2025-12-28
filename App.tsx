import './types';
import { logSystemAction } from './services/versionService';
import React, { useEffect, useRef, useState, createContext, useContext, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import Hero from './sections/Hero';
import Flashlight from './components/Flashlight';
import CustomCursor from './components/CustomCursor';
import BackgroundGradient from './components/BackgroundGradient';
import ContactModal from './components/ContactModal';
import HistoryModal from './components/HistoryModal';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AIAssistant from './components/AIAssistant';
import CollaborationModal from './components/CollaborationModal';
import { useAuth } from './context/AuthContext';
// Removed unused theme hooks

// Lazy load below-the-fold sections for performance
const InfrastructureSequence = React.lazy(() => import('./sections/InfrastructureSequence'));
const Dashboard = React.lazy(() => import('./sections/Dashboard'));
const Services = React.lazy(() => import('./sections/Services'));
const Approach = React.lazy(() => import('./sections/Approach'));
const TechStack = React.lazy(() => import('./sections/TechStack'));
const CTA = React.lazy(() => import('./sections/CTA'));
const CaseStudies = React.lazy(() => import('./pages/CaseStudies'));
const PremiumConsultantDashboard = React.lazy(() => import('./components/PremiumConsultantDashboard'));

type Language = 'en' | 'fr';
type Page = 'home' | 'login' | 'signup' | 'casestudies' | 'premium';

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (content: { en: string; fr: string } | string) => string;
}

interface ContactContextType {
  openContact: (message?: string) => void;
  closeContact: () => void;
  openHistory: () => void;
  closeHistory: () => void;
  openCollaboration: () => void;
  closeCollaboration: () => void;
}

interface PageContextType {
  currentPage: Page;
  setPage: (p: Page) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
const ContactContext = createContext<ContactContextType | undefined>(undefined);
const PageContext = createContext<PageContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useContact = () => {
  const context = useContext(ContactContext);
  if (!context) throw new Error("useContact must be used within ContactProvider");
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export const usePage = () => {
  const context = useContext(PageContext);
  if (!context) throw new Error("usePage must be used within PageProvider");
  return context;
};



const App: React.FC = () => {
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const [lang, setLang] = useState<Language>('en');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCollaborationOpen, setIsCollaborationOpen] = useState(false);
  const [currentPage, setPage] = useState<Page>('home');
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    // If logged in on login/signup page, go home
    if (user && (currentPage === 'login' || currentPage === 'signup')) {
      setPage('home'); // eslint-disable-line react-hooks/set-state-in-effect
    }

    // Telemetry: Log session initialization
    if (user) {
      logSystemAction(user.uid, "SESSION_START", { page: currentPage }, 'SYSTEM');
    }
  }, [user, currentPage]);

  useEffect(() => {
    const scrollRoot = scrollRootRef.current;
    if (!scrollRoot) return;

    const handleScroll = () => {
      const scrolled = scrollRoot.scrollTop;
      scrollRoot.style.backgroundPositionY = `${scrolled * 0.15}px`;
    };

    scrollRoot.addEventListener('scroll', handleScroll);
    return () => scrollRoot.removeEventListener('scroll', handleScroll);
  }, [currentPage]);

  const t = (content: { en: string; fr: string } | string) => {
    if (typeof content === 'string') return content;
    return content[lang];
  };

  const [defaultContactMessage, setDefaultContactMessage] = useState<string | undefined>(undefined);

  const openContact = (message?: string) => {
    setDefaultContactMessage(message);
    setIsContactOpen(true);
  };
  const closeContact = () => setIsContactOpen(false);
  const openHistory = () => setIsHistoryOpen(true);
  const closeHistory = () => setIsHistoryOpen(false);
  const openCollaboration = () => setIsCollaborationOpen(true);
  const closeCollaboration = () => setIsCollaborationOpen(false);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <ContactContext.Provider value={{ openContact, closeContact, openHistory, closeHistory, openCollaboration, closeCollaboration }}>
        <PageContext.Provider value={{ currentPage, setPage }}>
          {authLoading ? (
            // AI Studio style loader but with local branding
            <div className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 border-t-2 border-brand-accent rounded-full animate-spin" />
              <div className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/50 animate-pulse">
                Synchronizing Protocol
              </div>
            </div>
          ) : (
            <div
              id="scroll-root"
              ref={scrollRootRef}
              className="relative font-antonio selection:bg-brand-accent/30 selection:text-brand-accent bg-transparent transition-colors duration-500 h-screen overflow-y-auto overflow-x-hidden scrollbar-hide"
            >
              <CustomCursor />
              <BackgroundGradient />
              <Flashlight />

              {currentPage === 'home' && <Sidebar />}

              <main className="relative z-10 w-full min-h-screen">
                {currentPage === 'home' && (
                  <>
                    <section id="hero"><Hero /></section>
                    <Suspense fallback={<div className="min-h-screen flex items-center justify-center opacity-50">Loading...</div>}>
                      <section id="infrastructure"><InfrastructureSequence /></section>
                      <section id="dashboard"><Dashboard /></section>
                      <section id="services"><Services /></section>
                      <section id="capabilities"><TechStack /></section>
                      <section id="approach"><Approach /></section>
                      <section id="cta"><CTA /></section>
                    </Suspense>
                  </>
                )}
                {currentPage === 'login' && <Login />}
                {currentPage === 'signup' && <Signup />}
                {currentPage === 'casestudies' && (
                  <Suspense fallback={<div className="min-h-screen flex items-center justify-center opacity-50">Loading Archive...</div>}>
                    <CaseStudies />
                  </Suspense>
                )}
                {currentPage === 'premium' && (
                  <Suspense fallback={<div className="min-h-screen flex items-center justify-center opacity-50">Opening Secure Vault...</div>}>
                    <div className="pt-24 px-[5%]">
                      <PremiumConsultantDashboard />
                    </div>
                  </Suspense>
                )}
              </main>

              {currentPage === 'home' && (
                <footer className="py-20 border-t border-black/5 dark:border-white/5 bg-brand-dancer/20 dark:bg-black/20 px-[5%] relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="space-y-4">
                      <div className="text-2xl font-bold tracking-tighter uppercase italic text-gray-900 dark:text-gray-100 font-sans">Kaza X Labs</div>
                      <p className="text-[12px] text-apple-simple max-w-xs leading-relaxed font-sans">
                        {t({
                          en: "Deterministic digital lab focused on architectural upgrades and high-performance brand ecosystems.",
                          fr: "Laboratoire numérique déterministe axé sur les mises à niveau architecturales et les écosystèmes de marque haute performance."
                        })}
                      </p>
                    </div>

                    <div className="text-[14px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold font-sans">
                      © 2024 Kaza X — REBUILD_ENGINE_v4.0.1
                    </div>

                    <div className="flex gap-8">
                      <a href="#" aria-label="Twitter X" className="text-gray-700 dark:text-gray-300 hover:text-brand-accent transition-all hover:scale-110 focus:ring-2 focus:ring-brand-accent outline-none rounded-lg"><iconify-icon icon="line-md:twitter-x" width="24" /></a>
                      <a href="#" aria-label="LinkedIn" className="text-gray-700 dark:text-gray-300 hover:text-brand-accent transition-all hover:scale-110 focus:ring-2 focus:ring-brand-accent outline-none rounded-lg"><iconify-icon icon="line-md:linkedin" width="24" /></a>
                      <a href="#" aria-label="GitHub" className="text-gray-700 dark:text-gray-300 hover:text-brand-accent transition-all hover:scale-110 focus:ring-2 focus:ring-brand-accent outline-none rounded-lg"><iconify-icon icon="line-md:github" width="24" /></a>
                    </div>
                  </div>
                </footer>
              )}

              <ContactModal isOpen={isContactOpen} onClose={closeContact} defaultMessage={defaultContactMessage} />
              <HistoryModal isOpen={isHistoryOpen} onClose={closeHistory} />
              <CollaborationModal isOpen={isCollaborationOpen} onClose={closeCollaboration} />
              <AIAssistant />
            </div>
          )}
        </PageContext.Provider>
      </ContactContext.Provider>
    </LanguageContext.Provider >
  );
};

export default App;
