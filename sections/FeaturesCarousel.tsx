
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../App';
import '../types';

// Define the data structure for the engine items
const WORKFLOWS = [
    {
        id: 'vfx',
        label: { en: 'Visual Effects', fr: 'Effets Visuels' },
        description: { en: 'Procedural generation for film-grade assets.', fr: 'Génération procédurale pour des actifs de qualité cinéma.' },
        nodes: [
            { label: 'Raw Footage', color: '#525252' },
            { label: 'Depth Map', color: '#888888' },
            { label: 'Composited', color: '#262626' }
        ]
    },
    {
        id: 'fashion',
        label: { en: 'Fashion', fr: 'Mode' },
        description: { en: 'Virtual prototyping for garment physics.', fr: 'Prototypage virtuel pour la physique des vêtements.' },
        nodes: [
            { label: 'Pattern', color: '#d4d4d4' },
            { label: 'Drape Sim', color: '#737373' },
            { label: 'Render', color: '#a3a3a3' }
        ]
    },
    {
        id: 'advertising',
        label: { en: 'Advertising', fr: 'Publicité' },
        description: { en: 'Dynamic asset variation at scale.', fr: 'Variation dynamique des actifs à l\'échelle.' },
        nodes: [
            { label: 'Brief', color: '#999999' },
            { label: 'Variation', color: '#525252' },
            { label: 'Campaign', color: '#000000' }
        ]
    },
    {
        id: 'photography',
        label: { en: 'Photography', fr: 'Photographie' },
        description: { en: 'AI-enhanced lighting and composition.', fr: 'Éclairage et composition améliorés par l\'IA.' },
        nodes: [
            { label: 'RAW', color: '#262626' },
            { label: 'Grade', color: '#808080' },
            { label: 'Export', color: '#cccccc' }
        ]
    },
    {
        id: 'concepting',
        label: { en: 'Concepting', fr: 'Conception' },
        description: { en: 'Rapid iteration of visual ideas.', fr: 'Itération rapide d\'idées visuelles.' },
        nodes: [
            { label: 'Sketch', color: '#a3a3a3' },
            { label: 'Expand', color: '#666666' },
            { label: 'Concept', color: '#333333' }
        ]
    },
    {
        id: 'branding',
        label: { en: 'Branding', fr: 'Marque' },
        description: { en: 'Consistent identity system generation.', fr: 'Génération de systèmes d\'identité cohérents.' },
        nodes: [
            { label: 'Logo', color: '#000000' },
            { label: 'System', color: '#525252' },
            { label: 'Assets', color: '#999999' }
        ]
    },
    {
        id: 'motion',
        label: { en: 'Motion', fr: 'Mouvement' },
        description: { en: 'Automated keyframe interpolation.', fr: 'Interpolation automatisée des images clés.' },
        nodes: [
            { label: 'Keyframe', color: '#737373' },
            { label: 'Tween', color: '#404040' },
            { label: 'Video', color: '#1a1a1a' }
        ]
    },
    {
        id: 'architecture',
        label: { en: 'Architecture', fr: 'Architecture' },
        description: { en: 'Spatial computing and structural vis.', fr: 'Informatique spatiale et visualisation structurelle.' },
        nodes: [
            { label: 'CAD', color: '#a3a3a3' },
            { label: 'Light Sim', color: '#d4d4d4' },
            { label: 'Walkthrough', color: '#525252' }
        ]
    },
];

