
import React, { useState, useEffect, useRef } from 'react';
import { SERVICES } from '../constants';
import { useLanguage, useContact } from '../App';
import '../types';

const Services: React.FC = () => {
    const [activeIdx, setActiveIdx] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);
    const [inView, setInView] = useState(false);
    const { t } = useLanguage();
    const { openContact } = useContact();

    const activeService = SERVICES[activeIdx];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setInView(true);
            },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} id="services" className="min-h-screen bg-transparent py-32 px-[5%] relative overflow-hidden flex flex-col justify-center transition-colors duration-500">

            {/* Header Content */}
            <div className={`mb-16 max-w-2xl relative z-10 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="space-y-4 mb-6">
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-brand-accent font-sans">
                        {t({ en: 'Service Layer', fr: 'Couche de Service' })}
                    </span>
                    <h2 className="text-4xl md:text-6xl font-light tracking-tighter uppercase text-apple-shade font-sans">
                        {t({ en: 'SOLUTION ', fr: 'MATRICE ' })} <span className="italic">{t({ en: 'FRAMEWORK', fr: 'DE SOLUTIONS' })}</span>
                    </h2>
                </div>
                <p className="glass-panel text-sm md:text-base max-w-xl leading-relaxed font-sans">
                    {t({
                        en: 'Deterministic execution across the full stack of modern brand requirements. From core identity to complex platform logic.',
                        fr: 'Exécution déterministe à travers toute la pile des exigences de marque modernes. De l\'identité de base à la logique de plateforme complexe.'
                    })}
                </p>
            </div>

            {/* Main Interface Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative z-10 items-start">

                {/* Left Column: Navigation List */}
                <div className={`lg:col-span-5 flex flex-col justify-center space-y-4 lg:sticky lg:top-32 transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    {SERVICES.map((item, idx) => (
                        <div
                            key={idx}
                            onMouseEnter={() => setActiveIdx(idx)}
                            className={`cursor-pointer transition-all duration-500 ease-out group flex items-center justify-between border-b border-white/5 pb-4 ${activeIdx === idx
                                ? 'opacity-100 translate-x-4 border-brand-accent/50'
                                : 'opacity-60 hover:opacity-100 hover:translate-x-2'
                                }`}
                        >
                            <h3 className="text-xl md:text-2xl font-medium tracking-tight whitespace-nowrap font-sans text-apple-simple">
                                {t(item.title)}
                            </h3>
                            <div className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-all ${activeIdx === idx ? 'bg-brand-accent text-black rotate-0 scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : '-rotate-45 text-white'}`}>
                                <iconify-icon icon="ph:arrow-right-thin" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column: Service Visualizer */}
                <div className={`lg:col-span-7 relative w-full aspect-[4/3] lg:aspect-auto lg:h-[600px] mt-8 lg:mt-0 transition-all duration-1000 delay-300 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    {/* The "Card" container */}
                    <div className="absolute inset-0 bg-[#0c0c0c] rounded-[32px] border border-white/10 overflow-hidden shadow-2xl transition-all duration-300">

                        {/* Background Grid */}
                        { }
                        <div className="absolute inset-0 opacity-20 pointer-events-none"
                            style={{
                                backgroundImage: 'radial-gradient(circle at 1px 1px, #333 1px, transparent 0)',
                                backgroundSize: '24px 24px'
                            }}
                        />

                        {/* Content Layer - Crossfading Keyed on Index */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div key={activeIdx} className="w-full h-full flex flex-col items-center justify-center relative p-8 md:p-16">

                                {/* Decorative Background Elements */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-accent/5 rounded-full blur-[80px] animate-pulse-slow" />
                                <div className="absolute inset-0 border-[0.5px] border-white/5 rounded-[32px] m-4 pointer-events-none" />

                                {/* Main Icon Display */}
                                <div className="relative mb-12 animate-pop-in">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl glass bg-white/5 border-white/10 flex items-center justify-center relative overflow-hidden shadow-2xl">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
                                        <iconify-icon icon={activeService.icon} width="64" className="text-white relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />

                                        {/* Scanning Beam Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-accent/20 to-transparent h-[200%] w-full animate-scan pointer-events-none" />
                                    </div>
                                    {/* Orbiting Dots */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] border border-white/5 rounded-full animate-spin-slow pointer-events-none border-dashed" />
                                </div>

                                {/* Text Content */}
                                <div className="text-center space-y-4 max-w-md animate-slide-up">
                                    <div className="flex items-center justify-center gap-3 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-apple-simple font-sans">{t({ en: 'System Active', fr: 'Système Actif' })}</span>
                                    </div>

                                    <h3 className="text-2xl md:text-4xl font-light tracking-tighter font-sans text-apple-shade">
                                        {t(activeService.title)}
                                    </h3>

                                    <p className="text-apple-simple font-light leading-relaxed font-sans">
                                        {t(activeService.description)}
                                    </p>
                                </div>

                                {/* Action Button inside card */}
                                <button
                                    onClick={() => {
                                        const serviceName = t(activeService.title);
                                        openContact(t({
                                            en: `I am interested in deploying: ${serviceName}. Please provide the diagnostic protocol for our unit.`,
                                            fr: `Je suis intéressé par le déploiement de : ${serviceName}. Veuillez fournir le protocole de diagnostic pour notre unité.`
                                        }));
                                    }}
                                    className="mt-8 px-8 py-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all duration-300 text-[10px] font-bold uppercase tracking-widest animate-fade-in delay-200 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] font-sans"
                                >
                                    {t({ en: 'Initialize Solution', fr: 'Initialiser Solution' })}

                                </button>

                            </div>
                        </div>

                        {/* Metadata Overlay Controls (Top Right) */}
                        <div className="absolute top-6 right-6 flex gap-3 z-20">
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all cursor-pointer hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                <iconify-icon icon="ph:info-bold" width="14" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all cursor-pointer hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                <iconify-icon icon="ph:arrows-out-simple-bold" width="14" />
                            </div>
                        </div>

                        {/* Bottom Left Index */}
                        <div className="absolute bottom-6 left-8 z-20 pointer-events-none">
                            <span className="text-[120px] font-bold text-white/5 leading-none -mb-8 font-sans">
                                0{activeIdx + 1}
                            </span>
                        </div>

                    </div>
                </div>
            </div>

            <style>{`
            .animate-pop-in {
                animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
            .animate-slide-up {
                animation: slideUp 0.5s ease-out forwards;
            }
            .animate-fade-in {
                opacity: 0;
                animation: fadeIn 0.5s ease-out forwards;
            }
            .animate-scan {
                animation: scan 3s linear infinite;
            }
            
            @keyframes popIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeIn {
                to { opacity: 1; }
            }
            @keyframes scan {
                0% { transform: translateY(-50%); }
                100% { transform: translateY(50%); }
            }
        `}</style>
        </section>
    );
};

export default Services;
