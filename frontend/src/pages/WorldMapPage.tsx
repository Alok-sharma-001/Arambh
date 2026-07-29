import { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePlayer } from '@/context/PlayerContext';
import { useRegionStore } from '@/store/regionStore';
import { regions } from '@/data/regions';
import {
  BookOpen, Check, Circle, ChevronRight, Lock, Sword, Target, X,
  Trees, Gem, RotateCw, Cpu, Boxes, Shield, Zap, FolderGit2, Package, Swords, Layers, Trophy, Sparkles, CheckCircle2, Play
} from 'lucide-react';
import type { Region } from '@/types';
import { NavigationService } from '../core/progression/NavigationService';
import { ProgressValidator } from '../core/progression/ProgressValidator';

gsap.registerPlugin(ScrollTrigger);

const getRegionIcon = (regionId: string) => {
  switch (regionId) {
    case 'variables-forest':
      return <Trees className="w-5 h-5" />;
    case 'data-types-valley':
      return <Gem className="w-5 h-5" />;
    case 'loops-desert':
      return <RotateCw className="w-5 h-5" />;
    case 'functions-mountain':
      return <Cpu className="w-5 h-5" />;
    case 'collections-kingdom':
      return <Boxes className="w-5 h-5" />;
    case 'oop-citadel':
      return <Shield className="w-5 h-5" />;
    case 'exception-abyss':
      return <Zap className="w-5 h-5" />;
    case 'filesystem-ruins':
      return <FolderGit2 className="w-5 h-5" />;
    case 'modules-harbor':
      return <Package className="w-5 h-5" />;
    case 'algorithm-arena':
      return <Swords className="w-5 h-5" />;
    case 'iterator-isles':
      return <Layers className="w-5 h-5" />;
    case 'bossgate-saga':
      return <Trophy className="w-5 h-5" />;
    default:
      return <Sparkles className="w-5 h-5" />;
  }
};

