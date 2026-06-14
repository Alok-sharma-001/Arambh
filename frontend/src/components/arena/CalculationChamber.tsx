import React from 'react';
import { motion } from 'framer-motion';
import { EvalNode } from '../../engine/VisualizationEngine';

interface CalculationChamberProps {
  evaluation: EvalNode;
}

export const CalculationChamber: React.FC<CalculationChamberProps> = ({ evaluation }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.5, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
      transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0D0D12]/95 backdrop-blur-2xl border-2 border-game-gold/50 p-8 rounded-[3rem] shadow-[0_0_80px_rgba(251,191,36,0.3)] z-50 flex items-center gap-8"
    >
      <div className="absolute inset-0 bg-game-gold/5 blur-xl rounded-[3rem]" />

      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-16 h-16 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.5),rgba(76,29,149,0.5))] rounded-full flex items-center justify-center text-3xl font-extrabold text-white shadow-inner border border-purple-500/50 relative z-10"
      >
        {evaluation.leftVal}
      </motion.div>
      
      <motion.span 
        animate={{ scale: [1, 1.2, 1], color: ['#FBBF24', '#FFFFFF', '#FBBF24'] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="text-4xl text-game-gold font-black relative z-10"
      >
        {evaluation.operator}
      </motion.span>
      
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-16 h-16 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.5),rgba(76,29,149,0.5))] rounded-full flex items-center justify-center text-3xl font-extrabold text-white shadow-inner border border-purple-500/50 relative z-10"
      >
        {evaluation.rightVal}
      </motion.div>

      <span className="text-game-emerald font-bold mx-2 text-2xl relative z-10 animate-pulse">➞</span>
      
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 bg-gradient-to-br from-game-gold to-orange-500 rounded-full flex items-center justify-center text-3xl font-black text-[#0D0D12] shadow-[0_0_50px_rgba(251,191,36,0.8)] border-4 border-game-gold/30 relative z-10"
      >
        {evaluation.result}
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute -bottom-8 text-xs text-game-gold font-bold bg-[#0D0D12] px-4 py-1 rounded-full border border-game-gold/30 backdrop-blur-md shadow-[0_0_15px_rgba(251,191,36,0.4)] whitespace-nowrap"
        >
          {evaluation.targetVarName}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
