import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { ShaderGradient } from '@shadergradient/react';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// Pre-instantiated color objects to avoid GC pressure in the render loop
const TEMP_COLOR_1 = new THREE.Color();
const TEMP_COLOR_2 = new THREE.Color();
const TEMP_COLOR_HSL = { h: 0, s: 0, l: 0 };

const COLOR_SEQUENCE = [
    { pct: 0.0, c1: "#3C0008", c2: "#3A1F3B", c3: "#2D1E2F" },
    { pct: 0.2, c1: "#E4412C", c2: "#2D1E2F", c3: "#3C0008" },
    { pct: 0.45, c1: "#2D1E2F", c2: "#4E2A4F", c3: "#3A1F3B" },
    { pct: 0.7, c1: "#4E2A4F", c2: "#3A1F3B", c3: "#2D1E2F" },
    { pct: 0.9, c1: "#3A1F3B", c2: "#2D1E2F", c3: "#4E2A4F" },
    { pct: 1.0, c1: "#2D1E2F", c2: "#3A1F3B", c3: "#4E2A4F" },
];

const shiftHueOptimized = (hex: string, hueShift: number) => {
    TEMP_COLOR_1.set(hex);
    TEMP_COLOR_1.getHSL(TEMP_COLOR_HSL);
    const shift = (hueShift % 360) / 360;
    TEMP_COLOR_HSL.h = (TEMP_COLOR_HSL.h + shift) % 1;
    TEMP_COLOR_1.setHSL(TEMP_COLOR_HSL.h, TEMP_COLOR_HSL.s, TEMP_COLOR_HSL.l);
    return '#' + TEMP_COLOR_1.getHexString();
};

const lerpColorOptimized = (colorA: string, colorB: string, t: number) => {
    TEMP_COLOR_1.set(colorA);
    TEMP_COLOR_2.set(colorB);
    TEMP_COLOR_1.lerp(TEMP_COLOR_2, t);
    return '#' + TEMP_COLOR_1.getHexString();
};

const GradientController = ({ scrollY, hueOffset }: { scrollY: number; hueOffset: number }) => {
    // Memoize the sequence interpolation for performance
    const { c1, c2, c3, rotY, rotZ, zoom, amp, freq } = useMemo(() => {
        let activeSet = COLOR_SEQUENCE[0];
        let nextSet = COLOR_SEQUENCE[1];
        let localT = 0;

        for (let i = 0; i < COLOR_SEQUENCE.length - 1; i++) {
            if (scrollY >= COLOR_SEQUENCE[i].pct && scrollY <= COLOR_SEQUENCE[i + 1].pct) {
                activeSet = COLOR_SEQUENCE[i];
                nextSet = COLOR_SEQUENCE[i + 1];
                const range = nextSet.pct - activeSet.pct;
                localT = (scrollY - activeSet.pct) / range;
                break;
            }
        }

        if (scrollY >= 1) {
            activeSet = COLOR_SEQUENCE[COLOR_SEQUENCE.length - 1];
            nextSet = COLOR_SEQUENCE[COLOR_SEQUENCE.length - 1];
            localT = 0;
        }

        const baseC1 = lerpColorOptimized(activeSet.c1, nextSet.c1, localT);
        const baseC2 = lerpColorOptimized(activeSet.c2, nextSet.c2, localT);
        const baseC3 = lerpColorOptimized(activeSet.c3, nextSet.c3, localT);

        return {
            c1: shiftHueOptimized(baseC1, hueOffset),
            c2: shiftHueOptimized(baseC2, hueOffset),
            c3: shiftHueOptimized(baseC3, hueOffset),
            rotY: (scrollY * 180) - 20,
            rotZ: 50 + (scrollY * 20),
            zoom: 10 - (scrollY * 6),
            amp: 2 + (scrollY * 3),
            freq: 5.5 - (scrollY * 2.5)
        };
    }, [scrollY, hueOffset]);

    return (
        <ShaderGradient
            animate="on"
            brightness={1.2}
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
            reflection={0.1}
            rotationX={0}
            rotationY={rotY}
            rotationZ={rotZ}
            shader="defaults"
            type="sphere"
            uAmplitude={amp}
            uDensity={1.2} // Slightly reduced density for performance
            uFrequency={freq}
            uSpeed={0.15} // Slightly slower for more natural feel
            uStrength={2.5}
            uTime={0}
            wireframe={false}
        />
    );
};

const BackgroundGradient: React.FC = () => {
    const [scrollProgress, setScrollProgress] = React.useState(0);
    const { themeHue } = useTheme();
    const scrollRootRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const root = document.getElementById('scroll-root');
        if (!root) return;
        scrollRootRef.current = root;

        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const el = scrollRootRef.current;
                    if (el) {
                        const { scrollTop, scrollHeight, clientHeight } = el;
                        const maxScroll = scrollHeight - clientHeight;
                        const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;

                        // Only update state if progress changed significantly (0.1% threshold) to reduce re-renders
                        setScrollProgress(prev => {
                            if (Math.abs(prev - progress) > 0.001) return progress;
                            return prev;
                        });
                    }
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
        <div className="fixed inset-0 -z-40 pointer-events-none transform-gpu backface-hidden will-change-transform">
            <Canvas
                // Limit DPR to 1.5 to significantly reduce fragment shader load on high-DPI screens
                dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                gl={{
                    antialias: false, // Performance win, gradients don't usually need it
                    powerPreference: "high-performance",
                    alpha: true,
                    stencil: false,
                    depth: false
                }}
                resize={{ debounce: 50, scroll: false }} // Debounce resize
            >
                <GradientController scrollY={scrollProgress} hueOffset={themeHue} />
            </Canvas>
        </div>
    );
};

export default BackgroundGradient;
