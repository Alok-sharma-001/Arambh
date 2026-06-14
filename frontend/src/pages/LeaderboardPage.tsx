import { useState, useMemo, useEffect } from 'react';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import AnalyticsDashboard from '../components/dashboard/AnalyticsDashboard';
import {
  Trophy,
  Medal,
  Flame,
  Crown,
  ChevronUp,
  ChevronDown,
  Minus,
  Star,
  Shield,
  Zap,
  TrendingUp,
  Users,
  Target,
  Search,
  Loader2,
  BarChart2,
  Globe
} from 'lucide-react';

type SortField = 'rank' | 'total_xp' | 'regions_completed' | 'artifacts_collected' | 'streak';
type TimeFilter = 'all-time' | 'this-week' | 'today';

const getAvatar = (name: string) => {
  const avatars = ['🧑‍💻', '🧙‍♀️', '🐉', '⚔️', '🛡️', '🦊', '🦉', '🐺', '✨', '⚡'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatars[Math.abs(hash) % avatars.length];
};

export default function LeaderboardPage() {
  const { entries, isLoading, error, fetchLeaderboard } = useLeaderboardStore();
  
  const [view, setView] = useState<'global' | 'analytics'>('global');
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortAsc, setSortAsc] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all-time');
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const data = useMemo(() => {
    return entries.map((entry) => ({
      ...entry,
      avatar: getAvatar(entry.username)
    }));
  }, [entries]);

  const filteredData = useMemo(() => {
    let d = [...data];
    if (query.trim()) {
      d = d.filter((e) => e.username.toLowerCase().includes(query.toLowerCase()));
    }
    d.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (sortField === 'rank') return sortAsc ? aVal - bVal : bVal - aVal;
      return sortAsc ? (bVal as number) - (aVal as number) : (aVal as number) - (bVal as number);
    });
    return d;
  }, [data, sortField, sortAsc, query]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <Minus size={10} className="text-mid-gray/30" />;
    return sortAsc ? (
      <ChevronUp size={12} className="text-gold" />
    ) : (
      <ChevronDown size={12} className="text-gold" />
    );
  };

  const currentUser = data.find((e) => e.is_current_user);
  const top3 = data.slice(0, 3);

  if (isLoading && data.length === 0) {
    return (
      <main className="min-h-screen bg-near-black pt-[72px] flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={48} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-near-black pt-[72px]">
      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden border-b border-warm-white/[0.06]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(124,92,255,0.06) 0%, transparent 70%)',
          }}
        />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12 relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-royal-purple/20 bg-royal-purple/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-royal-purple mb-4">
                <Trophy size={12} /> Leaderboard
              </span>
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-warm-white leading-tight">
                Global Rankings
              </h1>
              <p className="mt-3 text-mid-gray text-base max-w-[55ch] leading-relaxed">
                Compete with fellow adventurers. Climb the ranks by earning XP, completing regions,
                and collecting artifacts.
              </p>
            </div>

            {/* Your Stats */}
            {currentUser && (
              <div className="flex items-center gap-4 rounded-2xl border border-gold/15 bg-gold/[0.04] px-6 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold text-2xl">
                  {currentUser.avatar}
                </div>
                <div>
                  <span className="text-xs text-mid-gray">Your Rank</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xl font-bold text-gold">#{currentUser.rank}</span>
                    <span className="text-sm text-warm-white font-medium">/ {data.length}</span>
                  </div>
                </div>
                <div className="ml-4 border-l border-warm-white/[0.08] pl-4">
                  <span className="text-xs text-mid-gray">XP</span>
                  <p className="font-mono text-lg font-bold text-gold">{currentUser.total_xp.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* ── Tab Switcher ── */}
          <div className="mt-10 flex gap-2">
            <button
              onClick={() => setView('global')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-colors ${
                view === 'global' 
                  ? 'bg-warm-white text-near-black' 
                  : 'bg-warm-white/[0.04] text-mid-gray hover:text-warm-white hover:bg-warm-white/[0.08]'
              }`}
            >
              <Globe size={16} /> Global Rankings
            </button>
            <button
              onClick={() => setView('analytics')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-colors ${
                view === 'analytics' 
                  ? 'bg-[#8b5cf6] text-white' 
                  : 'bg-[#8b5cf6]/[0.04] text-mid-gray hover:text-warm-white hover:bg-[#8b5cf6]/[0.08]'
              }`}
            >
              <BarChart2 size={16} /> My Analytics
            </button>
          </div>
        </div>
      </div>

      {view === 'global' ? (
        <>
          {/* ── Top 3 Podium ── */}
          {top3.length > 0 && (
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {top3.map((entry, idx) => {
                const podiumColors = [
                  { bg: 'rgba(200,164,94,0.08)', border: 'rgba(200,164,94,0.30)', accent: '#c8a45e', icon: Crown },
                  { bg: 'rgba(192,192,192,0.06)', border: 'rgba(192,192,192,0.20)', accent: '#c0c0c0', icon: Medal },
                  { bg: 'rgba(205,127,50,0.06)', border: 'rgba(205,127,50,0.20)', accent: '#cd7f32', icon: Medal },
                ];
                const cfg = podiumColors[idx];
                const Icon = cfg.icon;
                const orderClass = idx === 0 ? 'md:order-2 md:-mt-4' : idx === 1 ? 'md:order-1' : 'md:order-3';

                return (
                  <div
                    key={entry.rank}
                    className={`relative overflow-hidden rounded-2xl border p-6 text-center transition-all hover:-translate-y-1 hover:shadow-card-hover ${orderClass}`}
                    style={{
                      borderColor: cfg.border,
                      background: `linear-gradient(170deg, rgba(28,28,28,0.97), rgba(12,12,12,0.98)), radial-gradient(circle at 50% 0%, ${cfg.bg}, transparent 60%)`,
                    }}
                  >
                    <div
                      className="absolute inset-x-0 top-0 h-px opacity-70"
                      style={{ background: `linear-gradient(90deg, transparent, ${cfg.accent}, transparent)` }}
                    />

                    <div
                      className="mx-auto flex h-10 w-10 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${cfg.accent}20`, border: `2px solid ${cfg.accent}50` }}
                    >
                      <Icon size={18} style={{ color: cfg.accent }} />
                    </div>

                    <div className="mt-4 mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 text-3xl"
                      style={{ borderColor: `${cfg.accent}40`, backgroundColor: `${cfg.accent}10` }}
                    >
                      {entry.avatar}
                    </div>

                    <h3 className="mt-3 font-display text-lg font-bold text-warm-white">{entry.username}</h3>
                    <p className="text-xs text-mid-gray mt-1">Level {entry.level}</p>

                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="rounded-lg border border-warm-white/[0.06] bg-warm-white/[0.02] py-2">
                        <span className="block font-mono text-sm font-bold" style={{ color: cfg.accent }}>
                          {entry.total_xp.toLocaleString()}
                        </span>
                        <span className="text-[9px] uppercase tracking-[0.12em] text-mid-gray">XP</span>
                      </div>
                      <div className="rounded-lg border border-warm-white/[0.06] bg-warm-white/[0.02] py-2">
                        <span className="block font-mono text-sm font-bold text-warm-white">
                          {entry.regions_completed}
                        </span>
                        <span className="text-[9px] uppercase tracking-[0.12em] text-mid-gray">Regions</span>
                      </div>
                      <div className="rounded-lg border border-warm-white/[0.06] bg-warm-white/[0.02] py-2">
                        <span className="block font-mono text-sm font-bold text-warm-white">
                          {entry.artifacts_collected}
                        </span>
                        <span className="text-[9px] uppercase tracking-[0.12em] text-mid-gray">Artifacts</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          )}

          {/* ── Filters & Search ── */}
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {(['all-time', 'this-week', 'today'] as TimeFilter[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeFilter(t)}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.1em] border transition-all ${
                      timeFilter === t
                        ? 'bg-royal-purple/10 border-royal-purple/30 text-royal-purple'
                        : 'border-warm-white/[0.08] text-mid-gray hover:text-warm-white hover:border-warm-white/20'
                    }`}
                  >
                    {t.replace('-', ' ')}
                  </button>
                ))}
              </div>
              <div className="relative w-full sm:w-auto">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mid-gray" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search players..."
                  className="h-9 w-full sm:w-[220px] rounded-lg border border-warm-white/[0.08] bg-deep-charcoal/60 pl-9 pr-3 text-xs text-warm-white outline-none placeholder:text-mid-gray/60 focus:border-royal-purple/40 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* ── Full Rankings Table ── */}
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pb-20">
            <div className="overflow-hidden rounded-2xl border border-warm-white/[0.08]">
              <div className="grid grid-cols-[60px_1fr_100px_100px_100px_80px] md:grid-cols-[60px_1fr_120px_120px_120px_100px] gap-2 border-b border-warm-white/[0.06] bg-deep-charcoal/40 px-5 py-3">
                <button onClick={() => toggleSort('rank')} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-mid-gray hover:text-warm-white transition-colors">
                  Rank <SortIcon field="rank" />
                </button>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-mid-gray">Player</span>
                <button onClick={() => toggleSort('total_xp')} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-mid-gray hover:text-warm-white transition-colors text-right justify-end">
                  XP <SortIcon field="total_xp" />
                </button>
                <button onClick={() => toggleSort('regions_completed')} className="hidden md:flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-mid-gray hover:text-warm-white transition-colors text-right justify-end">
                  Regions <SortIcon field="regions_completed" />
                </button>
                <button onClick={() => toggleSort('artifacts_collected')} className="hidden md:flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-mid-gray hover:text-warm-white transition-colors text-right justify-end">
                  Artifacts <SortIcon field="artifacts_collected" />
                </button>
                <button onClick={() => toggleSort('streak')} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-mid-gray hover:text-warm-white transition-colors text-right justify-end">
                  Streak <SortIcon field="streak" />
                </button>
              </div>

              <div>
                {filteredData.map((entry) => {
                  const isTop3 = entry.rank <= 3;
                  const isUser = entry.is_current_user;
                  const rankColors = ['#c8a45e', '#c0c0c0', '#cd7f32'];

                  return (
                    <div
                      key={entry.rank}
                      className={`grid grid-cols-[60px_1fr_100px_100px_100px_80px] md:grid-cols-[60px_1fr_120px_120px_120px_100px] gap-2 items-center px-5 py-3.5 border-b border-warm-white/[0.03] transition-colors ${
                        isUser ? 'bg-gold/[0.06] border-l-2 border-l-gold' : 'hover:bg-warm-white/[0.02]'
                      }`}
                    >
                      <div>
                        {isTop3 ? (
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-bold"
                            style={{ backgroundColor: `${rankColors[entry.rank - 1]}20`, color: rankColors[entry.rank - 1], border: `1.5px solid ${rankColors[entry.rank - 1]}40` }}
                          >
                            {entry.rank}
                          </span>
                        ) : (
                          <span className="font-mono text-sm text-mid-gray pl-1">{entry.rank}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warm-white/[0.04] text-lg border border-warm-white/[0.06]">
                          {entry.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${isUser ? 'text-gold' : 'text-warm-white'}`}>
                            {entry.username}
                            {isUser && (
                              <span className="ml-2 text-[9px] uppercase tracking-widest bg-gold/15 text-gold px-1.5 py-0.5 rounded">You</span>
                            )}
                          </p>
                          <p className="text-[11px] text-mid-gray/60">Level {entry.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-sm font-bold text-gold">{entry.total_xp.toLocaleString()}</span>
                      </div>
                      <div className="hidden md:block text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Target size={12} className="text-mid-gray/50" />
                          <span className="font-mono text-sm text-warm-white">{entry.regions_completed}</span>
                          <span className="text-[10px] text-mid-gray/40">/ 11</span>
                        </div>
                      </div>
                      <div className="hidden md:block text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Star size={12} className="text-mid-gray/50" />
                          <span className="font-mono text-sm text-warm-white">{entry.artifacts_collected}</span>
                          <span className="text-[10px] text-mid-gray/40">/ 11</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-warm-white/[0.03] px-2.5 py-1">
                          <Flame size={12} className={entry.streak > 0 ? 'text-orange-400' : 'text-mid-gray/30'} />
                          <span className="font-mono text-xs font-bold text-warm-white">{entry.streak}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {filteredData.length === 0 && !isLoading && (
                  <div className="p-8 text-center text-mid-gray">
                    No adventurers found matching "{query}"
                  </div>
                )}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="rounded-xl border border-warm-white/[0.08] bg-deep-charcoal/40 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={14} className="text-royal-purple" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-mid-gray">Total Players</span>
                </div>
                <span className="font-mono text-2xl font-bold text-warm-white">{data.length}</span>
              </div>
              <div className="rounded-xl border border-warm-white/[0.08] bg-deep-charcoal/40 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-mid-gray">Total XP Earned</span>
                </div>
                <span className="font-mono text-2xl font-bold text-gold">
                  {data.reduce((sum, e) => sum + e.total_xp, 0).toLocaleString()}
                </span>
              </div>
              <div className="rounded-xl border border-warm-white/[0.08] bg-deep-charcoal/40 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Shield size={14} className="text-emerald" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-mid-gray">Regions Cleared</span>
                </div>
                <span className="font-mono text-2xl font-bold text-emerald">
                  {data.reduce((sum, e) => sum + e.regions_completed, 0)}
                </span>
              </div>
              <div className="rounded-xl border border-warm-white/[0.08] bg-deep-charcoal/40 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp size={14} className="text-orange-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-mid-gray">Top Streak</span>
                </div>
                <span className="font-mono text-2xl font-bold text-orange-400">
                  {data.length > 0 ? Math.max(...data.map((e) => e.streak)) : 0}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-8">
          <AnalyticsDashboard />
        </div>
      )}
    </main>
  );
}
