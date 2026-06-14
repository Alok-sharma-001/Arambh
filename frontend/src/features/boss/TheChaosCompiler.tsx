import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Sparkles, AlertTriangle, Bug } from 'lucide-react';
import { useRegionStore } from '../../store/regionStore';
import { useProgressionStore } from '../../store/progressionStore';
import { useNavigate } from 'react-router-dom';

export default function TheChaosCompiler() {
  const [phase, setPhase] = useState(1);
  const [playerCode, setPlayerCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVictory, setIsVictory] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { completeBoss } = useRegionStore();
  const { gainItem } = useProgressionStore();
  const navigate = useNavigate();

  const handleCast = () => {
    if (isAnimating) return;
    setError(null);
    setIsAnimating(true);

    setTimeout(() => {
      // Phase 1: Fix Syntax Error (missing colon and indent)
      if (phase === 1) {
        const hasDef = /def\s+stabilize\s*\(\s*\)\s*:/.test(playerCode);
        const hasPrint = /\n\s+print\s*\(\s*['"]Stable['"]\s*\)/.test(playerCode);
        
        if (!hasDef || !hasPrint) {
          setError("Failed! Define `def stabilize():` and properly indent `print('Stable')`.");
          setIsAnimating(false);
          return;
        }
        setPhase(2);
        setPlayerCode('');
      }
      // Phase 2: Shield of Try
      else if (phase === 2) {
        const hasTry = /try\s*:/.test(playerCode);
        const hasBlast = /blast\s*=\s*1\s*\/\s*0/.test(playerCode);
        const hasExcept = /except\s+ZeroDivisionError\s*:/.test(playerCode);
        const hasCounter = /counter_attack\s*=\s*True/.test(playerCode);
        
        if (!hasTry || !hasBlast || !hasExcept || !hasCounter) {
          setError("Failed! Wrap `blast = 1 / 0` in `try:`, then `except ZeroDivisionError:` and set `counter_attack = True`.");
          setIsAnimating(false);
          return;
        }
        setPhase(3);
        setPlayerCode('');
      }
      // Phase 3: Raise ValueError
      else if (phase === 3) {
        const hasIf = /if\s+corruption_level\s*>\s*50\s*:/.test(playerCode);
        const hasRaise = /raise\s+ValueError\(\s*['"]Corrupt Data!['"]\s*\)/.test(playerCode);
        
        if (!hasIf || !hasRaise) {
          setError("Failed! Check `if corruption_level > 50:` and `raise ValueError('Corrupt Data!')`.");
          setIsAnimating(false);
          return;
        }
        setPhase(4);
        setPlayerCode('');
      }
      // Phase 4: Finally block
      else if (phase === 4) {
        const hasTry = /try\s*:/.test(playerCode);
        const hasExcept = /except\s+Exception\s*:/.test(playerCode);
        const hasFinally = /finally\s*:/.test(playerCode);
        const hasSeal = /seal_abyss\(\)/.test(playerCode);
        
        if (!hasTry || !hasExcept || !hasFinally || !hasSeal) {
          setError("Failed! Use `try:`, `except Exception:`, and `finally:` to call `seal_abyss()`.");
          setIsAnimating(false);
          return;
        }
        
        // Victory
        setIsVictory(true);
        setTimeout(() => {
          completeBoss('exception-abyss');
          gainItem('error_sigil');
        }, 2000);
      }
      
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050005] p-8 font-sans overflow-hidden relative">
      {/* Glitchy Cinematic Backgrounds */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-color-dodge filter hue-rotate-180" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0005] via-transparent to-transparent" />
      
      {/* Random red glitch lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.5) 2px, rgba(255,0,0,0.5) 4px)' }}></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <header className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-magenta-500 to-red-600 mb-4 tracking-tight drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]"
          >
            The Chaos Compiler
          </motion.h1>
          <p className="text-xl text-red-200/60 font-light italic">
            "Unhandled exception at 0xDEADBEEF. Core dumped."
          </p>
        </header>

        {isVictory ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/60 backdrop-blur-xl border border-red-500/30 rounded-3xl p-16 text-center max-w-2xl mx-auto"
          >
            <ShieldAlert className="w-24 h-24 text-red-500 mx-auto mb-8 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)]" />
            <h2 className="text-4xl font-bold text-white mb-6">Reality Stabilized!</h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              You successfully caught all exceptions, handled the corrupt data, and safely sealed the execution timeline. The Abyss is silent once more.
            </p>
            <div className="p-6 bg-red-900/20 rounded-xl border border-red-500/30 mb-8 inline-block">
              <h3 className="text-red-400 font-bold mb-2 flex items-center gap-2 justify-center"><Bug className="w-5 h-5"/> Artifact Acquired</h3>
              <p className="text-2xl font-black text-white drop-shadow-md">Error Sigil</p>
            </div>
            <br />
            <button
              onClick={() => navigate('/learning-map')}
              className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Return to Map
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Boss Visualization */}
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <motion.div 
                animate={isAnimating ? { 
                  scale: [1, 1.2, 0.9, 1.1, 1],
                  filter: ['hue-rotate(0deg)', 'hue-rotate(90deg) blur(5px)', 'hue-rotate(0deg)']
                } : {
                  y: [-15, 15, -15],
                  rotateZ: [-2, 2, -2]
                }}
                transition={{ 
                  y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                  rotateZ: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                  scale: { duration: 0.5 },
                  filter: { duration: 0.5 }
                }}
                className="relative"
              >
                {/* Glitching Entity */}
                <div className="w-64 h-64 relative">
                  <div className="absolute inset-0 bg-red-600/40 blur-[80px] rounded-full mix-blend-screen" />
                  <div className="absolute inset-4 bg-black border-4 border-red-600 border-dashed rounded-xl transform shadow-[0_0_60px_rgba(220,38,38,0.8)] flex items-center justify-center overflow-hidden">
                    <AlertTriangle className="w-32 h-32 text-red-500 drop-shadow-[0_0_20px_rgba(220,38,38,1)] animate-pulse" />
                    <div className="absolute inset-0 bg-red-500/20 mix-blend-overlay" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.5) 10px, rgba(0,0,0,0.5) 20px)' }}></div>
                  </div>
                </div>
              </motion.div>
              
              <div className="mt-12 bg-black/70 backdrop-blur-md border border-red-900 p-6 rounded-2xl w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse"></div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-red-500 font-bold font-mono tracking-widest uppercase text-sm animate-pulse">Exception Handler</h3>
                  <span className="text-red-300/50 font-mono text-sm">Trace {phase}/4</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-red-600 to-yellow-500"
                    initial={{ width: '100%' }}
                    animate={{ width: `${100 - (phase - 1) * 25}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="mt-4 text-red-200 font-mono text-sm h-12 leading-relaxed">
                  {phase === 1 && "> FATAL_ERR: Syntax broken. Fix the definition of `stabilize()`."}
                  {phase === 2 && "> WARN: ZeroDivision incoming! Shield with `try` and counter-attack."}
                  {phase === 3 && "> ERR: Corruption level critical. Reject it with a `ValueError`!"}
                  {phase === 4 && "> CRITICAL: Core meltdown! Catch everything and `finally` seal_abyss()."}
                </p>
              </div>
            </div>

            {/* Code Editor */}
            <div className="bg-[#0A050A] rounded-2xl border border-red-900/50 flex flex-col shadow-2xl relative">
              <div className="p-4 border-b border-red-900/30 flex items-center gap-3 bg-red-900/10">
                <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <span className="ml-2 text-red-400 font-mono text-sm">terminal_crash.py</span>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <textarea
                  value={playerCode}
                  onChange={(e) => setPlayerCode(e.target.value)}
                  className="flex-1 bg-transparent text-red-300 font-mono text-lg resize-none outline-none leading-relaxed"
                  placeholder={
                    phase === 1 ? "def stabilize()\nprint('Stable')" :
                    phase === 2 ? "# try:\n# blast = 1 / 0\n# except ZeroDivisionError:\n# counter_attack = True" :
                    phase === 3 ? "corruption_level = 100\n# if corruption_level > 50:\n# raise ValueError('Corrupt Data!')" :
                    "# try:\n# except Exception:\n# finally:\n# seal_abyss()"
                  }
                  spellCheck={false}
                />
                
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-400 flex items-start gap-3"
                    >
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="font-mono text-sm">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleCast}
                  disabled={isAnimating || !playerCode.trim()}
                  className={`mt-6 w-full py-4 rounded-xl font-bold font-mono text-lg flex items-center justify-center gap-2 transition-all ${
                    isAnimating || !playerCode.trim()
                      ? 'bg-red-950 text-red-900 cursor-not-allowed border border-red-900/30'
                      : 'bg-red-600 text-white hover:bg-red-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] border border-red-400'
                  }`}
                >
                  {isAnimating ? (
                    <Sparkles className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Bug className="w-6 h-6" />
                      COMPILE_AND_RUN
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
