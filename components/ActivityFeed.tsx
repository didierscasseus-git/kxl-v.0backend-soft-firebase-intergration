
import React, { useEffect, useState } from 'react';
import { getUserHistory } from '../services/versionService';
import { format } from 'date-fns';

interface ActivityFeedProps {
    uid: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ uid }) => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(!!uid);

    useEffect(() => {
        if (!uid) {
            return;
        }
        const fetchHistory = async () => {
            setLoading(true);
            const data = await getUserHistory(uid);
            setHistory(data);
            setLoading(false);
        };
        fetchHistory();
    }, [uid]);

    if (loading) return (
        <div className="flex flex-col gap-4 animate-pulse">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-white/5 border border-white/5 rounded-2xl" />
            ))}
        </div>
    );

    if (history.length === 0) return (
        <div className="text-center py-10 glass-panel border-dashed border-white/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">No Protocol logs discovered</p>
        </div>
    );

    return (
        <div className="space-y-4">
            {history.map((item, idx) => (
                <div key={item.id} className="relative pl-8 group">
                    {/* Timeline Line */}
                    {idx !== history.length - 1 && (
                        <div className="absolute left-[3px] top-4 bottom-[-16px] w-[1px] bg-white/10 group-hover:bg-brand-accent/30 transition-colors" />
                    )}

                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full border border-brand-accent bg-black z-10 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />

                    <div className="glass-panel !p-5 hover:border-brand-accent/30 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">
                                {item.action.replace(/_/g, ' ')}
                            </span>
                            <span className="text-[8px] font-bold text-white/40">
                                {(() => {
                                    if (!item.timestamp) return 'Processing...';
                                    const date = item.timestamp.toDate ? item.timestamp.toDate() : new Date(item.timestamp);
                                    return !isNaN(date.getTime()) ? format(date, 'HH:mm:ss · MMM d') : 'Processing...';
                                })()}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className={`text-[8px] px-2 py-0.5 rounded-full border ${item.category === 'SECURITY' ? 'border-red-500/20 text-red-500 bg-red-500/5' :
                                item.category === 'AI' ? 'border-brand-accent/20 text-brand-accent bg-brand-accent/5' :
                                    'border-white/10 text-white/60 bg-white/5'
                                } font-bold tracking-widest uppercase`}>
                                {item.category || 'SYSTEM'}
                            </span>
                            {item.metadata?.pillar && (
                                <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">
                                    Target: {item.metadata.pillar}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActivityFeed;
