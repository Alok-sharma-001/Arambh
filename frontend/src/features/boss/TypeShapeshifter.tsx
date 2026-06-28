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

export default function TypeShapeshifter() {
  const [code, setCode] = useState('# Defeat the Type Shapeshifter!\n# Cast different types to break its forms:\n# 1. string: form = "Solid"\n# 2. float: temperature = 98.6\n# 3. bool: is_stable = False\n');
  const [bossHealth, setBossHealth] = useState(100);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [phase, setPhase] = useState<'intro' | 'battle' | 'victory'>('intro');
  
  const { initialize, play, isPlaying } = useEngineStore();
  const navigate = useNavigate();
  const { completeBoss } = useRegionStore();
  const { gainXP, gainItem } = useProgressionStore();

  // Initialize empty memory grid on mount so it's not a black box
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
    if (code.includes('form') && code.includes('"Solid"') && 
        code.includes('temperature') && code.includes('98.6') && 
        code.includes('is_stable') && code.includes('False')) {
      useEngineStore.setState({ 
        steps: [
          { 
            id: 1, 
            type: 'ALLOCATE', 
            description: "Allocated string 'Solid' to 'form'.",
            lineNumber: 3, 
            variable: { address: '0x00', name: 'form', value: '"Solid"', type: 'string' },
            memorySnapshot: { '0x00': { address: '0x00', name: 'form', value: '"Solid"', type: 'string' } }
          },
          { 
            id: 2, 
            type: 'ALLOCATE', 
            description: "Allocated float 98.6 to 'temperature'.",
            lineNumber: 4, 
            variable: { address: '0x01', name: 'temperature', value: '98.6', type: 'float' },
            memorySnapshot: { 
              '0x00': { address: '0x00', name: 'form', value: '"Solid"', type: 'string' },
              '0x01': { address: '0x01', name: 'temperature', value: '98.6', type: 'float' } 
            }
          },
          { 
            id: 3, 
            type: 'ALLOCATE', 
            description: "Allocated boolean False to 'is_stable'.",
            lineNumber: 5, 
            variable: { address: '0x02', name: 'is_stable', value: 'False', type: 'bool' },
            memorySnapshot: { 
              '0x00': { address: '0x00', name: 'form', value: '"Solid"', type: 'string' },
              '0x01': { address: '0x01', name: 'temperature', value: '98.6', type: 'float' },
              '0x02': { address: '0x02', name: 'is_stable', value: 'False', type: 'bool' } 
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
      setError('The spell failed! Ensure you defined form="Solid", temperature=98.6, and is_stable=False.');
    }
  };

  const handleVictory = async () => {
    try {
      console.log('handleVictory called');
      gainXP(500, 'Boss Defeated');
      gainItem('crystal-lens');
      completeBoss('data-types-valley');
      navigate('/region/data-types-valley');
    } catch (e) {
      console.error(e);
      alert('Error navigating. Please check console.');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#05050A] text-white font-sans overflow-hidden relative">
      {/* Dynamic Background */}
      <div className={`absolute inset-0 transition-colors duration-1000 pointer-events-none ${
        phase === 'intro' ? 'bg-cyan-900/10' :
        phase === 'battle' ? 'bg-cyan-900/20' :
        'bg-game-gold/20'
      }`} />

      {/* Header */}
      <header className="h-16 border-b border-game-border flex items-center justify-between px-6 bg-slate-950/40 backdrop-blur-md relative z-30">
        <h1 className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 uppercase tracking-widest flex items-center gap-3">
          <Shield className="w-6 h-6 text-cyan-400" />
          Boss Battle
        </h1>
        <div className="text-cyan-400 font-bold">Data Types Valley Final Trial</div>
      </header>

      <main className="flex-1 flex items-center justify-center relative z-10 p-6 overflow-y-auto">
          {phase === 'intro' && (
            <div 
              className="text-center max-w-2xl bg-game-surface p-10 border border-game-border rounded-2xl shadow-2xl relative overflow-hidden group"
            >
              <Shield className="w-24 h-24 text-cyan-500 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
              <h2 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-200">The Type Shapeshifter Awakens</h2>
              <p className="text-xl text-game-text mb-8 leading-relaxed">
                A chaotic entity of pure unstable data blocks your path. It shifts forms wildly. You must hit it with distinct data types—a String, a Float, and a Boolean—to shatter its unstable core!
              </p>
              <Button onClick={() => setPhase('battle')} className="text-lg px-8 py-4 bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] cursor-pointer relative z-20">
                <Sword className="w-6 h-6 mr-3" /> Initiate Combat
              </Button>
            </div>
          )}

          {phase === 'battle' && (
            <motion.div 
              key="battle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 h-[80vh]"
            >
              <div className="flex flex-col gap-6">
                {/* Boss Status */}
                <div className="bg-game-surface border border-game-border rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-game-border">
                    <motion.div 
                      className="h-full bg-cyan-500" 
                      initial={{ width: '100%' }}
                      animate={{ width: `${bossHealth}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-cyan-400">Type Shapeshifter</h3>
                  <div className="text-4xl font-black mb-4">{bossHealth} / 100 HP</div>
                  <div className="h-32 bg-[#0A0A0F] rounded-lg border border-game-border flex items-center justify-center relative overflow-hidden">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, -5, 0],
                        borderRadius: ['20%', '50%', '30%', '20%']
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className={`w-20 h-20 bg-gradient-to-br from-cyan-600 to-purple-600 shadow-[0_0_40px_rgba(6,182,212,0.6)] ${bossHealth <= 0 ? 'hidden' : ''}`}
                    />
                    {bossHealth <= 0 && (
                      <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }} 
                        className="text-game-gold font-bold text-2xl flex items-center gap-2"
                      >
                        SHATTERED!
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Editor */}
                <div className="flex-1 bg-game-surface border border-game-border rounded-xl flex flex-col overflow-hidden">
                  <div className="bg-[#1E1E1E] px-4 py-2 text-sm text-game-text border-b border-game-border flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-2 font-mono">attack_spell.py</span>
                  </div>
                  <div className="flex-1">
                    <Editor
                      height="100%"
                      defaultLanguage="python"
                      theme="vs-dark"
                      value={code}
                      onChange={(v) => setCode(v || '')}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 16,
                        lineHeight: 24,
                        padding: { top: 16 },
                        scrollBeyondLastLine: false,
                        readOnly: isPlaying || success,
                      }}
                    />
                  </div>
                  {error && (
                    <div className="bg-red-500/10 border-t border-red-500/20 p-4 text-red-400 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="text-sm leading-relaxed">{error}</p>
                    </div>
                  )}
                  <div className="p-4 border-t border-game-border bg-slate-900/50">
                    <Button 
                      onClick={handleRun} 
                      disabled={isPlaying || success}
                      className="w-full text-lg py-6 bg-cyan-600 hover:bg-cyan-500 cursor-pointer relative z-20"
                    >
                      <Sword className="w-5 h-5 mr-2" /> Execute Attack
                    </Button>
                  </div>
                </div>
              </div>

              {/* Execution Engine */}
              <div className="bg-game-surface border border-game-border rounded-xl p-6 flex flex-col h-full">
                <h3 className="text-xl font-bold mb-6 text-game-gold">Memory World</h3>
                <div className="flex-1 min-h-0 bg-[#0A0A0F] rounded-lg border border-game-border p-4 overflow-y-auto relative z-10">
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
              className="text-center max-w-xl bg-game-surface p-12 border border-game-gold/30 rounded-2xl shadow-[0_0_50px_rgba(251,191,36,0.15)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-game-gold/10 to-transparent pointer-events-none" />
              <Shield className="w-24 h-24 text-game-gold mx-auto mb-6 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
              <h2 className="text-4xl font-black mb-4 text-game-gold">Victory!</h2>
              <p className="text-xl text-game-text mb-8 relative z-10">
                The Type Shapeshifter has been shattered into its base variables. Data Types Valley is now safe!
              </p>
              
              <div className="bg-[#0A0A0F] border border-game-border rounded-xl p-6 mb-8 transform hover:scale-105 transition-transform relative z-10">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">Type Prism Acquired!</h3>
                <p className="text-cyan-400 text-sm">Artifact 2/5</p>
              </div>

              <Button onClick={handleVictory} className="text-lg px-8 py-4 bg-game-gold hover:bg-yellow-400 text-black w-full cursor-pointer relative z-20">
                Claim Rewards & Continue <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}
      </main>
    </div>
  );
}
