
import React, { useEffect, useRef, useMemo } from 'react';
import { useLanguage, useContact, usePage } from '../App';

const Hero: React.FC = () => {
  const { t } = useLanguage();
  const { openContact } = useContact();
  const { setPage } = usePage();

  // Parallax Refs
  const textRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);

  // Generate particles for ethereal effect
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      // eslint-disable-next-line react-hooks/purity
      left: Math.random() * 100,
      // eslint-disable-next-line react-hooks/purity
      top: Math.random() * 100,
      // eslint-disable-next-line react-hooks/purity
      size: Math.random() * 3 + 1,
      // eslint-disable-next-line react-hooks/purity
      opacity: Math.random() * 0.3 + 0.1,
      // eslint-disable-next-line react-hooks/purity
      duration: Math.random() * 15 + 10 + 's',
      // eslint-disable-next-line react-hooks/purity
      delay: Math.random() * -20 + 's',
    }));
  }, []);

  const titleLine1 = t({ en: 'DESIGN', fr: 'DESIGN' });
  const titleLine2 = t({ en: 'ENGINEERED FOR SCALE', fr: 'CONÇU POUR L\'ÉCHELLE' });

  useEffect(() => {
    const scrollRoot = document.getElementById('scroll-root');
    if (!scrollRoot) return;

    let requestId: number;

    const handleScroll = () => {
      requestId = requestAnimationFrame(() => {
        const scrollY = scrollRoot.scrollTop;

        if (textRef.current) {
          textRef.current.style.transform = `translateY(${scrollY * 0.15}px)`;
        }
        if (blob1Ref.current) {
          blob1Ref.current.style.transform = `translateY(${scrollY * 0.25}px)`;
        }
        if (blob2Ref.current) {
          blob2Ref.current.style.transform = `translateY(${scrollY * 0.1}px)`;
        }
      });
    };

    scrollRoot.addEventListener('scroll', handleScroll);

    return () => {
      scrollRoot.removeEventListener('scroll', handleScroll);
      if (requestId) cancelAnimationFrame(requestId);
    };
  }, []);

  return (
    <section aria-labelledby="hero-heading" className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-[5%] overflow-hidden">

      {/* Particles Layer */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        {particles.map((p) => (

          <div
            key={p.id}
            className="absolute bg-white rounded-full animate-float"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationDuration: p.duration,
              animationDelay: p.delay,
              boxShadow: `0 0 ${p.size * 2}px rgba(255, 255, 255, 0.4)`
            }}
          />
        ))}
      </div>

      <div
        ref={textRef}
        className="absolute top-24 left-[5%] text-[25vw] md:text-[120px] font-bold text-white/5 select-none pointer-events-none will-change-transform font-sans transition-colors duration-500 z-0"
      >
        01
      </div>

      <div
        ref={blob1Ref}
        className="absolute top-[20%] left-[10%] w-[35vw] h-[35vw] pointer-events-none will-change-transform z-0"
      >
        <div className="w-full h-full bg-brand-accent/5 blur-[130px] rounded-full animate-float opacity-30" />
      </div>

      <div
        ref={blob2Ref}
        className="absolute bottom-[10%] right-[15%] w-[30vw] h-[30vw] pointer-events-none will-change-transform z-0"
      >
        { }
        <div className="w-full h-full bg-brand-accent/5 blur-[100px] rounded-full animate-float opacity-20" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto space-y-6 flex flex-col items-start text-left">

        <div className="relative">
          {/* Mockup Reflected Box: Large white area for focus */}
          <div className="absolute -inset-8 bg-white/10 blur-2xl rounded-[40px] pointer-events-none" />

          <h1 id="hero-heading" className="text-6xl md:text-8xl lg:text-[140px] font-sans font-black tracking-tighter leading-[0.9] text-left my-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-white/95 to-white/70 drop-shadow-[0_10px_30px_rgba(0,0,0,0.4)] relative">
            <span className="block">
              {titleLine1}
            </span>
            <span className="block mt-2 md:mt-0">
              {titleLine2}
            </span>
          </h1>
        </div>

        <div className="max-w-4xl mt-8 flex flex-col md:flex-row gap-12 items-start">
          {/* Decorative Indicator Column from Image 1 */}
          <div className="hidden md:flex flex-col gap-8 py-4 opacity-80">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-4 group">
                <iconify-icon icon="ph:arrow-up-right-bold" className="text-white text-3xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </div>
            ))}
          </div>

          <div className="space-y-8 flex-1">
            <div className="glass-panel text-lg md:text-2xl leading-relaxed font-light font-sans text-left tracking-wide !bg-white/10 !backdrop-blur-[40px] border-white/20">
              {t({
                en: 'High-performance digital ecosystems that power your most ambitious objectives. Precise. Scalable. Invisible.',
                fr: 'Des écosystèmes numériques haute performance qui propulsent vos objectifs les plus ambitieux. Précis. Évolutifs. Invisibles.'
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-start gap-6 w-full">
              <button
                onClick={() => openContact()}
                className="w-full sm:w-auto bg-white text-black px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[14px] hover:scale-105 active:scale-95 transition-all duration-500 shadow-[0_10px_30px_rgba(255,255,255,0.2)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.4)] group relative overflow-hidden"
              >
                <span className="relative z-10">{t({ en: 'Start Rebuild', fr: 'Lancer Reconstruction' })}</span>
                <div className="absolute inset-0 bg-brand-accent/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              </button>

              <button
                onClick={() => setPage('casestudies')}
                className="w-full sm:w-auto glass px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[14px] hover:scale-105 active:scale-95 transition-all duration-500 hover:bg-white/10 text-white border border-white/20"
              >
                {t({ en: 'Explore Case Files', fr: 'Explorer les Cas' })}

              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
