import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Database, ChevronRight, AlertTriangle } from 'lucide-react';
import { useEngineStore } from '../../store/engineStore';
import { MemoryVisualizer } from '../../components/arena/MemoryVisualizer';
import Editor from '@monaco-editor/react';
import { useNavigate } from 'react-router-dom';
import { useProgressionStore } from '../../store/progressionStore';
import { useRegionStore } from '../../store/regionStore';

export default function TheDataHoarder() {
  const [code, setCode] = useState(`# The Data Hoarder has corrupted the kingdom's archives!\n# Reconstruct the four core collections:\n# 1. Define a list 'inventory' with "sword" and "shield"\n# 2. Define a tuple 'coords' with 10 and 20\n# 3. Define a set 'unique_ids' with 1, 2, 3\n# 4. Define a dict 'player' with key "level" as 10\n\n`);
  const [bossHealth, setBossHealth] = useState(100);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [phase, setPhase] = useState<'intro' | 'battle' | 'victory'>('intro');
  
  const { initialize, play, isPlaying } = useEngineStore();
  const navigate = useNavigate();
  const { completeBoss } = useRegionStore();
  const { gainXP, gainItem } = useProgressionStore();

  useEffect(() => {
    if (phase === 'battle') {
      useEngineStore.setState({
        steps: [
          {
            id: 0,
            type: 'IDLE',
            description: "Awaiting archive restoration...",
            lineNumber: 1,
            memorySnapshot: {}
          }
        ],
        currentStepIndex: 0,
        isPlaying: false
      });
    }
  }, [phase]);

  const handleRun = () => {
    setError(null);
    
    // Validation
    const hasList = /inventory\s*=\s*\[\s*['"]sword['"]\s*,\s*['"]shield['"]\s*\]/.test(code);
    const hasTuple = /coords\s*=\s*\(\s*10\s*,\s*20\s*\)/.test(code);
    const hasSet = /unique_ids\s*=\s*\{\s*1\s*,\s*2\s*,\s*3\s*\}/.test(code);
    const hasDict = /player\s*=\s*\{\s*['"]level['"]\s*:\s*10\s*\}/.test(code);

    if (hasList && hasTuple && hasSet && hasDict) {
      useEngineStore.setState({ 
        steps: [
          { 
            id: 1, 
            type: 'ALLOCATE', 
            description: "List restored.",
            lineNumber: 5, 
            variable: { address: '0x00', name: 'inventory', value: '["sword", "shield"]', type: 'list' },
            memorySnapshot: { '0x00': { address: '0x00', name: 'inventory', value: '["sword", "shield"]', type: 'list' } }
          },
          { 
            id: 2, 
            type: 'ALLOCATE', 
            description: "Tuple restored.",
            lineNumber: 6, 
            variable: { address: '0x01', name: 'coords', value: '(10, 20)', type: 'tuple' },
            memorySnapshot: { 
              '0x00': { address: '0x00', name: 'inventory', value: '["sword", "shield"]', type: 'list' },
              '0x01': { address: '0x01', name: 'coords', value: '(10, 20)', type: 'tuple' }
            }
          },
          { 
            id: 3, 
            type: 'ALLOCATE', 
            description: "Set restored.",
            lineNumber: 7, 
            variable: { address: '0x02', name: 'unique_ids', value: '{1, 2, 3}', type: 'set' },
            memorySnapshot: { 
              '0x00': { address: '0x00', name: 'inventory', value: '["sword", "shield"]', type: 'list' },
              '0x01': { address: '0x01', name: 'coords', value: '(10, 20)', type: 'tuple' },
              '0x02': { address: '0x02', name: 'unique_ids', value: '{1, 2, 3}', type: 'set' }
            }
          },
          { 
            id: 4, 
            type: 'ALLOCATE', 
            description: "Dictionary restored.",
            lineNumber: 8, 
            variable: { address: '0x03', name: 'player', value: '{"level": 10}', type: 'dict' },
            memorySnapshot: { 
              '0x00': { address: '0x00', name: 'inventory', value: '["sword", "shield"]', type: 'list' },
              '0x01': { address: '0x01', name: 'coords', value: '(10, 20)', type: 'tuple' },
              '0x02': { address: '0x02', name: 'unique_ids', value: '{1, 2, 3}', type: 'set' },
              '0x03': { address: '0x03', name: 'player', value: '{"level": 10}', type: 'dict' }
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
      setTimeout(() => setBossHealth(75), 500);
      setTimeout(() => setBossHealth(50), 1500);
      setTimeout(() => setBossHealth(25), 2500);
      setTimeout(() => setBossHealth(0), 3500);
      
      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => setPhase('victory'), 1500);
      }, 4000);
    } else {
      const errors = [];
      if (!hasList) errors.push("Missing `inventory = ['sword', 'shield']`");
      if (!hasTuple) errors.push("Missing `coords = (10, 20)`");
      if (!hasSet) errors.push("Missing `unique_ids = {1, 2, 3}`");
      if (!hasDict) errors.push("Missing `player = {'level': 10}`");
      setError('Archive Corruption Detected: ' + errors.join(' | '));
    }
  };

  const handleVictory = async () => {
    try {
      console.log('handleVictory called');
      gainXP(500, 'Boss Defeated');
      gainItem('royal-scepter');
      completeBoss('collections-kingdom');
      navigate('/region/collections-kingdom');
    } catch (e) {
      console.error(e);
      alert('Error navigating. Please check console.');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#05050A] text-white font-sans overflow-hidden relative">
      {/* Dynamic Background */}
      <div className={`absolute inset-0 transition-colors duration-1000 pointer-events-none ${
        phase === 'intro' ? 'bg-indigo-900/10' :
        phase === 'battle' ? 'bg-indigo-900/20' :
        'bg-game-gold/20'
      }`} />

      {/* Header */}
      <header className="h-16 border-b border-game-border flex items-center justify-between px-6 bg-slate-950/40 backdrop-blur-md relative z-30">
        <h1 className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 uppercase tracking-widest flex items-center gap-3">
          <Database className="w-6 h-6 text-indigo-400" />
          Boss Battle
        </h1>
        <div className="text-indigo-400 font-bold">Collections Kingdom Final Trial</div>
      </header>

      <main className="flex-1 flex items-center justify-center relative z-10 p-6 overflow-y-auto">
          {phase === 'intro' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl bg-game-surface p-10 border border-game-border rounded-2xl shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
              
              <div className="mb-6 relative flex justify-center">
                <div className="absolute inset-0 bg-indigo-500 blur-[80px] opacity-20 rounded-full animate-pulse" />
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="text-8xl relative z-10"
                >
                  🗄️
                </motion.div>
              </div>

              <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-md uppercase tracking-wide">
                The Data Hoarder
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                A corrupted collector who has stolen knowledge from every archive. His kingdom is collapsing because data is stored incorrectly. You must reconstruct all four collection types to defeat him.
              </p>

              <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-lg p-4 mb-8 flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h4 className="text-indigo-400 font-bold mb-1">Combat Strategy</h4>
                  <p className="text-sm text-indigo-200/80">Reconstruct the required list, tuple, set, and dictionary exactly as requested to restore the kingdom's memory.</p>
                </div>
              </div>

              <Button 
                onClick={() => setPhase('battle')}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-none group transition-all duration-300"
              >
                Enter the Archive
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}

          {phase === 'battle' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-6xl grid grid-cols-12 gap-6 h-[80vh]"
            >
              {/* Left Column: Boss & Editor */}
              <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
                
                {/* Boss Status Card */}
                <div className="bg-game-surface border border-game-border rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Database className="w-24 h-24" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="text-5xl animate-pulse">🗄️</div>
                    <div>
                      <h3 className="font-bold text-xl text-indigo-400 uppercase tracking-wider">Data Hoarder</h3>
                      <p className="text-sm text-slate-400">Master of Corruption</p>
                    </div>
                  </div>

                  {/* Health Bar */}
                  <div className="space-y-2 relative z-10">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-slate-300">Data Integrity</span>
                      <span className={bossHealth > 50 ? "text-indigo-400" : bossHealth > 20 ? "text-fuchsia-400" : "text-red-400"}>
                        {bossHealth} / 100
                      </span>
                    </div>
                    <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-game-border/50 p-0.5">
                      <motion.div 
                        initial={{ width: '100%' }}
                        animate={{ width: `${bossHealth}%` }}
                        transition={{ type: 'spring', bounce: 0.2 }}
                        className={`h-full rounded-sm ${
                          bossHealth > 50 ? 'bg-gradient-to-r from-indigo-500 to-indigo-400' :
                          bossHealth > 20 ? 'bg-gradient-to-r from-fuchsia-500 to-fuchsia-400' :
                          'bg-gradient-to-r from-red-500 to-red-400'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Spell Editor */}
                <div className="flex-1 bg-game-surface border border-game-border rounded-xl overflow-hidden flex flex-col min-h-[300px]">
                  <div className="h-10 bg-slate-900/50 border-b border-game-border flex items-center px-4 font-mono text-xs text-slate-400 font-bold uppercase tracking-wider">
                    Archive Terminal
                  </div>
                  <div className="flex-1 p-2">
                    <Editor
                      height="100%"
                      defaultLanguage="python"
                      theme="vs-dark"
                      value={code}
                      onChange={(val) => setCode(val || '')}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: 'Fira Code, monospace',
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        padding: { top: 16 },
                      }}
                    />
                  </div>
                  <div className="p-4 border-t border-game-border bg-slate-900/30">
                    <Button 
                      onClick={handleRun} 
                      disabled={isPlaying || success}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-12 text-lg shadow-lg shadow-indigo-900/20"
                    >
                      {isPlaying ? 'Compiling...' : success ? 'Hoarder Defeated!' : 'Restore Archives'}
                    </Button>
                    
                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 text-red-400 text-sm font-medium text-center bg-red-950/30 p-2 rounded border border-red-900/50"
                      >
                        {error}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Visualizer */}
              <div className="col-span-12 lg:col-span-7 bg-game-surface border border-game-border rounded-xl overflow-hidden flex flex-col h-full">
                 <div className="h-10 bg-slate-900/50 border-b border-game-border flex items-center px-4 font-mono text-xs text-slate-400 font-bold uppercase tracking-wider gap-2">
                    <Database className="w-4 h-4 text-indigo-400" />
                    Memory Timeline
                 </div>
                 <div className="flex-1 relative">
                    <MemoryVisualizer />
                 </div>
              </div>
            </motion.div>
          )}

          {phase === 'victory' && (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center max-w-lg bg-game-surface p-10 border-2 border-game-gold/50 rounded-2xl shadow-[0_0_50px_rgba(250,204,21,0.2)] relative z-50"
            >
              <div className="text-6xl mb-6">💎</div>
              <h2 className="text-3xl font-extrabold text-game-gold mb-2 uppercase tracking-widest">
                Victory!
              </h2>
              <p className="text-slate-300 mb-8 font-medium">
                You have successfully reorganized the data structures! The Hoarder's archives are secure, granting you the Collection Core!
              </p>
              
              <div className="bg-black/40 rounded-xl p-4 mb-8 border border-game-gold/20 flex items-center justify-center gap-4">
                <div className="text-left">
                  <div className="text-game-gold font-bold">+500 XP</div>
                  <div className="text-sm text-slate-400">Collection Core Acquired</div>
                </div>
              </div>

              <Button 
                onClick={handleVictory}
                className="w-full h-14 bg-game-gold text-black hover:bg-yellow-400 font-bold text-lg"
              >
                Claim Reward
              </Button>
            </motion.div>
          )}
      </main>
    </div>
  );
}
