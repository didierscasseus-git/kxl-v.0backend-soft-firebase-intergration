
import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../App';
import '../types';

const InvestigationStages = [
  { pct: 0, label: { en: "INITIATING SYSTEM SCAN", fr: "INITIATION DU SCAN SYSTÈME" }, detail: { en: "Connecting to cluster nodes...", fr: "Connexion aux nœuds du cluster..." }, icon: "ph:magnifying-glass" },
  { pct: 15, label: { en: "ANALYZING LATENCY DELTA", fr: "ANALYSE DU DELTA DE LATENCE" }, detail: { en: "Detected 800% rise in egress traffic.", fr: "Hausse de 800% du trafic sortant détectée." }, icon: "ph:activity" },
  { pct: 30, label: { en: "TRACE RECONSTRUCTION", fr: "RECONSTRUCTION DES TRACES" }, detail: { en: "Tracing bottleneck: /api/user/auth", fr: "Traçage du goulot : /api/user/auth" }, icon: "ph:git-branch" },
  { pct: 45, label: { en: "ERROR LOG AGGREGATION", fr: "AGRÉGATION DES JOURNAUX D'ERREURS" }, detail: { en: "502 Bad Gateway spike detected.", fr: "Pic de 502 Bad Gateway détecté." }, icon: "ph:warning-circle" },
  { pct: 60, label: { en: "STACK OVERFLOW ANALYSIS", fr: "ANALYSE DE DÉBORDEMENT DE PILE" }, detail: { en: "Memory leak in node.js worker threads.", fr: "Fuite de mémoire dans les threads ouvriers node.js." }, icon: "ph:cpu" },
  { pct: 75, label: { en: "VALIDATING INFRASTRUCTURE", fr: "VALIDATION DE L'INFRASTRUCTURE" }, detail: { en: "Checking Kubernetes pod health...", fr: "Vérification de la santé des pods Kubernetes..." }, icon: "ph:cube" },
  { pct: 90, label: { en: "FINALIZING REPORT", fr: "FINALISATION DU RAPPORT" }, detail: { en: "Generating deterministic resolution path.", fr: "Génération du chemin de résolution déterministe." }, icon: "ph:check-circle" },
  { pct: 100, label: { en: "INVESTIGATION COMPLETE", fr: "INVESTIGATION TERMINÉE" }, detail: { en: "Accessing core architecture.", fr: "Accès à l'architecture centrale." }, icon: "ph:shield-check" },
];

