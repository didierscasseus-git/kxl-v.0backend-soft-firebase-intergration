
import React from 'react';
import { APPROACH } from '../constants';
import { useLanguage } from '../App';

const Approach: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="approach" className="py-40 px-[5%] relative overflow-hidden bg-transparent">
      <div className="text-center mb-32 max-w-3xl mx-auto space-y-6">
        <span className="text-[11px] font-bold tracking-[0.5em] uppercase text-white/40 font-sans">
          {t({ en: 'Execution Methodology', fr: 'Méthodologie d\'Exécution' })}
        </span>
        <h2 className="text-5xl md:text-8xl font-light tracking-tighter uppercase text-apple-shade font-sans">
          {t({ en: 'LAB ', fr: 'CYCLE ' })} <span className="italic font-bold">{t({ en: 'CYCLE', fr: 'LABO' })}</span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 hidden md:block" />

        <div className="space-y-24">
          {APPROACH.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col md:flex-row items-center gap-10 md:gap-32 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start text-center md:text-left space-y-4">
                <span className="text-7xl font-black text-white/[0.03] italic font-sans leading-none">{item.stage}</span>
                <h3 className="text-2xl font-bold uppercase tracking-[0.3em] text-white font-sans">{t(item.label)}</h3>
                <p className="text-sm md:text-base text-apple-simple max-w-md font-sans leading-relaxed">{t(item.details)}</p>
              </div>

              <div className="relative z-10 flex-shrink-0">
                <div className="w-20 h-20 rounded-[30px] glass border-white/20 flex items-center justify-center bg-black shadow-2xl relative overflow-hidden group hover:scale-110 transition-transform duration-500">
                  <div className="absolute inset-0 bg-white scale-0 group-hover:scale-100 transition-transform duration-700 rounded-full opacity-10" />
                  <span className="relative z-10 font-bold text-xl text-white font-sans">{item.stage}</span>
                </div>
                {idx === 0 && <div className="absolute inset-0 animate-pulse-sonar bg-white/20 rounded-full" />}
              </div>

              <div className="hidden md:block w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Approach;
