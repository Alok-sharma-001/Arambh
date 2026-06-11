import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingXPProps {
  amount: number;
  triggerKey: number;
}

export const FloatingXP: React.FC<FloatingXPProps> = ({ amount, triggerKey }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (triggerKey > 0) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [triggerKey]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key={`xp-${triggerKey}`}
          initial={{ opacity: 0, y: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 1, 0], y: -100, scale: [0.5, 1.2, 1, 1] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-50 flex items-center justify-center"
        >
          {/* Particles */}
          {[...Array(6)].map((_, i) => (
             <motion.div
               key={i}
               className="absolute w-2 h-2 bg-game-gold rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]"
               initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
               animate={{ 
                 x: (Math.random() - 0.5) * 100, 
                 y: (Math.random() - 0.5) * 100, 
                 opacity: 0,
                 scale: 0
               }}
               transition={{ duration: 1, ease: "easeOut" }}
             />
          ))}
          <div className="text-2xl font-black text-game-gold drop-shadow-[0_0_15px_rgba(251,191,36,1)] tracking-wider">
            +{amount} XP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
