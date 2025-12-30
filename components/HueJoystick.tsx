
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '../App';
import { useThemeHue } from '../context/ThemeContext';
import { useThemeMode } from '../context/ThemeModeContext';

import { Canvas } from '@react-three/fiber';
import { ShaderGradient } from '@shadergradient/react';
import * as THREE from 'three';

/**
 * Utility to convert HSL values to a valid Hex string for ShaderGradient.
 * Standardizes format to prevent "Invalid color format" errors.
 */
const getHexFromHsl = (h: number, s: number, l: number) => {
  const color = new THREE.Color();
  // Three.js HSL values are normalized 0-1
  color.setHSL(((h % 360) + 360) % 360 / 360, s / 100, l / 100);
  return '#' + color.getHexString();
};

const HologramOrb: React.FC<{ hue: number }> = ({ hue }) => {
  // Generate valid Hex colors for the shader to avoid format issues
  const color1 = useMemo(() => getHexFromHsl(hue + 340, 50, 20), [hue]);
  const color2 = useMemo(() => getHexFromHsl(hue + 20, 50, 40), [hue]);
  const color3 = useMemo(() => getHexFromHsl(hue + 200, 50, 30), [hue]);

  return (
    <div className="w-full h-full rounded-full overflow-hidden border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.2)] bg-black/40">
      <Canvas
        camera={{ position: [0, 0, 2], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ShaderGradient
          animate="on"
          brightness={1.5}
          cAzimuthAngle={180}
          cDistance={3}
          cPolarAngle={110}
          cameraZoom={10}
          color1={color1}
          color2={color2}
          color3={color3}
          envPreset="city"
          grain="on"
          lightType="3d"
          positionX={0}
          positionY={0}
          positionZ={0}
          range="disabled"
          reflection={0.1}
          rotationX={0}
          rotationY={45}
          rotationZ={0}
          shader="defaults"
          type="sphere"
          uAmplitude={3}
          uDensity={1.5}
          uFrequency={5}
          uSpeed={0.4}
          uStrength={3}
          uTime={0}
        />
      </Canvas>
      {/* Scanline overlay for hologram feel */}
      { }
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.1) 1px, rgba(255,255,255,0.1) 2px)',
          backgroundSize: '100% 4px'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-accent/20 to-transparent pointer-events-none" />
    </div>
  );
};

