import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserHistory } from '../services/versionService';
import { format } from 'date-fns';

const TerminalStack: React.FC = () => {
  const { user } = useAuth();
  const [rotation, setRotation] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setRotation(scrollY * 0.1);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchHistory = async () => {
      const data = await getUserHistory(user.uid);
      setHistory(data.slice(0, 8)); // Get last 8 actions for the 8 terminals
    };
    fetchHistory();
    // Poll every 30 seconds for new telemetry if not real-time
    const interval = setInterval(fetchHistory, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const terminals = Array.from({ length: 8 });

  return (
    <div className="relative h-[800px] w-full flex items-center justify-center perspective-[2000px] overflow-visible">
      { }
      <div
        ref={containerRef}
        className="relative w-full h-full preserve-3d transition-transform duration-700 ease-out"
        style={{ transform: `rotateY(${rotation}deg) rotateX(10deg)` }}
      >
        {terminals.map((_, i) => {
          const log = history[i];
          return (
             
            <div
              key={i}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass w-[85vw] md:w-[600px] h-[320px] rounded-lg border border-[var(--border-primary)] shadow-2xl flex flex-col p-6 overflow-hidden transition-all duration-300 hover:border-brand-accent/30"
              style={{
                transform: `translate(-50%, -50%) rotateY(${i * 45}deg) translateZ(500px)`,
                backfaceVisibility: 'hidden'
              }}
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                  <span className="text-[9px] opacity-40 ml-2 font-mono uppercase tracking-[0.2em]">NODE://0x{i.toString(16).padStart(2, '0')}</span>
                </div>
                <span className="text-[8px] font-bold text-white/20 font-mono italic uppercase">Latency: {12 + i * 2}ms</span>
              </div>

              <div className="flex-1 font-mono text-[11px] space-y-3">
                <div className="space-y-1">
                  <p className="flex justify-between text-white/40">
                    <span className="flex items-center gap-2">
                      <iconify-icon icon="ph:terminal-window-thin" />
                      SECURE_SHELL_ESTABLISHED
                    </span>
                    <span className="text-brand-accent/60">0x{(i * 1234).toString(16)}</span>
                  </p>
                  <p className="flex justify-between text-white/40">
                    <span className="flex items-center gap-2">
                      <iconify-icon icon="ph:shield-check-thin" />
                      FIREWALL_LAYER_{i + 1}_ACTIVE
                    </span>
                    <span className="text-green-500/40">PASSED</span>
                  </p>
                </div>

                <div className="p-3 bg-black/40 border border-white/5 rounded-xl space-y-2">
                  <p className="text-brand-accent text-[9px] uppercase font-bold tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                    Live Protocol Telemetry
                  </p>
                  {log ? (
                    <div className="animate-fade-in text-[10px]">
                      <p className="text-white/80 font-bold mb-1">{log.action.replace(/_/g, ' ')}</p>
                      <p className="text-white/40 leading-relaxed italic">
                        Category: {log.category || 'SYSTEM'} • {log.timestamp?.toDate ? format(log.timestamp.toDate(), 'HH:mm:ss') : 'LIVE'}
                      </p>
                    </div>
                  ) : (
                    <div className="animate-pulse space-y-1">
                      <div className="h-2 w-3/4 bg-white/5 rounded-full" />
                      <div className="h-2 w-1/2 bg-white/5 rounded-full" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[8px] font-bold text-white/20 uppercase tracking-widest">
                    <span>Buffer Sync</span>
                    <span>{90 + i}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-accent transition-all duration-1000 ease-out"
                      style={{ width: `${90 + i}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 h-8 flex items-center overflow-hidden mask-fade-edges relative">
                <div className="whitespace-nowrap animate-marquee flex gap-12 text-[9px] uppercase font-bold tracking-[0.3em] text-white/30">
                  <span>SYSTEM_UPGRADE_IN_PROGRESS</span>
                  <span>DECRYPTING_DATA_STREAMS</span>
                  <span>KAZA_X_LABS_OPERATOR_LINKED</span>
                  <span>NODE_0{i}_ACTIVE</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TerminalStack;
