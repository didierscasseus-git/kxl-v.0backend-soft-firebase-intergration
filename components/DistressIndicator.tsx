
import React from 'react';

interface DistressIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const DistressIndicator: React.FC<DistressIndicatorProps> = ({ size = 'sm', className = "" }) => {
  const scale = size === 'sm' ? 'scale-[0.4]' : size === 'md' ? 'scale-[0.8]' : 'scale-[1.2]';
  
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${scale} ${className}`}>
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Triangle Shadow */}
        <div className="absolute top-1 left-1 w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[42px] border-b-black/40 blur-[4px] translate-y-1" />
        
        {/* Main Triangle Body */}
        <div className="absolute w-0 h-0 border-l-[22px] border-l-transparent border-r-[22px] border-r-transparent border-b-[40px] border-b-[#f00] drop-shadow-lg" />
        
        {/* Inner Triangle for Depth */}
        <div className="absolute w-0 h-0 border-l-[18px] border-l-transparent border-r-[18px] border-r-transparent border-b-[34px] border-b-[#d00] translate-y-[3px]" />
        
        {/* The Exclamation Mark (!) with Neon Blink */}
        <div className="absolute top-[12px] flex flex-col items-center gap-[2px] font-black z-10 select-none pointer-events-none animate-neon-blink" style={{ fontSize: '20px', lineHeight: '1' }}>
           <span className="leading-none h-4">!</span>
           <div className="w-[4px] h-[4px] rounded-full bg-current" />
        </div>
      </div>
    </div>
  );
};

export default DistressIndicator;
