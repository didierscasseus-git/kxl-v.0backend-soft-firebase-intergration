
import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(12); // Default small size
  const [isHoveringText, setIsHoveringText] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Direct 1:1 update without lerp
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if the target is text-related or interactive
      const isText = ['P', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'LABEL'].includes(target.tagName);
      const isInteractive = ['BUTTON', 'A', 'INPUT'].includes(target.tagName) || target.closest('button') || target.closest('a');

      if (isInteractive) {
        setSize(60); // Large sphere for interactive elements
        setIsHoveringText(false);
      } else if (isText) {
        const style = window.getComputedStyle(target);
        const fontSize = parseFloat(style.fontSize);
        const newSize = Math.max(20, Math.min(fontSize * 1.8, 150));
        setSize(newSize);
        setIsHoveringText(true);
      } else {
        setSize(12); // Reset to small dot
        setIsHoveringText(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
     
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference will-change-transform"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: 'white', // White mixes with difference to invert colors
        transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1), height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        // Removed backdropFilter: 'blur(2px)' to ensure text remains crisp and readable
        // The sphere effect is maintained via the inset shadow
        boxShadow: isHoveringText
          ? 'inset 0 0 12px rgba(0,0,0,0.15)' // Softer shadow when reading text
          : 'inset 0 0 4px rgba(0,0,0,0.5)',  // Distinct sphere edge when idle
      }}
    />
  );
};

export default CustomCursor;
