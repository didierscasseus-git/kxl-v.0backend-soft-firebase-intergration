import React, { useState, useEffect } from 'react';
import { useLanguage, useContact, usePage } from '../App';
import { useAuth } from '../context/AuthContext';
import HueJoystick from './HueJoystick';
import ProfileCRM from './ProfileCRM';
import { useRef } from 'react';
import '../types';

// Refined Vocabulary for Apple/Google style professional-accessibility
const SECTIONS = [
  { id: 'hero', name: { en: 'Home', fr: 'Accueil' }, icon: 'ph:house-thin' },
  { id: 'infrastructure', name: { en: 'System Status', fr: 'État du système' }, icon: 'ph:cpu-thin' },
  { id: 'services', name: { en: 'Services', fr: 'Services' }, icon: 'ph:grid-four-thin' },
  { id: 'capabilities', name: { en: 'Resources', fr: 'Ressources' }, icon: 'ph:shield-check-thin' },
  { id: 'approach', name: { en: 'Process', fr: 'Processus' }, icon: 'ph:recycle-thin' },
  { id: 'cta', name: { en: 'Guidelines', fr: 'Directives' }, icon: 'ph:lock-key-thin' },
];

const Sidebar: React.FC = () => {
  const [folded, setFolded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [crmOpen, setCrmOpen] = useState(false);
  const authMenuRef = useRef<HTMLDivElement>(null);

  const { t } = useLanguage();
  const { openHistory } = useContact();
  const { setPage, currentPage } = usePage();
  const { user, logout, profile } = useAuth();

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
  }, [activeIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (authMenuRef.current && !authMenuRef.current.contains(event.target as Node)) {
        setAuthMenuOpen(false);
      }
    };
    if (authMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [authMenuOpen]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <nav
        id="nav-root"
        className="fixed left-6 top-6 z-50 flex flex-col items-center"
      >
        {/* Logo with Dynamic Whiteboard Casing */}
        <div className="relative mb-6">
          <button
            onClick={() => setFolded(!folded)}
            className="w-[clamp(44px,5vw,56px)] h-[clamp(44px,5vw,56px)] glass rounded-2xl flex items-center justify-center font-bold italic text-lg border-white/10 shadow-2xl hover:scale-105 transition-all bg-black/80 text-white z-20 relative"
            aria-label="Toggle Navigation"
          >
            KX
          </button>

          {/* Master Whiteboard Connector Line */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 top-full w-[1px] bg-gradient-to-b from-white/40 to-white/5 transition-all duration-700 -z-5 ${folded ? 'h-0 opacity-0' : 'h-[75vh] opacity-100'
              }`}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              transitionDelay: folded ? '0ms' : '150ms'
            }}
          />
        </div>

        {/* Navigation Stack - Whiteboard Pull-Down Effect (Segmented) */}
        <div
          className={`flex flex-col gap-[clamp(8px,1.5vh,16px)] origin-top transition-all ${folded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          style={{
            transitionDuration: '700ms',
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
          }}
        >
          {SECTIONS.map((section, idx) => {
            const isActive = activeIndex === idx;
            const staggerDelay = folded
              ? (SECTIONS.length - 1 - idx) * 35
              : idx * 50;

            return (
              <div
                key={section.id}
                className="relative flex items-center justify-center"
                style={{
                  transitionDelay: `${staggerDelay}ms`,
                  transitionProperty: 'transform, opacity',
                  transitionDuration: '700ms',
                  transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: folded ? 'translateY(-100%) scale(0.8)' : 'translateY(0) scale(1)',
                  opacity: folded ? 0 : 1,
                  zIndex: SECTIONS.length - idx
                }}
              >
                {/* Individual Whiteboard Segment - This unrolls from the logo */}
                <div
                  className={`absolute inset-0 w-[clamp(44px,5vw,56px)] left-1/2 -translate-x-1/2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 transition-all -z-10 ${folded ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
                    }`}
                  style={{
                    transitionDuration: '800ms',
                    transitionDelay: `${staggerDelay}ms`,
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.76, 0.64, 1)' // Higher bounce for the board itself
                  }}
                />

                <button
                  onClick={() => scrollTo(section.id)}
                  title={t(section.name)}
                  className={`group relative w-[clamp(36px,4vw,48px)] h-[clamp(36px,4vw,48px)] flex items-center justify-center rounded-2xl transition-all ${isActive ? 'bg-white text-black shadow-lg scale-110' : 'bg-transparent text-gray-400 hover:text-white'
                    }`}
                  style={{
                    transitionDelay: `${staggerDelay + 50}ms`,
                    transitionDuration: '600ms',
                    transitionTimingFunction: 'cubic-bezier(0.34, 1.76, 0.64, 1)'
                  }}
                >
                  <iconify-icon icon={section.icon} width="22" />
                  <span className="absolute left-[calc(100%+24px)] bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white opacity-0 -translate-x-2 pointer-events-none transition-all group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap">
                    {t(section.name)}
                  </span>
                </button>
              </div>
            );
          })}


          {/* Auth/User Actions - Continued Stagger */}
          <div
            className={`mt-4 pt-4 border-t border-white/5 flex flex-col gap-4 items-center transition-all ${folded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            style={{
              transitionDelay: folded ? '0ms' : `${SECTIONS.length * 50}ms`,
              transitionDuration: '700ms',
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: folded ? 'translateY(-20px)' : 'translateY(0)'
            }}
          >
            {user && (
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => setCrmOpen(true)}
                  title="Account Hub"
                  className="w-[clamp(36px,4vw,48px)] h-[clamp(36px,4vw,48px)] flex items-center justify-center rounded-2xl bg-brand-accent/20 text-brand-accent border border-brand-accent/30 hover:bg-brand-accent/30 transition-all"
                >
                  <iconify-icon icon="ph:cpu-duotone" width="22" />
                </button>
                <button
                  onClick={() => setPage('premium')}
                  title="Project Timeline"
                  className={`w-[clamp(36px,4vw,48px)] h-[clamp(36px,4vw,48px)] flex items-center justify-center rounded-2xl transition-all ${currentPage === 'premium' ? 'bg-brand-accent text-white shadow-lg' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <iconify-icon icon="ph:clock-counter-clockwise-thin" width="22" />
                </button>
              </div>
            )}

            <button
              onClick={() => setAuthMenuOpen(!authMenuOpen)}
              className={`w-[clamp(36px,4vw,48px)] h-[clamp(36px,4vw,48px)] flex items-center justify-center rounded-2xl transition-all ${authMenuOpen ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
            >
              <iconify-icon icon="ph:user-circle-thin" width="22" />
            </button>
          </div>

          {/* Hue Controller - Staggered last */}
          <div
            className={`mt-2 scale-75 origin-top transition-all ${folded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            style={{
              transitionDelay: folded ? '0ms' : `${(SECTIONS.length + 1) * 50}ms`,
              transitionDuration: '700ms',
              transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: folded ? 'translateY(-20px)' : 'translateY(0)'
            }}
          >
            <HueJoystick />
          </div>
        </div>

        {/* Auth Sub-Menu (Popover style) */}
        {authMenuOpen && (
          <div
            ref={authMenuRef}
            className="absolute left-[calc(100%+24px)] top-0 w-64 glass animate-window-pop rounded-3xl p-2 border border-white/10 shadow-2xl"
          >
            <div className="p-3 border-b border-white/5 mb-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent mb-1">Session Protocol</p>
              <p className="text-[12px] text-white font-medium truncate">{user ? (user.displayName || user.email) : 'Guest Access'}</p>
            </div>
            <div className="flex flex-col gap-1">
              {!user ? (
                <>
                  <button onClick={() => setPage('login')} className="w-full text-left p-3 rounded-2xl hover:bg-white/5 text-[11px] font-bold uppercase tracking-widest text-white flex items-center gap-3">
                    <iconify-icon icon="ph:sign-in-thin" width="18" /> Log In
                  </button>
                  <button onClick={() => setPage('signup')} className="w-full text-left p-3 rounded-2xl hover:bg-white/5 text-[11px] font-bold uppercase tracking-widest text-white flex items-center gap-3">
                    <iconify-icon icon="ph:user-plus-thin" width="18" /> Sign Up
                  </button>
                </>
              ) : (
                <button onClick={logout} className="w-full text-left p-3 rounded-2xl hover:bg-red-500/10 text-[11px] font-bold uppercase tracking-widest text-red-500 flex items-center gap-3">
                  <iconify-icon icon="ph:sign-out-thin" width="18" /> Disconnect
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <ProfileCRM isOpen={crmOpen} onClose={() => setCrmOpen(false)} />
    </>
  );
};

export default Sidebar;
