import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Clock, MousePointer2, Plus, RefreshCw, RefreshCcw, Trash, Terminal, Info, CheckCircle, AlertTriangle, ShieldAlert, FileOutput, FileInput, FileText, FileX, Ship, Cpu, ArrowRightLeft, Waypoints } from 'lucide-react';
import { useEngineStore } from '../../store/engineStore';
import { motion, AnimatePresence } from 'framer-motion';

export const ExecutionTimeline: React.FC = React.memo(() => {
  const { isPlaying, play, pause, stepNext, stepPrev, reset, currentStepIndex, steps, executionMode, setExecutionMode } = useEngineStore();
  const [mounted, setMounted] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [currentStepIndex]);

  if (!mounted || steps.length === 0) return null;

  const progress = (currentStepIndex / (steps.length - 1)) * 100;
  const historyLog = steps.slice(0, currentStepIndex + 1).filter(s => s.type !== 'IDLE');

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'ALLOCATE': return <Plus className="w-3 h-3 text-emerald-400" />;
      case 'UPDATE': return <RefreshCw className="w-3 h-3 text-cyan-400" />;
      case 'TYPE_CHANGE': return <RefreshCcw className="w-3 h-3 text-amber-400" />;
      case 'DELETE': return <Trash className="w-3 h-3 text-red-400" />;
      case 'EVALUATE': return <Terminal className="w-3 h-3 text-game-purple" />;
      case 'LOOP_START': return <RotateCcw className="w-3 h-3 text-cyan-400" />;
      case 'LOOP_ITERATION': return <RefreshCw className="w-3 h-3 text-cyan-300 animate-spin-slow" />;
      case 'LOOP_END': return <CheckCircle className="w-3 h-3 text-emerald-500" />;
      case 'ERROR': return <AlertTriangle className="w-3 h-3 text-red-500" />;
      case 'ERROR_CAUGHT': return <ShieldAlert className="w-3 h-3 text-amber-500" />;
      case 'FILE_OPEN': return <FileInput className="w-3 h-3 text-blue-400" />;
      case 'FILE_READ': return <FileText className="w-3 h-3 text-sky-300" />;
      case 'FILE_WRITE': return <FileOutput className="w-3 h-3 text-indigo-400" />;
      case 'FILE_CLOSE': return <FileX className="w-3 h-3 text-slate-500" />;
      case 'IMPORT_MODULE': return <Ship className="w-3 h-3 text-fuchsia-400" />;
      case 'ALGORITHM_STEP': return <Cpu className="w-3 h-3 text-rose-400" />;
      case 'ARRAY_SWAP': return <ArrowRightLeft className="w-3 h-3 text-orange-400" />;
      case 'POINTER_MOVE': return <Waypoints className="w-3 h-3 text-yellow-400" />;
      default: return <Info className="w-3 h-3 text-slate-400" />;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'ALLOCATE': return 'text-emerald-400';
      case 'UPDATE': return 'text-cyan-400';
      case 'TYPE_CHANGE': return 'text-amber-400';
      case 'DELETE': return 'text-red-400';
      case 'EVALUATE': return 'text-game-purple';
      case 'LOOP_START': return 'text-cyan-400';
      case 'LOOP_ITERATION': return 'text-cyan-300';
      case 'LOOP_END': return 'text-emerald-500';
      case 'ERROR': return 'text-red-500';
      case 'ERROR_CAUGHT': return 'text-amber-500';
      case 'FILE_OPEN': return 'text-blue-400';
      case 'FILE_READ': return 'text-sky-300';
      case 'FILE_WRITE': return 'text-indigo-400';
      case 'FILE_CLOSE': return 'text-slate-500';
      case 'IMPORT_MODULE': return 'text-fuchsia-400';
      case 'ALGORITHM_STEP': return 'text-rose-400';
      case 'ARRAY_SWAP': return 'text-orange-400';
      case 'POINTER_MOVE': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const getStepLabel = (type: string) => {
    switch (type) {
      case 'ALLOCATE': return 'CREATE';
      case 'UPDATE': return 'UPDATE';
      case 'TYPE_CHANGE': return 'TYPE_CHANGE';
      case 'DELETE': return 'DELETE';
      case 'EVALUATE': return 'EVALUATE';
      case 'LOOP_START': return 'LOOP_START';
      case 'LOOP_ITERATION': return 'ITERATION';
      case 'LOOP_END': return 'LOOP_END';
      case 'ERROR': return 'CRASH';
      case 'ERROR_CAUGHT': return 'CAUGHT';
      case 'FILE_OPEN': return 'OPEN_FILE';
      case 'FILE_READ': return 'READ_FILE';
      case 'FILE_WRITE': return 'WRITE_FILE';
      case 'FILE_CLOSE': return 'CLOSE_FILE';
      case 'IMPORT_MODULE': return 'IMPORT';
      case 'ALGORITHM_STEP': return 'ALGO_STEP';
      case 'ARRAY_SWAP': return 'SWAP';
      case 'POINTER_MOVE': return 'MOVE_PTR';
      default: return 'LOG';
    }
  };

  return (
    <div className="w-full bg-slate-950/80 backdrop-blur-xl border border-game-border p-4 flex flex-col gap-4 relative z-20 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl">
      
      {/* Event Log Window */}
      <div 
        ref={logRef}
        className="h-32 bg-black/50 border border-white/5 rounded-xl p-3 overflow-y-auto flex flex-col gap-2 custom-scrollbar font-mono text-sm"
      >
        <AnimatePresence initial={false}>
          {historyLog.map((step) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3 bg-white/5 p-2 rounded-lg"
            >
              <div className="mt-0.5">{getStepIcon(step.type)}</div>
              <div>
                <span className={`text-[10px] font-bold ${getStepColor(step.type)} uppercase mr-2 tracking-wider`}>
                  [{getStepLabel(step.type)}]
                </span>
                <span className="text-slate-300">
                  {step.description}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {historyLog.length === 0 && (
          <div className="h-full flex items-center justify-center text-slate-500 italic text-xs">
            Awaiting execution...
          </div>
        )}
      </div>

      {/* Execution Modes */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button 
            onClick={() => setExecutionMode('PLAY')} 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${executionMode === 'PLAY' ? 'bg-game-emerald/20 text-game-emerald border-game-emerald/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'}`}
          >
            <Play className="w-3 h-3" /> NORMAL
          </button>
          <button 
            onClick={() => setExecutionMode('SLOW')} 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${executionMode === 'SLOW' ? 'bg-game-purple/20 text-game-purple border-game-purple/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]' : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'}`}
          >
            <Clock className="w-3 h-3" /> SLOW MOTION
          </button>
          <button 
            onClick={() => setExecutionMode('STEP')} 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${executionMode === 'STEP' ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10'}`}
          >
            <MousePointer2 className="w-3 h-3" /> STEP-BY-STEP
          </button>
        </div>
        <span className="text-xs font-mono text-slate-500 font-bold tracking-wider">
          STEP {currentStepIndex + 1} / {steps.length}
        </span>
      </div>

      {/* Progress Bar & Info */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden relative border border-white/5">
          <motion.div 
            className={`absolute top-0 left-0 h-full shadow-[0_0_10px_rgba(139,92,246,0.8)] ${steps[currentStepIndex]?.type === 'ERROR' ? 'bg-gradient-to-r from-red-600 to-rose-500' : 'bg-gradient-to-r from-game-purple to-indigo-500'}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-2">
        
        {/* Controls */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-xl border border-white/10">
          <button onClick={reset} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button onClick={stepPrev} disabled={currentStepIndex === 0} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30">
            <SkipBack className="w-4 h-4" />
          </button>

          {isPlaying && executionMode !== 'STEP' ? (
            <button onClick={pause} className="p-2 bg-game-crimson/20 text-game-crimson border border-game-crimson/30 hover:bg-game-crimson/30 rounded-lg transition-colors shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <Pause className="w-5 h-5 fill-current" />
            </button>
          ) : (
            <button onClick={play} disabled={currentStepIndex >= steps.length - 1} className="p-2 bg-game-emerald/20 text-game-emerald border border-game-emerald/30 hover:bg-game-emerald/30 rounded-lg transition-colors shadow-[0_0_15px_rgba(16,185,137,0.2)] disabled:opacity-30">
              <Play className="w-5 h-5 fill-current" />
            </button>
          )}

          <button onClick={stepNext} disabled={currentStepIndex >= steps.length - 1} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 flex items-center gap-2">
            <SkipForward className="w-4 h-4" />
            {executionMode === 'STEP' && <span className="text-xs font-bold">NEXT</span>}
          </button>
        </div>
        
      </div>
    </div>
  );
});

ExecutionTimeline.displayName = 'ExecutionTimeline';
