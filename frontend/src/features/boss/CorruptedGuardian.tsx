import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Shield, Sword, ChevronRight, AlertTriangle } from 'lucide-react';
import { useEngineStore } from '../../store/engineStore';
import { MemoryVisualizer } from '../../components/arena/MemoryVisualizer';
import Editor from '@monaco-editor/react';
import { useNavigate } from 'react-router-dom';
import { useProgressionStore } from '../../store/progressionStore';
import { useRegionStore } from '../../store/regionStore';

export default function CorruptedGuardian() {
  const [code, setCode] = useState('# Defeat the Corrupted Guardian!\n# 1. Create a variable "spell_power" and set it to 9000\n# 2. Create a variable "target" and set it to "Guardian"\n');
  const [bossHealth, setBossHealth] = useState(100);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [phase, setPhase] = useState<'intro' | 'battle' | 'victory'>('intro');
  
  const { initialize, play, isPlaying } = useEngineStore();
  const { gainXP, gainItem } = useProgressionStore();
  const { completeBoss } = useRegionStore();
  const navigate = useNavigate();

  const handleRun = () => {
    setError(null);
    
    // Validation
    if (code.includes('spell_power') && code.includes('9000') && code.includes('target') && code.includes('Guardian')) {
      useEngineStore.setState({ 
        steps: [
          { 
            id: 1, 
            type: 'ALLOCATE', 
            description: "Allocated integer 9000 to memory slot 0x01. Attached label 'spell_power'.",
            lineNumber: 2, 
            variable: { address: '0x01', name: 'spell_power', value: '9000', type: 'int' },
            memorySnapshot: { '0x01': { address: '0x01', name: 'spell_power', value: '9000', type: 'int' } }
          },
          { 
            id: 2, 
            type: 'ALLOCATE', 
            description: "Allocated string 'Guardian' to memory slot 0x02. Attached label 'target'.",
            lineNumber: 3, 
            variable: { address: '0x02', name: 'target', value: '"Guardian"', type: 'string' },
            memorySnapshot: { 
              '0x01': { address: '0x01', name: 'spell_power', value: '9000', type: 'int' },
              '0x02': { address: '0x02', name: 'target', value: '"Guardian"', type: 'string' } 
            }
          }
        ],
        currentStepIndex: 0,
        isPlaying: false,
        executionMode: 'PLAY'
      });
      initialize();
      play();
      
      // Animate Boss Health
      setTimeout(() => setBossHealth(50), 1000);
      setTimeout(() => setBossHealth(0), 2500);
      
      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => setPhase('victory'), 1500);
      }, 3000);
    } else {
      setError('The spell failed! Ensure you defined spell_power = 9000 and target = "Guardian".');
    }
  };

  const handleVictory = () => {
    gainXP(500, 'Boss Defeated');
    gainItem('forest-ring');
    completeBoss('variables-forest');
    navigate('/region/variables-forest');
  };

  return (
    <div className="h-screen flex flex-col bg-[#05050A] text-white font-sans overflow-hidden relative">
      {/* Dynamic Background */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${
        phase === 'intro' ? 'bg-game-crimson/10' :
        phase === 'battle' ? 'bg-game-crimson/20' :
        'bg-game-gold/20'
      }`} />

      {/* Header */}
      <header className="h-16 border-b border-game-border flex items-center justify-between px-6 bg-slate-950/40 backdrop-blur-md relative z-30">
        <h1 className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-game-crimson to-red-400 uppercase tracking-widest flex items-center gap-3">
          <Shield className="w-6 h-6 text-game-crimson" />
          Boss Battle
        </h1>
        <div className="text-game-crimson font-bold">Variables Forest Final Trial</div>
      </header>

      <main className="flex-1 flex items-center justify-center relative z-10 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl text-center bg-slate-950/80 backdrop-blur-md border border-game-crimson/50 rounded-3xl p-10 shadow-[0_0_50px_rgba(220,38,38,0.2)]"
            >
              <div className="w-32 h-32 mx-auto mb-8 bg-[#0D0D12] border-4 border-game-crimson rounded-full flex items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                <Shield className="w-16 h-16 text-game-crimson" />
                <div className="absolute inset-0 bg-game-crimson/20 animate-pulse" />
              </div>
              <h2 className="text-4xl font-extrabold text-white mb-4 uppercase tracking-widest text-shadow-sm shadow-game-crimson">Corrupted Crystal Guardian</h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                The guardian of the Variables Crystal has been corrupted by a memory leak! 
                You must rewrite its memory allocations to defeat it and claim the artifact.
              </p>
              <Button 
                variant="primary" 
                onClick={() => setPhase('battle')}
                rightIcon={<Sword className="w-5 h-5" />}
                className="bg-game-crimson hover:bg-game-crimson/80 shadow-[0_0_20px_rgba(220,38,38,0.4)] px-8 py-4 text-lg w-full max-w-sm mx-auto"
              >
                Initiate Combat
              </Button>
            </motion.div>
          )}

          {phase === 'battle' && (
            <motion.div 
              key="battle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full max-w-7xl flex flex-col md:flex-row gap-6 items-stretch"
            >
              {/* Left Column: Boss & Objective */}
              <div className="w-full md:w-1/3 flex flex-col gap-6">
                {/* Boss Panel */}
                <div className="bg-slate-950/80 border border-game-crimson/50 rounded-3xl p-6 flex-1 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_0_30px_rgba(220,38,38,0.15)]">
                  <div className={`transition-transform duration-300 ${success ? 'scale-90 opacity-50 grayscale' : 'scale-100'} ${bossHealth === 50 ? 'animate-bounce' : ''}`}>
                    <Shield className="w-32 h-32 text-game-crimson drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]" />
                  </div>
                  <h3 className="text-2xl font-bold mt-6 mb-4 text-white">Guardian HP</h3>
                  <div className="w-full max-w-xs h-6 bg-slate-900 rounded-full border border-slate-800 overflow-hidden relative">
                    <motion.div 
                      className="h-full bg-game-crimson"
                      animate={{ width: `${bossHealth}%` }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow-md">
                      {bossHealth} / 100
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-game-gold mb-4">Tactical Objective</h3>
                  <ul className="space-y-3 text-slate-300 list-disc list-inside">
                    <li>Create <code className="bg-black text-game-emerald px-1 rounded">spell_power</code> set to <code className="bg-black text-game-gold px-1 rounded">9000</code></li>
                    <li>Create <code className="bg-black text-game-emerald px-1 rounded">target</code> set to <code className="bg-black text-game-gold px-1 rounded">"Guardian"</code></li>
                  </ul>
                  
                  <AnimatePresence>
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-6 p-3 rounded-xl bg-game-crimson/10 border border-game-crimson/30 flex items-start gap-3"
                      >
                        <AlertTriangle className="w-5 h-5 text-game-crimson flex-shrink-0" />
                        <span className="text-sm text-game-crimson">{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button 
                    variant="primary"
                    onClick={handleRun}
                    disabled={isPlaying || bossHealth === 0}
                    leftIcon={<Sword className="w-5 h-5" />}
                    className="w-full mt-6 bg-game-crimson hover:bg-game-crimson/80 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                  >
                    {isPlaying ? 'Casting...' : 'Execute Attack'}
                  </Button>
                </div>
              </div>

              {/* Right Column: Code & Memory */}
              <div className="w-full md:w-2/3 flex flex-col gap-6">
                {/* Editor */}
                <div className="h-64 bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                  <Editor
                    height="100%"
                    defaultLanguage="python"
                    theme="vs-dark"
                    value={code}
                    onChange={(val) => setCode(val || '')}
                    options={{
                      minimap: { enabled: false },
                      padding: { top: 16 },
                      fontSize: 18,
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}
                  />
                </div>

                {/* Memory Visualizer */}
                <div className="flex-1 bg-[#0B0B0F] border border-game-border rounded-3xl relative overflow-hidden shadow-2xl">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.1),transparent_70%)] pointer-events-none" />
                  <MemoryVisualizer />
                </div>
              </div>
            </motion.div>
          )}

          {phase === 'victory' && (
            <motion.div 
              key="victory"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl text-center bg-slate-950/90 backdrop-blur-2xl border border-game-gold rounded-3xl p-12 shadow-[0_0_100px_rgba(251,191,36,0.3)] relative"
            >
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-game-gold/30 blur-[100px] pointer-events-none" />
              <div className="w-40 h-40 mx-auto bg-black border-4 border-game-gold rounded-full flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(251,191,36,0.5)]">
                <img src="/crystal.png" alt="Variables Crystal" className="w-24 h-24 object-contain animate-pulse" />
              </div>
              <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-game-gold to-yellow-200 uppercase tracking-widest mb-4">Guardian Defeated</h2>
              <p className="text-game-emerald text-xl font-bold tracking-[0.2em] mb-8 uppercase">Variables Crystal Acquired</p>
              
              <div className="flex justify-center gap-6 mb-8">
                <div className="bg-black/50 border border-slate-800 rounded-xl p-4 min-w-[120px]">
                  <div className="text-slate-400 text-xs font-bold uppercase mb-1">XP Earned</div>
                  <div className="text-game-gold font-bold text-2xl">+500</div>
                </div>
                <div className="bg-black/50 border border-slate-800 rounded-xl p-4 min-w-[120px]">
                  <div className="text-slate-400 text-xs font-bold uppercase mb-1">Region</div>
                  <div className="text-game-emerald font-bold text-xl mt-1">Cleared</div>
                </div>
              </div>

              <Button 
                variant="primary" 
                onClick={handleVictory}
                rightIcon={<ChevronRight className="w-5 h-5" />}
                className="bg-game-gold hover:bg-game-gold/80 text-black shadow-[0_0_20px_rgba(251,191,36,0.4)] px-8 py-4 text-lg w-full"
              >
                Claim Rewards & Continue
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
