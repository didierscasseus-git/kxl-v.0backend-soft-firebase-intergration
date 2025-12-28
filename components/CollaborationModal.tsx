
import React, { useState } from 'react';
import { useLanguage } from '../App';
import { useThemeHue, useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { initiateCollaboration } from '../services/collaborationService';
import { logSystemAction } from '../services/versionService';

interface CollaborationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CollaborationModal: React.FC<CollaborationModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const { theme } = useTheme();
    const { themeHue } = useThemeHue();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        partnerId: '',
        projectType: 'brand_rebuild',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError(null);
        try {
            await initiateCollaboration(user.uid, formData.partnerId, formData.projectType);
            await logSystemAction(user.uid, "COLLABORATION_INITIATED", {
                partner: formData.partnerId,
                type: formData.projectType
            });
            onClose();
        } catch (err) {
            console.error("Collaboration Error:", err);
            setError(t({
                en: "Failed to establish link. Please check if the Operator ID is valid.",
                fr: "Échec de l'établissement du lien. Veuillez vérifier si l'ID Opérateur est valide."
            }));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

            { }
            <div
                className={`w-full max-w-lg rounded-[40px] border p-10 relative overflow-hidden animate-window-pop transition-all duration-500 ${theme === 'light'
                    ? 'bg-white/90 border-black/5 shadow-[0_30px_60px_rgba(0,0,0,0.1)] text-gray-900'
                    : 'bg-black/80 border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] text-white'
                    }`}
                style={{ '--theme-hue': themeHue } as React.CSSProperties}
            >
                <div
                    className="absolute top-0 left-0 w-full h-1 opacity-50 transition-all duration-500 collaboration-gradient-border"
                />

                <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                        <h3 className={`text-2xl font-bold uppercase tracking-widest ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            {t({ en: 'Initiate Collaboration', fr: 'Initier Collaboration' })}
                        </h3>
                        <p className={`text-[10px] font-bold uppercase tracking-[0.3em] italic ${theme === 'light' ? 'text-gray-400' : 'text-white/40'}`}>
                            {t({ en: 'Link operators for synchronized rebuild', fr: 'Lier les opérateurs pour une reconstruction synchrone' })}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-brand-accent transition-colors" aria-label={t({ en: 'Close', fr: 'Fermer' })}>
                        <iconify-icon icon="ph:x-bold" width="24" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2 group">
                        <label className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} group-hover:text-brand-accent`}>
                            {t({ en: 'Partner Operator ID / Email', fr: 'ID Opérateur Partenaire / Email' })}
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.partnerId}
                            onChange={(e) => setFormData(prev => ({ ...prev, partnerId: e.target.value }))}
                            className={`w-full border rounded-2xl px-5 py-4 text-sm focus:outline-none transition-all ${theme === 'light'
                                ? 'bg-black/5 border-black/10 text-gray-900 focus:border-brand-accent/50'
                                : 'bg-white/5 border-white/10 text-white focus:border-brand-accent/50'
                                }`}
                            placeholder="operator_uuid_or_email"
                        />
                    </div>

                    <div className="space-y-2 group">
                        <label className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} group-hover:text-brand-accent`}>
                            {t({ en: 'Mission Core', fr: 'Cœur de Mission' })}
                        </label>
                        <div className="relative">
                            <select
                                aria-label={t({ en: 'Mission Core', fr: 'Cœur de Mission' })}
                                value={formData.projectType}
                                onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                                className={`w-full border rounded-2xl px-5 py-4 text-sm focus:outline-none appearance-none transition-all ${theme === 'light'
                                    ? 'bg-black/5 border-black/10 text-gray-900 focus:border-brand-accent/50'
                                    : 'bg-white/5 border-white/10 text-white focus:border-brand-accent/50'
                                    }`}
                            >
                                <option value="brand_rebuild">{t({ en: 'Brand Rebuild Protocol', fr: 'Protocole Reconstruction de Marque' })}</option>
                                <option value="systems_integration">{t({ en: 'Systems Integration', fr: 'Intégration de Systèmes' })}</option>
                                <option value="ai_deployment">{t({ en: 'AI Unit Deployment', fr: 'Déploiement Unité IA' })}</option>
                            </select>
                            <iconify-icon icon="ph:caret-down-bold" className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                        </div>
                    </div>

                    <div className="space-y-2 group">
                        <label className={`text-[9px] font-bold uppercase tracking-widest transition-colors ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'} group-hover:text-brand-accent`}>
                            {t({ en: 'Briefing Note', fr: 'Note de Briefing' })}
                        </label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                            className={`w-full border rounded-2xl px-5 py-4 text-sm focus:outline-none transition-all min-h-[100px] resize-none ${theme === 'light'
                                ? 'bg-black/5 border-black/10 text-gray-900 focus:border-brand-accent/50'
                                : 'bg-white/5 border-white/10 text-white focus:border-brand-accent/50'
                                }`}
                            placeholder={t({ en: 'Describe collaboration objectives...', fr: 'Décrire les objectifs de collaboration...' })}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-500 text-[10px] uppercase font-bold tracking-widest animate-shake">
                            <iconify-icon icon="ph:warning-circle-bold" width="18" />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-5 rounded-[20px] font-bold uppercase tracking-[0.3em] text-[11px] hover:scale-[1.02] active:scale-[0.98] transition-all group flex items-center justify-center gap-3 collaboration-submit-shadow ${theme === 'light'
                            ? 'bg-black text-white'
                            : 'bg-white text-black'
                            }`}
                    >
                        {loading ? (
                            <iconify-icon icon="ph:spinner-gap-bold" className="animate-spin text-xl" />
                        ) : (
                            <>
                                {t({ en: 'Establish Link', fr: 'Établir le Lien' })}
                                <iconify-icon icon="ph:link-bold" className="group-hover:rotate-45 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CollaborationModal;
