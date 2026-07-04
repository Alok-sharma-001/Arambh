import { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePlayer } from '@/context/PlayerContext';
import { useRegionStore } from '@/store/regionStore';
import { regions } from '@/data/regions';
import { BookOpen, Check, Circle, ChevronRight, Lock, Sword, Target, X } from 'lucide-react';
import type { Region } from '@/types';

gsap.registerPlugin(ScrollTrigger);

const getThemeColors = (status: 'completed' | 'current' | 'locked') => {
  if (status === 'completed') {
    return {
      accent: '#5682B1', // Steel Blue
    };
  }
  if (status === 'current') {
    return {
      accent: '#FFE8DB', // Peach
    };
  }
  // Locked
  return {
    accent: '#739EC9', // Light Steel Blue
  };
};

function MapHeader() {
  const { player } = usePlayer();
  const completedRegions = Object.values(player.regionProgress).filter((r) => r.completed).length;
  const progressPercent = (completedRegions / regions.length) * 100;

  return (
    <div className="sticky top-[72px] z-40 bg-near-black/90 backdrop-blur-xl border-b border-gold/10">
      <div className="max-w-[1280px] mx-auto flex flex-col px-6 lg:px-10">
        {/* Top row */}
        <div className="h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-gold">WORLD MAP</span>
            <span className="hidden sm:inline text-warm-white/60">|</span>
            <span className="hidden sm:flex items-center gap-2 text-sm text-warm-white">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getThemeColors('current').accent }} />
              {regions.find((r) => r.id === player.currentRegion)?.name}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <div className="w-[200px] h-1.5 bg-warm-white/[0.08] rounded-full overflow-hidden">
                <div
                   className="h-full gradient-completion-bar rounded-full transition-all duration-1000"
                   style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[0.625rem] text-mid-gray mt-1 block">Region {completedRegions} of {regions.length}</span>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center animate-level-pulse">
                <span className="font-mono text-[0.625rem] font-bold text-near-black">{player.level}</span>
              </div>
              <span className="font-mono text-sm text-gold tabular-nums">{player.totalXP.toLocaleString()} XP</span>
            </div>
          </div>
        </div>

        {/* Mobile progress bar (visible only on small screens) */}
        <div className="sm:hidden pb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-mid-gray font-mono font-bold">
              Region {completedRegions} of {regions.length}
            </span>
            <span className="text-[10px] text-gold font-mono font-bold">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="w-full h-1 bg-warm-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${progressPercent}%`,
                background: 'linear-gradient(90deg, #5682B1, #FFE8DB)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
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

  const glowClass = isCurrent ? 'animate-pulse-glow' : '';

  const themeColors = getThemeColors(region.status);
  const accentColor = themeColors.accent;

  // Use the theme's colors for borders and shadows
  const borderColor = isCompleted 
    ? `${accentColor}50` // 50% opacity
    : isCurrent 
      ? '#FFE8DB' // Peach for currently active
      : 'rgba(115,158,201,0.08)';

  return (
    <div
      id={region.number === 1 ? "world-map-grid" : undefined}
      className={`relative cursor-pointer group z-10 ${glowClass}`}
      onClick={onClick}
    >
      <div
        className="relative w-full overflow-hidden rounded-xl p-3.5 transition-apple-fast hover:-translate-y-1"
        style={{
          background: isBoss
            ? 'linear-gradient(135deg, rgba(20,20,20,0.98), rgba(15,8,22,0.98))'
            : `linear-gradient(145deg, rgba(20,20,20,0.97), rgba(10,10,10,0.98)), radial-gradient(circle at 20% 0%, ${accentColor}18, transparent 40%)`,
          borderColor,
          boxShadow: isCurrent
            ? `0 0 20px ${accentColor}25, 0 8px 30px rgba(0,0,0,0.4)`
            : isBoss
              ? '0 0 20px rgba(255,232,219,0.25), 0 0 40px rgba(86,130,177,0.1)'
              : '0 8px 24px rgba(0,0,0,0.3)',
        }}
      >
        <div
          className="absolute -right-12 -top-12 h-28 w-28 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-90"
          style={{ backgroundColor: `${accentColor}15` }}
        />
        <div className="absolute inset-x-0 top-0 h-px opacity-60" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />

        {/* ROW 1: Icon, Title, Status Badge */}
        <div className="relative flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Shrunk Icon */}
            <div
              className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border"
              style={{ backgroundColor: `${accentColor}10`, borderColor: `${accentColor}15` }}
            >
              <span style={{ color: accentColor }}>
                {isBoss ? <Sword size={14} /> : <span className="font-mono text-xs font-bold">{region.name.charAt(0)}</span>}
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[9px] font-bold text-mid-gray/50">
                  {String(region.number).padStart(2, '0')}
                </span>
                <span className="text-warm-white/20 text-[8px]">•</span>
                <h3 className="font-display font-extrabold text-warm-white tracking-tight truncate text-sm leading-none">
                  {region.name}
                </h3>
              </div>
            </div>
          </div>

          <span
            className="shrink-0 rounded-full border px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider"
            style={{
              borderColor: `${accentColor}20`,
              backgroundColor: `${accentColor}05`,
              color: isLocked ? '#739EC9' : accentColor,
            }}
          >
            {isCompleted ? 'Mastered' : isCurrent ? 'Active' : 'Locked'}
          </span>
        </div>

        {/* ROW 2: Subtitle */}
        <p className="text-[10px] text-mid-gray/60 font-medium truncate mt-1.5 pl-0.5">
          {region.subtitle}
        </p>

        {/* ROW 3: Thinner Progress Bar with Inline percentage */}
        <div className="relative mt-2.5 flex items-center gap-2.5">
          <div className="flex-1 relative h-[3px] bg-warm-white/[0.03] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: accentColor,
              }}
            />
          </div>
          <span className="text-[9px] font-mono text-mid-gray/50 font-bold shrink-0 min-w-[22px] text-right">
            {Math.round(progressPercent)}%
          </span>
        </div>

        {/* ROW 4: Footer stats and navigation */}
        <div className="relative mt-2.5 pt-2 border-t border-warm-white/5 flex items-center justify-between gap-2">
          {/* Mini Inline Stats (Lessons, Boss Status) */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-mid-gray/60 pl-0.5">
            <span>{completedLessons}/{region.lessons.length} Lessons</span>
            <span className="text-warm-white/10">•</span>
            <span>{bossCompleted ? 'Defeated' : bossAvailable ? 'Boss Ready' : 'Boss Locked'}</span>
          </div>

          {!isLocked && (
            <ChevronRight size={12} className="text-mid-gray/40 group-hover:text-warm-white transition-colors" />
          )}
        </div>

        {/* Boss lock overlay */}
        {isBoss && isLocked && (
          <div className="absolute inset-0 bg-near-black/90 backdrop-blur-md z-20 rounded-xl flex flex-col items-center justify-center">
            <Lock size={20} className="text-mid-gray/50 mb-1" />
            <span className="text-[9px] text-mid-gray/50 text-center px-4 font-bold uppercase tracking-widest">Locked</span>
          </div>
        )}
      </div>
    </div>
  );
}