const FeaturesCarousel: React.FC = () => {
    const [activeId, setActiveId] = useState('vfx');
    const sectionRef = useRef<HTMLElement>(null);
    const [inView, setInView] = useState(false);
    const { t } = useLanguage();

    const activeItem = WORKFLOWS.find(w => w.id === activeId) || WORKFLOWS[0];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setInView(true);
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} id="features" className="min-h-screen bg-transparent text-white py-24 px-[5%] relative overflow-hidden flex flex-col justify-center">
            {/* Background Ambient */}
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-white/5 rounded-full blur-[150px] pointer-events-none" />

            {/* Header Content */}
            <div className={`mb-16 max-w-2xl relative z-10 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h2 className="text-3xl md:text-5xl font-light tracking-tighter mb-6 font-sans text-apple-shade">
                    {t({ en: 'Generative workflows that scale.', fr: 'Des flux génératifs qui s\'adaptent.' })}
                </h2>
                <p className="glass-panel text-sm md:text-base max-w-xl leading-relaxed font-sans">
                    {t({
                        en: 'Teams use Kaza X to explore possibilities and amplify their creative output through deterministic node-based architecture.',
                        fr: 'Les équipes utilisent Kaza X pour explorer les possibilités et amplifier leur production créative grâce à une architecture déterministe basée sur des nœuds.'
                    })}
                </p>
                <button className="mt-8 px-6 py-3 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] font-sans">
                    {t({ en: 'See all workflows', fr: 'Voir tous les flux' })}
                </button>
            </div>

            {/* Main Interface Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative z-10 items-start">

                {/* Left Column: Navigation List */}
                <div className={`lg:col-span-5 flex flex-col justify-center space-y-2 lg:sticky lg:top-24 transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    {WORKFLOWS.map((item) => (
                        <div
                            key={item.id}
                            onMouseEnter={() => setActiveId(item.id)}
                            className={`cursor-pointer transition-all duration-200 ease-out group flex items-center ${activeId === item.id
                                ? 'opacity-100 translate-x-2 lg:translate-x-4'
                                : 'opacity-40 hover:opacity-70'
                                }`}
                        >
                            <h3 className="text-3xl md:text-5xl lg:text-6xl font-medium tracking-tight whitespace-nowrap font-sans text-apple-simple">
                                {t(item.label)}
                            </h3>
                        </div>
                    ))}
                </div>

                {/* Right Column: Node Graph Visualizer */}
                <div className={`lg:col-span-7 relative w-full aspect-[4/3] lg:aspect-auto lg:h-[600px] mt-8 lg:mt-0 transition-all duration-1000 delay-300 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                    {/* The "Card" container */}
                    <div className="absolute inset-0 bg-[#0c0c0c] rounded-3xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 group">

                        {/* Background Grid */}
                        { }
                        <div className="absolute inset-0 opacity-20"
                            style={{
                                backgroundImage: 'radial-gradient(circle at 1px 1px, #333 1px, transparent 0)',
                                backgroundSize: '24px 24px'
                            }}
                        />

                        {/* Content Layer - Crossfading */}
                        <div className="absolute inset-0 p-4 md:p-8 flex items-center justify-center">
                            {/* Keyed container for refresh on state change - CRITICAL: This key={activeId} forces re-render of animations */}
                            <div key={activeId} className="w-full h-full flex items-center justify-between relative">

                                {/* Node Graph Visualization SVG */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
                                    <defs>
                                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                            <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                                        </marker>
                                    </defs>

                                    {/* Background Passive Paths (Dim) */}
                                    <path
                                        d="M 140 300 C 250 300, 350 150, 450 150"
                                        className="stroke-white/5 stroke-2 fill-none vector-path"
                                    />
                                    <path
                                        d="M 140 300 C 250 300, 350 450, 450 450"
                                        className="stroke-white/5 stroke-2 fill-none vector-path"
                                    />

                                    {/* Active Beam Paths - The "Stream of Light" */}
                                    <path
                                        d="M 140 300 C 250 300, 350 150, 450 150"
                                        className="stroke-brand-accent stroke-[3] fill-none vector-path animate-beam opacity-80"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d="M 140 300 C 250 300, 350 450, 450 450"
                                        className="stroke-brand-accent stroke-[3] fill-none vector-path animate-beam opacity-80"
                                        strokeLinecap="round"
                                    />
                                </svg>

                                {/* Input Node (Left) - Appears immediately */}
                                <div className="absolute left-[5%] top-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-4 animate-pop-in">
                                    <div className="w-24 md:w-32 h-32 md:h-40 rounded-xl bg-[#1e1e1e] border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:border-white/20 transition-colors">
                                        { }
                                        <div className="absolute inset-0 opacity-40 transition-all duration-500" style={{ backgroundColor: activeItem.nodes[0].color }} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                        <div className="absolute bottom-3 left-3 text-[10px] uppercase font-bold tracking-widest text-white font-sans">{activeItem.nodes[0].label}</div>
                                        <iconify-icon icon="ph:file-image-thin" width="24" className="opacity-50" />
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                                </div>

                                {/* Output Nodes (Right Split) - Staggered Appearance matching the Beam arrival */}
                                <div className="absolute right-[5%] top-0 bottom-0 flex flex-col justify-center gap-24 md:gap-32 z-10">
                                    {/* Top Output - Delayed */}
                                    { }
                                    <div className="flex flex-col items-center gap-4 animate-slide-in-delayed opacity-0" style={{ animationDelay: '0.4s' }}>
                                        <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                                        <div className="w-32 md:w-48 h-24 md:h-32 rounded-xl bg-[#1e1e1e] border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden">
                                            { }
                                            <div className="absolute inset-0 opacity-60 transition-all duration-500" style={{ backgroundColor: activeItem.nodes[1].color }} />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                            <div className="absolute bottom-3 left-3 text-[10px] uppercase font-bold tracking-widest text-white font-sans">{activeItem.nodes[1].label}</div>
                                            <iconify-icon icon="ph:sliders-horizontal-thin" width="24" className="opacity-50" />
                                        </div>
                                    </div>

                                    {/* Bottom Output - Delayed slightly more */}
                                    { }
                                    <div className="flex flex-col items-center gap-4 animate-slide-in-delayed opacity-0" style={{ animationDelay: '0.5s' }}>
                                        <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />
                                        <div className="w-32 md:w-48 h-24 md:h-32 rounded-xl bg-[#1e1e1e] border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden">
                                            { }
                                            <div className="absolute inset-0 opacity-60 transition-all duration-500" style={{ backgroundColor: activeItem.nodes[2].color }} />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                            <div className="absolute bottom-3 left-3 text-[10px] uppercase font-bold tracking-widest text-white font-sans">{activeItem.nodes[2].label}</div>
                                            <iconify-icon icon="ph:export-thin" width="24" className="opacity-50" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Metadata Overlay Controls */}
                        <div className="absolute top-6 right-6 flex gap-3 z-20">
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all cursor-pointer hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                <iconify-icon icon="ph:gear-six-fill" width="14" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all cursor-pointer hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                <iconify-icon icon="ph:arrows-out-simple-bold" width="14" />
                            </div>
                        </div>

                        {/* Bottom Info */}
                        <div className="absolute bottom-6 left-6 max-w-xs z-20 pointer-events-none">
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-apple-simple/50 mb-2 font-sans">
                                {t({ en: 'Node Logic', fr: 'Logique Nœud' })}
                            </p>
                            <p className="text-sm font-light text-apple-simple leading-tight font-sans">
                                {t(activeItem.description)}
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            <style>{`
            .animate-beam {
                stroke-dasharray: 1000;
                stroke-dashoffset: 1000;
                animation: drawLine 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            }

            .animate-pop-in {
                animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }

            .animate-slide-in-delayed {
                animation: slideInFade 0.4s ease-out forwards;
            }

            @keyframes drawLine {
                to { stroke-dashoffset: 0; }
            }

            @keyframes popIn {
                from { opacity: 0; transform: translateY(-50%) scale(0.9); }
                to { opacity: 1; transform: translateY(-50%) scale(1); }
            }

            @keyframes slideInFade {
                from { opacity: 0; transform: translateX(-20px); }
                to { opacity: 1; transform: translateX(0); }
            }

            /* Responsive fix for vector paths on mobile */
            @media (max-width: 1024px) {
                .vector-path { display: none; }
            }
        `}</style>
        </section>
    );
};

export default FeaturesCarousel;
