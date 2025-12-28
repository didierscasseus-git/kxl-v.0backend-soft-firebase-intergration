import React, { useState, useEffect } from 'react';
import { getAllCaseStudies, CaseStudy, seedCaseStudies } from '../services/intelligenceService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../App';

const IntelligenceArchive: React.FC = () => {
    const { profile } = useAuth();
    const { t } = useLanguage();
    const [studies, setStudies] = useState<CaseStudy[]>([]);
    const [loading, setLoading] = useState(true);

    const isAuthorized = profile?.role === 'PREMIUM_OPERATOR' || profile?.role === 'DEVELOPER';

    useEffect(() => {
        const fetchStudies = async () => {
            let data = await getAllCaseStudies();
            if (data.length === 0) {
                console.log("Archive Empty. Initializing Seed Protocol...");
                await seedCaseStudies();
                data = await getAllCaseStudies();
            }
            setStudies(data);
            setLoading(false);
        };
        fetchStudies();
    }, []);

    if (loading) return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-64 glass-panel border-white/5 bg-white/5 rounded-[30px]" />
            ))}
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studies.map((study) => {
                const isLocked = study.isPremium && !isAuthorized;

                return (
                    <div key={study.id} className={`group relative glass transition-all duration-500 flex flex-col p-8 rounded-[30px] ${isLocked ? 'opacity-60 grayscale-[0.5] overflow-hidden' : 'hover:border-[var(--accent-blue)]'}`}>
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-2 rounded-lg bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/20 text-[var(--accent-blue)]`}>
                                <iconify-icon
                                    icon={
                                        study.type === 'VIDEO' ? 'ph:play-circle-bold' :
                                            study.type === 'REDDIT' ? 'ph:reddit-logo-bold' :
                                                study.type === 'UNCONVENTIONAL' ? 'ph:sparkle-bold' :
                                                    'ph:file-text-bold'
                                    }
                                    width="20"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                {study.isPremium && (
                                    <span className="text-[8px] font-bold bg-brand-accent/20 text-brand-accent px-2 py-0.5 rounded-full tracking-widest uppercase">
                                        Premium
                                    </span>
                                )}
                                <span className="text-[9px] font-bold opacity-30 uppercase tracking-[0.2em]">Score: {study.facilitationScore}</span>
                            </div>
                        </div>

                        <h4 className="text-lg font-light mb-4 group-hover:text-[var(--accent-blue)] transition-colors leading-snug">
                            {study.title}
                        </h4>

                        <div className={`flex-1 space-y-4 mb-8 transition-all duration-500 ${isLocked ? 'blur-sm select-none' : ''}`}>
                            {study.findings.map((f, i) => (
                                <div key={i} className="flex gap-2">
                                    <div className="w-1 h-1 rounded-full bg-[var(--accent-blue)] mt-1.5" />
                                    <p className="text-[10px] opacity-70 leading-relaxed font-sans">{f}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-6 border-t border-[var(--border-primary)]/50">
                            {study.diagnosticTags.map(tag => (
                                <span key={tag} className="text-[8px] font-bold opacity-50 uppercase tracking-widest px-2 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-primary)]">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {isLocked ? (
                            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] opacity-100 transition-opacity">
                                <iconify-icon icon="ph:lock-key-fill" width="32" className="text-brand-accent mb-4" />
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                                    {t({ en: 'Premium Access Required', fr: 'Accès Premium Requis' })}
                                </p>
                            </div>
                        ) : (
                            <a
                                href={study.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 z-0 opacity-0"
                            >
                                View Source
                            </a>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default IntelligenceArchive;
