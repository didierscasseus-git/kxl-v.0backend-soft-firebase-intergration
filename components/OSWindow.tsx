import React, { useState, useRef } from 'react';
import '../types';

interface OSWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  style?: React.CSSProperties;
}

const OSWindow: React.FC<OSWindowProps> = ({ title, children, className = '', dark = false, style }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!windowRef.current) return;
    const rect = windowRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 15;
    const rotateY = (centerX - x) / 15;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleTouch = () => {
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 500);
  };

  return (
    <div
      ref={windowRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouch}
      className={`flex flex-col rounded-2xl overflow-hidden shadow-2xl border transition-all duration-300 ease-out preserve-3d group ${dark ? 'glass-dark border-white/10' : 'glass border-black/5'
        } ${isTapped ? 'scale-95' : ''} ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
        zIndex: isHovered ? 50 : undefined,
        ...style
      }}
    >
      {/* Header bar */}
      <div className={`px-4 py-3 flex items-center justify-between border-b ${dark ? 'bg-black/40 border-white/5' : 'bg-white/40 border-black/5'}`}>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56] shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E] shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F] shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <span className={`text-[9px] font-bold uppercase tracking-[0.2em] pointer-events-none ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{title}</span>
        <div className="flex gap-4">
          <iconify-icon icon="ph:plus-bold" width="12" className={`${dark ? 'text-gray-600' : 'text-gray-400'}`} />
          <iconify-icon icon="ph:magnifying-glass-bold" width="12" className={`${dark ? 'text-gray-600' : 'text-gray-400'}`} />
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 p-5 overflow-auto scrollbar-hide bg-gradient-to-b from-transparent to-black/5">
        {children}
      </div>

      {/* Subtle shine effect on hover */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-tr from-white via-transparent to-transparent"
        style={{ transform: 'translateZ(20px)' }}
      />
    </div>
  );
};

export default OSWindow;