function MapHeader() {
  const navigate = useNavigate();
  const { player } = usePlayer();
  const completedRegions = Object.values(player.regionProgress).filter((r) => r.completed).length;
  const progressPercent = (completedRegions / regions.length) * 100;

  return (
    <div className="sticky top-[72px] z-40 bg-[#09090d]/95 backdrop-blur-xl border-b border-gold/20 shadow-lg">
      <div className="max-w-[1280px] mx-auto flex flex-col px-4 sm:px-6 lg:px-10">
        {/* Top row */}
        <div className="h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-mono text-xs font-black uppercase tracking-[0.18em] text-gold flex items-center gap-1.5">
              <CompassIcon /> World Map
            </span>
            <button
              onClick={() => navigate('/placement-test')}
              className="px-2.5 py-1 rounded-full bg-[#c8a45e]/10 border border-[#c8a45e]/30 text-[#c8a45e] hover:bg-[#c8a45e]/20 text-[11px] font-semibold transition-all flex items-center gap-1"
            >
              <Target className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Skill Assessment</span>
              <span className="xs:hidden">Test</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <div className="w-[180px] h-2 bg-warm-white/[0.08] rounded-full overflow-hidden border border-warm-white/10">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-gold to-amber-500 rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-mid-gray mt-1 block font-mono">
                {completedRegions} of {regions.length} Regions Defeated
              </span>
            </div>

            <div className="flex items-center gap-2 bg-gold/10 px-3 py-1 rounded-xl border border-gold/20">
              <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center text-near-black font-mono text-[10px] font-black">
                {player.level}
              </div>
              <span className="font-mono text-xs text-gold font-bold tabular-nums">
                {player.totalXP.toLocaleString()} XP
              </span>
            </div>
          </div>
        </div>

        {/* Mobile progress bar */}
        <div className="md:hidden pb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-mid-gray font-mono font-bold">
              Kingdom Progress: {completedRegions}/{regions.length}
            </span>
            <span className="text-[10px] text-gold font-mono font-bold">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-warm-white/[0.06] rounded-full overflow-hidden border border-warm-white/10">
            <div
              className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-emerald-400 via-gold to-amber-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function CompassIcon() {
  return (
    <svg className="w-4 h-4 text-gold inline" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function RegionNode({ region, onClick }: { region: Region; onClick: () => void }) {
  const storeRegions = useRegionStore((state) => state.regions);
  const storeRegion = storeRegions[region.id];

  const isCompleted = region.status === 'completed';
  const isCurrent = region.status === 'current';
  const isLocked = region.status === 'locked';
  const isBoss = region.number === 11;

  const completedLessons = isCompleted ? region.lessons.length : (storeRegion?.completedLessons?.length || 0);
  const progressPercent = region.lessons.length > 0 ? (completedLessons / region.lessons.length) * 100 : 0;
  const bossCompleted = storeRegion?.bossStatus === 'completed';
  const bossAvailable = storeRegion?.bossStatus === 'available';

  const accentColor = region.accentColor || '#c8a45e';

  return (
    <div
      id={region.number === 1 ? "world-map-grid" : undefined}
      className="relative cursor-pointer group z-10"
      onClick={onClick}
    >
      <div
        className={`relative w-full overflow-hidden rounded-2xl p-4 transition-all duration-300 ${
          isCurrent
            ? 'shadow-[0_0_30px_rgba(251,191,36,0.22)] border-2 border-gold/70 scale-[1.02]'
            : isCompleted
            ? 'border border-emerald-500/40 hover:border-emerald-400'
            : 'border border-warm-white/[0.08] opacity-85 hover:opacity-100 hover:border-warm-white/20'
        }`}
        style={{
          background: isCurrent
            ? `radial-gradient(circle at 10% 20%, ${accentColor}25, transparent 70%), linear-gradient(145deg, #14141d, #0c0c12)`
            : isCompleted
            ? `radial-gradient(circle at 10% 20%, rgba(52,211,153,0.15), transparent 70%), linear-gradient(145deg, #0e1411, #080b09)`
            : `linear-gradient(145deg, #121218, #09090d)`,
        }}
      >
        {/* Glow orb */}
        <div
          className="absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-100 opacity-50"
          style={{ backgroundColor: `${accentColor}30` }}
        />

        {/* Top Header Row */}
        <div className="relative flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-inner ${
                isCurrent
                  ? 'bg-gold/20 border-gold text-gold shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                  : isCompleted
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-warm-white/5 border-warm-white/10 text-mid-gray/60'
              }`}
            >
              {getRegionIcon(region.id)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] font-black text-mid-gray/70 bg-warm-white/5 px-1.5 py-0.5 rounded">
                  REGION {String(region.number).padStart(2, '0')}
                </span>
              </div>
              <h3 className="font-display font-black text-warm-white tracking-tight truncate text-base mt-0.5">
                {region.name}
              </h3>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${
              isCompleted
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : isCurrent
                ? 'bg-gold/20 border-gold/60 text-gold animate-pulse'
                : 'bg-warm-white/5 border-warm-white/10 text-mid-gray/60'
            }`}
          >
            {isCompleted ? '✓ Mastered' : isCurrent ? 'Active Quest' : 'Locked'}
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-xs text-mid-gray/80 font-medium truncate mb-3 pl-0.5">
          {region.subtitle}
        </p>

        {/* Progress Bar */}
        <div className="relative mb-3">
          <div className="flex items-center justify-between text-[10px] font-mono text-mid-gray mb-1">
            <span>{completedLessons}/{region.lessons.length} Lessons</span>
            <span className="font-bold text-warm-white">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-warm-white/5 p-0.5">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                background: isCompleted
                  ? 'linear-gradient(90deg, #10b981, #34d399)'
                  : isCurrent
                  ? `linear-gradient(90deg, ${accentColor}, #fbbf24)`
                  : '#334155',
              }}
            />
          </div>
        </div>

        {/* Footer info */}
        <div className="relative pt-2 border-t border-warm-white/[0.06] flex items-center justify-between text-xs text-mid-gray font-semibold">
          <span className="flex items-center gap-1.5 text-[11px]">
            {bossCompleted ? (
              <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 size={13} /> Boss Defeated</span>
            ) : bossAvailable ? (
              <span className="text-gold flex items-center gap-1"><Sword size={13} /> Boss Battle Ready</span>
            ) : (
              <span className="text-mid-gray/60 flex items-center gap-1"><Lock size={12} /> Boss Locked</span>
            )}
          </span>

          {!isLocked && (
            <span className="text-gold group-hover:translate-x-1 transition-transform flex items-center gap-1 text-[11px] font-bold">
              Explore <ChevronRight size={14} />
            </span>
          )}
        </div>

        {/* Locked Overlay */}
        {isBoss && isLocked && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-20 rounded-2xl flex flex-col items-center justify-center">
            <Lock size={24} className="text-mid-gray/40 mb-2" />
            <span className="text-xs text-mid-gray/60 font-bold uppercase tracking-widest">Boss Gate Locked</span>
          </div>
        )}
      </div>
    </div>
  );
}

