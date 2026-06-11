import React from 'react';
import { useEngineStore } from '../../store/engineStore';
import { motion, AnimatePresence } from 'framer-motion';

export const MemoryVisualizer: React.FC = () => {
  const { steps, currentStepIndex } = useEngineStore();

  // If no steps initialized yet, just return an empty grid
  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const memorySnapshot = currentStep.memorySnapshot;

  // We have 8 RAM slots (0x00 to 0x07)
  const slots = Array.from({ length: 8 }, (_, i) => `0x0${i}`);

  return (
    <div className="flex-1 flex items-center justify-center p-8 relative z-10 w-full">
      <div className="grid grid-cols-4 gap-6 w-full max-w-2xl relative">
        
        {slots.map((address) => {
          const variable = memorySnapshot[address];
          const isJustAllocated = currentStep.type === 'ALLOCATE' && currentStep.variable?.address === address;

          return (
            <motion.div
              key={address}
              initial={false}
              animate={{
                borderColor: isJustAllocated ? '#8B5CF6' : 'rgba(255,255,255,0.05)',
                boxShadow: isJustAllocated ? 'inset 0 0 20px rgba(139,92,246,0.2)' : 'none',
              }}
              className="aspect-square bg-slate-950/40 backdrop-blur-md border-2 rounded-3xl flex items-center justify-center relative group overflow-visible shadow-inner"
            >
              {/* Slot Address */}
              <span className="text-slate-600 font-mono text-[10px] absolute top-3 right-3 font-bold">
                {address}
              </span>

              <AnimatePresence>
                {variable && (
                  <motion.div
                    key={`${variable.address}-${variable.value}`} // Force re-render if value changes
                    layoutId={`var-${variable.address}`}
                    initial={{ opacity: 0, scale: 0.5, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="w-16 h-16 bg-gradient-to-br from-game-purple to-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white shadow-[0_0_30px_rgba(139,92,246,0.5)] relative z-20"
                  >
                    {/* The Value */}
                    {variable.value}

                    {/* The Variable Name Label */}
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="absolute -bottom-8 text-xs text-game-purple font-bold bg-slate-950 px-3 py-1 rounded-full border border-game-purple/30 backdrop-blur-md shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                    >
                      {variable.name}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Evaluation Pulse Overlay if this variable is part of an evaluation right now */}
              {currentStep.type === 'EVALUATE' && currentStep.evaluation && 
               (variable?.value === currentStep.evaluation.leftVal || variable?.value === currentStep.evaluation.rightVal) && (
                <motion.div 
                  className="absolute inset-0 border-2 border-game-gold rounded-3xl z-10"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: [0, 1, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

            </motion.div>
          );
        })}

        {/* Global Evaluation overlay rendering */}
        <AnimatePresence>
          {currentStep.type === 'EVALUATE' && currentStep.evaluation && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -50 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-xl border border-game-gold/50 p-6 rounded-3xl shadow-[0_0_50px_rgba(251,191,36,0.4)] z-50 flex items-center gap-6"
            >
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-inner">
                {currentStep.evaluation.leftVal}
              </div>
              <span className="text-2xl text-game-gold font-bold">{currentStep.evaluation.operator}</span>
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-inner">
                {currentStep.evaluation.rightVal}
              </div>
              <span className="text-slate-400 font-bold mx-2">➞</span>
              <div className="w-16 h-16 bg-gradient-to-br from-game-gold to-yellow-600 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-slate-900 shadow-[0_0_30px_rgba(251,191,36,0.8)]">
                {currentStep.evaluation.result}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
