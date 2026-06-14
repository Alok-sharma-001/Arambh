import { useState } from 'react';
import { motion } from 'framer-motion';
import { TowerControl as Castle, Activity, Crown, Zap, ChevronUp, Lock } from 'lucide-react';
import { useTowerStore } from '../../store/towerStore';
import { TowerEngine, ProceduralChallenge } from '../../engine/TowerEngine';
import { TowerFloor } from './TowerFloor';

export default function TowerHub() {
  const { progress, activeStreak } = useTowerStore();
  const [activeChallenge, setActiveChallenge] = useState<ProceduralChallenge | null>(null);

  const startAscent = () => {
    const challenge = TowerEngine.generateFloor(progress.current_floor);
    setActiveChallenge(challenge);
  };

  const handleChallengeComplete = () => {
    setActiveChallenge(null);
  };

  const getDifficultyTitle = (floor: number) => {
    if (floor <= 20) return { title: 'Novice Tier', color: 'text-slate-400' };
    if (floor <= 50) return { title: 'Apprentice Tier', color: 'text-game-blue' };
    if (floor <= 100) return { title: 'Adept Tier', color: 'text-game-emerald' };
    if (floor <= 250) return { title: 'Master Tier', color: 'text-game-purple' };
    if (floor <= 500) return { title: 'Grandmaster Tier', color: 'text-game-crimson' };
    return { title: 'Legend Tier', color: 'text-game-gold' };
  };

  const currentTier = getDifficultyTitle(progress.current_floor);

  if (activeChallenge) {
    return <TowerFloor challenge={activeChallenge} onExit={handleChallengeComplete} />;
  }

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto min-h-screen relative overflow-hidden flex flex-col items-center">
      {/* Background Tower visual */}
      <div className="absolute inset-0 z-0 flex justify-center opacity-10 pointer-events-none">
        <div className="w-[300px] bg-gradient-to-t from-game-purple to-transparent h-full relative border-l-4 border-r-4 border-game-purple/30 flex flex-col items-center justify-end">
          <Castle className="w-64 h-64 text-game-purple mb-32" />
        </div>
      </div>

      <header className="flex flex-col items-center gap-4 mb-16 relative z-10 text-center">
        <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-game-purple flex items-center justify-center shadow-[0_0_50px_rgba(139,92,246,0.4)]">
          <Castle className="w-12 h-12 text-game-purple" />
        </div>
        <div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 uppercase tracking-widest">
            The Infinite Tower
          </h1>
          <p className="text-slate-400 font-mono text-sm mt-2 flex justify-center items-center gap-2">
            <span className={currentTier.color}>{currentTier.title}</span> • 
            Endgame Procedural Engine
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full relative z-10">
        
        {/* Left Column: Stats */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 shadow-xl">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4" /> Personal Best
            </h2>
            <div className="text-4xl font-black text-white">
              Floor {progress.max_floor}
            </div>
          </div>
          
          <div className="bg-slate-900/80 backdrop-blur-md border border-game-gold/30 rounded-3xl p-6 shadow-xl">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-game-gold" /> Resonance Matrix
            </h2>
            <div className="text-3xl font-black text-game-gold">
              {progress.resonance}
            </div>
            <p className="text-xs text-slate-400 mt-2">Spend at the Paragons' Vault</p>
          </div>
        </div>

        {/* Center: Ascend Action */}
        <div className="flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-md border border-game-purple/50 rounded-3xl p-8 shadow-[0_0_30px_rgba(139,92,246,0.15)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-game-purple/5 group-hover:bg-game-purple/10 transition-colors" />
          
          <h2 className="text-lg font-bold text-slate-300 mb-2 z-10">Current Altitude</h2>
          <div className="text-7xl font-black text-white mb-2 z-10 flex items-center gap-4">
            Floor {progress.current_floor}
          </div>
          
          <div className="flex items-center gap-2 text-game-emerald font-bold mb-8 z-10">
            <Zap className="w-4 h-4" /> Streak: {activeStreak}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startAscent}
            className="z-10 bg-game-purple hover:bg-purple-500 text-white font-black uppercase tracking-widest py-4 px-12 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.5)] flex items-center gap-3 transition-colors"
          >
            <ChevronUp className="w-6 h-6" /> Ascend
          </motion.button>
        </div>

        {/* Right Column: Leaderboards (Mock) */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 shadow-xl flex flex-col">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Crown className="w-4 h-4 text-game-gold" /> Global Leaders
          </h2>
          
          <div className="flex-1 space-y-4">
            {[
              { rank: 1, name: 'TuringGhost', floor: 142 },
              { rank: 2, name: 'AdaLovelace', floor: 139 },
              { rank: 3, name: 'LinusT', floor: 115 },
              { rank: 4, name: 'SyntaxSlayer', floor: 98 },
            ].map(player => (
              <div key={player.rank} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <div className="flex items-center gap-3">
                  <span className={`font-bold ${player.rank === 1 ? 'text-game-gold' : player.rank === 2 ? 'text-slate-300' : player.rank === 3 ? 'text-orange-400' : 'text-slate-500'}`}>
                    #{player.rank}
                  </span>
                  <span className="text-white font-medium">{player.name}</span>
                </div>
                <div className="text-slate-400 font-mono text-sm">Fl. {player.floor}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-center">
            <button className="text-sm text-game-purple hover:text-white transition-colors flex items-center gap-2">
              <Lock className="w-4 h-4" /> View Full Leaderboard
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
