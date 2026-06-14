import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ship, Sparkles, AlertTriangle, Shield, Package, Wind, Anchor } from 'lucide-react';
import { useRegionStore } from '../../store/regionStore';
import { useProgressionStore } from '../../store/progressionStore';
import { useNavigate } from 'react-router-dom';

export default function TheSmugglerOfSecrets() {
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
      // Phase 1: math.sqrt
      if (phase === 1) {
        const hasImport = /import\s+math/.test(playerCode);
        const hasSqrt = /math\.sqrt\(\s*trajectory\s*\)/.test(playerCode);
        
        if (!hasImport || !hasSqrt) {
          setError("Failed! Use `import math` and calculate intercept with `math.sqrt(trajectory)`.");
          setIsAnimating(false);
          return;
        }
        setPhase(2);
        setPlayerCode('');
      }
      // Phase 2: random.randint
      else if (phase === 2) {
        const hasImport = /from\s+random\s+import\s+randint/.test(playerCode);
        const hasRandint = /strike\s*=\s*randint\(\s*1\s*,\s*100\s*\)/.test(playerCode);
        
        if (!hasImport || !hasRandint) {
          setError("Failed! Use `from random import randint` and generate `strike = randint(1, 100)`.");
          setIsAnimating(false);
          return;
        }
        setPhase(3);
        setPlayerCode('');
      }
      // Phase 3: Alias
      else if (phase === 3) {
        const hasImport = /import\s+defensive_barriers\s+as\s+db/.test(playerCode);
        const hasShield = /db\.shield\(\)/.test(playerCode);
        
        if (!hasImport || !hasShield) {
          setError("Failed! Import with alias: `import defensive_barriers as db`, then call `db.shield()`.");
          setIsAnimating(false);
          return;
        }
        setPhase(4);
        setPlayerCode('');
      }
      // Phase 4: Packages
      else if (phase === 4) {
        const hasImport = /from\s+harbor\.fleet\.armada\s+import\s+fire_cannons/.test(playerCode);
        const hasFire = /fire_cannons\(\)/.test(playerCode);
        
        if (!hasImport || !hasFire) {
          setError("Failed! Use `from harbor.fleet.armada import fire_cannons` and execute `fire_cannons()`.");
          setIsAnimating(false);
          return;
        }
        
        // Victory
        setIsVictory(true);
        setTimeout(() => {
          completeBoss('modules-harbor');
          gainItem('library_compass');
        }, 2000);
      }
      
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0A0514] p-8 font-sans overflow-hidden relative">
      {/* Nautical / Harbor Cinematic Backgrounds */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-screen filter hue-rotate-180 sepia brightness-50" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0514] via-[#0A0514]/80 to-transparent" />
      
      {/* Magical Mist */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(ellipse at bottom, rgba(217,70,239,0.15) 0%, transparent 60%)' }}></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <header className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-fuchsia-400 mb-4 tracking-tight drop-shadow-[0_0_20px_rgba(217,70,239,0.6)]"
          >
            The Smuggler of Secrets
          </motion.h1>
          <p className="text-xl text-fuchsia-200/60 font-light italic">
            "Your imports are weak! You cannot track what you cannot name!"
          </p>
        </header>

        {isVictory ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/60 backdrop-blur-xl border border-fuchsia-500/30 rounded-3xl p-16 text-center max-w-2xl mx-auto"
          >
            <Shield className="w-24 h-24 text-fuchsia-500 mx-auto mb-8 drop-shadow-[0_0_30px_rgba(217,70,239,0.8)]" />
            <h2 className="text-4xl font-bold text-white mb-6">Trade Routes Secured!</h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              You've proven your mastery over imports and dependencies. The Smuggler surrenders their stash of modular artifacts!
            </p>
            <div className="p-6 bg-fuchsia-900/20 rounded-xl border border-fuchsia-500/30 mb-8 inline-block">
              <h3 className="text-fuchsia-400 font-bold mb-2 flex items-center gap-2 justify-center"><Anchor className="w-5 h-5"/> Artifact Acquired</h3>
              <p className="text-2xl font-black text-white drop-shadow-md">Library Compass</p>
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
                  x: [-20, 20, -20, 20, 0],
                  filter: ['hue-rotate(0deg)', 'hue-rotate(90deg) blur(4px)', 'hue-rotate(0deg)']
                } : {
                  y: [-15, 15, -15]
                }}
                transition={{ 
                  y: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                  x: { duration: 0.5 },
                  filter: { duration: 0.5 }
                }}
                className="relative"
              >
                {/* Smuggler Ship */}
                <div className="w-64 h-64 relative">
                  <div className="absolute inset-0 bg-fuchsia-600/20 blur-[60px] rounded-full mix-blend-screen" />
                  <div className="absolute inset-4 bg-[#110A1F] border-2 border-fuchsia-500/50 rounded-full transform shadow-[0_0_40px_rgba(217,70,239,0.4)] flex items-center justify-center overflow-hidden">
                    <Ship className="w-32 h-32 text-fuchsia-400 drop-shadow-[0_0_20px_rgba(217,70,239,1)]" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40 mix-blend-overlay"></div>
                  </div>
                </div>
              </motion.div>
              
              <div className="mt-12 bg-slate-900/80 backdrop-blur-md border border-fuchsia-900 p-6 rounded-2xl w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-fuchsia-600"></div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-fuchsia-500 font-bold font-mono tracking-widest uppercase text-sm">Combat Log</h3>
                  <span className="text-fuchsia-300/50 font-mono text-sm">Phase {phase}/4</span>
                </div>
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-fuchsia-600 to-cyan-500"
                    initial={{ width: '100%' }}
                    animate={{ width: `${100 - (phase - 1) * 25}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="mt-4 text-fuchsia-200 font-mono text-sm h-12 leading-relaxed">
                  {phase === 1 && "The Smuggler attacks! You must calculate the intercept point. `import math` and use `math.sqrt(trajectory)`."}
                  {phase === 2 && "He raises an energy shield! Use `from random import randint` to generate a `strike = randint(1, 100)` to pierce it."}
                  {phase === 3 && "He floods the namespace! Import your defense under an alias: `import defensive_barriers as db`, then call `db.shield()`."}
                  {phase === 4 && "He destroys the local network! Navigate the package: `from harbor.fleet.armada import fire_cannons` and execute it!"}
                </p>
              </div>
            </div>

            {/* Code Editor */}
            <div className="bg-[#0D0A14] rounded-2xl border border-fuchsia-900/50 flex flex-col shadow-2xl relative overflow-hidden">
              <div className="p-4 border-b border-fuchsia-900/30 flex items-center gap-3 bg-fuchsia-900/10">
                <div className="w-3 h-3 rounded-full bg-fuchsia-600" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <span className="ml-2 text-fuchsia-400 font-mono text-sm">battle_tactics.py</span>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <textarea
                  value={playerCode}
                  onChange={(e) => setPlayerCode(e.target.value)}
                  className="flex-1 bg-transparent text-fuchsia-300 font-mono text-lg resize-none outline-none leading-relaxed"
                  placeholder={
                    phase === 1 ? "# Import math\n# intercept = math.sqrt(trajectory)" :
                    phase === 2 ? "# From random import randint\n# strike = randint(1, 100)" :
                    phase === 3 ? "# Import defensive_barriers as db\n# Call db.shield()" :
                    "# From harbor.fleet.armada import fire_cannons\n# Call fire_cannons()"
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
                      : 'bg-fuchsia-600 text-white hover:bg-fuchsia-500 hover:shadow-[0_0_30px_rgba(217,70,239,0.4)] border border-fuchsia-400'
                  }`}
                >
                  {isAnimating ? (
                    <Sparkles className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      {phase === 4 ? <Wind className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                      EXECUTE_IMPORT
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
