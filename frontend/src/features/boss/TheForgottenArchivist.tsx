import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Archive, Sparkles, AlertTriangle, FileText, FileOutput, Shield, Database } from 'lucide-react';
import { useRegionStore } from '../../store/regionStore';
import { useProgressionStore } from '../../store/progressionStore';
import { useNavigate } from 'react-router-dom';

export default function TheForgottenArchivist() {
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
      // Phase 1: Reading
      if (phase === 1) {
        const hasWith = /with\s+open\(\s*['"]weakness\.txt['"]\s*,\s*['"]r['"]\s*\)\s+as/.test(playerCode);
        const hasRead = /\.read\(\)/.test(playerCode);
        const hasPrint = /print\s*\(/.test(playerCode);
        
        if (!hasWith || !hasRead || !hasPrint) {
          setError("Failed! Use `with open('weakness.txt', 'r') as f:`, then `print(f.read())`.");
          setIsAnimating(false);
          return;
        }
        setPhase(2);
        setPlayerCode('');
      }
      // Phase 2: Writing
      else if (phase === 2) {
        const hasWith = /with\s+open\(\s*['"]minion\.txt['"]\s*,\s*['"]w['"]\s*\)\s+as/.test(playerCode);
        const hasWrite = /\.write\(\s*['"]banished['"]\s*\)/.test(playerCode);
        
        if (!hasWith || !hasWrite) {
          setError("Failed! Open `minion.txt` in `'w'` mode and `.write('banished')` to overwrite it.");
          setIsAnimating(false);
          return;
        }
        setPhase(3);
        setPlayerCode('');
      }
      // Phase 3: Appending
      else if (phase === 3) {
        const hasWith = /with\s+open\(\s*['"]buffs\.txt['"]\s*,\s*['"]a['"]\s*\)\s+as/.test(playerCode);
        const hasWrite = /\.write\(\s*['"]haste\\n['"]\s*\)/.test(playerCode);
        
        if (!hasWith || !hasWrite) {
          setError("Failed! Open `buffs.txt` in `'a'` mode and `.write('haste\\n')` to add to it.");
          setIsAnimating(false);
          return;
        }
        setPhase(4);
        setPlayerCode('');
      }
      // Phase 4: JSON
      else if (phase === 4) {
        const hasImport = /import\s+json/.test(playerCode);
        const hasLoads = /json\.loads\(\s*boss_core\s*\)/.test(playerCode);
        const hasModify = /\[\s*['"]hp['"]\s*\]\s*=\s*0/.test(playerCode);
        const hasDumps = /json\.dumps\(/.test(playerCode);
        
        if (!hasImport || !hasLoads || !hasModify || !hasDumps) {
          setError("Failed! `import json`, use `json.loads(boss_core)`, modify `['hp'] = 0`, and serialize back with `json.dumps()`.");
          setIsAnimating(false);
          return;
        }
        
        // Victory
        setIsVictory(true);
        setTimeout(() => {
          completeBoss('file-system-ruins');
          gainItem('archive_key');
        }, 2000);
      }
      
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#030712] p-8 font-sans overflow-hidden relative">
      {/* Ancient Ruins Cinematic Backgrounds */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549421297-8cba9a617711?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-color-dodge filter sepia hue-rotate-15" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#010308] via-[#030712]/80 to-transparent" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, rgba(16,185,129,0.1) 0%, transparent 60%)' }}></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <header className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 mb-4 tracking-tight drop-shadow-[0_0_20px_rgba(52,211,153,0.6)]"
          >
            The Forgotten Archivist
          </motion.h1>
          <p className="text-xl text-emerald-200/60 font-light italic">
            "Your unauthorized read operations will be terminated."
          </p>
        </header>

        {isVictory ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/60 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-16 text-center max-w-2xl mx-auto"
          >
            <Shield className="w-24 h-24 text-emerald-500 mx-auto mb-8 drop-shadow-[0_0_30px_rgba(16,185,129,0.8)]" />
            <h2 className="text-4xl font-bold text-white mb-6">Archives Restored!</h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              You've proven your mastery over persistent memory. The Archivist steps aside, granting you the keys to the kingdom's history.
            </p>
            <div className="p-6 bg-emerald-900/20 rounded-xl border border-emerald-500/30 mb-8 inline-block">
              <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2 justify-center"><Archive className="w-5 h-5"/> Artifact Acquired</h3>
              <p className="text-2xl font-black text-white drop-shadow-md">Archive Key</p>
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
                  scale: [1, 1.1, 0.9, 1.05, 1],
                  filter: ['hue-rotate(0deg)', 'hue-rotate(-45deg) blur(2px)', 'hue-rotate(0deg)']
                } : {
                  y: [-10, 10, -10]
                }}
                transition={{ 
                  y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                  scale: { duration: 0.5 },
                  filter: { duration: 0.5 }
                }}
                className="relative"
              >
                {/* Skeletal Book / Boss */}
                <div className="w-64 h-64 relative">
                  <div className="absolute inset-0 bg-emerald-600/20 blur-[60px] rounded-full mix-blend-screen" />
                  <div className="absolute inset-4 bg-[#0B1519] border-2 border-emerald-500/50 rounded-xl transform shadow-[0_0_40px_rgba(16,185,129,0.4)] flex items-center justify-center overflow-hidden">
                    <FileText className="w-32 h-32 text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,1)]" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] opacity-30 mix-blend-overlay"></div>
                  </div>
                </div>
              </motion.div>
              
              <div className="mt-12 bg-slate-900/80 backdrop-blur-md border border-emerald-900 p-6 rounded-2xl w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-600"></div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-emerald-500 font-bold font-mono tracking-widest uppercase text-sm">System Logs</h3>
                  <span className="text-emerald-300/50 font-mono text-sm">Seal {phase}/4</span>
                </div>
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-emerald-600 to-cyan-500"
                    initial={{ width: '100%' }}
                    animate={{ width: `${100 - (phase - 1) * 25}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="mt-4 text-emerald-200 font-mono text-sm h-12 leading-relaxed">
                  {phase === 1 && "The Archivist hides behind a magical seal. READ `weakness.txt` to find its flaw!"}
                  {phase === 2 && "It summons a minion! OVERWRITE `minion.txt` in 'w' mode with the text 'banished'."}
                  {phase === 3 && "You are slowed! APPEND 'haste\\n' to `buffs.txt` in 'a' mode."}
                  {phase === 4 && "The core JSON is exposed! Parse it, set 'hp' to 0, and serialize it back."}
                </p>
              </div>
            </div>

            {/* Code Editor */}
            <div className="bg-[#0B111A] rounded-2xl border border-emerald-900/50 flex flex-col shadow-2xl relative overflow-hidden">
              <div className="p-4 border-b border-emerald-900/30 flex items-center gap-3 bg-emerald-900/10">
                <div className="w-3 h-3 rounded-full bg-emerald-600" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <div className="w-3 h-3 rounded-full bg-slate-700" />
                <span className="ml-2 text-emerald-400 font-mono text-sm">ancient_spell.py</span>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <textarea
                  value={playerCode}
                  onChange={(e) => setPlayerCode(e.target.value)}
                  className="flex-1 bg-transparent text-emerald-300 font-mono text-lg resize-none outline-none leading-relaxed"
                  placeholder={
                    phase === 1 ? "# Read weakness.txt using with\n# Print its contents" :
                    phase === 2 ? "# Overwrite minion.txt using with\n# Write 'banished'" :
                    phase === 3 ? "# Append 'haste\\n' to buffs.txt" :
                    "import json\nboss_core = '{\"hp\": 9999, \"shield\": true}'\n# load to dict, set hp to 0\n# dumps back to string"
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
                      : 'bg-emerald-600 text-white hover:bg-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] border border-emerald-400'
                  }`}
                >
                  {isAnimating ? (
                    <Sparkles className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      {phase === 4 ? <Database className="w-6 h-6" /> : <FileOutput className="w-6 h-6" />}
                      EXECUTE_SPELL
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
