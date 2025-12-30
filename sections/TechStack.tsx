
import React from 'react';
import { useLanguage } from '../App';
import '../types';

const TECH_LOGOS = [
  { icon: "simple-icons:react", name: "React" },
  { icon: "simple-icons:typescript", name: "TypeScript" },
  { icon: "simple-icons:tailwindcss", name: "Tailwind" },
  { icon: "simple-icons:googlecloud", name: "GCP" },
  { icon: "simple-icons:postgresql", name: "PostgreSQL" },
  { icon: "simple-icons:openai", name: "OpenAI" },
  { icon: "simple-icons:framer", name: "Framer" },
  { icon: "simple-icons:vercel", name: "Vercel" },
  { icon: "simple-icons:rust", name: "Rust" },
  { icon: "simple-icons:docker", name: "Docker" },
  { icon: "simple-icons:amazonwebservices", name: "AWS" },
  { icon: "simple-icons:figma", name: "Figma" },
];

const TechStack: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="capabilities" className="py-40 px-[5%] border-t border-white/5 bg-black/[0.1]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="space-y-12">
          <div className="space-y-6">
            <span className="text-[11px] font-bold tracking-[0.5em] uppercase text-white/40 font-sans">
              {t({ en: 'The Technology Layer', fr: 'La Couche Technologique' })}
            </span>
            <h2 className="text-5xl md:text-7xl font-light tracking-tighter uppercase text-apple-shade font-sans">
              {t({ en: 'SYSTEM ', fr: 'NOTRE ' })} <span className="italic font-bold">{t({ en: 'ARCHITECTURE', fr: 'ARCHITECTURE' })}</span>
            </h2>
          </div>
          <p className="glass-panel text-lg !p-10 !bg-white/[0.03] border-white/5 leading-relaxed font-light font-sans max-w-2xl">
            {t({
              en: "We deploy specific deterministic stacks tailored for scale. Our logic follows a rigid path of safety, speed, and cross-browser resilience.",
              fr: "Nous déployons des piles déterministes spécifiques conçues pour l'échelle. Notre logique suit un chemin rigide de sécurité et de vitesse."
            })}
          </p>
          <div className="flex flex-wrap gap-4">
            {['Cloud-Native', 'Type-Safe', 'Edge-Optimized', 'AI-First'].map(tag => (
              <div key={tag} className="glass px-8 py-3 rounded-full text-[10px] font-bold tracking-[0.3em] uppercase border-white/10 text-white/80 hover:bg-white hover:text-black transition-all duration-500 cursor-default font-sans">
                {t({
                  en: tag,
                  fr: tag === 'Cloud-Native' ? 'Cloud-Natif' :
                    tag === 'Type-Safe' ? 'Type-Sûr' :
                      tag === 'Edge-Optimized' ? 'Optimisé Edge' : 'Priorité IA'
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 p-12 glass rounded-[50px] border-white/10 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.7)] relative overflow-hidden bg-black/40 backdrop-blur-3xl">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/[0.02] blur-[100px] rounded-full" />
          {TECH_LOGOS.map((tech, i) => (
            <div
              key={i}
              className="aspect-square glass bg-white/[0.04] border-white/5 rounded-[24px] flex flex-col items-center justify-center gap-3 group hover:bg-white hover:scale-110 hover:-translate-y-2 cursor-pointer transition-all duration-500 shadow-lg"
            >
              <iconify-icon icon={tech.icon} width="40" height="40" className="text-apple-simple group-hover:text-black transition-colors duration-500" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-apple-simple group-hover:text-black font-sans">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
