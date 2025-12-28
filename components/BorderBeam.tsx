
import React from 'react';

interface BorderBeamProps {
  className?: string;
  duration?: string;
}

const BorderBeam: React.FC<BorderBeamProps> = ({ duration = '4s', className = '' }) => {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden ${className}`}
    >
      <div 
        className="absolute inset-[-2px] border-2 border-transparent rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(90deg, transparent, #ffffff, transparent) border-box',
          WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          animation: `beam-move ${duration} linear infinite`,
          backgroundSize: '200% 100%'
        }}
      />
    </div>
  );
};

export default BorderBeam;