const HueJoystick: React.FC = () => {
  const { themeHue, setThemeHue } = useThemeHue();
  const { t } = useLanguage();
  const { toggleMode } = useThemeMode();

  const [draftHue, setDraftHue] = useState(themeHue);
  const [isDrafting, setIsDrafting] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showApproval, setShowApproval] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const revertTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastInteractionTime = useRef<number>(0);
  useEffect(() => { lastInteractionTime.current = Date.now(); }, []);

  // Increased radius so the knob can physically hover on top of the bars
  const MAX_RADIUS = 38;
  const SLAB_COUNT = 40;
  const slabs = useMemo(() => Array.from({ length: SLAB_COUNT }), []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1280);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setDraftHue(themeHue);
  }, [themeHue]);

  const handleRevert = useCallback(() => {
    setThemeHue(0);
    setDraftHue(0);
    setIsDrafting(false);
    setShowApproval(false);
    if (revertTimeoutRef.current) window.clearTimeout(revertTimeoutRef.current);
  }, [setThemeHue]);

  useEffect(() => {
    if (isDrafting && !isDragging) {
      if (revertTimeoutRef.current) window.clearTimeout(revertTimeoutRef.current);
      revertTimeoutRef.current = setTimeout(() => {
        handleRevert();
      }, 5000);
    }
    return () => {
      if (revertTimeoutRef.current) window.clearTimeout(revertTimeoutRef.current);
    };
  }, [isDrafting, isDragging, draftHue, handleRevert]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.type !== 'touchstart') {
      e.preventDefault();
    }
    setIsDragging(true);
    setIsDrafting(true);
    setShowApproval(true);
    lastInteractionTime.current = Date.now();
  };

  const handleDrag = React.useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    if (e.cancelable) e.preventDefault();

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

    const dx = clientX - centerX;
    const dy = clientY - centerY;

    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const hue = (angle + 360) % 360;

    const dist = Math.sqrt(dx * dx + dy * dy);
    const clampedDist = Math.min(dist, MAX_RADIUS);
    const clampScale = dist > 0 ? clampedDist / dist : 0;

    setJoystickPos({ x: dx * clampScale, y: dy * clampScale });
    setDraftHue(hue);
    setThemeHue(hue);
    lastInteractionTime.current = Date.now();
  }, [isDragging, setThemeHue]);

  const handleDragEnd = () => {
    setIsDragging(false);
    setJoystickPos({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDrag, { passive: false });
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleDrag, { passive: false });
      window.addEventListener('touchend', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDrag);
      window.removeEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDrag);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleDrag]);

  const handleRandom = () => {
    const randomHue = Math.floor(Math.random() * 360);
    setDraftHue(randomHue);
    setThemeHue(randomHue);
    setIsDrafting(true);
    setShowApproval(true);
    lastInteractionTime.current = Date.now();
  };

  const handleSave = () => {
    setIsDrafting(false);
    setShowApproval(false);
    if (revertTimeoutRef.current) window.clearTimeout(revertTimeoutRef.current);
  };


  return (
    <div className="relative group/joystick">
      {/* Mobile Hologram Preview Popup */}
      {isMobile && (isDrafting || isDragging) && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex flex-col items-center animate-window-pop pointer-events-none z-[100]">
          <div className="w-32 h-32 relative">
            <div className="absolute inset-[-10px] bg-brand-accent/10 blur-xl rounded-full animate-pulse" />
            <HologramOrb hue={draftHue} />
            {/* Projection Beam Base */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-8 bg-gradient-to-t from-brand-accent/40 to-transparent blur-md clip-path-pyramid" />
          </div>
          <div className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
            {t({ en: 'Visual Engine Preview', fr: 'Aperçu Moteur Visuel' })}
          </div>
        </div>
      )}

      {/* Hue Slabs Wheel */}
      <div
        ref={containerRef}
        className="relative w-24 h-24 flex items-center justify-center transition-transform duration-700 group-hover/joystick:scale-110"
      >
        {slabs.map((_, i) => {
          const angle = (i / SLAB_COUNT) * 360;
          const hue = (angle + draftHue) % 360;
          return (

            <div
              key={i}
              className="absolute w-[3px] h-6 rounded-full transition-all duration-500 z-0"
              style={{
                backgroundColor: `hsla(${hue}, 50%, 60%, 0.8)`,
                transform: `rotate(${angle}deg) translateY(-36px)`,
                boxShadow: `0 0 10px hsla(${hue}, 50%, 60%, 0.3)`,
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            />
          );
        })}

        {/* Central Joystick Socket & Knob - Hovering ON TOP of the bars */}
        <div className="absolute w-14 h-14 rounded-full bg-black/80 border border-white/10 flex items-center justify-center shadow-2xl z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 rounded-full" />
          <div className="absolute inset-0 rounded-full border border-white/5 shadow-inner pointer-events-none" />

          {/* Chrome Knob - High Specular Light Texture */}
          { }
          <div
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            onClick={() => {
              if (!isDragging && Date.now() - lastInteractionTime.current > 500) {
                toggleMode();
                handleRandom();
              }
            }}

            className={`w-11 h-11 rounded-full shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-300 relative z-20 overflow-hidden ${isDragging ? 'scale-90 shadow-none' : 'hover:scale-105 shadow-[0_15px_30px_rgba(0,0,0,0.8)]'}`}
            style={{
              transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
              background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 25%, #ffffff 50%, #d1d1d1 75%, #f5f5f5 100%)',
              border: '1px solid rgba(255,255,255,0.4)',
              boxShadow: isDragging
                ? '0 2px 4px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,1)'
                : '0 12px 24px rgba(0,0,0,0.6), inset 0 2px 3px rgba(255,255,255,0.8)'
            }}
          >
            {/* Chrome Refinement Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-black/30 pointer-events-none" />

            {/* Specular Highlight */}
            <div className="absolute top-1 left-2 w-3 h-3 bg-white/80 rounded-full blur-[2px] pointer-events-none" />

            {/* Secondary Reflection */}
            <div className="absolute bottom-2 right-2 w-4 h-2 bg-black/10 rounded-full blur-[4px] rotate-45 pointer-events-none" />

            {/* Central Core Indicator */}
            <div className="w-2 h-2 rounded-full bg-black/20 shadow-inner flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-white/60 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 rounded-full border border-white/5 opacity-40 pointer-events-none" />
      </div>

      {/* Approval Overlay */}
      <div className={`absolute left-full ml-6 top-1/2 -translate-y-1/2 transition-all duration-500 flex flex-col gap-2 ${showApproval ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 -translate-x-4 pointer-events-none'}`}>
        <div className="glass p-1.5 rounded-2xl flex items-center gap-1 border border-white/10 shadow-2xl">
          <button
            onClick={handleSave}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-green-500/20 text-green-500 flex items-center justify-center transition-colors group"
            title={t({ en: 'Apply Style', fr: 'Appliquer Style' })}
          >
            <iconify-icon icon="ph:check-bold" width="18" />
          </button>
          <button
            onClick={handleRevert}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-red-500/20 text-red-500 flex items-center justify-center transition-colors group"
            title={t({ en: 'Discard Changes', fr: 'Annuler Changements' })}
          >
            <iconify-icon icon="ph:x-bold" width="18" />
          </button>
        </div>

        {showApproval && !isDragging && (
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-brand-accent animate-countdown" />
          </div>
        )}
      </div>

      <style>{`
        @keyframes countdown {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-countdown {
          animation: countdown 5s linear forwards;
        }
        .clip-path-pyramid {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
      `}</style>
    </div>
  );
};

export default HueJoystick;
