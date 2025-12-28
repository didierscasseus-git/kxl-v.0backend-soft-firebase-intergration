
import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ShaderGradient } from '@shadergradient/react';
import * as THREE from 'three';
import { useThemeHue, useTheme } from '../context/ThemeContext';

// Deterministic color sequence mapped to scroll progress
const COLOR_SEQUENCE = [
  { pct: 0.0, c1: "#3C0008", c2: "#3A1F3B", c3: "#2D1E2F" },
  { pct: 0.2, c1: "#E4412C", c2: "#2D1E2F", c3: "#3C0008" },
  { pct: 0.45, c1: "#2D1E2F", c2: "#4E2A4F", c3: "#3A1F3B" },
  { pct: 0.7, c1: "#4E2A4F", c2: "#3A1F3B", c3: "#2D1E2F" },
  { pct: 0.9, c1: "#3A1F3B", c2: "#2D1E2F", c3: "#4E2A4F" },
  { pct: 1.0, c1: "#2D1E2F", c2: "#3A1F3B", c3: "#4E2A4F" },
];

const LIGHT_COLOR_SEQUENCE = [
  { pct: 0.0, c1: "#F6F8FA", c2: "#E1E4E8", c3: "#FFFFFF" }, // GitHub Light Gray
  { pct: 0.2, c1: "#E1E4E8", c2: "#D1D5DA", c3: "#F6F8FA" },
  { pct: 0.45, c1: "#D1D5DA", c2: "#E1E4E8", c3: "#FFFFFF" },
  { pct: 0.7, c1: "#F6F8FA", c2: "#E1E4E8", c3: "#D1D5DA" },
  { pct: 0.9, c1: "#FFFFFF", c2: "#F6F8FA", c3: "#E1E4E8" },
  { pct: 1.0, c1: "#E1E4E8", c2: "#F6F8FA", c3: "#FFFFFF" },
];

const shiftHue = (hex: string, hueShift: number) => {
  const color = new THREE.Color(hex);
  const hsl = { h: 0, s: 0, l: 0 };
  (color as any).getHSL(hsl);

  // Normalize hueShift to 0-1
  const shift = (hueShift % 360) / 360;
  hsl.h = (hsl.h + shift) % 1;

  color.setHSL(hsl.h, hsl.s, hsl.l);
  return '#' + color.getHexString();
};

const lerpColor = (colorA: string, colorB: string, t: number) => {
  const c1 = new THREE.Color(colorA);
  const c2 = new THREE.Color(colorB);
  c1.lerp(c2, t);
  return '#' + c1.getHexString();
};

const GradientController = ({ scrollY, hueOffset, theme }: { scrollY: number; hueOffset: number; theme: 'light' | 'dark' }) => {
  const sequence = theme === 'light' ? LIGHT_COLOR_SEQUENCE : COLOR_SEQUENCE;

  let activeSet = sequence[0];
  let nextSet = sequence[1];
  let localT = 0;

  for (let i = 0; i < sequence.length - 1; i++) {
    if (scrollY >= sequence[i].pct && scrollY <= sequence[i + 1].pct) {
      activeSet = sequence[i];
      nextSet = sequence[i + 1];
      const range = nextSet.pct - activeSet.pct;
      localT = (scrollY - activeSet.pct) / range;
      break;
    }
  }

  if (scrollY >= 1) {
    activeSet = sequence[sequence.length - 1];
    nextSet = sequence[sequence.length - 1];
    localT = 0;
  }

  const baseC1 = lerpColor(activeSet.c1, nextSet.c1, localT);
  const baseC2 = lerpColor(activeSet.c2, nextSet.c2, localT);
  const baseC3 = lerpColor(activeSet.c3, nextSet.c3, localT);

  // Apply Hue Shift
  const c1 = shiftHue(baseC1, hueOffset);
  const c2 = shiftHue(baseC2, hueOffset);
  const c3 = shiftHue(baseC3, hueOffset);

  const rotY = (scrollY * 180) - 20;
  const rotZ = 50 + (scrollY * 20);
  const zoom = 10 - (scrollY * 6);
  const amp = 2 + (scrollY * 3);
  const freq = 5.5 - (scrollY * 2.5);

  return (
    <ShaderGradient
      animate="on"
      brightness={theme === 'light' ? 0.8 : 1.2}
      cAzimuthAngle={180}
      cDistance={3.5}
      cPolarAngle={110}
      cameraZoom={zoom}
      color1={c1}
      color2={c2}
      color3={c3}
      envPreset="city"
      grain="on"
      lightType="3d"
      positionX={0}
      positionY={0}
      positionZ={0}
      range="disabled"
      rangeEnd={40}
      rangeStart={0}
      reflection={theme === 'light' ? 0.05 : 0.1}
      rotationX={0}
      rotationY={rotY}
      rotationZ={rotZ}
      shader="defaults"
      type="sphere"
      uAmplitude={amp}
      uDensity={1.3}
      uFrequency={freq}
      uSpeed={0.2}
      uStrength={2.5}
      uTime={0}
      wireframe={false}
    />
  );
};

const BackgroundGradient: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { themeHue } = useThemeHue();
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.getElementById('scroll-root');
    if (!root) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const { scrollTop, scrollHeight, clientHeight } = root;
          const maxScroll = scrollHeight - clientHeight;
          const progress = Math.min(1, Math.max(0, scrollTop / maxScroll));
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    root.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => root.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none transform-gpu backface-hidden will-change-transform">
      <Canvas
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio * 1.5, 3) : 1}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: true,
          preserveDrawingBuffer: true
        }}
        resize={{ debounce: 0, scroll: false }}
      >
        <GradientController scrollY={scrollProgress} hueOffset={themeHue} theme={theme} />
      </Canvas>
    </div>
  );
};

export default BackgroundGradient;
