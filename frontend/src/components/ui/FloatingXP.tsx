import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingXPProps {
  amount: number;
  triggerKey: number; // Increment this to trigger the animation
  onComplete?: () => void;
}

export const FloatingXP: React.FC<FloatingXPProps> = ({ amount, triggerKey, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (triggerKey > 0) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [triggerKey, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: 1, y: -50, scale: 1.2 }}
          exit={{ opacity: 0, y: -80, scale: 0.8 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute z-50 pointer-events-none"
        >
          <span className="text-xl font-extrabold text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
            +{amount} XP
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
