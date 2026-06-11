import React from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { useEngineStore } from '../../store/engineStore';
import { motion, AnimatePresence } from 'framer-motion';

export const Terminal: React.FC = () => {
  const { outputLog, isPlaying, steps, currentStepIndex } = useEngineStore();

  const isExecutionComplete = currentStepIndex >= steps.length - 1 && steps.length > 0;

  return (
    <div className="h-64 bg-slate-950/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 font-mono text-sm flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
      {/* Decorative Top Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-game-emerald/5 blur-[50px] pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 text-slate-400 border-b border-slate-800/50 pb-3 relative z-10">
        <TerminalIcon className="w-5 h-5 text-game-emerald drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
        <span className="uppercase tracking-widest text-xs font-extrabold text-slate-300">Terminal Output</span>
        {isPlaying && (
           <span className="ml-auto flex items-center gap-2 text-[10px] text-game-gold">
             <span className="w-1.5 h-1.5 rounded-full bg-game-gold animate-ping" />
             EXECUTING
           </span>
        )}
      </div>

      {/* Output Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar leading-relaxed relative z-10 flex flex-col gap-1">
        <AnimatePresence>
          {outputLog.length === 0 && !isPlaying && !isExecutionComplete && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-500 italic">
              &gt; Ready for execution...
            </motion.div>
          )}

          {outputLog.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-game-emerald font-bold"
            >
              &gt; {log}
            </motion.div>
          ))}

          {isExecutionComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-game-gold font-bold border-t border-slate-800/50 pt-2"
            >
              [Process completed successfully.]
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
