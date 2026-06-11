import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, FastForward } from 'lucide-react';
import { useEngineStore } from '../../store/engineStore';
import { motion } from 'framer-motion';

export const TimelineControls: React.FC = () => {
  const { isPlaying, play, pause, stepNext, stepPrev, reset, currentStepIndex, steps, speed, setSpeed } = useEngineStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || steps.length === 0) return null;

  const progress = (currentStepIndex / (steps.length - 1)) * 100;
  const currentStep = steps[currentStepIndex];

  return (
    <div className="w-full bg-slate-900/60 backdrop-blur-xl border-t border-slate-800 p-4 flex flex-col gap-3 relative z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
      
      {/* Progress Bar & Info */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden relative">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-game-purple shadow-[0_0_10px_rgba(139,92,246,0.8)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
        <span className="text-xs font-mono text-slate-400 font-bold w-12 text-right">
          {Math.round(progress)}%
        </span>
      </div>

      <div className="flex items-center justify-between">
        
        {/* Step Description */}
        <div className="flex-1">
          <motion.p 
            key={currentStep.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold text-game-gold drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]"
          >
            {currentStep.description}
          </motion.p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800/80">
          <button onClick={reset} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button onClick={stepPrev} disabled={currentStepIndex === 0} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30">
            <SkipBack className="w-4 h-4" />
          </button>

          {isPlaying ? (
            <button onClick={pause} className="p-2 bg-game-crimson/20 text-game-crimson border border-game-crimson/30 hover:bg-game-crimson/30 rounded-lg transition-colors shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <Pause className="w-5 h-5 fill-current" />
            </button>
          ) : (
            <button onClick={play} disabled={currentStepIndex >= steps.length - 1} className="p-2 bg-game-emerald/20 text-game-emerald border border-game-emerald/30 hover:bg-game-emerald/30 rounded-lg transition-colors shadow-[0_0_15px_rgba(16,185,137,0.2)] disabled:opacity-30">
              <Play className="w-5 h-5 fill-current" />
            </button>
          )}

          <button onClick={stepNext} disabled={currentStepIndex >= steps.length - 1} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30">
            <SkipForward className="w-4 h-4" />
          </button>
          
          {/* Speed Toggle */}
          <button 
            onClick={() => setSpeed(speed === 1500 ? 500 : 1500)} 
            className={`p-2 ml-2 rounded-lg transition-colors border ${speed === 500 ? 'bg-game-purple/20 text-game-purple border-game-purple/30 shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'text-slate-500 border-transparent hover:bg-slate-800'}`}
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
