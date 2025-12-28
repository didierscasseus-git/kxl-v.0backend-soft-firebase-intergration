
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeToPremiumIntelligence, PremiumEntry } from '../services/premiumIntelligenceService';

const PremiumConsultantDashboard: React.FC = () => {
    const { profile } = useAuth();
    const [entries, setEntries] = useState<PremiumEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (profile?.role !== 'PREMIUM_OPERATOR') return;

        const unsubscribe = subscribeToPremiumIntelligence(['React', 'Firebase', 'LLM', 'Vite'], (data) => {
            setEntries(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [profile]);

    if (profile?.role !== 'PREMIUM_OPERATOR') {
        return (
            <div className="p-12 glass-dark rounded-[40px] border border-white/5 flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                    <iconify-icon icon="ph:lock-keyhole-fill" width="40" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">Restricted Protocol</h3>
                    <p className="text-white/40 text-sm max-w-md mx-auto line-clamp-2">
                        Authorized clearance is required to access the Premium Consultant Repository.
                        Contact System Admin for eligibility status.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 py-12">
            {/* Header */}
            <div className="flex justify-between items-end px-4">
                <div>
                    <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Premium Consultant Vault</h2>
                    <p className="text-brand-accent font-bold text-xs uppercase tracking-[0.3em] mt-2">Proprietary Intelligence Moat _v4.1</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <div className="text-[10px] text-white/40 uppercase font-black tracking-widest leading-none">Simulation Success_Rate</div>
                        <div className="text-3xl font-black text-brand-simple">94.8%</div>
                    </div>
                </div>
            </div>

            {/* Ingestion Stream */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {entries.map((entry) => (
                    <div key={entry.id} className="group relative glass-dark rounded-[40px] border border-white/5 p-8 hover:border-brand-accent/30 transition-all duration-500 overflow-hidden">
                        {/* Success Rate Highlight */}
                        <div className="absolute top-0 right-12 px-4 py-6 bg-brand-accent/10 border-x border-b border-brand-accent/20 rounded-b-3xl">
                            <div className="text-[10px] text-brand-accent uppercase font-black text-center mb-1">Success</div>
                            <div className="text-xl font-black text-white leading-none">{entry.simulationData.successRate}%</div>
                        </div>

                        <div className="space-y-6 mt-4">
                            <div className="flex flex-wrap gap-2">
                                {entry.techStackContext.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-white/40 uppercase tracking-widest">{tag}</span>
                                ))}
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-simple transition-colors">{entry.title}</h3>
                                <p className="text-sm text-white/50 leading-relaxed line-clamp-2">{entry.description}</p>
                            </div>

                            {/* Benchmark Section */}
                            <div className="p-5 bg-white/5 rounded-3xl border border-white/5 space-y-3">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-brand-accent tracking-widest">
                                    <iconify-icon icon="ph:chart-line-up-bold" width="14" />
                                    Benchmark: {entry.simulationData.comparisonApproach}
                                </div>
                                <p className="text-[11px] text-white/60 leading-relaxed italic">&quot;{entry.simulationData.benchmarkResult}&quot;</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                <div>
                                    <h4 className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Known Delta</h4>
                                    <p className="text-[10px] text-red-400 font-bold">{entry.bugsReported[0] || 'Clean'}</p>
                                </div>
                                <div className="text-right">
                                    <h4 className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Version</h4>
                                    <p className="text-[10px] text-white/50 font-bold">{entry.version.toFixed(1)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Background Decor */}
                        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-brand-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>

            {loading && entries.length === 0 && (
                <div className="h-64 flex flex-col items-center justify-center space-y-4">
                    <iconify-icon icon="ph:circle-notch-bold" className="animate-spin text-brand-accent" width="32" />
                    <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Syncing Premium Repository...</p>
                </div>
            )}
        </div>
    );
};

export default PremiumConsultantDashboard;
