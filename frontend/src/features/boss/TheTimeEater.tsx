import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Sparkles, AlertTriangle, Gauge, Swords, Target, Crosshair } from 'lucide-react';
import { useRegionStore } from '../../store/regionStore';
import { useProgressionStore } from '../../store/progressionStore';
import { useNavigate } from 'react-router-dom';

export default function TheTimeEater() {
  const [phase, setPhase] = useState(1);
  const [playerCode, setPlayerCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVictory, setIsVictory] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { completeBoss } = useRegionStore();
  const { gainXP, gainItem } = useProgressionStore();
  const navigate = useNavigate();

  const handleCast = () => {
    if (isAnimating) return;
    setError(null);
    setIsAnimating(true);

    setTimeout(() => {
      // Phase 1: Binary Search
      if (phase === 1) {
        const hasLowUpdate = /low\s*=\s*mid\s*\+\s*1/.test(playerCode);
        const hasHighUpdate = /high\s*=\s*mid\s*-\s*1/.test(playerCode);
        
        if (!hasLowUpdate || !hasHighUpdate) {
          setError("Failed! You must implement a Binary Search. Update `low = mid + 1` and `high = mid - 1`.");
          setIsAnimating(false);
          return;
        }
        setPhase(2);
        setPlayerCode('');
      }
      // Phase 2: Sorting Logic
      else if (phase === 2) {
        const hasLoop = /for\s+/.test(playerCode);
        const hasSwap = /arr\[j\],\s*arr\[j\+1\]\s*=\s*arr\[j\+1\],\s*arr\[j\]/.test(playerCode);
        
        if (!hasLoop || !hasSwap) {
          setError("Failed! The data is chaotic. You must use a loop and swap adjacent elements to sort them.");
          setIsAnimating(false);
          return;
        }
        setPhase(3);
        setPlayerCode('');
      }
      // Phase 3: Hash Set Optimization
      else if (phase === 3) {
        const hasSet = /set\(\)/.test(playerCode);
        const hasIn = /in\s+/.test(playerCode);
        const hasNestedLoops = /for\s+.*for\s+/.test(playerCode);
        
        if (hasNestedLoops || !hasSet || !hasIn) {
          setError("Failed! The Time Eater feeds on O(N^2) nested loops. You must use a `set()` for O(1) duplicate checking.");
          setIsAnimating(false);
          return;
        }
        setPhase(4);
        setPlayerCode('');
      }
      // Phase 4: Hash Map (Dictionary)
      else if (phase === 4) {
        const hasDictLookup = /\[.*\]/.test(playerCode) || /\.get\(.*\)/.test(playerCode);
        const hasLoop = /for\s+/.test(playerCode);
        
        if (hasLoop || !hasDictLookup) {
          setError("Failed! Do not loop! Use O(1) dictionary lookup to instantly find the weakness.");
          setIsAnimating(false);
          return;
        }
        
        // Victory
        setIsVictory(true);
        setTimeout(() => {
          completeBoss('algorithm-arena');
          gainItem('arena-trophy');
          gainXP(600, 'Boss Defeated');
        }, 2000);
      }
      
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050505] p-8 font-sans overflow-hidden relative">
      {/* Colosseum / Dimensional Void Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-screen filter hue-rotate-300 contrast-150" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent" />
      
      {/* Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        backgroundImage: 'linear-gradient(rgba(244,63,94,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(244,63,94,0.2) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <header className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-orange-400 to-rose-500 mb-4 tracking-tight drop-shadow-[0_0_20px_rgba(244,63,94,0.6)]"
          >
            The Time Eater
          </motion.h1>
          <p className="text-xl text-rose-200/60 font-light italic">
            "Your nested loops sustain me... Your linear searches feed me..."
          </p>
        </header>

        {isVictory ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/60 backdrop-blur-xl border border-rose-500/30 rounded-3xl p-16 text-center max-w-2xl mx-auto"
          >
            <Cpu className="w-24 h-24 text-rose-500 mx-auto mb-8 drop-shadow-[0_0_30px_rgba(244,63,94,0.8)]" />
            <h2 className="text-4xl font-bold text-white mb-6">Complexity Minimized!</h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              You've optimized the execution engine to perfection. The Time Eater starves from a lack of operations!
            </p>
            <div className="p-6 bg-rose-900/20 rounded-xl border border-rose-500/30 mb-8 inline-block">
              <h3 className="text-rose-400 font-bold mb-2 flex items-center gap-2 justify-center"><Swords className="w-5 h-5"/> Artifact Forged</h3>
              <p className="text-2xl font-black text-white drop-shadow-md">Algorithm Blade</p>
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
                  rotate: [0, 90, 180, 270, 360],
                  scale: [1, 1.2, 1],
                  filter: ['blur(0px)', 'blur(10px)', 'blur(0px)']
                } : {
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  rotate: isAnimating ? { duration: 0.5, ease: "linear", repeat: Infinity } : { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  scale: { duration: 0.5 },
                  filter: { duration: 0.5 }
                }}
                className="relative"
              >
                {/* The Entity */}
                <div className="w-64 h-64 relative">
                  <div className="absolute inset-0 bg-rose-600/30 blur-[80px] rounded-full mix-blend-screen" />
                  <div className="absolute inset-4 bg-black border-[4px] border-rose-500 rounded-lg transform rotate-45 shadow-[0_0_50px_rgba(244,63,94,0.5)] flex items-center justify-center overflow-hidden">
                    <Gauge className="w-32 h-32 text-rose-400 -rotate-45 drop-shadow-[0_0_20px_rgba(244,63,94,1)]" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-50 mix-blend-overlay"></div>
                  </div>
                </div>
              </motion.div>
              
              <div className="mt-12 bg-slate-900/80 backdrop-blur-md border border-rose-900 p-6 rounded-2xl w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-rose-600"></div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-rose-500 font-bold font-mono tracking-widest uppercase text-sm">Execution State</h3>
                  <span className="text-rose-300/50 font-mono text-sm">Phase {phase}/4</span>
                </div>
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-rose-600 to-orange-500"
                    initial={{ width: '100%' }}
                    animate={{ width: `${100 - (phase - 1) * 25}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="mt-4 text-rose-200 font-mono text-sm h-16 leading-relaxed">
                  {phase === 1 && "[O(log N)] The entity hides the core anomaly among 10,000 fragments. Implement Binary Search pointers (`low = mid + 1`, `high = mid - 1`) to find it instantly."}
                  {phase === 2 && "[O(N^2)] Reality fractures into chaos! Use a loop and swap logic (`arr[j], arr[j+1] = arr[j+1], arr[j]`) to sort the temporal fragments."}
                  {phase === 3 && "[O(N)] You are trapped in nested loops! Refactor the duplicate check using a `set()` for instant O(1) lookups."}
                  {phase === 4 && "[O(1)] The final strike! Do not loop through the weakness list. Use O(1) dictionary lookup to strike instantly!"}
                </p>
              </div>
            </div>

            {/* Code Editor */}
            <div className="bg-[#0A050A] rounded-2xl border border-rose-900/50 flex flex-col shadow-2xl relative overflow-hidden">
              <div className="p-4 border-b border-rose-900/30 flex items-center gap-3 bg-rose-900/10">
                <div className="w-3 h-3 rounded-full bg-rose-600" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <span className="ml-2 text-rose-400 font-mono text-sm">optimal_strategy.py</span>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <textarea
                  value={playerCode}
                  onChange={(e) => setPlayerCode(e.target.value)}
                  className="flex-1 bg-transparent text-rose-300 font-mono text-lg resize-none outline-none leading-relaxed"
                  placeholder={
                    phase === 1 ? "# Binary Search\n# Update low and high pointers based on mid\n" :
                    phase === 2 ? "# Bubble Sort Logic\n# arr[j], arr[j+1] = ..." :
                    phase === 3 ? "# Refactor to O(N)\nseen = set()\n# Check if item in seen..." :
                    "# Dictionary Lookup O(1)\n# weakness = entity_data['weakness']"
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
                      ? 'bg-slate-900 text-slate-700 cursor-not-allowed border border-slate-800'
                      : 'bg-rose-600 text-white hover:bg-rose-500 hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] border border-rose-400'
                  }`}
                >
                  {isAnimating ? (
                    <Sparkles className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      {phase === 1 ? <Target className="w-6 h-6" /> : 
                       phase === 2 ? <Cpu className="w-6 h-6" /> : 
                       phase === 3 ? <Gauge className="w-6 h-6" /> :
                       <Crosshair className="w-6 h-6" />}
                      EXECUTE_OPTIMIZATION
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
