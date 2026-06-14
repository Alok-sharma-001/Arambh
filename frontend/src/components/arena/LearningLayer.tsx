import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExecutionStep } from '../../engine/VisualizationEngine';
import { Info } from 'lucide-react';

interface LearningLayerProps {
  step: ExecutionStep | undefined;
}

export const LearningLayer: React.FC<LearningLayerProps> = ({ step }) => {
  return (
    <AnimatePresence mode="wait">
      {step && step.type !== 'IDLE' && (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="absolute bottom-6 right-6 max-w-sm bg-slate-950/90 backdrop-blur-xl border border-game-purple/30 p-5 rounded-2xl shadow-[0_10px_40px_rgba(139,92,246,0.2)] z-50 flex gap-4 items-start"
        >
          <div className="bg-game-purple/20 p-2 rounded-xl text-game-purple border border-game-purple/30">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider text-game-gold">Concept Executed</h4>
            <p className="text-slate-300 text-sm leading-relaxed font-medium">
              {step.description}
            </p>
            
            {step.variable && (
              <div className="mt-3 bg-black/50 p-3 rounded-xl border border-white/5">
                <p className="text-xs text-slate-400 font-mono">
                  <span className="text-game-purple font-bold">Variable</span> created: <span className="text-white">{step.variable.name}</span>
                </p>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  <span className="text-game-emerald font-bold">Value</span> stored: <span className="text-white">{step.variable.value}</span>
                </p>
              </div>
            )}
            
            {step.evaluation && (
              <div className="mt-3 bg-black/50 p-3 rounded-xl border border-white/5">
                <p className="text-xs text-slate-400 font-mono">
                  <span className="text-game-gold font-bold">Math Operation</span> performed.
                </p>
                <p className="text-xs text-white font-mono mt-1 font-bold">
                  {step.evaluation.leftVal} {step.evaluation.operator} {step.evaluation.rightVal} = {step.evaluation.result}
                </p>
              </div>
            )}
            
            {step.type === 'PRINT' && step.output && (
              <div className="mt-3 bg-black/50 p-3 rounded-xl border border-white/5">
                <p className="text-xs text-slate-400 font-mono">
                  <span className="text-cyan-400 font-bold">Output sent</span> to terminal.
                </p>
                <p className="text-xs text-white font-mono mt-1 font-bold">
                  {step.output}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
