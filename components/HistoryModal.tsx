
import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../App';
import { useAuth } from '../context/AuthContext';
import { getUserMessages, ContactMessage } from '../services/contactService';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [messages, setMessages] = useState<(ContactMessage & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    const fetchHistory = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await getUserMessages(user.uid);
            setMessages(data);
        } catch (error) {
            console.error("Failed to fetch history:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
            if (user) {
                fetchHistory();
            }
        } else {
            const timer = setTimeout(() => setIsVisible(false), 500);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen, user, fetchHistory]);

    if (!isVisible && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[200] flex items-center justify-center transition-all duration-500 ${isOpen ? 'opacity-100 backdrop-blur-md bg-black/60' : 'opacity-0 backdrop-blur-none pointer-events-none'}`}>
            <div className="absolute inset-0" onClick={onClose} />
            <div className={`relative w-full max-w-3xl mx-4 glass bg-[#0c0c0c]/90 border-white/10 rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 flex flex-col max-h-[80vh] ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}>

                {/* Header */}
                <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold uppercase tracking-widest text-white">
                            {t({ en: 'Request History', fr: 'Historique des Demandes' })}
                        </h3>
                        <p className="text-[10px] text-brand-accent font-mono uppercase tracking-wider">
                            {t({ en: 'Archived Transmission Logs', fr: 'Journaux de Transmission Archivés' })}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                        title={t({ en: 'Close', fr: 'Fermer' })}
                        aria-label={t({ en: 'Close', fr: 'Fermer' })}
                    >
                        <iconify-icon icon="ph:x-bold" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-4 overflow-y-auto">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4 text-white/30">
                            <iconify-icon icon="ph:spinner-gap-bold" className="animate-spin text-3xl" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Scanning Archives...</span>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4 text-white/20">
                            <iconify-icon icon="ph:tray-thin" className="text-5xl" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">No previous transmissions found.</span>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="space-y-1">
                                            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-brand-accent block">
                                                ID: {msg.id.substring(0, 8).toUpperCase()}
                                            </span>
                                            <span className="text-[9px] text-gray-500 font-mono">
                                                {msg.timestamp?.toDate().toLocaleString() || 'Pending...'}
                                            </span>
                                        </div>
                                        <div className="px-2 py-0.5 rounded-sm bg-green-500/10 text-green-500 text-[8px] font-bold uppercase tracking-widest">
                                            Transmitted
                                        </div>
                                    </div>
                                    <h4 className="text-[12px] font-bold text-white mb-2 uppercase tracking-wide">
                                        {msg.organization || 'Independent Project'}
                                    </h4>
                                    <p className="text-[11px] text-gray-400 leading-relaxed italic border-l border-brand-accent/30 pl-3">
                                        &quot;{msg.message}&quot;
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-white/10 bg-white/5 flex justify-between items-center text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                    <span>Protocol v4.0.1</span>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                        <span>Uplink Secure</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;
