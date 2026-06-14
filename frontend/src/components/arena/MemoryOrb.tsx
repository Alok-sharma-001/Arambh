import React from 'react';
import { motion } from 'framer-motion';
import { MemoryVariable } from '../../engine/VisualizationEngine';
import { Scroll, CheckCircle2, XCircle, Box, Lock, Loader2, Library, FileCode2, Zap, AlertTriangle } from 'lucide-react';

interface MemoryOrbProps {
  variable: MemoryVariable;
  isEvaluating?: boolean;
  onClick?: (variable: MemoryVariable) => void;
}

export const MemoryOrb: React.FC<MemoryOrbProps> = React.memo(({ variable, isEvaluating, onClick }) => {
  const type = variable.type;
  
  // Base visual mappings
  let shapeClass = "w-16 h-16";
  let bgClass = "bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,1),rgba(76,29,149,1))]";
  let borderClass = "border-2 border-purple-300/30";
  let shadowClass = "shadow-[0_0_40px_rgba(139,92,246,0.8)] animate-pulse";
  let textClass = "text-2xl font-extrabold text-white";
  let clipPath = "";

  if (type === 'int') {
    // Sharp crystal edges
    shapeClass = "w-16 h-16";
    clipPath = "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)";
    shadowClass = "shadow-[0_0_40px_rgba(139,92,246,0.8)]"; // No tailwind drop-shadow for clip-path easily, but we can wrap it or just use internal styling
  } else if (type === 'string') {
    shapeClass = "min-w-[5rem] w-fit px-4 h-14 rounded-md"; // Scroll shape, grows with text
    bgClass = "bg-[linear-gradient(45deg,rgba(251,191,36,0.9),rgba(217,119,6,0.9))]";
    borderClass = "border border-amber-300/50";
    shadowClass = "shadow-[0_0_30px_rgba(251,191,36,0.6)]";
    textClass = "text-xl font-bold text-[#3E2723] font-serif tracking-widest";
  } else if (type === 'float') {
    shapeClass = "w-16 h-16 rounded-[40%_60%_60%_40%/60%_30%_70%_40%] animate-[spin_8s_linear_infinite]"; // Liquid droplet shape
    bgClass = "bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.9),rgba(8,145,178,0.9))]";
    borderClass = "border border-cyan-300/50";
    shadowClass = "shadow-[0_0_40px_rgba(34,211,238,0.7)]";
  } else if (type === 'bool') {
    shapeClass = "w-16 h-16 rounded-xl rotate-45"; // Diamond rune shape
    if (variable.value === 'True') {
      bgClass = "bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.9),rgba(5,150,105,0.9))]";
      borderClass = "border-2 border-emerald-300/50";
      shadowClass = "shadow-[0_0_40px_rgba(52,211,153,0.7)]";
    } else {
      bgClass = "bg-[radial-gradient(ellipse_at_center,rgba(248,113,113,0.9),rgba(220,38,38,0.9))]";
      borderClass = "border-2 border-red-300/50";
      shadowClass = "shadow-[0_0_40px_rgba(248,113,113,0.7)]";
    }
  } else if (type === 'list') {
    shapeClass = "w-16 h-16 rounded-md"; // Treasure Chest
    bgClass = "bg-[linear-gradient(to_bottom,rgba(180,83,9,0.9),rgba(146,64,14,0.9))]";
    borderClass = "border-t-4 border-game-gold/80 border-l border-r border-b border-amber-800/80";
    shadowClass = "shadow-[0_0_30px_rgba(217,119,6,0.6)]";
  } else if (type === 'tuple') {
    shapeClass = "w-16 h-20 rounded-t-full rounded-b-sm"; // Ancient Stone Tablet
    bgClass = "bg-[radial-gradient(ellipse_at_center,rgba(100,116,139,0.9),rgba(71,85,105,0.9))]";
    borderClass = "border-2 border-slate-400/50";
    shadowClass = "shadow-[0_0_30px_rgba(148,163,184,0.5)]";
  } else if (type === 'set') {
    shapeClass = "w-16 h-16 rounded-full border-dashed border-[3px]"; // Magic Circle
    bgClass = "bg-[radial-gradient(circle_at_center,rgba(217,70,239,0.4),rgba(192,38,211,0.2))]";
    borderClass = "border-fuchsia-400";
    shadowClass = "shadow-[0_0_40px_rgba(232,121,249,0.8)]";
  } else if (type === 'dict') {
    shapeClass = "w-14 h-20 rounded-l-md rounded-r-sm"; // Library Book / Shelf
    bgClass = "bg-[linear-gradient(to_right,rgba(15,23,42,0.9),rgba(30,41,59,0.9))]";
    borderClass = "border-l-[6px] border-indigo-500 border-y border-r border-slate-600";
    shadowClass = "shadow-[0_0_30px_rgba(99,102,241,0.6)]";
  } else if (type === 'class') {
    shapeClass = "w-20 h-16 rounded-md"; // Holographic Blueprint
    bgClass = "bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.4),rgba(8,145,178,0.2))]";
    borderClass = "border-2 border-cyan-400 border-dashed";
    shadowClass = "shadow-[0_0_50px_rgba(34,211,238,0.8)]";
  } else if (type === 'object') {
    shapeClass = "w-16 h-16 rounded-full"; // Living Statue
    bgClass = "bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.9),rgba(217,119,6,0.9))]";
    borderClass = "border-4 border-amber-200/80";
    shadowClass = "shadow-[0_0_40px_rgba(252,211,77,0.7)]";
  } else if (type === 'exception') {
    shapeClass = "w-16 h-16 rounded-[4px] rotate-45 scale-y-125"; // Fractured Crystal
    bgClass = "bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.9),rgba(153,27,27,0.9))]";
    borderClass = "border-2 border-red-400 border-dashed";
    shadowClass = "shadow-[0_0_30px_rgba(239,68,68,0.8)]";
    clipPath = "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"; // Diamond shape, slightly corrupted
  }

  const handleInteraction = () => {
    if (onClick) onClick(variable);
  };

  return (
    <motion.div
      key={`${variable.address}-${variable.type}`} // Ensures it fully remounts/breaks apart on type change
      layoutId={`var-${variable.address}`}
      initial={{ opacity: 0, scale: 0.2, rotateY: type === 'bool' && variable.value === 'False' ? 180 : 0 }}
      animate={{ 
        opacity: isEvaluating ? 0.3 : 1, 
        scale: isEvaluating ? 0.8 : 1, 
        rotateY: type === 'bool' && variable.value === 'False' ? 180 : 0,
        rotateX: type === 'bool' && variable.value === 'True' ? 360 : 0
      }}
      exit={{ opacity: 0, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 120, damping: 15 }}
      onClick={handleInteraction}
      className={`${shapeClass} ${bgClass} ${borderClass} ${shadowClass} cursor-pointer flex items-center justify-center relative z-20 overflow-hidden hover:scale-110 transition-transform`}
      style={{ clipPath: clipPath || undefined }}
    >
      <div className={`absolute inset-0 flex items-center justify-center ${type === 'bool' ? '-rotate-45' : ''} ${type === 'float' ? 'animate-[spin_8s_linear_infinite_reverse]' : ''}`}>
        {type === 'string' && <Scroll className="absolute inset-0 w-full h-full text-amber-900/10" />}
        <span className={`${textClass} max-w-[150px] truncate px-2 relative z-10`}>
          {type === 'bool' ? (
             variable.value === 'True' ? <CheckCircle2 className="w-8 h-8 text-white" /> : <XCircle className="w-8 h-8 text-white" />
          ) : type === 'list' ? (
             <Box className="w-8 h-8 text-game-gold drop-shadow-md" />
          ) : type === 'tuple' ? (
             <Lock className="w-8 h-8 text-slate-300 drop-shadow-md" />
          ) : type === 'set' ? (
             <Loader2 className="w-8 h-8 text-fuchsia-300 drop-shadow-md" />
          ) : type === 'dict' ? (
             <Library className="w-8 h-8 text-indigo-300 drop-shadow-md" />
          ) : type === 'class' ? (
             <FileCode2 className="w-8 h-8 text-cyan-200 drop-shadow-md" />
          ) : type === 'object' ? (
             <Zap className="w-8 h-8 text-amber-100 drop-shadow-md" />
          ) : type === 'exception' ? (
             <AlertTriangle className="w-8 h-8 text-white drop-shadow-md -rotate-45" />
          ) : (
             variable.value
          )}
        </span>
      </div>

      {/* Type & Name Badge Layer */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`absolute -bottom-10 ${type === 'bool' ? '-rotate-45 bottom-[-45px]' : ''} ${type === 'float' ? 'animate-[spin_8s_linear_infinite_reverse] bottom-[-40px]' : ''} flex flex-col items-center pointer-events-none`}
      >
        <div className="text-[9px] uppercase tracking-widest text-slate-400 bg-black/60 px-2 py-0.5 rounded-t-md font-bold">
          {type}
        </div>
        <div className="text-xs text-game-gold font-bold bg-[#0D0D12] px-4 py-1 rounded-b-md rounded-t-none border border-game-gold/30 backdrop-blur-md shadow-[0_0_15px_rgba(251,191,36,0.4)] whitespace-nowrap">
          {variable.name}
        </div>
      </motion.div>
    </motion.div>
  );
});

MemoryOrb.displayName = 'MemoryOrb';