function MobileRegionCard({ region, onClick }: { region: Region; onClick: () => void }) {
  const storeRegions = useRegionStore((state) => state.regions);
  const storeRegion = storeRegions[region.id];

  const isCompleted = region.status === 'completed';
  const isCurrent = region.status === 'current';
  const isLocked = region.status === 'locked';

  const completedLessons = isCompleted ? region.lessons.length : (storeRegion?.completedLessons?.length || 0);
  const progressPercent = region.lessons.length > 0 ? (completedLessons / region.lessons.length) * 100 : 0;
  const accentColor = region.accentColor || '#c8a45e';

  return (
    <div
      onClick={onClick}
      className={`relative w-full rounded-2xl p-5 transition-all cursor-pointer ${
        isCurrent
          ? 'bg-gradient-to-br from-[#1c1810] via-[#121218] to-[#0d0d12] border-2 border-gold/80 shadow-[0_0_35px_rgba(251,191,36,0.25)]'
          : isCompleted
          ? 'bg-gradient-to-br from-[#0c1612] via-[#0b100d] to-[#080b09] border border-emerald-500/40'
          : 'bg-[#101016] border border-warm-white/[0.08] opacity-75 hover:opacity-100'
      }`}
    >
      {/* Background Accent Mesh */}
      <div
        className="absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-md shrink-0 ${
              isCurrent
                ? 'bg-gold/20 border-gold text-gold shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                : isCompleted
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-warm-white/5 border-warm-white/10 text-mid-gray/50'
            }`}
          >
            {getRegionIcon(region.id)}
          </div>
          <div>
            <span className="font-mono text-[10px] font-black uppercase text-gold/80 tracking-widest block">
              REGION {String(region.number).padStart(2, '0')}
            </span>
            <h3 className="font-display font-black text-lg text-warm-white leading-tight">
              {region.name}
            </h3>
          </div>
        </div>

        <span
          className={`shrink-0 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
            isCompleted
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : isCurrent
              ? 'bg-gold/20 border-gold text-gold animate-pulse'
              : 'bg-warm-white/5 border-warm-white/10 text-mid-gray/50'
          }`}
        >
          {isCompleted ? '✓ Mastered' : isCurrent ? 'Active' : 'Locked'}
        </span>
      </div>

      <p className="text-xs text-mid-gray/90 mb-4 leading-relaxed font-sans">
        {region.subtitle}
      </p>

      {/* Progress section */}
      <div className="space-y-1.5 mb-4">
        <div className="flex justify-between text-[11px] font-mono">
          <span className="text-mid-gray font-semibold">{completedLessons} of {region.lessons.length} Lessons</span>
          <span className="font-bold text-gold">{Math.round(progressPercent)}%</span>
        </div>
        <div className="h-2.5 bg-black/60 rounded-full overflow-hidden p-0.5 border border-warm-white/10">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progressPercent}%`,
              background: isCompleted
                ? 'linear-gradient(90deg, #10b981, #34d399)'
                : isCurrent
                ? `linear-gradient(90deg, ${accentColor}, #fbbf24)`
                : '#334155',
            }}
          />
        </div>
      </div>

      {/* Action Button */}
      {!isLocked && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className={`w-full py-3 rounded-xl font-extrabold uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
            isCurrent
              ? 'bg-[#d4b76e] text-near-black hover:bg-[#c4a75e] shadow-[0_0_20px_rgba(212,183,110,0.3)]'
              : 'bg-warm-white/10 text-warm-white hover:bg-warm-white/20 border border-warm-white/10'
          }`}
        >
          {isCurrent ? (
            <>
              <Play size={14} className="fill-near-black" /> Resume Quest
            </>
          ) : (
            <>
              <BookOpen size={14} /> View Region Lessons
            </>
          )}
        </button>
      )}
    </div>
  );
}