function RegionDetailPanel({ region, onClose }: { region: Region; onClose: () => void }) {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const themeColors = getThemeColors(region.status);
  const accentColor = themeColors.accent;

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
  const rp = { completed: region.status === 'completed', lessonsCompleted, totalLessons: region.lessons.length };
  const progressPercent = (rp.lessonsCompleted / rp.totalLessons) * 100;

  return (
    <>
      <div ref={backdropRef} className="fixed inset-0 bg-black/50 z-[60]" onClick={handleClose} />
      <div
        ref={panelRef}
        className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-[#0f0f0f]/98 backdrop-blur-xl border-l-2 border-gold/15 z-[60] flex flex-col"
      >
        {/* Header */}
        <div className="panel-inner p-8 border-b border-warm-white/[0.06]">
          <button onClick={handleClose} className="absolute top-6 right-6 text-mid-gray hover:text-gold hover:rotate-90 transition-all duration-300 text-3xl font-light">
            <X size={28} />
          </button>

          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}15` }}>
            <span className="font-mono text-2xl font-bold" style={{ color: accentColor }}>{region.name.charAt(0)}</span>
          </div>

          <h2 className="mt-4 font-display font-bold text-2xl text-warm-white">{region.name}</h2>
          <p className="text-sm text-mid-gray mt-1">{region.subtitle}</p>

          <div className="mt-4">
            <div className="h-2 bg-warm-white/[0.08] rounded-full overflow-hidden">
              <div className="h-full gradient-completion-bar rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-xs text-mid-gray mt-1">{rp.lessonsCompleted} of {rp.totalLessons} lessons completed</span>
          </div>
        </div>

        {/* Body */}
        <div className="panel-inner flex-1 overflow-y-auto p-8">
          {/* Lore */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-mid-gray mb-3">About This Region</h4>
            <p className="text-sm text-mid-gray leading-relaxed">{region.lore}</p>
          </div>

          {/* Lessons */}
          <div className="mt-8">
            <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-mid-gray mb-3">Lessons</h4>
            <div className="space-y-0">
              {region.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 py-3 border-b border-warm-white/[0.04] hover:bg-warm-white/[0.02] transition-colors px-2 -mx-2 rounded"
                >
                  <span className="font-mono text-xs text-mid-gray w-6">{String(lesson.number).padStart(2, '0')}</span>
                  <span className="flex-1 text-sm text-warm-white">{lesson.title}</span>
                  {lesson.status === 'completed' && <Check size={16} className="text-emerald shrink-0" />}
                  {lesson.status === 'current' && <Circle size={16} className="text-gold fill-gold shrink-0" />}
                  {lesson.status === 'locked' && <Lock size={16} className="text-mid-gray shrink-0" />}
                  <span className="font-mono text-xs text-gold">+{lesson.xpReward} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Boss Challenge */}
          <div className="mt-8">
            <div className="gradient-boss-card rounded-2xl p-6">
              <span className="inline-block px-3 py-1 bg-warm-white/15 text-warm-white text-[0.625rem] font-semibold uppercase tracking-[0.1em] rounded-full mb-3">
                BOSS CHALLENGE
              </span>
              <h4 className="font-display font-bold text-lg text-white">{region.bossChallenge.title}</h4>
              <p className="text-sm text-warm-white/80 mt-2">{region.bossChallenge.description}</p>
              <div className="mt-3 flex items-center gap-4 font-mono text-sm text-gold">
                <span>+{region.bossChallenge.xpReward} XP</span>
                <span>+1 {region.bossChallenge.artifactReward}</span>
              </div>
              {region.bossChallenge.locked ? (
                <p className="mt-3 text-xs text-warm-white/50">LOCKED — Complete all lessons first</p>
              ) : (
                <button 
                  onClick={() => navigate(`/region/${region.id}/boss`)}
                  className="mt-4 px-6 py-2.5 bg-gold text-near-black font-semibold text-sm rounded-lg hover:bg-[#d4b76e] transition-colors"
                >
                  START BOSS
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="panel-inner space-y-3 p-6 border-t border-warm-white/[0.06]">
          <button
            onClick={() => {
              const currentLesson = region.lessons.find((l) => l.status === 'current') || region.lessons[0];
              navigate(`/lesson/${region.id}/${currentLesson.id}`);
            }}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-gold text-near-black font-body font-semibold text-sm uppercase tracking-[0.1em] rounded-lg hover:bg-[#d4b76e] transition-colors"
          >
            <BookOpen size={16} />
            Start Learning
          </button>
          <button
            onClick={() => navigate(`/training/${region.id}`)}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-warm-white/[0.06] text-warm-white border border-warm-white/[0.08] font-body font-semibold text-sm uppercase tracking-[0.1em] rounded-lg hover:border-gold/30 hover:text-gold transition-colors"
          >
            <Target size={16} />
            Training Ground
          </button>
        </div>
      </div>
    </>
  );
}



export default function WorldMapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const { player } = usePlayer();
  const { regions: storeRegions } = useRegionStore();
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

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
    <main className="bg-near-black min-h-screen">
      <MapHeader />

      {/* Desktop view */}
      <div className="hidden lg:block">
        <div ref={mapRef} className="relative pb-40" style={{ height: '4800px' }}>
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,252,242,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,252,242,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />

          {/* SVG Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Full route path (always visible as a faint guide) */}
            <path
              d={buildPath()}
              fill="none"
              stroke="rgba(155,184,216,0.3)"
              strokeWidth="0.15"
            />
            {/* Animated bright path (draws on scroll) */}
            <path
              ref={pathRef}
              d={buildPath()}
              fill="none"
              stroke="#9BB8D8"
              strokeWidth="0.15"
              style={{ filter: 'drop-shadow(0 0 6px rgba(155,184,216,0.4))' }}
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
                width: region.number === 11 ? 'min(320px, calc(100vw - 48px))' : 'min(260px, calc(100vw - 48px))',
              }}
            >
              <RegionNode
                region={region}
                onClick={() => setSelectedRegionId(region.id)}
              />
            </div>
          ))}

          {/* Ambient floating symbols */}
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

      {/* Mobile/Tablet view */}
      <div className="block lg:hidden max-w-lg mx-auto px-4 pt-6 pb-24 space-y-4">
        {enrichedRegions.map((region) => (
          <RegionNode
            key={region.id}
            region={region}
            onClick={() => setSelectedRegionId(region.id)}
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
