import { useState } from 'react';
import { Play, ChevronLeft, ShieldAlert } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { useTowerStore } from '../../store/towerStore';
import { ProceduralChallenge } from '../../engine/TowerEngine';

export const TowerFloor = ({ challenge, onExit }: { challenge: ProceduralChallenge, onExit: () => void }) => {
  const [code, setCode] = useState(challenge.initialCode);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { advanceFloor, failFloor, addResonance } = useTowerStore();

  const handleRun = () => {
    setError(null);
    const result = challenge.validate(code);
    if (result.isValid) {
      setSuccess(true);
      setTimeout(() => {
        advanceFloor();
        addResonance(Math.floor(Math.random() * 5) + 10);
        onExit(); // Go back to hub to grab next challenge or rest
      }, 2000);
    } else {
      setError(result.error || 'Syntax failure. The tower rejects this solution.');
      failFloor();
    }
  };

  const isBoss = challenge.type.includes('BOSS');

  return (
    <div className="h-screen w-full flex flex-col bg-[#05050A] text-white p-6 relative overflow-hidden">
      
      {/* Visual background based on floor type */}
      <div className={`absolute inset-0 pointer-events-none opacity-20 ${isBoss ? 'bg-game-crimson/10' : 'bg-game-purple/5'}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[100px] mix-blend-screen" 
             style={{ backgroundColor: isBoss ? '#ef4444' : '#8b5cf6' }} />
      </div>

      <header className="flex items-center justify-between mb-8 relative z-10">
        <button onClick={onExit} className="flex items-center gap-2 text-slate-400 hover:text-white transition">
          <ChevronLeft className="w-5 h-5" /> Flee
        </button>
        <div className="text-center">
          <h1 className={`text-3xl font-black uppercase tracking-widest ${isBoss ? 'text-game-crimson' : 'text-game-purple'}`}>
            Floor {challenge.floor}
          </h1>
          <p className="text-slate-400 font-mono text-sm">{challenge.type}</p>
        </div>
        <div className="w-24" /> {/* spacer */}
      </header>

      <div className="flex-1 max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* Left: Challenge Info */}
        <div className={`p-8 rounded-3xl backdrop-blur-xl border ${isBoss ? 'bg-red-950/40 border-red-900/50' : 'bg-slate-900/60 border-game-purple/30'} flex flex-col`}>
          <div className="flex items-center gap-3 mb-6">
            {isBoss && <ShieldAlert className="w-8 h-8 text-game-crimson animate-pulse" />}
            <h2 className={`text-2xl font-bold ${isBoss ? 'text-game-crimson' : 'text-white'}`}>{challenge.title}</h2>
          </div>
          
          <p className="text-lg text-slate-300 leading-relaxed flex-1">
            {challenge.description}
          </p>

          <div className="mt-8 space-y-4">
            {error && (
              <div className="p-4 bg-red-950/50 border border-red-900 rounded-xl text-red-400 font-mono text-sm">
                &gt; Traceback Error:<br/>{error}
                <br/><span className="text-slate-500 mt-2 block">// Your streak was broken. The tower pushed you down.</span>
              </div>
            )}
            {success && (
              <div className="p-4 bg-emerald-950/50 border border-emerald-900 rounded-xl text-emerald-400 font-mono text-sm">
                &gt; Success!<br/>Ascending to the next floor...
              </div>
            )}
            
            <button
              onClick={handleRun}
              disabled={success}
              className={`w-full py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                success ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 
                isBoss ? 'bg-game-crimson hover:bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 
                'bg-game-purple hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]'
              }`}
            >
              <Play className="w-5 h-5" /> Execute & Ascend
            </button>
          </div>
        </div>

        {/* Right: Code Editor */}
        <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
          <Editor
            height="100%"
            defaultLanguage="python"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
              minimap: { enabled: false },
              padding: { top: 24 },
              fontSize: 16,
              fontFamily: "'JetBrains Mono', monospace",
              scrollBeyondLastLine: false,
            }}
          />
        </div>
      </div>
    </div>
  );
};
