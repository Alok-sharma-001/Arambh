import React from 'react';
import { motion } from 'framer-motion';

interface DataFlowPathProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  active: boolean;
}

export const DataFlowPath: React.FC<DataFlowPathProps> = ({ startX, startY, endX, endY, active }) => {
  if (!active) return null;

  const dx = endX - startX;
  
  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-10" 
      style={{ overflow: 'visible' }}
    >
      <motion.path
        d={`M ${startX} ${startY} Q ${startX + dx/2} ${startY - 50} ${endX} ${endY}`}
        fill="none"
        stroke="url(#flowGradient)"
        strokeWidth="3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <defs>
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
    </svg>
  );
};
