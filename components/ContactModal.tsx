import React, { useState, useEffect } from 'react';
import { useLanguage } from '../App';
import { useAuth } from '../context/AuthContext';
import { sendContactMessage } from '../services/contactService';
import { logSystemAction } from '../services/versionService';
import '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMessage?: string;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, defaultMessage }) => {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData(prev => {    // eslint-disable-line react-hooks/set-state-in-effect
        const newName = prev.name || (profile ? `${profile.firstName} ${profile.lastName}`.trim() : '');
        const newEmail = prev.email || profile?.email || '';
        const newOrg = prev.organization || profile?.organization || '';
        const newMsg = defaultMessage || prev.message;

        if (prev.name !== newName || prev.email !== newEmail || prev.organization !== newOrg || prev.message !== newMsg) {
          return {
            name: newName,
            email: newEmail,
            organization: newOrg,
            message: newMsg
          };
        }
        return prev;
      });
    }
  }, [profile, isOpen, defaultMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sendContactMessage({
        ...formData,
        userId: user?.uid
      });

      // Log Transmission to Protocol History
      if (user) {
        await logSystemAction(user.uid, "TRANSMISSION_SENT", {
          org: formData.organization,
          type: 'DIRECT_UPLINK'
        }, 'SYSTEM');
      }

      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({ name: '', email: '', organization: '', message: '' });
        onClose();
      }, 2000);
    } catch {
      setLoading(false);
      setError(t({ en: 'Transmission failed. Please try again.', fr: 'La transmission a échoué. Veuillez réessayer.' }));
    }
  };

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 500);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center transition-all duration-500 ${isOpen ? 'opacity-100 backdrop-blur-md bg-black/60' : 'opacity-0 backdrop-blur-none pointer-events-none'}`}>
      <div
        className="absolute inset-0"
        onClick={onClose}
      />
      <div className={`relative w-full max-w-2xl mx-4 glass bg-[#0c0c0c]/90 border-white/10 rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 flex flex-col ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}>

        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="space-y-1">
            <h3 className="text-xl font-bold uppercase tracking-widest text-white">
              {t({ en: 'Initialize Project', fr: 'Initialiser le Projet' })}
            </h3>
            <p className="text-[10px] text-brand-accent font-mono uppercase tracking-wider">
              {t({ en: 'Secure Transmission Protocol', fr: 'Protocole de Transmission Sécurisé' })}
            </p>
          </div>
          <button onClick={onClose} title={t({ en: 'Close Modal', fr: 'Fermer la Modale' })} aria-label="Close Modal" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors text-white">
            <iconify-icon icon="ph:x-bold" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="p-8 md:p-10 space-y-6 overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block">
                  {t({ en: 'Identity', fr: 'Identité' })}
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors placeholder:text-gray-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block">
                  {t({ en: 'Coordinates', fr: 'Coordonnées' })}
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors placeholder:text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block">
                {t({ en: 'Organization', fr: 'Organisation' })}
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Company Name Inc."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block">
                {t({ en: 'Directives', fr: 'Directives' })}
              </label>
              <textarea
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder={t({ en: "Briefly describe your architectural requirements...", fr: "Décrivez brièvement vos exigences architecturales..." })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-accent transition-colors placeholder:text-gray-600 resize-none"
              />
            </div>

            {error && (
              <p className="text-red-500 text-[10px] uppercase font-bold tracking-widest animate-shake">
                {error}
              </p>
            )}

            {success && (
              <div className="flex items-center gap-2 text-green-500 text-[10px] uppercase font-bold tracking-widest">
                <iconify-icon icon="ph:check-circle-fill" />
                {t({ en: 'Protocol Received. Standing by.', fr: 'Protocole reçu. En attente.' })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-white/10 bg-white/5 flex justify-end">
            <button
              type="submit"
              disabled={loading || success}
              className="bg-brand-accent text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-brand-accent/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <iconify-icon icon="ph:spinner-gap-bold" className="animate-spin" />
              ) : (
                <iconify-icon icon="ph:paper-plane-tilt-bold" />
              )}
              {t({ en: 'Transmit Request', fr: 'Transmettre la Demande' })}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;