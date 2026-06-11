import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Send, ChevronLeft, Database, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';

// Engine Components
import { MemoryVisualizer } from '../components/arena/MemoryVisualizer';
import { TimelineControls } from '../components/arena/TimelineControls';
import { Terminal } from '../components/arena/Terminal';
import { useEngineStore } from '../store/engineStore';
import { useToastStore } from '../store/toastStore';

export default function LearningArena() {
  const navigate = useNavigate();
  const [code, setCode] = useState('x = 5\ny = 10\nz = x + y\nprint(z)');
  const [hasRun, setHasRun] = useState(false);
  
  const { initialize, play, isPlaying, steps, currentStepIndex } = useEngineStore();
  const { addToast } = useToastStore();

  const handleRun = () => {
    setHasRun(true);
    initialize();
    play();
  };

  // Listen for execution completion to award XP
  useEffect(() => {
    if (hasRun && steps.length > 0 && currentStepIndex === steps.length - 1) {
      addToast({
        type: 'achievement',
        title: 'Execution Completed!',
        description: 'Successfully visualized code.',
        xpAmount: 50,
        icon: '🏆'
      });
    }
  }, [currentStepIndex, steps.length, hasRun, addToast]);

  return (
    <div className="h-screen flex flex-col bg-transparent text-white overflow-hidden font-sans relative">
      {/* Header */}
      <header className="h-16 border-b border-game-border flex items-center justify-between px-6 bg-slate-950/40 backdrop-blur-3xl relative z-30 shadow-xl">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/map')} 
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-game-purple to-indigo-400">
              Module 1: Variables & Memory
            </h1>
            <p className="text-[10px] font-bold tracking-widest text-game-gold uppercase mt-0.5">
              Python Kingdom • Beginner
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRun}
            disabled={isPlaying}
            leftIcon={<Play className={`w-4 h-4 ${isPlaying ? 'text-slate-500' : 'text-game-emerald drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]'}`} />}
            className={`bg-slate-900/50 border-white/5 backdrop-blur-md ${isPlaying ? 'opacity-50' : 'hover:border-game-emerald/50 hover:bg-game-emerald/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]'}`}
          >
            {isPlaying ? 'Executing...' : 'Run Animation'}
          </Button>
          <Button 
            variant="primary"
            size="sm"
            leftIcon={<Send className="w-4 h-4" />}
            className="bg-game-purple hover:bg-game-purple/80 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] border-none"
          >
            Submit Solution
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden p-6 gap-6 relative z-10">
        
        {/* Left Panel: Code Editor & Terminal */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-[40%] flex flex-col gap-6"
        >
          {/* Code Editor */}
          <div className="flex-1 bg-slate-950/80 backdrop-blur-2xl border border-game-border rounded-3xl overflow-hidden flex flex-col shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-game-purple/5 blur-[80px] pointer-events-none" />
             
             <div className="h-12 border-b border-game-border bg-black/40 flex items-center justify-between px-5 relative z-10">
               <div className="flex items-center gap-4">
                 <div className="flex space-x-2">
                   <div className="w-3 h-3 rounded-full bg-game-crimson/20 border border-game-crimson/50" />
                   <div className="w-3 h-3 rounded-full bg-game-gold/20 border border-game-gold/50" />
                   <div className="w-3 h-3 rounded-full bg-game-emerald/20 border border-game-emerald/50" />
                 </div>
                 <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                    <Code className="w-4 h-4 text-game-purple" />
                    <span className="text-xs font-bold font-mono text-slate-300 tracking-wide">main.py</span>
                 </div>
               </div>
             </div>
             
            <div className="flex-1 p-3 relative z-10">
              <Editor
                height="100%"
                defaultLanguage="python"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || '')}
                options={{
                  fontSize: 15,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 16 },
                  automaticLayout: true,
                  renderLineHighlight: "all",
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                }}
              />
            </div>
          </div>
          
          {/* Terminal */}
          <Terminal />
          
        </motion.div>

        {/* Right Panel: Visualization Engine (Hero Section) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 relative bg-slate-900/30 backdrop-blur-3xl border border-game-border rounded-3xl flex flex-col overflow-hidden shadow-2xl"
        >
          {/* Ambient Engine Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.15),transparent_70%)] pointer-events-none" />

          {/* Engine Header */}
          <div className="absolute top-6 left-6 z-20">
            <div className="flex items-center space-x-3 bg-black/60 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/5 shadow-2xl">
              <Database size={18} className="text-game-purple" />
              <span className="text-sm font-bold uppercase tracking-widest text-slate-200">Execution Engine</span>
              {isPlaying && (
                 <div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 rounded-full bg-game-emerald/10 border border-game-emerald/20">
                   <div className="w-1.5 h-1.5 rounded-full bg-game-emerald animate-pulse" />
                   <span className="text-[10px] font-bold text-game-emerald">LIVE</span>
                 </div>
              )}
            </div>
          </div>

          {/* Visualization Canvas */}
          <MemoryVisualizer />

          {/* Timeline Controls */}
          {steps.length > 0 && (
             <TimelineControls />
          )}

          {/* Empty State */}
          {steps.length === 0 && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm flex items-center gap-3">
                  <Play className="w-4 h-4 opacity-50" />
                  Click Run Animation to Begin
                </p>
             </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
