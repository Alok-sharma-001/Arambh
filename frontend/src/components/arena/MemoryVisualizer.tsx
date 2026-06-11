import React from 'react';
import { useEngineStore } from '../../store/engineStore';
import { motion, AnimatePresence } from 'framer-motion';

export const MemoryVisualizer: React.FC = () => {
  const { steps, currentStepIndex } = useEngineStore();

  if (steps.length === 0) return null;

  const currentStep = steps[currentStepIndex];
  const memorySnapshot = currentStep.memorySnapshot;

  const slots = Array.from({ length: 8 }, (_, i) => `0x0${i}`);

  return (
    <div className="flex-1 flex items-center justify-center p-8 relative z-10 w-full">
      
      {/* Execution Chamber Background Glow */}
      {currentStep.type === 'EVALUATE' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-game-purple/20 blur-[100px] rounded-full pointer-events-none z-0"
        />
      )}

      <div className="grid grid-cols-4 gap-8 w-full max-w-2xl relative z-10">
        
        {slots.map((address) => {
          const variable = memorySnapshot[address];
          const isJustAllocated = currentStep.type === 'ALLOCATE' && currentStep.variable?.address === address;
          const isEvaluating = currentStep.type === 'EVALUATE' && currentStep.evaluation && 
               (variable?.value === currentStep.evaluation.leftVal || variable?.value === currentStep.evaluation.rightVal);

          return (
            <motion.div
              key={address}
              initial={false}
              animate={{
                borderColor: isJustAllocated ? '#8B5CF6' : isEvaluating ? '#FBBF24' : 'rgba(255,255,255,0.05)',
                boxShadow: isJustAllocated ? 'inset 0 0 30px rgba(139,92,246,0.3)' : isEvaluating ? 'inset 0 0 30px rgba(251,191,36,0.3)' : 'none',
              }}
              className="aspect-square bg-[#13131A]/80 backdrop-blur-md border-2 rounded-3xl flex items-center justify-center relative group overflow-visible shadow-inner transition-colors duration-500"
            >
              <span className="text-slate-600 font-mono text-[10px] absolute top-3 right-3 font-bold z-10">
                {address}
              </span>

              <AnimatePresence>
                {variable && (
                  <motion.div
                    key={`${variable.address}-${variable.value}`} 
                    layoutId={`var-${variable.address}`}
                    initial={{ opacity: 0, scale: 0.2, y: -150 }}
                    animate={{ 
                      opacity: isEvaluating ? 0.3 : 1, 
                      scale: isEvaluating ? 0.8 : 1, 
                      y: 0 
                    }}
                    exit={{ opacity: 0, scale: 0.5, y: 150 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 15 }}
                    className="w-16 h-16 bg-gradient-to-br from-game-purple to-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white shadow-[0_0_40px_rgba(139,92,246,0.6)] relative z-20"
                  >
                    {variable.value}

                    <motion.div 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4, type: 'spring' }}
                      className="absolute -bottom-8 text-xs text-game-gold font-bold bg-[#0D0D12] px-4 py-1.5 rounded-full border border-game-gold/30 backdrop-blur-md shadow-[0_0_15px_rgba(251,191,36,0.4)]"
                    >
                      {variable.name}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Global Evaluation overlay rendering */}
        <AnimatePresence>
          {currentStep.type === 'EVALUATE' && currentStep.evaluation && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, y: -50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0D0D12]/95 backdrop-blur-2xl border-2 border-game-gold/50 p-8 rounded-[3rem] shadow-[0_0_80px_rgba(251,191,36,0.3)] z-50 flex items-center gap-8"
            >
              <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl font-extrabold text-white shadow-inner border border-slate-700"
              >
                {currentStep.evaluation.leftVal}
              </motion.div>
              
              <motion.span 
                animate={{ scale: [1, 1.2, 1], color: ['#FBBF24', '#FFFFFF', '#FBBF24'] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-4xl text-game-gold font-black"
              >
                {currentStep.evaluation.operator}
              </motion.span>
              
              <motion.div 
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-3xl font-extrabold text-white shadow-inner border border-slate-700"
              >
                {currentStep.evaluation.rightVal}
              </motion.div>

              <span className="text-slate-500 font-bold mx-2 text-2xl">➞</span>
              
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-gradient-to-br from-game-gold to-orange-500 rounded-3xl flex items-center justify-center text-3xl font-black text-[#0D0D12] shadow-[0_0_50px_rgba(251,191,36,0.8)] border-4 border-game-gold/30"
              >
                {currentStep.evaluation.result}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
