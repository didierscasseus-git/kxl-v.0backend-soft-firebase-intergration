import React from 'react';
import { useLanguage, usePage } from '../App';
import IntelligenceArchive from '../components/IntelligenceArchive';

const CaseStudies: React.FC = () => {
    const { t } = useLanguage();
    const { setPage } = usePage();

    return (
        <div className="min-h-screen pt-24 pb-20 px-[5%] relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-brand-accent/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-white/[0.02] rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10 space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <button
                            onClick={() => setPage('home')}
                            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-brand-accent transition-colors group"
                        >
                            <iconify-icon icon="ph:arrow-left-bold" className="group-hover:-translate-x-1 transition-transform" />
                            {t({ en: 'Back to Command', fr: 'Retour au Commandement' })}
                        </button>
                        <h1 className="text-5xl md:text-7xl font-light tracking-tighter uppercase text-apple-shade">
                            Intelligence <span className="italic font-medium text-white">Archive</span>
                        </h1>
                        <p className="max-w-xl text-apple-simple font-light leading-relaxed">
                            {t({
                                en: 'Explore researched case studies, strategic post-mortems, and architectural transformations from across the digital sector.',
                                fr: 'Explorez des études de cas documentées, des post-mortems stratégiques et des transformations architecturales du secteur numérique.'
                            })}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {['TECH', 'BRAND', 'STRATEGY', 'FAILURE'].map(tag => (
                            <div key={tag} className="px-4 py-1.5 rounded-lg border border-white/10 bg-white/5 text-[9px] font-bold uppercase tracking-widest text-white/60">
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Archive Feed */}
                <div className="animate-fade-in">
                    <IntelligenceArchive />
                </div>
            </div>
        </div>
    );
};

export default CaseStudies;
