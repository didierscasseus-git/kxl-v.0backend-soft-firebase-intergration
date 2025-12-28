import React, { useState, useEffect } from 'react';
import { useLanguage, useContact } from '../App';
import DistressIndicator from '../components/DistressIndicator';
import { useAuth } from '../context/AuthContext';
import { updateUserStage } from '../services/userService';
import { logSystemAction } from '../services/versionService';
import { subscribeToActiveCollaborations } from '../services/collaborationService';
import ActivityFeed from '../components/ActivityFeed';
import IntelligenceArchive from '../components/IntelligenceArchive';
import RevealCard from '../components/RevealCard';
import '../types';

const PILLARS = [
  {
    id: 'clarity',
    title: { en: 'Clarity', fr: 'Clarté' },
    desc: {
      en: 'Your brand is refined so it clearly communicates who you are, what you stand for, and why you are distinct—without chasing trends or compromising values.',
      fr: 'Votre marque est affinée pour communiquer clairement qui vous êtes et pourquoi vous êtes distinct, sans compromis.'
    },
    icon: 'ph:lighthouse-thin'
  },
  {
    id: 'structure',
    title: { en: 'Structure', fr: 'Structure' },
    desc: {
      en: 'Your digital presence is reorganized to support how the business actually operates, removing friction between intention and execution.',
      fr: 'Votre présence numérique est réorganisée pour soutenir le fonctionnement réel de l\'entreprise, éliminant les frictions.'
    },
    icon: 'ph:graph-thin'
  },
  {
    id: 'efficiency',
    title: { en: 'Efficiency', fr: 'Efficacité' },
    desc: {
      en: 'Unnecessary manual work is reduced, allowing systems to carry routine load so growth does not require constant intervention or expanding overhead.',
      fr: 'Le travail manuel inutile est réduit, permettant aux systèmes de porter la charge routinière.'
    },
    icon: 'ph:lightning-thin'
  }
];

const SYMPTOMS = [
  { en: "Your brand no longer communicates the depth or direction of the business", fr: "Votre marque ne communique plus la profondeur ou la direction de l'entreprise" },
  { en: "Your website exists, but does not actively support operations, sales, or decision-making", fr: "Votre site web existe mais ne soutient pas activement les opérations" },
  { en: "Growth has introduced manual effort, oversight, and unnecessary complexity", fr: "La croissance a introduit des efforts manuels et une complexité inutile" },
  { en: "Progress feels possible, but increasingly costly in time, energy, and resources", fr: "Le progrès semble possible, mais de plus en plus coûteux" }
];

const PROCESS = [
  {
    step: '01',
    title: { en: 'Diagnose', fr: 'Diagnostiquer' },
    detail: { en: 'Deep analysis of current operational bottlenecks and brand disconnects.', fr: 'Analyse approfondie des goulots d\'étranglement opérationnels actuels.' },
    icon: 'ph:scan-thin',
    deepDive: {
      en: [
        "Audit of existence: analyzing current digital footprint and performance leaks.",
        "Infrastructure mapping: identifying technical debt and scaling limitations.",
        "Brand alignment: verifying if communication matches core business intent.",
        "Growth-friction report: pinpointing exactly where the business is stalling."
      ],
      fr: [
        "Audit de l'existence : analyse de l'empreinte numérique et des fuites de performance.",
        "Cartographie de l'infrastructure : identification de la dette technique.",
        "Alignement de la marque : vérification de la cohérence de la communication.",
        "Rapport de friction : identification précise des goulots d'étranglement."
      ]
    }
  },
  {
    step: '02',
    title: { en: 'Rebuild', fr: 'Reconstruire' },
    detail: { en: 'Architecting the deterministic foundation and visual identity system.', fr: 'Architecture de la fondation déterministe et du système d\'identité visuelle.' },
    icon: 'ph:hammer-thin',
    deepDive: {
      en: [
        "Conceptualizing the core: rebuilding the brand's visual and verbal DNA.",
        "Technical architecture: designing a cloud-native, serverless ecosystem.",
        "UI/UX Engineering: high-fidelity prototyping of the user journey.",
        "Systemic integration: wiring backend logic for automated operations."
      ],
      fr: [
        "Conceptualisation du noyau : reconstruction de l'ADN visuel et verbal.",
        "Architecture technique : conception d'un écosystème cloud-native.",
        "Ingénierie UI/UX : prototypage haute fidélité du parcours utilisateur.",
        "Intégration systémique : câblage de la logique backend pour l'automatisation."
      ]
    }
  },
  {
    step: '03',
    title: { en: 'Activate', fr: 'Activer' },
    detail: { en: 'Deploying the new ecosystem with full operational training and handoff.', fr: 'Déploiement du nouvel écosystème avec formation opérationnelle complète.' },
    icon: 'ph:lightning-thin',
    deepDive: {
      en: [
        "Production deployment: migrating to the new high-performance stack.",
        "Operational handoff: training the unit on the new system protocols.",
        "Performance stabilization: real-time monitoring of growth metrics.",
        "Continuous optimization: iterative upgrades for long-term dominance."
      ],
      fr: [
        "Déploiement en production : migration vers la nouvelle pile haute performance.",
        "Transfert opérationnel : formation aux nouveaux protocoles système.",
        "Stabilisation des performances : suivi en temps réel des métriques.",
        "Optimisation continue : mises à niveau itératives pour la dominance."
      ]
    }
  }
];

