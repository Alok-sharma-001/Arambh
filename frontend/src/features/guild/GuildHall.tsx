import { useEffect, useState } from 'react';
import { Shield, Users, Swords, Scroll, AlertCircle, Plus } from 'lucide-react';
import { useGuildStore } from '../../store/guildStore';
import { useProgressionStore } from '../../store/progressionStore';

export default function GuildHall() {
  const { myGuild, publicGuilds, isLoading, error, fetchMyGuild, fetchPublicGuilds, createGuild, joinGuild, leaveGuild } = useGuildStore();
  const { stats } = useProgressionStore();
  const [newGuildName, setNewGuildName] = useState('');
  const [newGuildDesc, setNewGuildDesc] = useState('');

  useEffect(() => {
    fetchMyGuild();
    fetchPublicGuilds();
  }, []);

  const handleCreate = async () => {
    if (!newGuildName.trim()) return;
    try {
      await createGuild(newGuildName, newGuildDesc, 'shield');
    } catch (e) {}
  };

  if (isLoading) {
    return <div className="p-8 text-center font-mono text-game-purple animate-pulse">Loading Guild Realms...</div>;
  }

  if (!myGuild) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-game-blue to-game-purple mb-4">Guild Realms</h1>
          <p className="text-slate-400">Join an alliance of code mages or forge your own legacy.</p>
        </header>

        {error && (
          <div className="p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 p-6 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Plus className="w-6 h-6 text-game-blue" /> Forge a Guild</h2>
            {stats && stats.current_level >= 10 ? (
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Guild Name" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white"
                  value={newGuildName}
                  onChange={(e) => setNewGuildName(e.target.value)}
                />
                <textarea 
                  placeholder="Description (Optional)" 
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white resize-none h-24"
                  value={newGuildDesc}
                  onChange={(e) => setNewGuildDesc(e.target.value)}
                />
                <button onClick={handleCreate} className="w-full py-3 bg-gradient-to-r from-game-blue to-game-purple rounded-lg font-bold text-white hover:scale-105 transition-transform">
                  Found Alliance (Costs 1000 XP)
                </button>
              </div>
            ) : (
              <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-400 text-center">
                You must reach Level 10 (Master) to found a guild.
              </div>
            )}
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 p-6 rounded-2xl flex flex-col max-h-[500px]">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Shield className="w-6 h-6 text-game-purple" /> Active Guilds</h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {publicGuilds.length === 0 ? (
                <div className="text-center text-slate-500 py-8">No guilds found.</div>
              ) : (
                publicGuilds.map(g => (
                  <div key={g.id} className="p-4 bg-slate-900 border border-slate-700 rounded-xl flex items-center justify-between group hover:border-game-purple transition-colors">
                    <div>
                      <h3 className="font-bold text-white text-lg">{g.name}</h3>
                      <p className="text-xs text-slate-400">Lvl {g.level} • {g.member_count}/50 Members • {g.reputation} Rep</p>
                    </div>
                    <button onClick={() => joinGuild(g.id)} className="px-4 py-2 bg-slate-800 hover:bg-game-purple text-white text-sm font-bold rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      Join
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Guild Hall View
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)]">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white">{myGuild.name}</h1>
              <p className="text-slate-400 font-mono text-sm">{myGuild.description}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-4 text-center">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 min-w-[100px]">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Level</p>
            <p className="text-2xl font-black text-game-blue">{myGuild.level}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 min-w-[100px]">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Reputation</p>
            <p className="text-2xl font-black text-game-purple">{myGuild.reputation}</p>
          </div>
          <button onClick={leaveGuild} className="p-3 bg-red-900/20 text-red-400 border border-red-900/50 rounded-xl hover:bg-red-900/40 text-sm font-bold">
            Leave
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roster */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-emerald-400" /> Roster ({myGuild.members.length}/50)</h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {myGuild.members.map(m => (
              <div key={m.user_id} className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-200">{m.username}</p>
                  <p className="text-xs text-slate-500 capitalize">{m.role} • Lvl {m.level} {m.rank}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-emerald-400">+{m.contribution_gxp} GXP</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* War Room */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Swords className="w-5 h-5 text-red-400" /> Active Guild Boss</h2>
            {myGuild.progress?.active_boss_id ? (
              <div className="p-6 bg-red-950/30 border border-red-900/50 rounded-xl text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&q=80')] opacity-10 mix-blend-screen" />
                <h3 className="text-2xl font-black text-red-500 mb-2">{myGuild.progress.active_boss_id.toUpperCase()}</h3>
                <p className="text-slate-300 mb-6">Boss Health</p>
                <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-red-900">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-orange-500" 
                    style={{ width: `${(myGuild.progress.boss_health_remaining / 1000000) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-red-400 mt-2 font-mono">{myGuild.progress.boss_health_remaining} / 1,000,000 HP</p>
                <button className="mt-6 px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-colors uppercase tracking-widest shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                  Engage Boss
                </button>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 border border-dashed border-slate-700 rounded-xl">
                No active boss threat. Officers can summon a boss from the Bestiary.
              </div>
            )}
          </div>

          <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Scroll className="w-5 h-5 text-amber-400" /> Cooperative Quests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl">
                <h3 className="font-bold text-amber-400 text-sm uppercase tracking-wider mb-2">The Syntax Drive</h3>
                <p className="text-sm text-slate-300 mb-4">Collectively write 5,000 lines of valid code across all members.</p>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: '45%' }} />
                </div>
                <p className="text-right text-xs text-slate-500 mt-1">2,250 / 5,000</p>
              </div>
              <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-xl opacity-50">
                <h3 className="font-bold text-amber-400 text-sm uppercase tracking-wider mb-2">Mentorship</h3>
                <p className="text-sm text-slate-300 mb-4">Have 5 members complete Functions Mountain.</p>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: '0%' }} />
                </div>
                <p className="text-right text-xs text-slate-500 mt-1">0 / 5</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
