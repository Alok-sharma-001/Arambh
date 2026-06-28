import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgression } from '../../hooks/useProgression';
import { Sparkles, Gift, ArrowRight } from 'lucide-react';
import { playSound } from '../../utils/audio';
import { regions } from '../../data/regions';
import { useRegionStore } from '../../store/regionStore';

export const LevelUpModal: React.FC = () => {
  const { levelUpEvent, dismissLevelUp } = useProgression();
  const storeRegions = useRegionStore((s) => s.regions);

  useEffect(() => {
    if (levelUpEvent) {
      playSound.levelUp();
    }
  }, [levelUpEvent]);

  if (!levelUpEvent) return null;

  // Find the current or available region to show as unlocked
  const unlockedRegion = regions.find(r => {
    const status = (storeRegions[r.id]?.regionStatus || r.status) as string;
    return status === 'available' || status === 'current';
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
        onClick={dismissLevelUp}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative w-full max-w-md p-8 rounded-2xl bg-[#13131A] border-2 border-game-gold/50 shadow-[0_0_80px_rgba(251,191,36,0.3)] text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-game-gold rounded-full"
                initial={{
                  x: '50%',
                  y: '50%',
                  opacity: 1,
                  scale: 1,
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 1,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-game-gold/10 border-2 border-game-gold/30 mb-6"
          >
            <Sparkles className="w-10 h-10 text-game-gold" />
          </motion.div>

          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-game-gold mb-2">
            Level Up
          </h2>

          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-4xl font-black text-slate-400">
              {levelUpEvent.oldLevel}
            </span>
            <ArrowRight className="w-6 h-6 text-game-gold" />
            <span className="text-5xl font-black text-white">
              {levelUpEvent.newLevel}
            </span>
          </div>

          {levelUpEvent.reward && (
            <div className="p-4 rounded-xl bg-[#0D0D12] border border-[#181820] mb-6">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Gift className="w-4 h-4 text-game-purple" />
                <span className="text-xs font-bold uppercase tracking-wider text-game-purple">Unlocked Reward</span>
              </div>
              <p className="text-lg font-bold text-white">
                <span className="mr-2">{levelUpEvent.reward.icon}</span>
                {levelUpEvent.reward.name}
              </p>
            </div>
          )}

          {unlockedRegion && (
            <div className="p-4 rounded-xl bg-game-purple/10 border border-game-purple/30 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-game-purple">Unlocked Region</span>
              <p className="text-lg font-bold text-white mt-1">
                🏰 {unlockedRegion.name}
              </p>
            </div>
          )}

          <button
            onClick={dismissLevelUp}
            className="w-full py-3 rounded-xl bg-game-gold text-black font-bold text-sm hover:bg-game-gold/90 transition-colors"
          >
            Continue
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
