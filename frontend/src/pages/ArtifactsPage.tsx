import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from '@/context/PlayerContext';
import { artifacts } from '@/data/artifacts';
import {
  ChevronRight,
  Lock,
  Sparkles,
  Shield,
  Star,
  Trophy,
  X,
  Zap,
  Filter,
  Search,
} from 'lucide-react';

const RARITY_CONFIG = {
  Common: { color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.25)', label: 'Common' },
  Rare: { color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.25)', label: 'Rare' },
  Epic: { color: '#c084fc', bg: 'rgba(192,132,252,0.08)', border: 'rgba(192,132,252,0.25)', label: 'Epic' },
  Legendary: { color: '#c8a45e', bg: 'rgba(200,164,94,0.10)', border: 'rgba(200,164,94,0.35)', label: 'Legendary' },
};

type RarityFilter = 'All' | 'Common' | 'Rare' | 'Epic' | 'Legendary';

export default function ArtifactsPage() {
  const { player } = usePlayer();
  const [selectedArtifact, setSelectedArtifact] = useState<typeof artifacts[0] | null>(null);
  const [filter, setFilter] = useState<RarityFilter>('All');
  const [query, setQuery] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Derive unlock status from player progress
  const enrichedArtifacts = artifacts.map((a) => {
    const rp = player.regionProgress[a.regionId];
    const unlocked = rp ? rp.completed : a.unlocked;
    return { ...a, unlocked };
  });

  const filteredArtifacts = enrichedArtifacts.filter((a) => {
    const matchesFilter = filter === 'All' || a.rarity === filter;
    const matchesQuery =
      !query.trim() ||
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.regionName.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const unlockedCount = enrichedArtifacts.filter((a) => a.unlocked).length;
  const totalCount = enrichedArtifacts.length;
  const progressPercent = (unlockedCount / totalCount) * 100;

  const closeModal = () => setSelectedArtifact(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <main className="min-h-screen bg-near-black pt-[72px]">
      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden border-b border-warm-white/[0.06]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(200,164,94,0.08) 0%, transparent 70%)',
          }}
        />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12 relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-gold/[0.06] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-gold mb-4">
                <Sparkles size={12} /> Artifact Vault
              </span>
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-warm-white leading-tight">
                Artifact Collection
              </h1>
              <p className="mt-3 text-mid-gray text-base max-w-[55ch] leading-relaxed">
                Powerful relics earned by mastering each region. Collect them all to unlock the
                Legend's Crown and prove your mastery.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="block font-mono text-3xl font-bold text-gold">{unlockedCount}</span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-mid-gray">Collected</span>
              </div>
              <div className="w-px h-10 bg-warm-white/[0.08]" />
              <div className="text-center">
                <span className="block font-mono text-3xl font-bold text-warm-white/40">{totalCount}</span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-mid-gray">Total</span>
              </div>
              <div className="w-px h-10 bg-warm-white/[0.08]" />
              <div className="text-center min-w-[80px]">
                <div className="h-2 w-20 bg-warm-white/[0.08] rounded-full overflow-hidden">
                  <div
                    className="h-full gradient-completion-bar rounded-full transition-all duration-700"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[10px] uppercase tracking-[0.14em] text-mid-gray mt-1 block">
                  {Math.round(progressPercent)}% Complete
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-mid-gray" />
            {(['All', 'Common', 'Rare', 'Epic', 'Legendary'] as RarityFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.1em] border transition-all ${
                  filter === f
                    ? 'bg-gold/10 border-gold/30 text-gold'
                    : 'border-warm-white/[0.08] text-mid-gray hover:text-warm-white hover:border-warm-white/20'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-mid-gray" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search artifacts..."
              className="h-9 w-full sm:w-[220px] rounded-lg border border-warm-white/[0.08] bg-deep-charcoal/60 pl-9 pr-3 text-xs text-warm-white outline-none placeholder:text-mid-gray/60 focus:border-gold/40 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ── Artifact Grid ── */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pb-20">
        {filteredArtifacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search size={48} className="text-warm-white/10" />
            <h2 className="mt-6 font-display text-2xl font-bold text-warm-white">No artifacts found</h2>
            <p className="mt-2 text-sm text-mid-gray">Try adjusting your filters or search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredArtifacts.map((artifact) => {
              const rCfg = RARITY_CONFIG[artifact.rarity];
              return (
                <button
                  key={artifact.id}
                  onClick={() => setSelectedArtifact(artifact)}
                  className="group relative overflow-hidden rounded-2xl border text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                  style={{
                    borderColor: artifact.unlocked ? rCfg.border : 'rgba(255,252,242,0.06)',
                    background: artifact.unlocked
                      ? `linear-gradient(160deg, rgba(28,28,28,0.97), rgba(12,12,12,0.98)), radial-gradient(circle at 20% 0%, ${rCfg.bg}, transparent 50%)`
                      : 'linear-gradient(160deg, rgba(20,20,20,0.97), rgba(10,10,10,0.98))',
                  }}
                >
                  {/* Glow */}
                  {artifact.unlocked && (
                    <div
                      className="absolute -right-10 -top-10 h-24 w-24 rounded-full blur-2xl opacity-60 group-hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: `${artifact.accentColor}30` }}
                    />
                  )}

                  {/* Top edge accent */}
                  {artifact.unlocked && (
                    <div
                      className="absolute inset-x-0 top-0 h-px opacity-70"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${artifact.accentColor}, transparent)`,
                      }}
                    />
                  )}

                  <div className="relative p-6">
                    {/* Rarity badge */}
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em]"
                        style={{
                          borderColor: rCfg.border,
                          backgroundColor: rCfg.bg,
                          color: artifact.unlocked ? rCfg.color : '#8a8a8a',
                        }}
                      >
                        {rCfg.label}
                      </span>
                      {artifact.unlocked ? (
                        <Star size={14} className="text-gold" />
                      ) : (
                        <Lock size={14} className="text-mid-gray/40" />
                      )}
                    </div>

                    {/* Icon */}
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl border text-3xl transition-transform group-hover:scale-110 ${
                        artifact.unlocked ? '' : 'grayscale opacity-30'
                      }`}
                      style={{
                        borderColor: artifact.unlocked ? `${artifact.accentColor}30` : 'rgba(255,252,242,0.06)',
                        backgroundColor: artifact.unlocked ? `${artifact.accentColor}12` : 'rgba(255,252,242,0.02)',
                      }}
                    >
                      {artifact.icon}
                    </div>

                    {/* Name */}
                    <h3
                      className={`mt-4 font-display text-lg font-bold ${
                        artifact.unlocked ? 'text-warm-white' : 'text-warm-white/30'
                      }`}
                    >
                      {artifact.name}
                    </h3>

                    {/* Region */}
                    <p className="mt-1 text-xs text-mid-gray/60">{artifact.regionName}</p>

                    {/* Description */}
                    <p
                      className={`mt-3 text-[13px] leading-[1.7] line-clamp-2 ${
                        artifact.unlocked ? 'text-warm-white/60' : 'text-warm-white/20'
                      }`}
                    >
                      {artifact.unlocked ? artifact.description : '???  Complete this region to reveal.'}
                    </p>

                    {/* Stat boost */}
                    {artifact.unlocked && (
                      <div className="mt-4 flex items-center gap-2 rounded-lg border border-warm-white/[0.06] bg-warm-white/[0.02] px-3 py-2">
                        <Zap size={12} style={{ color: artifact.accentColor }} />
                        <span className="text-[11px] text-mid-gray">{artifact.statBoost}</span>
                      </div>
                    )}

                    {/* Locked overlay */}
                    {!artifact.unlocked && (
                      <div className="mt-4 flex items-center gap-2 text-[11px] text-mid-gray/50">
                        <Lock size={11} />
                        <span>{artifact.unlockCondition}</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selectedArtifact && (
        <>
          <div
            ref={backdropRef}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] animate-in fade-in duration-200"
            onClick={closeModal}
          />
          <div
            ref={modalRef}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="relative w-full max-w-[520px] rounded-3xl border-2 overflow-hidden pointer-events-auto animate-in zoom-in-95 fade-in duration-300"
              style={{
                borderColor: RARITY_CONFIG[selectedArtifact.rarity].border,
                background: 'linear-gradient(170deg, #1c1c1c 0%, #0a0908 100%)',
              }}
            >
              {/* Top accent */}
              <div
                className="absolute inset-x-0 top-0 h-1"
                style={{
                  background: `linear-gradient(90deg, transparent, ${selectedArtifact.accentColor}, transparent)`,
                }}
              />

              {/* Close */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-mid-gray hover:text-warm-white transition-colors z-10"
              >
                <X size={20} />
              </button>

              {/* Glow */}
              <div
                className="absolute -right-20 -top-20 h-48 w-48 rounded-full blur-3xl opacity-30"
                style={{ backgroundColor: selectedArtifact.accentColor }}
              />

              <div className="relative p-8 pt-10">
                {/* Rarity */}
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{
                    borderColor: RARITY_CONFIG[selectedArtifact.rarity].border,
                    backgroundColor: RARITY_CONFIG[selectedArtifact.rarity].bg,
                    color: RARITY_CONFIG[selectedArtifact.rarity].color,
                  }}
                >
                  <Sparkles size={10} />
                  {selectedArtifact.rarity}
                </span>

                {/* Icon */}
                <div
                  className={`mt-6 flex h-24 w-24 items-center justify-center rounded-3xl border text-5xl ${
                    selectedArtifact.unlocked ? '' : 'grayscale opacity-30'
                  }`}
                  style={{
                    borderColor: `${selectedArtifact.accentColor}30`,
                    backgroundColor: `${selectedArtifact.accentColor}12`,
                  }}
                >
                  {selectedArtifact.icon}
                </div>

                {/* Name */}
                <h2 className="mt-6 font-display text-3xl font-bold text-warm-white">
                  {selectedArtifact.name}
                </h2>
                <p className="mt-1 text-sm text-mid-gray">{selectedArtifact.regionName}</p>

                {/* Description */}
                <p className="mt-5 text-[15px] leading-[1.85] text-warm-white/75">
                  {selectedArtifact.unlocked ? selectedArtifact.description : '??? Complete this region to reveal the artifact\'s secrets.'}
                </p>

                {/* Lore */}
                {selectedArtifact.unlocked && (
                  <div className="mt-5 border-l-[3px] border-gold/40 pl-5">
                    <p className="text-sm leading-[1.8] text-warm-white/50 italic">
                      "{selectedArtifact.lore}"
                    </p>
                  </div>
                )}

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-warm-white/[0.06] bg-warm-white/[0.02] p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap size={13} style={{ color: selectedArtifact.accentColor }} />
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-mid-gray">
                        Stat Boost
                      </span>
                    </div>
                    <p className="text-sm text-warm-white font-medium">{selectedArtifact.statBoost}</p>
                  </div>
                  <div className="rounded-xl border border-warm-white/[0.06] bg-warm-white/[0.02] p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Trophy size={13} className="text-gold" />
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-mid-gray">
                        XP Value
                      </span>
                    </div>
                    <p className="text-sm text-gold font-mono font-bold">+{selectedArtifact.xpValue} XP</p>
                  </div>
                </div>

                {/* Unlock condition */}
                <div className="mt-5 flex items-center gap-3 rounded-xl border border-warm-white/[0.06] bg-warm-white/[0.02] p-4">
                  {selectedArtifact.unlocked ? (
                    <>
                      <Shield size={16} className="text-emerald shrink-0" />
                      <span className="text-sm text-emerald font-semibold">Artifact Unlocked</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} className="text-mid-gray shrink-0" />
                      <span className="text-sm text-mid-gray">{selectedArtifact.unlockCondition}</span>
                    </>
                  )}
                </div>

                {/* CTA */}
                <Link
                  to={`/map`}
                  onClick={closeModal}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-sm font-bold text-near-black uppercase tracking-[0.12em] hover:bg-[#d4b76e] transition-colors"
                >
                  {selectedArtifact.unlocked ? 'View Region' : 'Go to World Map'}
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
