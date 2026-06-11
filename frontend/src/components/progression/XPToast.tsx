import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface XPToastProps {
  amount: number;
  triggerKey: number;
}

/**
 * Reusable floating "+N XP" animation.
 * Lightweight: uses framer-motion AnimatePresence for clean mount/unmount.
 */
export const XPToast: React.FC<XPToastProps> = ({ amount, triggerKey }) => {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (triggerKey > 0) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [triggerKey]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key={`xp-toast-${triggerKey}`}
          initial={{ opacity: 0, y: 0, scale: 0.6 }}
          animate={{ opacity: [0, 1, 1, 0], y: -80, scale: [0.6, 1.1, 1, 1] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-50"
        >
          <span className="text-xl font-black text-game-gold drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] whitespace-nowrap">
            +{amount} XP
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
