
import React, { useState, useEffect } from 'react';
import { useLanguage, useContact, usePage } from '../App';
import '../types';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { lang, setLang, t } = useLanguage();
  const { openContact } = useContact();
  const { setPage, currentPage } = usePage();
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);

  useEffect(() => {
    const scrollRoot = document.getElementById('scroll-root');
    if (!scrollRoot) return;

    const handleScroll = () => {
      setIsScrolled(scrollRoot.scrollTop > 50);
    };

    scrollRoot.addEventListener('scroll', handleScroll);
    return () => scrollRoot.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (page: 'home' | 'login' | 'signup') => {
    setPage(page);
    setIsAuthMenuOpen(false);
  };

  return (
    <nav className={`sticky top-0 left-0 right-0 z-[60] flex items-center px-[5%] transition-all duration-500 ease-in-out ${isScrolled
      ? 'h-16 glass border-b border-black/5 shadow-sm'
      : 'h-24 bg-transparent'
      }`}>
      <div className="w-full h-full flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => handleNav('home')}
        >
          <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center bg-white shadow-sm group-hover:scale-110 transition-transform">
            <div className={`w-2 h-2 bg-brand-accent rounded-full ${isScrolled ? 'animate-pulse' : 'animate-pulse-sonar'}`} />
          </div>
          <span className="font-bold tracking-tighter uppercase italic text-lg text-gray-900 group-hover:text-brand-accent transition-colors font-sans">Kaza X Labs</span>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-[11px] font-bold tracking-[0.2em] uppercase font-sans">
          <button onClick={() => { handleNav('home'); setTimeout(() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }), 100) }} className="hover:text-brand-accent transition-colors outline-none focus:text-brand-accent text-apple-simple">
            {t({ en: 'Services', fr: 'Services' })}
          </button>
          <button onClick={() => { handleNav('home'); setTimeout(() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' }), 100) }} className="hover:text-brand-accent transition-colors outline-none focus:text-brand-accent text-apple-simple">
            {t({ en: 'Arsenal', fr: 'Arsenal' })}
          </button>
          <button onClick={() => { handleNav('home'); setTimeout(() => document.getElementById('approach')?.scrollIntoView({ behavior: 'smooth' }), 100) }} className="hover:text-brand-accent transition-colors outline-none focus:text-brand-accent text-apple-simple">
            {t({ en: 'Approach', fr: 'Approche' })}
          </button>

          <div className="w-px h-4 bg-black/10 mx-2" />

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang('en')}
              className={`hover:text-brand-accent transition-all ${lang === 'en' ? 'text-brand-accent underline' : 'text-gray-400'}`}
              aria-label="Switch to English"
            >
              EN
            </button>
            <span className="text-gray-300">/</span>
            <button
              onClick={() => setLang('fr')}
              className={`hover:text-brand-accent transition-all ${lang === 'fr' ? 'text-brand-accent underline' : 'text-gray-400'}`}
              aria-label="Passer en Français"
            >
              FR
            </button>
          </div>

          <div className="w-px h-4 bg-black/10 mx-2" />

          {/* User / Auth Menu */}
          <div className="relative" onMouseLeave={() => setIsAuthMenuOpen(false)}>
            <button
              onMouseEnter={() => setIsAuthMenuOpen(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 hover:bg-black/5 ${currentPage !== 'home' ? 'text-brand-accent' : 'text-gray-900'}`}
            >
              <iconify-icon icon="ph:user-circle-bold" width="24" />
              <iconify-icon icon="ph:caret-down-bold" width="10" className={`transition-transform duration-300 ${isAuthMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            <div className={`absolute top-full right-0 mt-2 w-48 glass bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-black/5 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 origin-top-right ${isAuthMenuOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'}`}>
              <div className="p-1 flex flex-col gap-1">
                <button
                  onClick={() => handleNav('login')}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-gray-200 font-sans"
                >
                  <iconify-icon icon="ph:sign-in-bold" width="14" />
                  {t({ en: 'Log In', fr: 'Connexion' })}
                </button>
                <button
                  onClick={() => handleNav('signup')}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-700 dark:text-gray-200 font-sans"
                >
                  <iconify-icon icon="ph:user-plus-bold" width="14" />
                  {t({ en: 'Sign Up', fr: 'S\'inscrire' })}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={() => openContact()}
            className={`ml-2 px-6 py-2 rounded-full border border-black/5 transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden outline-none focus:ring-2 focus:ring-brand-accent hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] ${isScrolled ? 'bg-gray-900 text-white' : 'glass'
              }`}
          >
            <span className="relative z-10">{t({ en: 'Start Project', fr: 'Lancer un Projet' })}</span>
            {!isScrolled && (
              <div className="absolute inset-0 bg-brand-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu Trigger */}

      </div>
    </nav>
  );
};

export default Navbar;
