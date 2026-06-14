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

export default function TheForgottenArchitect() {
  const [code, setCode] = useState('# The Forgotten Architect demands a flawless spell structure.\n# Define a function named `forge_key` that takes `magic` as a parameter.\n# It must calculate `power = magic * 10` and `return power`.\n# Finally, call the function with magic = 5.\n\n');
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
            description: "Awaiting spell execution...",
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
    const codeLower = code.toLowerCase();
    const hasDef = codeLower.includes('def forge_key(magic):') || codeLower.includes('def forge_key(magic )') || codeLower.includes('def forge_key( magic )');
    const hasReturn = codeLower.includes('return power');
    const hasCall = codeLower.includes('forge_key(5)');

    if (hasDef && hasReturn && hasCall) {
      useEngineStore.setState({ 
        steps: [
          { 
            id: 1, 
            type: 'FUNCTION_CALL', 
            description: "Function invoked.",
            lineNumber: 6, 
            functionCall: { functionName: 'forge_key', args: { magic: '5' } },
            memorySnapshot: {}
          },
          { 
            id: 2, 
            type: 'ALLOCATE', 
            description: "Parameter assigned.",
            lineNumber: 2, 
            variable: { address: '0x00', name: 'magic', value: '5', type: 'int' },
            memorySnapshot: { '0x00': { address: '0x00', name: 'magic', value: '5', type: 'int' } }
          },
          { 
            id: 3, 
            type: 'ALLOCATE', 
            description: "Power calculated.",
            lineNumber: 3, 
            variable: { address: '0x01', name: 'power', value: '50', type: 'int' },
            memorySnapshot: { 
              '0x00': { address: '0x00', name: 'magic', value: '5', type: 'int' },
              '0x01': { address: '0x01', name: 'power', value: '50', type: 'int' } 
            }
          },
          { 
            id: 4, 
            type: 'FUNCTION_RETURN', 
            description: "Value returned to caller.",
            lineNumber: 4, 
            functionCall: { functionName: 'forge_key', args: { magic: '5' }, returnValue: '50' },
            memorySnapshot: { 
              '0x00': { address: '0x00', name: 'magic', value: '5', type: 'int' },
              '0x01': { address: '0x01', name: 'power', value: '50', type: 'int' } 
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
      setTimeout(() => setBossHealth(60), 1000);
      setTimeout(() => setBossHealth(20), 2000);
      setTimeout(() => setBossHealth(0), 3000);
      
      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => setPhase('victory'), 1500);
      }, 3500);
    } else {
      setError('The spell failed! You need `def forge_key(magic):`, calculate and `return power`, and finally call `forge_key(5)`.');
    }
  };

  const handleVictory = async () => {
    try {
      console.log('handleVictory called');
      gainXP(800, 'Boss Defeated');
      gainItem('function_scroll');
      completeBoss('functions-mountain');
      navigate('/region/functions-mountain');
    } catch (e) {
      console.error(e);
      alert('Error navigating. Please check console.');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#05050A] text-white font-sans overflow-hidden relative">
      {/* Dynamic Background */}
      <div className={`absolute inset-0 transition-colors duration-1000 pointer-events-none ${
        phase === 'intro' ? 'bg-emerald-900/10' :
        phase === 'battle' ? 'bg-emerald-900/20' :
        'bg-game-gold/20'
      }`} />

      {/* Header */}
      <header className="h-16 border-b border-game-border flex items-center justify-between px-6 bg-slate-950/40 backdrop-blur-md relative z-30">
        <h1 className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 uppercase tracking-widest flex items-center gap-3">
          <Shield className="w-6 h-6 text-emerald-400" />
          Boss Battle
        </h1>
        <div className="text-emerald-400 font-bold">Functions Mountain Final Trial</div>
      </header>

      <main className="flex-1 flex items-center justify-center relative z-10 p-6 overflow-y-auto">
          {phase === 'intro' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl bg-game-surface p-10 border border-game-border rounded-2xl shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
              
              <div className="mb-6 relative flex justify-center">
                <div className="absolute inset-0 bg-emerald-500 blur-[80px] opacity-20 rounded-full animate-pulse" />
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="text-8xl relative z-10"
                >
                  🧙‍♂️
                </motion.div>
              </div>

              <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-md uppercase tracking-wide">
                The Forgotten Architect
              </h2>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                The ancient creator of these temples awakens. He tests your ability to structure code and control the flow of energy. You must define a perfect function blueprint and invoke it to pass his trial.
              </p>

              <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-lg p-4 mb-8 flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h4 className="text-emerald-400 font-bold mb-1">Combat Strategy</h4>
                  <p className="text-sm text-emerald-200/80">Use `def` to create the function, `return` to send power back, and finally call the function to execute it.</p>
                </div>
              </div>

              <Button 
                onClick={() => setPhase('battle')}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-none group transition-all duration-300"
              >
                Enter the Battle
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
                    <Sword className="w-24 h-24" />
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="text-5xl animate-pulse">🧙‍♂️</div>
                    <div>
                      <h3 className="font-bold text-xl text-emerald-400 uppercase tracking-wider">The Architect</h3>
                      <p className="text-sm text-slate-400">Master of Structure</p>
                    </div>
                  </div>

                  {/* Health Bar */}
                  <div className="space-y-2 relative z-10">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-slate-300">Structural Integrity</span>
                      <span className={bossHealth > 50 ? "text-emerald-400" : bossHealth > 20 ? "text-yellow-400" : "text-red-400"}>
                        {bossHealth} / 100
                      </span>
                    </div>
                    <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-game-border/50 p-0.5">
                      <motion.div 
                        initial={{ width: '100%' }}
                        animate={{ width: `${bossHealth}%` }}
                        transition={{ type: 'spring', bounce: 0.2 }}
                        className={`h-full rounded-sm ${
                          bossHealth > 50 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                          bossHealth > 20 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                          'bg-gradient-to-r from-red-500 to-red-400'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Spell Editor */}
                <div className="flex-1 bg-game-surface border border-game-border rounded-xl overflow-hidden flex flex-col min-h-[300px]">
                  <div className="h-10 bg-slate-900/50 border-b border-game-border flex items-center px-4 font-mono text-xs text-slate-400 font-bold uppercase tracking-wider">
                    Blueprint Editor
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
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 text-lg shadow-lg shadow-emerald-900/20"
                    >
                      {isPlaying ? 'Compiling...' : success ? 'Architect Defeated!' : 'Execute Blueprint'}
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
                    <Shield className="w-4 h-4 text-emerald-400" />
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
              <div className="text-6xl mb-6">📜</div>
              <h2 className="text-3xl font-extrabold text-game-gold mb-2 uppercase tracking-widest">
                Victory!
              </h2>
              <p className="text-slate-300 mb-8 font-medium">
                You have proven your mastery of structure and logic. The Architect fades, leaving behind the sacred Function Scroll!
              </p>
              
              <div className="bg-black/40 rounded-xl p-4 mb-8 border border-game-gold/20 flex items-center justify-center gap-4">
                <div className="text-left">
                  <div className="text-game-gold font-bold">+800 XP</div>
                  <div className="text-sm text-slate-400">Function Scroll Acquired</div>
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
