
import React, { useState, useEffect } from 'react';

const Flashlight: React.FC = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
      style={{
        background: `radial-gradient(circle 400px at ${pos.x}px ${pos.y}px, rgba(255, 255, 255, 0.05), transparent 80%)`
      }}
    />
  );
};

export default Flashlight;