const OUTCOMES = [
  { en: 'Greater clarity and consistency', fr: 'Plus grande clarté et cohérence' },
  { en: 'Fewer points of friction', fr: 'Moins de points de friction' },
  { en: 'Reduced operational strain', fr: 'Réduction de la tension opérationnelle' },
  { en: 'Stronger confidence in ability to grow', fr: 'Confiance renforcée dans la capacité de croissance' }
];



const InteractivePillar: React.FC<{
  item: typeof PILLARS[0];
  t: (v: any) => string;
  isActive: boolean;
  onHover: (id: string | null) => void;
  user: any;
  profile: any;
}> = ({ item, t, isActive, onHover, user, profile }) => {
  return (
    <div
      onMouseEnter={() => {
        onHover(item.id);
        if (user) {
          logSystemAction(user.uid, "PILLAR_INSPECT", { pillar: item.id }, 'UI');
          // Auto-progress stage if currently initializing
          if (profile?.stage === 'INITIALIZE' || !profile?.stage) {
            updateUserStage(user.uid, 'DIAGNOSE');
          }
        }
      }}
      onMouseLeave={() => onHover(null)}
      className={`relative group p-10 rounded-[40px] border transition-all duration-700 overflow-hidden cursor-crosshair
        ${isActive
          ? 'bg-white/10 border-white/20 scale-[1.03] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)] z-10'
          : 'bg-white/[0.03] border-white/5 opacity-60 hover:opacity-100 hover:bg-white/[0.06] backdrop-blur-3xl'
        }
      `}
    >
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-opacity duration-500">
        <iconify-icon icon={item.icon} width="56" />
      </div>

      <h3 className="text-2xl font-bold uppercase tracking-widest mb-6 flex items-center gap-3 font-sans text-apple-shade">
        {t(item.title)}
        {isActive && <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_15px_white] animate-pulse" />}
      </h3>

      <p className={`text-sm md:text-base leading-relaxed transition-colors duration-300 font-sans text-apple-simple`}>
        {t(item.desc)}
      </p>

      <div className={`absolute bottom-0 left-0 w-full h-1 transition-all duration-700 ${isActive ? 'bg-gradient-to-r from-transparent via-white to-transparent' : 'bg-transparent'}`} />
    </div>
  );
};

const ProcessCard: React.FC<{ step: typeof PROCESS[0]; index: number; t: (v: any) => string; onClick: () => void }> = ({ step, index, t, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <RevealCard delay={index * 150} className="relative group w-full">
      <div className={`hidden md:block absolute top-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border border-black/40 transition-all duration-500 z-20 ${isHovered ? 'bg-white scale-125 shadow-[0_0_20px_white]' : 'bg-[#1A1815]'}`} />

      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        className={`
          relative mt-8 p-10 rounded-[40px] border transition-all duration-700 overflow-hidden h-full flex flex-col justify-between group backdrop-blur-2xl cursor-pointer
          ${isHovered
            ? 'bg-white/10 border-white/20 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] -translate-y-4'
            : 'bg-white/[0.03] border-white/5 hover:border-white/10'
          }
        `}
      >
        <div className="relative z-10">
          <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center mb-10 transition-all duration-700 shadow-inner ${isHovered ? 'bg-white text-black rotate-6 scale-110 shadow-[0_0_30px_rgba(255,255,255,0.3)]' : 'bg-white/5 text-apple-simple/60'}`}>
            <iconify-icon icon={step.icon} width="32" />
          </div>

          <h4 className="text-xl font-bold uppercase tracking-[0.2em] mb-4 font-sans text-apple-shade">
            <span className="text-white/30 mr-3 text-sm font-mono block mb-1">STAGE_{step.step}</span>
            {t(step.title)}
          </h4>

          <p className="text-sm md:text-base leading-relaxed font-sans text-apple-simple">
            {t(step.detail)}
          </p>
        </div>

        <div className={`mt-10 pt-6 border-t border-white/10 flex items-center justify-between transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
            {index === 0 ? 'Diagnostic Protocol' : index === 1 ? 'Architecture Phase' : 'Deployment Sequence'}
          </span>
          <iconify-icon icon="ph:arrow-right-thin" className="text-white text-xl" />
        </div>
      </div>
    </RevealCard>
  );
};

const ProcessModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  step: typeof PROCESS[0] | null;
  t: (v: any) => string;
}> = ({ isOpen, onClose, step, t }) => {
  if (!step) return null;

  return (
    <div className={`fixed inset-0 z-[300] flex items-center justify-center p-6 transition-all duration-500 ${isOpen ? 'opacity-100 backdrop-blur-xl bg-black/60' : 'opacity-0 pointer-events-none backdrop-blur-none'}`}>
      <div className="absolute inset-0" onClick={onClose} />
      <div className={`relative w-full max-w-2xl glass-panel !p-12 !bg-[#0c0c0c]/90 border-white/10 rounded-[40px] shadow-2xl transition-all duration-500 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-10'}`}>
        <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
          <iconify-icon icon="ph:x-bold" width="24" />
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
            <iconify-icon icon={step.icon} width="32" className="text-white" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-accent mb-1 block">STAGE_{step.step}</span>
            <h3 className="text-3xl font-light uppercase tracking-tighter text-apple-shade">{t(step.title)}</h3>
          </div>
        </div>

        <div className="space-y-6">
          <p className="text-lg text-white font-light leading-relaxed">{t(step.detail)}</p>

          <div className="h-[1px] bg-white/10" />

          <div className="space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 italic">Diagnostic Protocol Details:</span>
            <ul className="space-y-4">
              {(t(step.deepDive) as unknown as string[]).map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-4 group">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0 animate-pulse" />
                  <span className="text-sm md:text-base text-apple-simple font-light leading-relaxed group-hover:text-white transition-colors">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { openContact, openCollaboration } = useContact();
  const { user, profile, loading: authLoading } = useAuth();
  const [activePillar, setActivePillar] = useState<string | null>(null);
  const [activeProcess, setActiveProcess] = useState<typeof PROCESS[0] | null>(null);
  const [collabSync, setCollabSync] = useState<'IDLE' | 'SYNCING' | 'LINKED'>('IDLE');

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToActiveCollaborations(user.uid, (data) => {
      if (data && data.length > 0) {
        setCollabSync('LINKED');
      } else {
        setCollabSync('IDLE');
      }
    });
    return () => unsubscribe();
  }, [user]);

  // Profile is now managed globally in AuthContext

  return (
    <section id="rebuild-message" className="relative min-h-screen bg-transparent py-40 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] bg-white/[0.02] rounded-full blur-[150px]" />
      </div>

      <div className="w-full flex flex-col items-center justify-center px-[5%] relative z-10">
        <div className="mb-40 text-center max-w-5xl">
          {user && (
            <RevealCard className="mb-12">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-brand-accent/20 bg-brand-accent/5 backdrop-blur-xl">
                  <div className={`w-2 h-2 rounded-full bg-brand-accent ${authLoading ? 'animate-ping' : ''}`} />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-accent">
                    {authLoading ? 'Syncing Profile...' : `Operator Active: ${profile?.firstName || user.displayName || 'Anonymous'}`}
                  </span>
                  <div className="w-[1px] h-3 bg-brand-accent/20" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-accent/60">
                    {profile?.stage || 'INITIALIZE'}
                  </span>
                  {profile?.organization && (
                    <>
                      <div className="w-[1px] h-3 bg-brand-accent/20" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60">
                        Unit: {profile.organization}
                      </span>
                    </>
                  )}
                </div>

                {/* Collaboration Layer Indicator */}
                {!authLoading && user && (
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-sm animate-fade-in">
                    <iconify-icon
                      icon={collabSync === 'LINKED' ? "ph:users-three-fill" : "ph:users-three-thin"}
                      className={collabSync === 'LINKED' ? "text-brand-accent" : "text-white/40"}
                      width="16"
                    />
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/40">
                      Sync Status: <span className={collabSync === 'LINKED' ? "text-brand-accent" : "text-white/20 italic"}>
                        {collabSync === 'LINKED' ? 'ACTIVE_COLLAB_NODE' : 'Isolated_Node'}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </RevealCard>
          )}

          <RevealCard>
            <h2 className="text-4xl md:text-7xl font-light tracking-tighter leading-none mb-10 font-sans text-apple-shade">
              {t({ en: 'A complete ', fr: 'Une ' })}
              <span className="font-black uppercase italic text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                {t({ en: 'Brand & Systems Rebuild', fr: 'Reconstruction de Marque & Systèmes' })}
              </span>
              {t({
                en: ' for long-term deterministic growth.',
                fr: ' pour une croissance déterministe à long terme.'
              })}
            </h2>
          </RevealCard>

          <RevealCard delay={200}>
            <p className="glass-panel text-lg md:text-2xl max-w-4xl mx-auto leading-relaxed font-sans !bg-white/[0.05] !p-12">
              {t({
                en: "Engaging businesses that intend to grow without losing clarity. As businesses scale, complexity introduces friction. What once worked begins to strain. We align your digital foundation with your ultimate ambition.",
                fr: "Engager les entreprises qui souhaitent croître sans perdre de clarté. Cet engagement aligne vos fondations numériques avec votre ambition ultime."
              })}
            </p>
          </RevealCard>
        </div>

        <div className="w-full max-w-7xl mb-40 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <RevealCard className="space-y-8">
            <span className="text-[11px] font-bold tracking-[0.5em] uppercase text-white/50 flex items-center gap-4 font-sans">
              <span className="w-12 h-[1px] bg-white/30" />
              {t({ en: 'Diagnostics', fr: 'Diagnostics' })}
            </span>
            <h3 className="text-4xl md:text-6xl font-light uppercase tracking-tighter leading-none text-apple-shade font-sans">
              {t({ en: 'Identifying Structural Strain', fr: 'Identifier les Tensions Structurelles' })}
            </h3>
            <div className="glass-panel p-8 !bg-white/[0.03] border-white/5 font-sans">
              {t({
                en: "Scalable growth is often hindered by structures built for an earlier stage. We identify where the brand and technical stacks are leaking potential.",
                fr: "La croissance est souvent entravée par des structures obsolètes. Nous identifions les fuites de potentiel."
              })}
            </div>
          </RevealCard>

          <div className="grid grid-cols-1 gap-6">
            {SYMPTOMS.map((symptom, idx) => (
              <RevealCard key={idx} delay={idx * 100} className="group">
                <div className="glass-panel compact p-8 transition-all duration-500 cursor-crosshair hover:bg-white/[0.07] border-white/5 hover:border-white/10 group-hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.4)]">
                  <div className="flex items-start gap-6">
                    <DistressIndicator size="sm" className="-ml-4 -mt-3" />
                    <div className="flex-1 flex items-center justify-between gap-6 -ml-2">
                      <p className="text-sm md:text-base leading-relaxed font-sans text-apple-simple">
                        {t(symptom)}
                      </p>
                      <iconify-icon icon="ph:arrow-up-right-thin" className="text-white/20 group-hover:text-white group-hover:scale-125 transition-all text-2xl" />
                    </div>
                  </div>
                </div>
              </RevealCard>
            ))}
          </div>
        </div>

        {/* CRM Activity Feed Section */}
        <div className="w-full max-w-5xl mt-40">
          <RevealCard>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-4 space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-brand-accent/5 border border-brand-accent/20">
                  <iconify-icon icon="ph:list-bullets-bold" className="text-brand-accent" width="16" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">Protocol Logs</span>
                </div>
                <h3 className="text-3xl font-light text-apple-shade leading-tight">
                  Real-time <span className="text-white italic font-medium">Session Intelligence</span>
                </h3>
                <p className="text-apple-simple text-xs leading-relaxed uppercase tracking-widest opacity-60">
                  Tracking architectural shifts and operator interactions within the core systems.
                </p>
              </div>
              <div className="lg:col-span-8 h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                <ActivityFeed uid={user?.uid || ''} />
              </div>
            </div>
          </RevealCard>

          <RevealCard className="mt-20">
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-brand-accent/5 border border-brand-accent/20">
                  <iconify-icon icon="ph:archive-bold" className="text-brand-accent" width="16" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white">Intelligence Archive</span>
                </div>
                <h3 className="text-4xl font-light text-apple-shade leading-tight">
                  Factual <span className="text-white italic font-medium">Field Intelligence</span>
                </h3>
                <p className="text-apple-simple text-xs leading-relaxed uppercase tracking-widest opacity-60 max-w-2xl mx-auto">
                  A curated database of real-world system rebuilds and brand transformations to inform your diagnostic protocol.
                </p>
              </div>
              <IntelligenceArchive />
            </div>
          </RevealCard>
        </div>

        <div className="w-full max-w-7xl mb-40">
          <RevealCard className="text-center mb-24">
            <h3 className="text-3xl md:text-5xl font-light uppercase tracking-[0.2em] text-apple-shade mb-6 font-sans">
              {t({ en: 'Rebuild Architecture', fr: 'Architecture de Reconstruction' })}
            </h3>
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto" />
          </RevealCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PILLARS.map((pillar) => (
              <InteractivePillar
                key={pillar.id}
                item={pillar}
                t={t}
                isActive={activePillar === pillar.id}
                onHover={setActivePillar}
                user={user}
                profile={profile}
              />
            ))}
          </div>
        </div>

        <div className="w-full max-w-7xl mb-40 mx-auto">
          <RevealCard className="mb-20 text-center">
            <h3 className="text-3xl font-light uppercase tracking-[0.2em] text-apple-shade mb-4 font-sans">
              {t({ en: 'Operational Roadmap', fr: 'Feuille de Route Opérationnelle' })}
            </h3>
            <p className="text-[11px] text-white/40 uppercase tracking-[0.4em] font-sans">
              {t({ en: 'Sequential Upgrading Protocol', fr: 'Protocole de Mise à Niveau Séquentiel' })}
            </p>
          </RevealCard>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mt-20">
            <div className="hidden md:block absolute top-0 left-[20%] right-[20%] h-[1px] bg-white/10" />
            {PROCESS.map((step, idx) => (
              <ProcessCard key={idx} step={step} index={idx} t={t} onClick={() => setActiveProcess(step)} />
            ))}
          </div>
        </div>

        <ProcessModal
          isOpen={activeProcess !== null}
          onClose={() => setActiveProcess(null)}
          step={activeProcess}
          t={t}
        />

        <RevealCard className="w-full max-w-5xl glass-panel !p-20 text-center relative overflow-hidden backdrop-blur-3xl border-white/20">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

          <div className="mb-16 space-y-6">
            <h3 className="text-4xl md:text-6xl font-light uppercase tracking-tighter text-apple-shade font-sans">
              {t({ en: 'The Final State', fr: 'L\'État Final' })}
            </h3>
            <p className="text-apple-simple max-w-2xl mx-auto text-base md:text-xl font-sans font-light leading-relaxed">
              {t({
                en: "Efficiency is the byproduct. Clarity is the result. Market dominance is the target.",
                fr: "L'efficacité est le sous-produit. La clarté est le résultat. La dominance du marché est la cible."
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16 max-w-3xl mx-auto">
            {OUTCOMES.map((outcome, idx) => (
              <div key={idx} className="flex items-center gap-4 text-left glass bg-white/[0.03] p-4 rounded-2xl border-white/5">
                <iconify-icon icon="ph:check-circle-thin" className="text-white text-2xl shrink-0" />
                <span className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white/80 font-sans">
                  {t(outcome)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => {
                openContact(t({
                  en: "I am requesting a full System Audit for our current digital infrastructure.",
                  fr: "Je demande un audit système complet pour notre infrastructure numérique actuelle."
                }));
                if (user) logSystemAction(user.uid, "AUDIT_REQUEST_CLICK", {}, 'UI');
              }}
              className="px-12 py-6 bg-white text-black rounded-full font-bold uppercase tracking-[0.3em] text-[11px] hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_80px_rgba(255,255,255,0.4)] font-sans"
            >
              {t({ en: 'Request System Audit', fr: 'Demander Audit Système' })}
            </button>
            <button
              onClick={openCollaboration}
              className="px-12 py-6 bg-black text-white border border-white/10 rounded-full font-bold uppercase tracking-[0.3em] text-[11px] hover:scale-105 transition-all hover:bg-white/5 font-sans"
            >
              {t({ en: 'Link Operator', fr: 'Lier Opérateur' })}
            </button>
          </div>
        </RevealCard>
      </div>
    </section>
  );
};

export default Dashboard;
