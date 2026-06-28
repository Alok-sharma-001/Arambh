import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, AlertTriangle, Hexagon, Database, Cpu, Terminal, Flame, Eye } from 'lucide-react';
import { useRegionStore } from '../../store/regionStore';
import { useProgressionStore } from '../../store/progressionStore';
import { useNavigate } from 'react-router-dom';

export default function AncientPythonDragon() {
  const [phase, setPhase] = useState(1);
  const [playerCode, setPlayerCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVictory, setIsVictory] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { completeBoss } = useRegionStore();
  const { gainItem, gainXP } = useProgressionStore();
  const navigate = useNavigate();

  const handleCast = () => {
    if (isAnimating) return;
    setError(null);
    setIsAnimating(true);

    setTimeout(() => {
      // Phase 1: Types & Variables
      if (phase === 1) {
        const hasInt = /int\s*\(\s*fire\s*\)/.test(playerCode);
        const hasFloat = /float\s*\(\s*fire\s*\)/.test(playerCode);
        
        if (!hasInt && !hasFloat) {
          setError("Failed! You must typecast the incoming fire using int() or float().");
          setIsAnimating(false);
          return;
        }
        setPhase(2);
        setPlayerCode('');
      }
      // Phase 2: Loops & Functions
      else if (phase === 2) {
        const hasRecursive = /def\s+break_coil\(.*\):/.test(playerCode);
        const hasBreak = /break/.test(playerCode);
        
        if (!hasRecursive && !hasBreak) {
          setError("Failed! The loop is infinite. Define a breaking condition and call it recursively, or use a `break`.");
          setIsAnimating(false);
          return;
        }
        setPhase(3);
        setPlayerCode('');
      }
      // Phase 3: OOP & Collections
      else if (phase === 3) {
        const hasClass = /class\s+Defender/.test(playerCode);
        const hasSet = /set\s*\(\s*.*\s*\)/.test(playerCode);
        
        if (!hasClass || !hasSet) {
          setError("Failed! Define a `Defender` class and use a `set()` to filter out the corrupted duplicates.");
          setIsAnimating(false);
          return;
        }
        setPhase(4);
        setPlayerCode('');
      }
      // Phase 4: Exceptions, Files & Algorithms
      else if (phase === 4) {
        const hasTryExcept = /try:/.test(playerCode) && /except/.test(playerCode);
        const hasOpen = /with\s+open/.test(playerCode);
        
        if (!hasTryExcept || !hasOpen) {
          setError("Failed! Wrap reality in a `try/except` block and use `with open(...)` to overwrite the Dragon's source code.");
          setIsAnimating(false);
          return;
        }
        
        // Victory
        setIsVictory(true);
        setTimeout(() => {
          completeBoss('bossgate-saga');
          gainItem('legends-crown');
          gainXP(5000, "Defeated the Ancient Python Dragon!");
        }, 3000);
      }
      
      setIsAnimating(false);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#050005] p-8 font-sans overflow-hidden relative">
      {/* Apocalyptic / Void Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 mix-blend-screen filter contrast-150 saturate-200" />
      <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-[#050005]/80 to-transparent" />
      
      {/* Glitch Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 via-orange-500 to-yellow-500 mb-4 tracking-tighter drop-shadow-[0_0_30px_rgba(239,68,68,0.8)] uppercase"
          >
            Ancient Python Dragon
          </motion.h1>
          <p className="text-2xl text-red-300/80 font-light italic">
            "The Memory World is mine. Your syntax is flawed."
          </p>
        </header>

        {isVictory ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="bg-black/80 backdrop-blur-2xl border border-yellow-500/50 rounded-3xl p-16 text-center max-w-3xl mx-auto shadow-[0_0_100px_rgba(234,179,8,0.3)]"
          >
            <div className="relative w-32 h-32 mx-auto mb-8">
               <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-cyan-500 to-fuchsia-500 rounded-full animate-spin blur-xl opacity-70"></div>
               <Hexagon className="w-full h-full text-white relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,1)]" />
            </div>
            
            <h2 className="text-5xl font-black text-white mb-6 uppercase tracking-widest drop-shadow-lg">The Seals are United</h2>
            <p className="text-2xl text-slate-300 mb-8 leading-relaxed font-light">
              You have neutralized the Ancient Python Dragon. The 10 artifacts have fused together into the ultimate singularity of knowledge.
            </p>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="p-8 bg-gradient-to-br from-indigo-900/40 to-fuchsia-900/40 rounded-2xl border border-cyan-500/50 mb-8 inline-block shadow-[0_0_50px_rgba(34,211,238,0.2)]"
            >
              <h3 className="text-cyan-400 font-bold mb-3 flex items-center gap-2 justify-center text-xl tracking-widest uppercase"><Sparkles className="w-6 h-6"/> Legendary Artifact Forged</h3>
              <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-fuchsia-400 drop-shadow-md">The Master Core</p>
            </motion.div>
            
            <br />
            <button
              onClick={() => navigate('/dashboard')}
              className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.5)]"
            >
              Claim Victory
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Boss Visualization */}
            <div className="flex flex-col items-center justify-center min-h-[500px]">
              <motion.div 
                animate={isAnimating ? { 
                  scale: [1, 1.1, 0.9, 1.2, 1],
                  filter: ['hue-rotate(0deg)', 'hue-rotate(90deg) blur(5px)', 'hue-rotate(0deg)']
                } : {
                  y: [-20, 20, -20],
                  rotate: [-2, 2, -2]
                }}
                transition={{ 
                  y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
                  rotate: { repeat: Infinity, duration: 8, ease: "easeInOut" },
                  scale: { duration: 0.5 },
                  filter: { duration: 0.5 }
                }}
                className="relative"
              >
                {/* The Dragon */}
                <div className="w-80 h-80 relative">
                  <div className="absolute inset-0 bg-red-600/40 blur-[100px] rounded-full mix-blend-screen" />
                  <div className="absolute inset-0 bg-gradient-to-b from-red-900 to-black border-2 border-red-500 rounded-full transform shadow-[0_0_80px_rgba(239,68,68,0.6)] flex items-center justify-center overflow-hidden">
                    <Eye className="w-48 h-48 text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,1)] animate-pulse" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/red-squared.png')] opacity-40 mix-blend-overlay"></div>
                  </div>
                </div>
              </motion.div>
              
              <div className="mt-16 bg-black/60 backdrop-blur-xl border border-red-900/50 p-8 rounded-3xl w-full relative overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-500"></div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-red-500 font-bold font-mono tracking-widest uppercase text-sm flex items-center gap-2"><Flame className="w-4 h-4"/> Dragon's Logic</h3>
                  <span className="text-red-300/50 font-mono text-xl font-bold">Phase {phase}/4</span>
                </div>
                <div className="h-3 bg-slate-950 rounded-full overflow-hidden border border-red-900/30">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-red-600 to-yellow-500"
                    initial={{ width: '100%' }}
                    animate={{ width: `${100 - (phase - 1) * 25}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <p className="mt-6 text-red-200 font-mono text-lg leading-relaxed min-h-[100px]">
                  {phase === 1 && "Breath of Chaos: The dragon breathes fire consisting of mismatched data types. Cast defensive variables and typecast the incoming `fire` using `int()` or `float()` to neutralize it."}
                  {phase === 2 && "The Infinite Coil: The dragon wraps its tail around the arena in an infinite loop. Write a `break` condition to shatter the coil."}
                  {phase === 3 && "The Object Swarm: The dragon summons an army of objects. Define a `Defender` class and use a `set()` to filter out the corrupted duplicates."}
                  {phase === 4 && "Reality Tear: The dragon attempts to delete your save file. Wrap reality in a `try...except` block, and use `with open(...)` to overwrite its source code!"}
                </p>
              </div>
            </div>

            {/* Code Editor */}
            <div className="bg-[#050205] rounded-3xl border border-red-900/50 flex flex-col shadow-2xl relative overflow-hidden">
              <div className="p-4 border-b border-red-900/30 flex items-center gap-3 bg-red-900/20">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="ml-2 text-red-400 font-mono text-sm font-bold tracking-widest">endgame_override.py</span>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <textarea
                  value={playerCode}
                  onChange={(e) => setPlayerCode(e.target.value)}
                  className="flex-1 bg-transparent text-red-200 font-mono text-xl resize-none outline-none leading-relaxed custom-scrollbar"
                  placeholder={
                    phase === 1 ? "# The fire is a string '500'\n# Cast it to int or float\n" :
                    phase === 2 ? "while True:\n    # Define breaking condition\n    break" :
                    phase === 3 ? "class Defender:\n    pass\n\n# Create a set of defenders" :
                    "try:\n    # Overwrite source code\n    with open('dragon.py', 'w') as f:\n        f.write('')\nexcept:\n    pass"
                  }
                  spellCheck={false}
                />
                
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-6 p-4 bg-red-950/80 border border-red-500 rounded-xl text-red-300 flex items-start gap-4 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    >
                      <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5 text-red-500" />
                      <p className="font-mono text-base">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleCast}
                  disabled={isAnimating || !playerCode.trim()}
                  className={`mt-8 w-full py-5 rounded-2xl font-black font-mono text-xl tracking-widest flex items-center justify-center gap-3 transition-all uppercase ${
                    isAnimating || !playerCode.trim()
                      ? 'bg-slate-900 text-slate-700 cursor-not-allowed border border-slate-800'
                      : 'bg-red-600 text-white hover:bg-red-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] border border-red-400 hover:scale-[1.02]'
                  }`}
                >
                  {isAnimating ? (
                    <Sparkles className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      {phase === 1 ? <Database className="w-6 h-6" /> : 
                       phase === 2 ? <Cpu className="w-6 h-6" /> : 
                       phase === 3 ? <Hexagon className="w-6 h-6" /> :
                       <Terminal className="w-6 h-6" />}
                      EXECUTE_FINAL_STRIKE
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
