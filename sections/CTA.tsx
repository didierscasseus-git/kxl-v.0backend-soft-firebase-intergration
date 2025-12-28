
import React from 'react';
import { useLanguage, useContact } from '../App';
import '../types';

const CTA: React.FC = () => {
  const { t } = useLanguage();
  const { openContact } = useContact();

  return (
    <section id="cta" className="py-40 px-[5%] relative overflow-hidden bg-transparent transition-colors duration-500">
      <div className="absolute inset-0 bg-white/50 dark:bg-black/50 -z-10" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent" />

      <div className="max-w-5xl mx-auto glass-panel p-12 md:p-24 text-center space-y-12 relative overflow-hidden">
        <div className="space-y-6">
          <h2 className="text-5xl md:text-8xl font-extralight tracking-tighter leading-none uppercase text-apple-shade font-sans">
            {t({ en: 'READY FOR ', fr: 'PRÊT POUR ' })} <br />
            <span className="font-bold italic text-brand-accent">{t({ en: 'THE UPGRADE?', fr: 'LA MISE À NIVEAU ?' })}</span>
          </h2>
          <p className="text-sm md:text-xl text-apple-simple font-light max-w-2xl mx-auto font-sans">
            {t({
              en: 'Secure your slot in our next development cycle. We only partner with brands ready to commit to deterministic excellence.',
              fr: 'Réservez votre place dans notre prochain cycle de développement. Nous ne collaborons qu\'avec des marques prêtes à s\'engager vers l\'excellence déterministe.'
            })}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* Primary Glow Button */}
          <button
            onClick={() => openContact(t({
              en: "I am ready to initialize the protocol. Please send the onboarding requirements.",
              fr: "Je suis prêt à initialiser le protocole. Veuillez envoyer les conditions d'intégration."
            }))}
            className="w-full sm:w-auto bg-brand-black dark:bg-white text-white dark:text-black px-12 py-6 rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all duration-500 shadow-2xl hover:shadow-[0_0_50px_rgba(163,163,163,0.5)] relative group overflow-hidden font-sans"
          >
            <span className="relative z-10">{t({ en: 'Initialize Protocol', fr: 'Initialiser le Protocole' })}</span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>

          {/* Secondary Glass Button */}
          <button
            onClick={() => openContact(t({
              en: "I am requesting a system audit for our organization.",
              fr: "Je demande un audit système pour notre organisation."
            }))}
            className="w-full sm:w-auto glass px-12 py-6 rounded-full font-bold uppercase tracking-[0.2em] text-xs hover:scale-105 active:scale-95 transition-all duration-500 hover:border-brand-accent hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] text-apple-shade dark:text-white font-sans"
          >
            {t({ en: 'Request Audit', fr: 'Demander un Audit' })}
          </button>
        </div>

        <div className="pt-12 flex flex-col md:flex-row items-center justify-center gap-12 opacity-60 text-[10px] font-bold tracking-[0.3em] uppercase font-sans">
          <div className="flex items-center gap-3">
            <iconify-icon icon="ph:check-circle-fill" className="text-apple-simple/40" />
            <span className="text-apple-simple">{t({ en: 'COMPLIANT', fr: 'CONFORME' })}</span>
          </div>
          <div className="flex items-center gap-3">
            <iconify-icon icon="ph:shield-check-fill" className="text-apple-simple/40" />
            <span className="text-apple-simple">{t({ en: 'ENCRYPTED COMMS', fr: 'COMMS CRYPTÉES' })}</span>
          </div>
          <div className="flex items-center gap-3">
            <iconify-icon icon="ph:cpu-fill" className="text-brand-accent" />
            <span className="text-apple-simple">{t({ en: 'HIGH THROUGHPUT', fr: 'HAUT DÉBIT' })}</span>
          </div>
        </div>
      </div>

      <svg className="absolute top-0 left-0 w-full h-full -z-20 pointer-events-none opacity-20" preserveAspectRatio="none">
        <path d="M-100 200 C 200 100, 400 400, 600 200 S 1000 0, 1400 300" stroke="#A3A3A3" fill="none" strokeWidth="1" />
        <path d="M-100 500 C 300 300, 600 600, 900 400 S 1300 700, 1600 500" stroke="#A3A3A3" fill="none" strokeWidth="1" />
      </svg>
    </section>
  );
};

export default CTA;