const InfrastructureSequence: React.FC = () => {
  // Check session storage to see if the scan has already run in this session
  const [shouldRender] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      return sessionStorage.getItem('kaza_scan_complete') !== 'true';
    } catch {
      return true;
    }
  });

  const [isDismissed, setIsDismissed] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeStage, setActiveStage] = useState(InvestigationStages[0]);

  // Sequence States
  const [isScanStarted, setIsScanStarted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const autoProgressRef = useRef(0);
  const animationFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const { t } = useLanguage();

  // 1. Scroll & Progress Logic MOVED DOWN


  const handleProceed = React.useCallback(() => {
    setShowPopup(false);
    // Wait for the popup transition to finish before removing the section
    setTimeout(() => {
      setIsDismissed(true);
    }, 500);
  }, []);

  const completeScan = React.useCallback(() => {
    if (!showPopup) {
      setShowPopup(true);
      try {
        sessionStorage.setItem('kaza_scan_complete', 'true');
      } catch {
        // Ignore storage errors
      }

      // Auto-dismiss 0.8s after popup is prompted
      setTimeout(() => {
        handleProceed();
      }, 800);
    }
  }, [showPopup, handleProceed]);

  const startAutoScan = React.useCallback(() => {
    startTimeRef.current = performance.now();

    // Total duration approx 9-10 seconds for 0-100%
    const animate = (time: number) => {
      const elapsed = time - startTimeRef.current;

      // Define phases: [endPct, durationMs]
      let newProgress = 0;

      if (elapsed < 1800) {
        const t = elapsed / 1800;
        const easeOut = 1 - Math.pow(1 - t, 3);
        newProgress = 35 * easeOut;
      } else if (elapsed < 5400) {
        const t = (elapsed - 1800) / 3600;
        newProgress = 35 + (27 * t); // Linear
      } else if (elapsed < 7800) {
        const t = (elapsed - 5400) / 2400;
        const easeInOut = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        newProgress = 62 + (16 * easeInOut);
      } else if (elapsed < 9000) {
        const t = (elapsed - 7800) / 1200;
        const easeOut = 1 - Math.pow(1 - t, 3);
        newProgress = 78 + (22 * easeOut);
      } else {
        newProgress = 100;
      }

      autoProgressRef.current = newProgress;

      setScanProgress(prev => {
        if (newProgress >= 100) {
          completeScan();
          return 100;
        }
        return Math.max(prev, newProgress);
      });

      if (newProgress < 100) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [completeScan]);

  // 1. Scroll & Progress Logic
  useEffect(() => {
    if (!shouldRender || isDismissed) return;

    const scrollRoot = document.getElementById('scroll-root');
    if (!scrollRoot) return;

    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const scrollDistance = rect.height - windowHeight;
      const scrolled = -rect.top;

      if (rect.top <= 0 && !isScanStarted) {
        setIsScanStarted(true);
        startAutoScan();
      }

      if (isScanStarted) {
        const rawScrollPct = Math.max(0, Math.min(1, scrolled / (scrollDistance * 0.9)));
        const scrollBasedProgress = rawScrollPct * 100;

        const effectiveProgress = Math.max(autoProgressRef.current, scrollBasedProgress);

        if (effectiveProgress >= 100) {
          completeScan();
        } else {
          setScanProgress(effectiveProgress);
        }
      }
    };

    scrollRoot.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      scrollRoot.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isScanStarted, shouldRender, isDismissed, startAutoScan, completeScan]);

  useEffect(() => {
    if (!shouldRender || isDismissed) return;
    const current = InvestigationStages.slice().reverse().find(s => scanProgress >= s.pct) || InvestigationStages[0];
    setActiveStage(current);
  }, [scanProgress, shouldRender, isDismissed]);

  if (!shouldRender || isDismissed) return null;

  return (
    // Tall container to allow for "scroll-to-fill" interaction (300vh)
    <section ref={sectionRef} className="relative h-[300vh] bg-transparent">

      {/* Sticky viewport that stays pinned while we scroll/load */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

        {/* ---------------- LOADING STATE ---------------- */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-[#0c0c0c]"
        >
          {/* Matrix / Code Rain Effect Background - KEEP MONO */}
          <div className="absolute inset-0 bg-brand-accent/5 overflow-hidden opacity-20">
            <div className="absolute inset-0 flex flex-col gap-4 p-4 font-mono text-[8px] text-brand-accent whitespace-nowrap opacity-40">
              {/* Pre-calculated randoms would go here, suppressing for now */}
              {Array.from({ length: 25 }).map((_, i) => (

                <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.05}s`, opacity: 0.5 }}>
                  {/* eslint-disable-next-line react-hooks/purity */}
                  [KERNEL_PANIC_CHECK_{i}] &gt;&gt; HEAP_ALLOC_0x{Math.floor(Math.random() * 16777215).toString(16).toUpperCase()} &gt;&gt; INTEGRITY: OK
                </div>
              ))}
            </div>
          </div>

          {/* Only show the loading bar if the popup isn't showing yet */}
          <div className={`relative flex flex-col items-center gap-12 max-w-lg w-full px-12 transition-all duration-500 ${showPopup ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100'}`}>
            <div className="space-y-3 text-center">
              <h2 className="text-[12px] font-bold tracking-[0.5em] uppercase text-brand-accent animate-pulse font-sans">
                {t({ en: 'System Override', fr: 'Surcharge Système' })}
              </h2>
              <p className="text-4xl font-extralight tracking-tighter uppercase italic text-apple-shade font-sans">
                {t({ en: 'Initiating Deep Scan', fr: 'Lancement du Scan Profond' })}
              </p>
            </div>

            {/* Progress Card */}
            <div className="w-full glass-dark bg-[#1A1815] border-white/10 p-8 rounded-[32px] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col gap-6 relative overflow-hidden">
              <div className="flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                    <iconify-icon icon={activeStage.icon} width="24" className={scanProgress < 100 ? "animate-spin-slow" : ""} />
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-bold text-apple-simple uppercase tracking-widest leading-tight font-sans">{t(activeStage.label)}</p>
                    <p className="text-[11px] text-apple-simple/60 font-antonio mt-1 uppercase tracking-wide font-sans">{t(activeStage.detail)}</p>
                  </div>
                </div>
                <div className="text-3xl font-antonio font-bold text-brand-accent tabular-nums">
                  {Math.round(scanProgress)}%
                </div>
              </div>

              {/* Bar Container */}
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5 z-10 relative">
                { }
                <div
                  className="h-full bg-brand-accent transition-all duration-75 ease-out shadow-[0_0_20px_rgba(255,255,255,0.4)] relative"
                  style={{ width: `${scanProgress}%` }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white blur-[2px]" />
                </div>
              </div>

              <div className="absolute inset-0 grid-background opacity-5 z-0" />
            </div>

            <div className="flex gap-6 text-[10px] font-bold tracking-[0.3em] text-apple-simple/50 uppercase font-sans">
              <span className="flex items-center gap-2"><div className="w-1 h-1 bg-white rounded-full animate-ping" /> CORE_ONLINE</span>
              <span className="flex items-center gap-2"><div className="w-1 h-1 bg-brand-accent rounded-full" /> V4.0.1_STABLE</span>
            </div>
          </div>

          {/* MacOS Style Popup - Appears when progress is 100% */}
          <div className={`absolute z-50 transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1) ${showPopup ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-8 pointer-events-none'}`}>
            <div className="w-[300px] bg-[#ececec] dark:bg-[#2c2c2c] rounded-xl shadow-2xl overflow-hidden border border-black/10 dark:border-white/10 font-sans">
              {/* Title Bar */}
              <div className="h-7 bg-gradient-to-b from-[#e6e6e6] to-[#dcdcdc] dark:from-[#3a3a3a] dark:to-[#323232] border-b border-[#c4c4c4] dark:border-black/30 flex items-center px-3 gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e] border border-[#dba536]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
              </div>
              {/* Content */}
              <div className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center text-green-500 text-2xl">
                  <iconify-icon icon="ph:check-bold" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-black dark:text-white font-sans">{t({ en: 'Deep Scan Complete', fr: 'Scan Profond Terminé' })}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-sans">
                    {t({ en: 'No critical anomalies found. System integrity at 100%.', fr: 'Aucune anomalie critique. Intégrité à 100%.' })}
                  </p>
                </div>
                <button
                  onClick={handleProceed}
                  className="w-full py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-md shadow-sm transition-colors cursor-pointer font-sans"
                >
                  {t({ en: 'Proceeding...', fr: 'Poursuite...' })}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default InfrastructureSequence;
