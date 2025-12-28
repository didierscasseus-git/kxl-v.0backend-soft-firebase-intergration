
import React, { useState, useEffect } from 'react';
import { useLanguage, useContact, usePage } from '../App';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import HueJoystick from './HueJoystick';
import ProfileCRM from './ProfileCRM';
import '../types';


const SECTIONS = [
  { id: 'hero', name: { en: 'Rebuild', fr: 'Reconstruction' }, color: '#111111', icon: 'ph:rocket-launch-thin' },
  { id: 'infrastructure', name: { en: 'Engine', fr: 'Moteur' }, color: '#1A1815', icon: 'ph:cpu-thin' },
  { id: 'services', name: { en: 'Services', fr: 'Services' }, color: '#222222', icon: 'ph:grid-four-thin' },
  { id: 'capabilities', name: { en: 'Arsenal', fr: 'Arsenal' }, color: '#333333', icon: 'ph:shield-check-thin' },
  { id: 'approach', name: { en: 'Lifecycle', fr: 'Cycle de vie' }, color: '#444444', icon: 'ph:recycle-thin' },
  { id: 'cta', name: { en: 'Protocol', fr: 'Protocole' }, color: '#555555', icon: 'ph:lock-key-thin' },
];

const Sidebar: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTranslate, setShowTranslate] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [crmOpen, setCrmOpen] = useState(false);
  const { t } = useLanguage();
  const { openHistory } = useContact();
  const { setPage, currentPage } = usePage();
  const { user, logout, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const scrollRoot = document.getElementById('scroll-root');
    if (!scrollRoot) return;

    const observerOptions = {
      root: scrollRoot,
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const index = SECTIONS.findIndex(s => s.id === id);
          if (index !== -1 && index !== activeIndex) {
            setActiveIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeIndex, t]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  const toggleTranslate = () => {
    setShowTranslate(!showTranslate);
  };

  const handleAuthNav = (page: 'login' | 'signup') => {
    setPage(page);
    setAuthMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <div className={`fixed z-[120] transition-all duration-300 ease-in-out origin-bottom-left bottom-[100px] 
          xl:left-[60px] xl:translate-x-0
          left-1/2 -translate-x-1/2
          ${showTranslate
          ? 'opacity-100 scale-100 visible xl:translate-y-0 translate-y-0'
          : 'opacity-0 scale-95 invisible pointer-events-none xl:translate-y-[10px] translate-y-[10px]'
        }`}
      >
        <div className="relative p-1 rounded-2xl glass-dark border border-white/10 shadow-2xl backdrop-blur-2xl">
          <div className="absolute -top-3 left-4 px-2 py-0.5 bg-brand-accent text-white text-[8px] font-bold uppercase tracking-widest rounded-sm shadow-sm z-20">
            System Lang
          </div>
          <div className="bg-[#F0EEE9]/80 dark:bg-[#0c0c0c]/80 rounded-xl p-3 w-[180px] relative overflow-hidden">
            <div id="google_translate_element" className="w-full min-h-[30px] flex items-center" />
            <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/5 flex justify-between items-center text-[8px] text-gray-500 font-mono">
              <span>AUTO_DETECT</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div >

      <nav aria-label="Desktop Navigation" className="sticky top-0 h-0 z-[70] hidden xl:block overflow-visible">
        <div className="absolute left-6 top-[20vh] flex flex-col gap-2">
          <button
            onClick={() => scrollTo('hero')}
            title="Scroll to Top"
            aria-label="Scroll to Top"
            className="mb-8 w-12 h-12 glass rounded-[20px] flex items-center justify-center font-bold italic text-lg border-white/10 shadow-xl hover:scale-110 transition-transform bg-black/80 text-white"
          >
            KX
          </button>

          <div className="relative flex flex-col gap-2">
            { }
            <div
              className="absolute left-0 w-12 h-12 rounded-[20px] transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) z-0"
              style={{
                transform: `translateY(${activeIndex * 56}px)`,
                backgroundColor: SECTIONS[activeIndex].color,
                boxShadow: `0 0 30px -5px ${SECTIONS[activeIndex].color}80, inset 0 0 0 1px rgba(255,255,255,0.1)`
              }}
            />


            {SECTIONS.map((section, idx) => {
              const isActive = activeIndex === idx;
              const stepNumber = (idx + 1).toString().padStart(2, '0');

              return (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  title={t(section.name)}
                  aria-label={`Navigate to ${t(section.name)}`}
                  className={`group relative z-10 flex items-center gap-4 px-2 py-2 rounded-[20px] transition-all duration-500 ease-out outline-none overflow-hidden w-12 hover:w-56 ${isActive ? 'bg-transparent' : 'bg-white/5 hover:bg-white/10'
                    }`}
                >
                  <div className={`w-8 h-8 flex-shrink-0 rounded-xl flex items-center justify-center text-[10px] font-bold tracking-tighter transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-400'
                    }`}>
                    {isActive ? <iconify-icon icon={section.icon} width="20" /> : stepNumber}
                  </div>

                  <div className="flex flex-col text-left transition-all duration-500 overflow-hidden opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 absolute left-14 top-2 bottom-2 right-2 flex justify-center">
                    <div className="absolute inset-0 bg-black/40 rounded-lg -z-10 backdrop-blur-sm border border-white/5" />
                    <span className={`text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap pl-2 ${isActive ? 'text-white' : 'text-gray-300'}`}>
                      {t(section.name)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 flex flex-col items-center gap-6">
            <div className="relative" onMouseLeave={() => setAuthMenuOpen(false)}>
              <button
                onMouseEnter={() => setAuthMenuOpen(true)}
                title={user ? t({ en: 'User Menu', fr: 'Menu Utilisateur' }) : t({ en: 'Sign In', fr: 'Connexion' })}
                aria-label={user ? t({ en: 'User Menu', fr: 'Menu Utilisateur' }) : t({ en: 'Sign In', fr: 'Connexion' })}
                className={`w-10 h-10 rounded-full glass flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${authMenuOpen ? 'text-brand-accent' : 'text-gray-400 hover:text-white'}`}
              >
                <iconify-icon icon="ph:user-circle-thin" width="24" />
              </button>
              <div className={`absolute left-full bottom-0 ml-4 w-48 glass bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-left ${authMenuOpen ? 'opacity-100 scale-100 translate-x-0 visible' : 'opacity-0 scale-95 -translate-x-2 invisible pointer-events-none'}`}>
                <div className="p-1 flex flex-col gap-1">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-white/5 space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-accent">
                          {t({ en: 'Operator Active', fr: 'Opérateur Actif' })}
                        </p>
                        <p className="text-[11px] text-white font-medium truncate">
                          {user.displayName || user.email}
                        </p>
                        <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-white/5 border border-white/10 group/id">
                          <code className="text-[8px] text-white/40 font-mono truncate max-w-[100px]">
                            ID: {user.uid}
                          </code>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(user.uid);
                            }}
                            className="text-brand-accent hover:scale-110 active:scale-95 transition-all p-1"
                            title={t({ en: 'Copy ID', fr: 'Copier l\'ID' })}
                          >
                            <iconify-icon icon="ph:copy-simple-thin" width="12" />
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setCrmOpen(true);
                          setAuthMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-brand-accent border border-brand-accent/20 bg-brand-accent/5 my-1"
                      >
                        <iconify-icon icon="ph:cpu-duotone" width="16" />
                        {profile?.role === 'DEVELOPER' ? 'SYSTEM_CRM' : 'REQUESTS'}
                      </button>
                      <button
                        onClick={() => {
                          openHistory();
                          setAuthMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-200"
                      >
                        <iconify-icon icon="ph:clock-counter-clockwise-thin" width="16" />
                        {t({ en: 'History', fr: 'Historique' })}
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setAuthMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-red-400"
                      >
                        <iconify-icon icon="ph:sign-out-thin" width="16" />
                        {t({ en: 'Disconnect', fr: 'Déconnexion' })}
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleAuthNav('login')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-200">
                        <iconify-icon icon="ph:sign-in-thin" width="16" />
                        {t({ en: 'Log In', fr: 'Connexion' })}
                      </button>
                      <button onClick={() => handleAuthNav('signup')} className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-200">
                        <iconify-icon icon="ph:user-plus-thin" width="16" />
                        {t({ en: 'Sign Up', fr: 'S\'inscrire' })}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {(profile?.role === 'PREMIUM_OPERATOR' || profile?.role === 'DEVELOPER') && (
              <button
                onClick={() => setPage('premium')}
                title={t({ en: 'Premium Vault', fr: 'Voûte Premium' })}
                aria-label={t({ en: 'Premium Vault', fr: 'Voûte Premium' })}
                className={`w-10 h-10 rounded-full glass flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${currentPage === 'premium' ? 'text-brand-accent bg-brand-accent/10 border-brand-accent' : 'text-gray-400 hover:text-white'}`}
              >
                <iconify-icon icon="ph:shield-star-thin" width="24" />
              </button>
            )}

            <button
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-full glass flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${theme === 'dark' ? 'text-yellow-400' : 'text-gray-400 hover:text-gray-600'}`}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <iconify-icon icon={theme === 'dark' ? "ph:sun-thin" : "ph:moon-thin"} width="22" />
            </button>

            <button onClick={toggleTranslate} title={showTranslate ? "Hide Translator" : "Show Translator"} aria-label={showTranslate ? "Hide Translator" : "Show Translator"} className={`w-10 h-10 rounded-full glass flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${showTranslate ? 'text-brand-accent' : 'text-gray-400 hover:text-white'}`}>
              <iconify-icon icon="ph:globe-simple-thin" width="22" />
            </button>

            {/* Hue Controller Integration */}
            <div className="mt-4 pt-4 border-t border-white/5">
              <HueJoystick />
            </div>
          </div>
        </div>
      </nav>

      <div className="fixed bottom-8 right-6 z-[110] xl:hidden flex flex-col items-end gap-4">
        {/* Mobile Hue Controller Trigger could go here, but for now it's in the mobile menu */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} title={mobileMenuOpen ? "Close Menu" : "Open Menu"} aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"} className={`w-14 h-14 rounded-full glass shadow-2xl border-white/10 flex items-center justify-center transition-all duration-500 ${mobileMenuOpen ? 'rotate-90 bg-black text-white' : 'bg-white/10 text-white'}`}>
          <iconify-icon icon={mobileMenuOpen ? "ph:x-thin" : "ph:list-thin"} width="28" />
        </button>
      </div>

      <div className={`fixed inset-0 z-[105] xl:hidden transition-all duration-700 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" onClick={() => setMobileMenuOpen(false)} />
        <div className={`absolute bottom-28 right-6 w-[260px] flex flex-col gap-2 transition-all duration-500 transform ${mobileMenuOpen ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95 opacity-0'}`}>
          <div className="mb-4 flex justify-center">
            <HueJoystick />
          </div>
          {SECTIONS.map((section, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 ${isActive ? 'bg-white text-black border-white shadow-xl scale-105' : 'bg-black/40 text-gray-300 border-white/5 hover:bg-white/10'
                  }`}
              >
                <iconify-icon icon={section.icon} width="20" />
                <span className="text-[11px] font-bold uppercase tracking-widest">{t(section.name)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <ProfileCRM isOpen={crmOpen} onClose={() => setCrmOpen(false)} />
    </>
  );
};

export default Sidebar;
