import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { Shield, Sword, ChevronRight, AlertTriangle } from 'lucide-react';
import { useEngineStore } from '../../store/engineStore';
import { MemoryVisualizer } from '../../components/arena/MemoryVisualizer';
import Editor from '@monaco-editor/react';
import { useNavigate } from 'react-router-dom';
import { useProgressionStore } from '../../store/progressionStore';
import { useRegionStore } from '../../store/regionStore';

export default function InfiniteStreamSentinel() {
  const [code, setCode] = useState(`# Defeat the Infinite Stream Sentinel!
# Eager evaluation (list(), tuple(), or []) will overflow memory and fail!
#
# Task: Define a generator 'evens(start)' that yields even numbers from 'start' upwards.
# Instantiate it with evens(0) and call next() 3 times to retrieve the values.

def evens(start):
    curr = start
    while True:
        if curr % 2 == 0:
            yield curr
        curr += 1

gen = evens(0)
val1 = next(gen)
val2 = next(gen)
val3 = next(gen)
print(val1)
print(val2)
print(val3)
`);
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
            description: "Sentinel is scanning your memory stack...",
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
    
    // Eager evaluation checks
    if (code.includes('list(') || code.includes('list (') || code.includes('tuple(') || code.includes('tuple (') || code.includes('[')) {
      setError('CRITICAL MEMORY OVERFLOW! Eager evaluation detected via list(), tuple(), or list literal brackets []. The Sentinel has blocked your attack!');
      return;
    }

    // AST-like verification: must define a generator and use next() or equivalent iteration
    if (!code.includes('def evens') || !code.includes('yield') || !code.includes('next(')) {
      setError('SPELL FAILURE: You must define a generator function containing "yield" and fetch items using "next()".');
      return;
    }

    // Success flow - mock visualizer state showing O(1) memory footprint
    useEngineStore.setState({ 
      steps: [
        { 
          id: 1, 
          type: 'ALLOCATE', 
          description: "Generator function 'evens' loaded into memory.",
          lineNumber: 6, 
          variable: { address: '0x01', name: 'evens', value: '<generator_function>', type: 'function' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'evens', value: '<generator_function>', type: 'function' } }
        },
        { 
          id: 2, 
          type: 'ALLOCATE', 
          description: "Instantiated generator instance 'gen' (State: Suspended, 104 bytes in RAM).",
          lineNumber: 12, 
          variable: { address: '0x02', name: 'gen', value: '<generator: suspended>', type: 'generator' },
          memorySnapshot: { 
            '0x01': { address: '0x01', name: 'evens', value: '<generator_function>', type: 'function' },
            '0x02': { address: '0x02', name: 'gen', value: '<generator: suspended>', type: 'generator' } 
          }
        },
        { 
          id: 3, 
          type: 'ALLOCATE', 
          description: "First next() call yields 0. Generator state suspended.",
          lineNumber: 13, 
          variable: { address: '0x03', name: 'val1', value: '0', type: 'int' },
          memorySnapshot: { 
            '0x01': { address: '0x01', name: 'evens', value: '<generator_function>', type: 'function' },
            '0x02': { address: '0x02', name: 'gen', value: '<generator: suspended>', type: 'generator' },
            '0x03': { address: '0x03', name: 'val1', value: '0', type: 'int' }
          }
        },
        { 
          id: 4, 
          type: 'ALLOCATE', 
          description: "Second next() call yields 2. Generator state suspended.",
          lineNumber: 14, 
          variable: { address: '0x04', name: 'val2', value: '2', type: 'int' },
          memorySnapshot: { 
            '0x01': { address: '0x01', name: 'evens', value: '<generator_function>', type: 'function' },
            '0x02': { address: '0x02', name: 'gen', value: '<generator: suspended>', type: 'generator' },
            '0x03': { address: '0x03', name: 'val1', value: '0', type: 'int' },
            '0x04': { address: '0x04', name: 'val2', value: '2', type: 'int' }
          }
        },
        { 
          id: 5, 
          type: 'ALLOCATE', 
          description: "Third next() call yields 4. Generator state suspended.",
          lineNumber: 15, 
          variable: { address: '0x05', name: 'val3', value: '4', type: 'int' },
          memorySnapshot: { 
            '0x01': { address: '0x01', name: 'evens', value: '<generator_function>', type: 'function' },
            '0x02': { address: '0x02', name: 'gen', value: '<generator: suspended>', type: 'generator' },
            '0x03': { address: '0x03', name: 'val1', value: '0', type: 'int' },
            '0x04': { address: '0x04', name: 'val2', value: '2', type: 'int' },
            '0x05': { address: '0x05', name: 'val3', value: '4', type: 'int' }
          }
        }
      ],
      currentStepIndex: 0,
      isPlaying: false,
      executionMode: 'PLAY'
    });
    initialize();
    play();
    
    // Animate health bar
    setTimeout(() => setBossHealth(66), 1000);
    setTimeout(() => setBossHealth(33), 2200);
    setTimeout(() => setBossHealth(0), 3400);
    
    setTimeout(() => {
      setSuccess(true);
      setTimeout(() => setPhase('victory'), 1500);
    }, 3900);
  };

  const handleVictory = () => {
    gainXP(600, 'Boss Defeated');
    gainItem('infinite-compass');
    completeBoss('iterator-isles');
    navigate('/region/iterator-isles');
  };

  return (
    <div className="h-screen flex flex-col bg-[#05050A] text-white font-sans overflow-hidden relative">
      <div className={`absolute inset-0 transition-colors duration-1000 pointer-events-none ${
        phase === 'intro' ? 'bg-amber-900/10' :
        phase === 'battle' ? 'bg-amber-900/20' :
        'bg-game-gold/20'
      }`} />

      {/* Header */}
      <header className="h-16 border-b border-game-border flex items-center justify-between px-6 bg-slate-950/40 backdrop-blur-md relative z-30">
        <h1 className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400 uppercase tracking-widest flex items-center gap-3">
          <Shield className="w-6 h-6 text-amber-400" />
          Boss Battle
        </h1>
        <div className="text-amber-400 font-bold">Iterator Isles Final Trial</div>
      </header>

      <main className="flex-1 flex items-center justify-center relative z-10 p-6 overflow-y-auto">
        {phase === 'intro' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl bg-game-surface p-10 border border-game-border rounded-2xl shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
            
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-amber-500 blur-[80px] opacity-20 rounded-full animate-pulse" />
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-8xl relative z-10"
              >
                🗿
              </motion.div>
            </div>

            <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-md uppercase tracking-wide">
              The Infinite Stream Sentinel
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              The Sentinel controls an endless flow of incoming data. If you attempt to save the entire stream into memory 
              using list, tuple, or brackets, the memory explosion will instantly defeat you. 
              You must construct a lazy iterator to siphon only the elements you need.
            </p>

            <div className="bg-amber-950/30 border border-amber-500/20 rounded-lg p-4 mb-8 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
              <div className="text-left">
                <h4 className="text-amber-400 font-bold mb-1">Sentinel Rules</h4>
                <p className="text-sm text-amber-200/80">
                  Any usage of eager collectors (list, tuple, sets, or brackets `[]`) is detected as a threat and will result in a crash. 
                  Only generators and lazy step evaluations are permitted.
                </p>
              </div>
            </div>

            <Button 
              onClick={() => setPhase('battle')}
              className="w-full h-14 text-lg font-bold bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 border-none group transition-all duration-300"
            >
              Face the Sentinel
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
              {/* Boss Status */}
              <div className="bg-game-surface border border-game-border rounded-xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sword className="w-24 h-24" />
                </div>
                
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="text-5xl">🗿</div>
                  <div>
                    <h3 className="font-bold text-xl text-amber-400 uppercase tracking-wider">Stream Sentinel</h3>
                    <p className="text-sm text-slate-400">Guardian of Infinite Streams</p>
                  </div>
                </div>

                <div className="space-y-2 relative z-10">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-300">HP</span>
                    <span className={bossHealth > 50 ? "text-green-400" : bossHealth > 20 ? "text-yellow-400" : "text-red-400"}>
                      {bossHealth} / 100
                    </span>
                  </div>
                  <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-game-border/50 p-0.5">
                    <motion.div 
                      initial={{ width: '100%' }}
                      animate={{ width: `${bossHealth}%` }}
                      transition={{ type: 'spring', bounce: 0.2 }}
                      className={`h-full rounded-sm ${
                        bossHealth > 50 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                        bossHealth > 20 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                        'bg-gradient-to-r from-red-500 to-red-400'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1 bg-game-surface border border-game-border rounded-xl overflow-hidden flex flex-col min-h-[300px]">
                <div className="h-10 bg-slate-900/50 border-b border-game-border flex items-center px-4 font-mono text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Stream-safe Grimoire
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
                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold h-12 text-lg shadow-lg shadow-amber-900/20"
                  >
                    {isPlaying ? 'Evaluating...' : success ? 'Sentinel Deactivated!' : 'Cast Lazy Spell'}
                  </Button>
                  
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 text-red-400 text-sm font-medium text-center bg-red-950/30 p-3 rounded border border-red-900/50"
                    >
                      {error}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Memory Visualizer */}
            <div className="col-span-12 lg:col-span-7 bg-game-surface border border-game-border rounded-xl overflow-hidden flex flex-col h-full">
               <div className="h-10 bg-slate-900/50 border-b border-game-border flex items-center px-4 font-mono text-xs text-slate-400 font-bold uppercase tracking-wider gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  Memory Visualizer (Stack & Heap footprints)
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
            <div className="text-6xl mb-6">🧭</div>
            <h2 className="text-3xl font-extrabold text-game-gold mb-2 uppercase tracking-widest">
              Sentinel Defeated!
            </h2>
            <p className="text-slate-300 mb-8 font-medium">
              You bypass the Sentinel with zero memory leaks. The Infinite Compass is yours.
            </p>
            
            <div className="bg-black/40 rounded-xl p-4 mb-8 border border-game-gold/20 flex items-center justify-center gap-4">
              <div className="text-left">
                <div className="text-game-gold font-bold">+600 XP</div>
                <div className="text-sm text-slate-400">Infinite Compass Acquired</div>
              </div>
            </div>

            <Button 
              onClick={handleVictory}
              className="w-full h-14 bg-game-gold text-black hover:bg-yellow-400 font-bold text-lg"
            >
              Claim Reward & Complete Region
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
