
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useThemeHue } from '../context/ThemeContext';
import { submitProposition, Proposition } from '../services/crmService';
import { getHueClass } from '../utils/themeUtils';

interface ProfileCRMProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProfileCRM: React.FC<ProfileCRMProps> = ({ isOpen, onClose }) => {
    const { user, profile } = useAuth();
    const { themeHue } = useThemeHue();
    const [activeTab, setActiveTab] = useState<'NEW' | 'LOGS' | 'VERSION'>('NEW');
    const [formType, setFormType] = useState<Proposition['type']>('FEATURE');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [propositions, setPropositions] = useState<Proposition[]>([]);
    const [systemHistory, setSystemHistory] = useState<any[]>([]);
    const [loadingLogs, setLoadingLogs] = useState(false);

    const loadPropositions = React.useCallback(async () => {
        if (!user) return;
        setLoadingLogs(true);
        try {
            if (activeTab === 'LOGS') {
                const { getUserPropositions, getAllPropositions } = await import('../services/crmService');
                const data = profile?.role === 'DEVELOPER'
                    ? await getAllPropositions()
                    : await getUserPropositions(user.uid);
                setPropositions(data);
            } else if (activeTab === 'VERSION' && profile?.role === 'DEVELOPER') {
                const { getAllSystemHistory } = await import('../services/versionService');
                const data = await getAllSystemHistory();
                setSystemHistory(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingLogs(false);
        }
    }, [user, activeTab, profile?.role]);

    useEffect(() => {
        if (isOpen && user && (activeTab === 'LOGS' || activeTab === 'VERSION')) {
            loadPropositions();
        }
    }, [isOpen, user, activeTab, loadPropositions]);

    const handleStatusUpdate = async (propId: string, newStatus: Proposition['status']) => {
        if (!user || profile?.role !== 'DEVELOPER') return;
        try {
            const { updatePropositionStatus } = await import('../services/crmService');
            await updatePropositionStatus(propId, newStatus);
            loadPropositions(); // Refresh
        } catch (e) {
            console.error(e);
            alert("Protocol Update Failed.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !content.trim()) return;

        setIsSubmitting(true);
        try {
            await submitProposition(user.uid, content, formType);
            setContent('');
            setActiveTab('LOGS');
        } catch (e) {
            console.error(e);
            alert('Failed to transmit proposition.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const hueClass = getHueClass(themeHue);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-500" onClick={onClose} />

            <div className="relative w-full max-w-4xl bg-[#0c0c0c]/90 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-window-pop">

                {/* Header */}
                <div className="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 ${hueClass}`}>
                            <iconify-icon icon="ph:cpu-duotone" width="20" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-wide font-sans">
                                {profile?.role === 'DEVELOPER' ? 'SYSTEM PROPOSITIONS' : 'REQUEST CENTER'}
                            </h2>
                            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-sans">
                                {profile?.role === 'DEVELOPER' ? 'Encrypted CRM Uplink' : 'Secure Feedback Channel'} • {profile?.organization || 'UNKNOWN_ORG'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} title="Close Profile CRM" aria-label="Close Profile CRM" className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                        <iconify-icon icon="ph:x" className="text-white/60" width="20" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}
                    <div className="w-64 border-r border-white/5 p-6 space-y-2 hidden md:block">
                        <button
                            onClick={() => setActiveTab('NEW')}
                            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 font-sans flex items-center gap-3 ${activeTab === 'NEW' ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                            <iconify-icon icon="ph:plus-circle" /> {profile?.role === 'DEVELOPER' ? 'New Proposition' : 'New Request'}
                        </button>
                        <button
                            onClick={() => setActiveTab('LOGS')}
                            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 font-sans flex items-center gap-3 ${activeTab === 'LOGS' ? 'bg-white text-black' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                            <iconify-icon icon="ph:list-dashes" /> System Logs
                        </button>
                        <button
                            onClick={() => setActiveTab('VERSION')}
                            disabled={profile?.role !== 'DEVELOPER'}
                            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 font-sans flex items-center gap-3 ${activeTab === 'VERSION' ? 'bg-white text-black' : profile?.role === 'DEVELOPER' ? 'text-white/40 hover:text-white hover:bg-white/5' : 'text-white/10 cursor-not-allowed'}`}
                        >
                            <iconify-icon icon="ph:git-branch" /> Version Control
                        </button>
                    </div>

                    {/* Main Panel */}
                    <div className="flex-1 p-8 overflow-y-auto relative">

                        {/* Mobile Tabs */}
                        <div className="flex md:hidden gap-2 mb-6 border-b border-white/5 pb-4">
                            <button onClick={() => setActiveTab('NEW')} className={`text-[10px] font-bold uppercase p-2 ${activeTab === 'NEW' ? 'text-white' : 'text-white/40'}`}>New</button>
                            <button onClick={() => setActiveTab('LOGS')} className={`text-[10px] font-bold uppercase p-2 ${activeTab === 'LOGS' ? 'text-white' : 'text-white/40'}`}>Logs</button>
                        </div>

                        {activeTab === 'NEW' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="p-4 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 mb-6">
                                    <p className="text-xs text-brand-accent font-sans flex items-center gap-2">
                                        <iconify-icon icon="ph:lock-key-fill" />
                                        <strong>SECURE CHANNEL:</strong> All propositions are encrypted client-side before transmission.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase text-white/40 tracking-widest font-sans">
                                        {profile?.role === 'DEVELOPER' ? 'Type Vector' : 'Category'}
                                    </label>
                                    <div className="flex gap-4">
                                        {(['FEATURE', 'BUG', 'STRATEGY'] as const).map(t => (
                                            <button
                                                key={t}
                                                onClick={() => setFormType(t)}
                                                className={`px-6 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all ${formType === t ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase text-white/40 tracking-widest font-sans">
                                        {profile?.role === 'DEVELOPER' ? 'Proposition Data' : 'Description'}
                                    </label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Enter detailed change request or strategy proposition..."
                                        className="w-full h-48 bg-black/20 border border-white/10 rounded-2xl p-4 text-white font-mono text-sm focus:outline-none focus:border-white/30 transition-colors resize-none placeholder:text-white/10"
                                    />
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !content.trim()}
                                            className="px-8 py-3 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100"
                                        >
                                            {isSubmitting
                                                ? (profile?.role === 'DEVELOPER' ? 'Transmitting...' : 'Sending...')
                                                : (profile?.role === 'DEVELOPER' ? 'Commit Proposition' : 'Submit Request')
                                            }
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'LOGS' && (
                            <div className="space-y-4 animate-fade-in">
                                {loadingLogs ? (
                                    <div className="text-center py-20 text-white/20 animate-pulse text-xs font-mono">SYNCING_DATALINK...</div>
                                ) : propositions.length === 0 ? (
                                    <div className="text-center py-20 text-white/20 text-xs font-mono">NO ACTIVE PROPOSITIONS FOUND</div>
                                ) : (
                                    propositions.map((prop) => (
                                        <div key={prop.id} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${prop.status === 'PENDING' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                                                    <span className="text-[10px] font-bold uppercase text-white/60 tracking-widest">{prop.type} • V{prop.version.toFixed(1)}</span>
                                                </div>
                                                <span className="text-[10px] text-white/20 font-mono">{prop.createdAt?.toDate ? prop.createdAt.toDate().toLocaleDateString() : 'PENDING'}</span>
                                            </div>
                                            <p className="text-sm text-white/80 font-mono leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                                                {prop.decryptedContent}
                                            </p>
                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] font-bold uppercase text-white/20 tracking-widest">ID: {prop.id}</span>
                                                    {profile?.role === 'DEVELOPER' && prop.status === 'PENDING' && (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleStatusUpdate(prop.id!, 'ACCEPTED')}
                                                                className="text-[8px] font-bold uppercase text-green-500 hover:text-green-400"
                                                            >
                                                                [ACCEPT]
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(prop.id!, 'REJECTED')}
                                                                className="text-[8px] font-bold uppercase text-red-500 hover:text-red-400"
                                                            >
                                                                [REJECT]
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                                <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${prop.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : prop.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-500' : 'bg-white/10 text-white'}`}>
                                                    {prop.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'VERSION' && profile?.role === 'DEVELOPER' && (
                            <div className="space-y-4 animate-fade-in">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
                                    <p className="text-[10px] text-white/40 font-mono uppercase tracking-[0.2em] flex items-center gap-2">
                                        <iconify-icon icon="ph:terminal-window" className="text-brand-accent" />
                                        LIVE_SYSTEM_TELEMETRY: Broad-spectrum event monitoring active.
                                    </p>
                                </div>
                                {loadingLogs ? (
                                    <div className="text-center py-20 text-white/20 animate-pulse text-xs font-mono">FETCHING_GLOBAL_HISTORY...</div>
                                ) : (
                                    <div className="space-y-2">
                                        {systemHistory.map((log) => (
                                            <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5 text-[10px] font-mono group hover:bg-white/[0.05] transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-white/20 w-32 tabular-nums">
                                                        {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleTimeString() : '...'}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded ${log.category === 'SECURITY' ? 'bg-red-500/20 text-red-400' : 'bg-brand-accent/20 text-brand-accent'}`}>
                                                        {log.category}
                                                    </span>
                                                    <span className="text-white font-bold">{log.action}</span>
                                                </div>
                                                <span className="text-white/30 group-hover:text-white/60 transition-colors">UID: {log.uid.substring(0, 8)}...</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-8 pt-8 border-t border-white/5">
                                    <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Maintenance Protocols</h4>
                                    <button
                                        onClick={async () => {
                                            if (confirm("RE-SEED_ARCHIVE: This will re-initialize the Intelligence Archive with current metadata. Proceed?")) {
                                                const { seedCaseStudies } = await import('../services/intelligenceService');
                                                await seedCaseStudies();
                                                alert("Archive synchronization sequence complete.");
                                            }
                                        }}
                                        className="px-6 py-2 rounded-lg border border-brand-accent/20 bg-brand-accent/5 text-brand-accent text-[10px] font-bold uppercase tracking-widest hover:bg-brand-accent hover:text-white transition-all"
                                    >
                                        Re-seed Intelligence Archive
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCRM;
