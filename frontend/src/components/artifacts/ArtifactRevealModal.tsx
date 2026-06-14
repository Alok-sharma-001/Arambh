import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useArtifacts } from '../../hooks/useArtifacts';
import { Button } from '../ui/Button';

export const ArtifactRevealModal: React.FC = () => {
  const { revealedArtifact, dismissArtifactReveal } = useArtifacts();

  if (!revealedArtifact) return null;

  const Icon = revealedArtifact.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
        onClick={dismissArtifactReveal}
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="relative w-full max-w-lg p-10 rounded-3xl bg-[#0D0D12] border border-[#181820] shadow-[0_0_100px_rgba(0,0,0,0.8)] text-center overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Intense background glow based on artifact color */}
          <div className={`absolute inset-0 blur-[100px] opacity-20 ${revealedArtifact.bg} rounded-3xl pointer-events-none`} />

          {/* Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 ${revealedArtifact.bg} rounded-full`}
                initial={{
                  x: '50%',
                  y: '50%',
                  opacity: 1,
                  scale: 0,
                }}
                animate={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  opacity: 0,
                  scale: Math.random() * 2,
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-slate-400 mb-8 relative z-10">
            Artifact Discovered
          </h2>

          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 0.2 }}
            className={`mx-auto w-32 h-32 rounded-full flex items-center justify-center mb-8 ${revealedArtifact.bg} border-4 border-[#181820] relative z-10`}
          >
            <Icon className={`w-16 h-16 ${revealedArtifact.color} drop-shadow-[0_0_15px_currentColor]`} />
            <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-20" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative z-10"
          >
            <h3 className="text-3xl font-black text-white mb-4 drop-shadow-md">
              {revealedArtifact.name}
            </h3>
            <p className="text-slate-300 italic text-lg max-w-sm mx-auto mb-10 leading-relaxed font-serif">
              "{revealedArtifact.description}"
            </p>

            <Button
              onClick={dismissArtifactReveal}
              size="lg"
              className="w-full bg-white text-black hover:bg-slate-200 shadow-[0_0_30px_rgba(255,255,255,0.2)] text-sm uppercase tracking-wider"
            >
              Add to Collection
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