function RegionDetailPanel({ region, onClose }: { region: Region; onClose: () => void }) {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const accentColor = region.accentColor || '#c8a45e';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(panelRef.current, { x: '100%' }, { x: '0%', duration: 0.4, ease: 'expo.out' });

      const inner = panelRef.current?.querySelectorAll('.panel-inner');
      if (inner) {
        gsap.fromTo(inner, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, delay: 0.2 });
      }
    });

    return () => ctx.revert();
  }, []);

  const handleClose = () => {
    gsap.to(panelRef.current, { x: '100%', duration: 0.3, ease: 'power2.in' });
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.3, onComplete: onClose });
  };

  const lessonsCompleted = region.lessons.filter((l) => l.status === 'completed').length;
  const progressPercent = (lessonsCompleted / region.lessons.length) * 100;

  return (
    <>
      <div ref={backdropRef} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]" onClick={handleClose} />
      <div
        id="region-detail-panel"
        ref={panelRef}
        className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-[#0c0c12] backdrop-blur-2xl border-l border-gold/30 z-[60] flex flex-col text-warm-white shadow-2xl"
      >
        {/* Header */}
        <div className="panel-inner p-6 sm:p-8 border-b border-warm-white/[0.08] relative">
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-mid-gray hover:text-gold hover:bg-warm-white/10 transition-all"
          >
            <X size={24} />
          </button>

          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg"
            style={{ backgroundColor: `${accentColor}20`, borderColor: `${accentColor}40`, color: accentColor }}
          >
            {getRegionIcon(region.id)}
          </div>

          <h2 className="mt-4 font-display font-black text-2xl text-warm-white">{region.name}</h2>
          <p className="text-xs text-mid-gray mt-1 font-sans leading-relaxed">{region.subtitle}</p>

          <div className="mt-4">
            <div className="flex justify-between text-xs font-mono mb-1 text-mid-gray">
              <span>Lessons Progress</span>
              <span className="text-gold font-bold">{lessonsCompleted}/{region.lessons.length}</span>
            </div>
            <div className="h-2 bg-black/60 rounded-full overflow-hidden border border-warm-white/10 p-0.5">
              <div
                className="h-full rounded-full transition-all bg-gradient-to-r from-emerald-400 to-gold"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="panel-inner flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
          {/* Lore */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-gold mb-2">About This Region</h4>
            <p className="text-xs text-mid-gray/90 leading-relaxed font-sans">{region.lore}</p>
          </div>

          {/* Lessons list */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-gold mb-3">Lessons ({region.lessons.length})</h4>
            <div className="space-y-2">
              {region.lessons.map((lesson) => {
                const isLocked = lesson.status === 'locked';
                return (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      if (!isLocked) {
                        NavigationService.openRegion(region.id);
                      }
                    }}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                      isLocked
                        ? 'opacity-40 bg-black/20 border-warm-white/5 cursor-not-allowed'
                        : 'cursor-pointer bg-[#14141e] border-warm-white/[0.08] hover:border-gold/40 hover:bg-gold/[0.04]'
                    }`}
                  >
                    <span className="font-mono text-xs font-bold text-mid-gray w-6">
                      {String(lesson.number).padStart(2, '0')}
                    </span>
                    <span className="flex-1 text-xs font-bold text-warm-white">{lesson.title}</span>
                    {lesson.status === 'completed' && <Check size={16} className="text-emerald-400 shrink-0" />}
                    {lesson.status === 'current' && <Circle size={16} className="text-gold fill-gold shrink-0" />}
                    {lesson.status === 'locked' && <Lock size={14} className="text-mid-gray shrink-0" />}
                    <span className="font-mono text-[11px] font-bold text-gold shrink-0">+{lesson.xpReward} XP</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Boss Challenge */}
          <div>
            <div className="rounded-2xl p-6 bg-gradient-to-br from-red-950/40 via-[#180e14] to-[#100a0e] border border-red-500/30 relative overflow-hidden shadow-lg">
              <span className="inline-block px-3 py-1 bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.15em] rounded-full mb-3 border border-red-500/30">
                ⚔️ BOSS BATTLE
              </span>
              <h4 className="font-display font-black text-lg text-white">{region.bossChallenge.title}</h4>
              <p className="text-xs text-mid-gray mt-2 leading-relaxed">{region.bossChallenge.description}</p>
              <div className="mt-3 flex items-center gap-4 font-mono text-xs text-gold font-bold">
                <span>+{region.bossChallenge.xpReward} XP</span>
                <span>+1 {region.bossChallenge.artifactReward}</span>
              </div>
              {region.bossChallenge.locked ? (
                <p className="mt-3 text-xs text-mid-gray/60 font-mono font-bold">🔒 Complete all lessons to unlock Boss Battle</p>
              ) : (
                <button
                  onClick={() => NavigationService.goToBoss(region.id)}
                  className="mt-4 w-full py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Sword size={16} /> START BOSS BATTLE
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="panel-inner p-6 border-t border-warm-white/[0.08] space-y-2.5">
          <button
            onClick={() => {
              NavigationService.openRegion(region.id);
            }}
            className="w-full py-3.5 bg-[#d4b76e] text-near-black font-extrabold text-xs uppercase tracking-wider rounded-xl hover:bg-[#c4a75e] shadow-md transition-all flex items-center justify-center gap-2"
          >
            <BookOpen size={16} /> Start Learning
          </button>
          <button
            onClick={() => navigate(`/training/${region.id}`)}
            className="w-full py-3 bg-warm-white/5 border border-warm-white/10 text-warm-white font-bold text-xs uppercase tracking-wider rounded-xl hover:border-gold/40 hover:text-gold transition-all flex items-center justify-center gap-2"
          >
            <Target size={16} /> Training Ground
          </button>
        </div>
      </div>
    </>
  );
}

export default function WorldMapPage() {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const { player } = usePlayer();
  const { regions: storeRegions } = useRegionStore();
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  useEffect(() => {
    sessionStorage.setItem('mapSource', 'map');
  }, []);

  // Enrich regions with player state
  const enrichedRegions = regions.map((region) => {
    const storeRegion = storeRegions[region.id];
    const regionStatus = storeRegion?.regionStatus || (region.id === 'variables-forest' ? 'available' : 'locked');
    const isCompleted = regionStatus === 'completed';
    const isCurrent = player.currentRegion === region.id;
    const isLocked = regionStatus === 'locked' && !isCurrent && !isCompleted;

    const status: 'completed' | 'current' | 'locked' = isCompleted ? 'completed' : isCurrent ? 'current' : 'locked';

    // Enrich lessons
    const completedLessons = storeRegion?.completedLessons || [];
    let foundCurrent = false;

    const enrichedLessons = region.lessons.map((lesson) => {
      let lessonStatus: 'completed' | 'current' | 'locked' = 'locked';
      if (isCompleted || completedLessons.includes(lesson.id)) {
        lessonStatus = 'completed';
      } else if (!isLocked && !foundCurrent) {
        lessonStatus = 'current';
        foundCurrent = true;
      }
      return { ...lesson, status: lessonStatus };
    });

    const isBossLocked = !isCompleted && completedLessons.length < region.lessons.length;

    return {
      ...region,
      status,
      lessons: enrichedLessons,
      bossChallenge: {
        ...region.bossChallenge,
        locked: isBossLocked
      }
    };
  });

  const selectedRegion = selectedRegionId
    ? enrichedRegions.find((r) => r.id === selectedRegionId) || null
    : null;

  // Build SVG path through all regions
  const buildPath = useCallback(() => {
    const sorted = [...regions].sort((a, b) => a.number - b.number);
    let d = `M ${sorted[0].position.x} ${sorted[0].position.y}`;
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      const cpx1 = prev.position.x + (curr.position.x - prev.position.x) * 0.5;
      const cpy1 = prev.position.y;
      const cpx2 = prev.position.x + (curr.position.x - prev.position.x) * 0.5;
      const cpy2 = curr.position.y;
      d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.position.x} ${curr.position.y}`;
    }
    return d;
  }, []);

  // Scroll-driven path animation
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: mapRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  // Region entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const nodes = mapRef.current?.querySelectorAll('.region-node-wrapper');
      nodes?.forEach((node) => {
        gsap.fromTo(node, { opacity: 0, scale: 0.9, xPercent: -50, y: 20 }, {
          opacity: 1, scale: 1, xPercent: -50, y: 0, duration: 0.5, ease: 'expo.out',
          scrollTrigger: { trigger: node, start: 'top 80%', toggleActions: 'play none none none' },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <main className="bg-[#07070a] min-h-screen">
      <MapHeader />

      {/* Desktop view */}
      <div className="hidden lg:block">
        <div ref={mapRef} className="relative pb-40" style={{ height: '4800px' }}>
          {/* Grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,252,242,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,252,242,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />

          {/* SVG Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d={buildPath()}
              fill="none"
              stroke="rgba(200,164,94,0.2)"
              strokeWidth="0.18"
            />
            <path
              ref={pathRef}
              d={buildPath()}
              fill="none"
              stroke="#d4b76e"
              strokeWidth="0.2"
              style={{ filter: 'drop-shadow(0 0 8px rgba(212,183,110,0.6))' }}
            />
          </svg>

          {/* Region Nodes */}
          {enrichedRegions.map((region) => (
            <div
              key={region.id}
              className="region-node-wrapper absolute z-10"
              style={{
                left: `${region.position.x}%`,
                top: `${region.position.y}%`,
                transform: 'translateX(-50%)',
                width: region.number === 11 ? 'min(340px, calc(100vw - 48px))' : 'min(280px, calc(100vw - 48px))',
              }}
            >
              <RegionNode
                region={region}
                onClick={() => {
                  if (ProgressValidator.isRegionUnlocked(region.id)) {
                    setSelectedRegionId(region.id);
                  }
                }}
              />
            </div>
          ))}

          {/* Ambient symbols */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className="absolute font-mono text-gold/[0.08] text-sm animate-float"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${4 + Math.random() * 4}s`,
                }}
              >
                {['{', '}', '[', ']', '(', ')'][i % 6]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile view */}
      <div className="block lg:hidden max-w-md mx-auto px-4 pt-6 pb-28 space-y-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-gold font-display">
            ⚔️ Python Kingdom Regions
          </h2>
          <span className="text-[11px] font-mono text-mid-gray">
            12 Epic Domains
          </span>
        </div>

        {enrichedRegions.map((region) => (
          <MobileRegionCard
            key={region.id}
            region={region}
            onClick={() => {
              if (ProgressValidator.isRegionUnlocked(region.id)) {
                setSelectedRegionId(region.id);
              }
            }}
          />
        ))}
      </div>

      {/* Region Detail Panel */}
      {selectedRegion && (
        <RegionDetailPanel region={selectedRegion} onClose={() => setSelectedRegionId(null)} />
      )}
    </main>
  );
}
