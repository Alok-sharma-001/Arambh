import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0 to 100
  color?: string; // Tailwind color class, e.g., 'bg-blue-500'
  height?: string; // Tailwind height class, e.g., 'h-2'
  className?: string;
  showLabel?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = 'bg-game-purple',
  height = 'h-3',
  className = '',
  showLabel = false,
}) => {
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-400">
          <span>Progress</span>
          <span>{Math.round(safeProgress)}%</span>
        </div>
      )}
      <div className={`w-full bg-[#0D0D12] rounded-full overflow-hidden border border-[#181820] ${height}`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safeProgress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color} rounded-full relative`}
        >
          {/* Subtle glow effect on the bar */}
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20" style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)'}} />
        </motion.div>
      </div>
    </div>
  );
};
