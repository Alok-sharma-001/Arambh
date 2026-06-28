import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles, AlertCircle, Sword } from 'lucide-react';
import { useRegionStore } from '../../store/regionStore';
import { useProgressionStore } from '../../store/progressionStore';
import { useNavigate } from 'react-router-dom';

export default function TheHollowKing() {
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
      // Phase 1: Create Weapon class with __init__ setting damage
      if (phase === 1) {
        const hasClass = /class\s+Weapon\s*:/.test(playerCode);
        const hasInit = /def\s+__init__\s*\(\s*self\s*,\s*damage\s*\)\s*:/.test(playerCode);
        const hasSelfDamage = /self\.damage\s*=\s*damage/.test(playerCode);
        
        if (!hasClass || !hasInit || !hasSelfDamage) {
          setError("Failed! Define `class Weapon:` with `def __init__(self, damage):` and set `self.damage = damage`.");
          setIsAnimating(false);
          return;
        }
        setPhase(2);
        setPlayerCode('');
      }
      // Phase 2: Instantiate my_sword = Weapon(500)
      else if (phase === 2) {
        const hasInstance = /my_sword\s*=\s*Weapon\(\s*500\s*\)/.test(playerCode);
        
        if (!hasInstance) {
          setError("Failed! Create the object: `my_sword = Weapon(500)`.");
          setIsAnimating(false);
          return;
        }
        setPhase(3);
        setPlayerCode('');
      }
      // Phase 3: Create MagicSword(Weapon) with cast_spell() returning "Fire!"
      else if (phase === 3) {
        const hasChild = /class\s+MagicSword\s*\(\s*Weapon\s*\)\s*:/.test(playerCode);
        const hasMethod = /def\s+cast_spell\s*\(\s*self\s*\)\s*:/.test(playerCode);
        const hasReturn = /return\s+['"]Fire!['"]/.test(playerCode);
        
        if (!hasChild || !hasMethod || !hasReturn) {
          setError("Failed! Define `class MagicSword(Weapon):` with `def cast_spell(self): return 'Fire!'`.");
          setIsAnimating(false);
          return;
        }
        setPhase(4);
        setPlayerCode('');
      }
      // Phase 4: legendary_sword = MagicSword(999) and legendary_sword.cast_spell()
      else if (phase === 4) {
        const hasInst = /legendary_sword\s*=\s*MagicSword\(\s*999\s*\)/.test(playerCode);
        const hasCall = /legendary_sword\.cast_spell\(\)/.test(playerCode);
        
        if (!hasInst || !hasCall) {
          setError("Failed! Instantiate `legendary_sword = MagicSword(999)` and call `legendary_sword.cast_spell()`.");
          setIsAnimating(false);
          return;
        }
        
        // Victory
        setIsVictory(true);
        setTimeout(() => {
          completeBoss('oop-citadel');
          gainItem('class-sigil');
          gainXP(600, 'Boss Defeated');
        }, 2000);
      }
      
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0A0A0F] p-8 font-sans overflow-hidden relative">
      {/* Cinematic Backgrounds */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-5 mix-blend-screen" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <header className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-600 mb-4 tracking-tight drop-shadow-lg"
          >
            The Hollow King
          </motion.h1>
          <p className="text-xl text-rose-200/60 font-light">
            A corrupted object disconnected from its blueprint.
          </p>
        </header>

        {isVictory ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/60 backdrop-blur-xl border border-yellow-500/30 rounded-3xl p-16 text-center max-w-2xl mx-auto"
          >
            <Sparkles className="w-24 h-24 text-yellow-400 mx-auto mb-8 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]" />
            <h2 className="text-4xl font-bold text-white mb-6">Hierarchy Restored!</h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              You have forged the legendary magical weapon, binding the object to its parent blueprint. The Hollow King is defeated!
            </p>
            <div className="p-6 bg-yellow-500/10 rounded-xl border border-yellow-500/20 mb-8 inline-block">
              <h3 className="text-yellow-400 font-bold mb-2">Artifact Acquired</h3>
              <p className="text-2xl font-black text-white drop-shadow-md">OOP Crown</p>
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
                  x: [-10, 10, -10, 10, 0],
                  filter: ['brightness(1)', 'brightness(2)', 'brightness(1)']
                } : {
                  y: [-10, 10, -10]
                }}
                transition={{ 
                  y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                  x: { duration: 0.5 },
                  filter: { duration: 0.5 }
                }}
                className="relative"
              >
                {/* Floating crown/king representation */}
                <div className="w-64 h-64 relative">
                  <div className="absolute inset-0 bg-red-600/20 blur-[60px] rounded-full" />
                  <div className="absolute inset-4 bg-gradient-to-br from-red-900 to-black border-4 border-red-500/50 rounded-lg transform rotate-45 shadow-[0_0_50px_rgba(220,38,38,0.5)] flex items-center justify-center">
                    <Sword className="w-24 h-24 text-red-500 -rotate-45 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]" />
                  </div>
                </div>
              </motion.div>
              
              <div className="mt-12 bg-black/50 backdrop-blur-md border border-red-900/50 p-6 rounded-2xl w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-red-400 font-bold font-mono tracking-widest uppercase text-sm">Hollow King's Status</h3>
                  <span className="text-rose-300/50 font-mono text-sm">Phase {phase}/4</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-red-600 to-rose-400"
                    initial={{ width: '100%' }}
                    animate={{ width: `${100 - (phase - 1) * 25}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="mt-4 text-slate-300 font-medium h-12">
                  {phase === 1 && "The King shatters your weapon. Draft a new blueprint quickly!"}
                  {phase === 2 && "The blueprint is useless without manifestation. Forge the weapon!"}
                  {phase === 3 && "The King summons a dark shield. You need to inherit ancient magic!"}
                  {phase === 4 && "The shield cracks! Manifest the legendary sword and strike!"}
                </p>
              </div>
            </div>

            {/* Code Editor */}
            <div className="bg-[#13131A] rounded-2xl border border-white/5 flex flex-col shadow-2xl">
              <div className="p-4 border-b border-white/5 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-slate-500 font-mono text-sm">forge_weapon.py</span>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <textarea
                  value={playerCode}
                  onChange={(e) => setPlayerCode(e.target.value)}
                  className="flex-1 bg-transparent text-emerald-300 font-mono text-lg resize-none outline-none leading-relaxed"
                  placeholder={
                    phase === 1 ? "class Weapon:\n    def __init__(self, damage):\n        self.damage = damage" :
                    phase === 2 ? "my_sword = Weapon(500)" :
                    phase === 3 ? "class MagicSword(Weapon):\n    def cast_spell(self):\n        return 'Fire!'" :
                    "legendary_sword = MagicSword(999)\nlegendary_sword.cast_spell()"
                  }
                  spellCheck={false}
                />
                
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleCast}
                  disabled={isAnimating || !playerCode.trim()}
                  className={`mt-6 w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    isAnimating || !playerCode.trim()
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:shadow-[0_0_30px_rgba(225,29,72,0.4)]'
                  }`}
                >
                  {isAnimating ? (
                    <Sparkles className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <Shield className="w-6 h-6" />
                      Execute Code
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
