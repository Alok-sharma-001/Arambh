import { useRef, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePlayer } from '@/context/PlayerContext';
import { regions } from '@/data/regions';
import { BookOpen, Check, Circle, ChevronRight, Lock, Sword, Target, X } from 'lucide-react';
import type { Region } from '@/types';

gsap.registerPlugin(ScrollTrigger);

function MapHeader() {
  const { player } = usePlayer();
  const completedRegions = Object.values(player.regionProgress).filter((r) => r.completed).length;
  const progressPercent = (completedRegions / regions.length) * 100;

  return (
    <div className="sticky top-[72px] z-40 bg-near-black/90 backdrop-blur-xl border-b border-gold/10 h-16">
      <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between px-6 lg:px-10">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-gold">WORLD MAP</span>
          <span className="hidden sm:inline text-warm-white/60">|</span>
          <span className="hidden sm:flex items-center gap-2 text-sm text-warm-white">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: regions.find((r) => r.id === player.currentRegion)?.accentColor || '#c8a45e' }} />
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

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center animate-level-pulse">
              <span className="font-mono text-[0.625rem] font-bold text-near-black">{player.level}</span>
            </div>
            <span className="font-mono text-sm text-gold tabular-nums">{player.totalXP.toLocaleString()} XP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegionNode({ region, onClick }: { region: Region; onClick: () => void }) {
  const isCompleted = region.status === 'completed';
  const isCurrent = region.status === 'current';
  const isLocked = region.status === 'locked';
  const isBoss = region.number === 11;

  const completedLessons = isCompleted ? region.lessons.length : isCurrent ? 2 : 0;
  const progressPercent = (completedLessons / region.lessons.length) * 100;
  const glowClass = isCurrent ? 'animate-pulse-glow' : '';

  // Use the region's specific color for completed, gold for active, and subtle for locked
  const borderColor = isCompleted 
    ? `${region.accentColor}50` // 50% opacity of their specific color
    : isCurrent 
      ? '#c8a45e' // Gold for currently active
      : 'rgba(255,252,242,0.08)';

  return (
    <div
      className={`relative cursor-pointer group z-10 ${glowClass}`}
      onClick={onClick}
    >
      <div
        className={`relative w-full overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-2 ${
          isBoss ? 'border-[3px]' : 'border-2'
        }`}
        style={{
          background: isBoss
            ? 'linear-gradient(135deg, rgba(28,28,28,0.98), rgba(20,10,30,0.98))'
            : `linear-gradient(145deg, rgba(28,28,28,0.97), rgba(12,12,12,0.98)), radial-gradient(circle at 20% 0%, ${region.accentColor}22, transparent 45%)`,
          borderColor,
          boxShadow: isCurrent
            ? `0 0 28px ${region.accentColor}35, 0 18px 60px rgba(0,0,0,0.45)`
            : isBoss
              ? '0 0 30px rgba(200,164,94,0.4), 0 0 60px rgba(124,92,255,0.15)'
              : '0 16px 48px rgba(0,0,0,0.35)',
        }}
      >
        <div
          className="absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl transition-opacity duration-300 group-hover:opacity-90"
          style={{ backgroundColor: `${region.accentColor}24` }}
        />
        <div className="absolute inset-x-0 top-0 h-px opacity-70" style={{ background: `linear-gradient(90deg, transparent, ${region.accentColor}, transparent)` }} />

        <div className="relative flex items-start justify-between">
          <span className="font-mono text-xs font-bold text-mid-gray">
            {String(region.number).padStart(2, '0')}
          </span>
          <span
            className="rounded-full border px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.12em]"
            style={{
              borderColor: `${region.accentColor}35`,
              backgroundColor: `${region.accentColor}10`,
              color: isLocked ? '#8a8a8a' : region.accentColor,
            }}
          >
            {isCompleted ? 'Mastered' : isCurrent ? 'Active' : 'Locked'}
          </span>
        </div>

        {/* Region icon (circle with color) */}
        <div
          className="relative mt-4 flex h-14 w-14 items-center justify-center rounded-2xl border"
          style={{ backgroundColor: `${region.accentColor}15`, borderColor: `${region.accentColor}25` }}
        >
          <span style={{ color: region.accentColor }}>
            {region.number === 11 ? <Sword size={24} /> : <span className="font-mono text-lg font-bold">{region.name.charAt(0)}</span>}
          </span>
        </div>

        {/* Region name */}
        <h3 className={`relative mt-4 font-display font-bold text-warm-white ${isBoss ? 'text-xl' : 'text-lg'}`}>
          {region.name}
        </h3>
        <p className="relative mt-1 text-xs text-mid-gray">{region.subtitle}</p>

        <div className="relative mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-warm-white/[0.06] bg-warm-white/[0.025] px-3 py-2">
            <span className="block font-mono text-sm font-bold" style={{ color: region.accentColor }}>{region.lessons.length}</span>
            <span className="text-[0.6rem] uppercase tracking-[0.12em] text-mid-gray">Lessons</span>
          </div>
          <div className="rounded-lg border border-warm-white/[0.06] bg-warm-white/[0.025] px-3 py-2">
            <span className="block font-mono text-sm font-bold text-gold">+{region.bossChallenge.xpReward}</span>
            <span className="text-[0.6rem] uppercase tracking-[0.12em] text-mid-gray">Boss XP</span>
          </div>
        </div>

        {/* Progress mini-bar */}
        <div className="relative mt-4 h-1.5 bg-warm-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: region.accentColor,
            }}
          />
        </div>

        {/* Status */}
        <div className="relative mt-2 flex items-center gap-1.5">
          {isCompleted && <><Check size={12} className="text-emerald" /><span className="text-[0.625rem] uppercase tracking-[0.1em] text-emerald font-semibold">COMPLETED</span></>}
          {isCurrent && <><Circle size={12} className="text-gold fill-gold" /><span className="text-[0.625rem] uppercase tracking-[0.1em] text-gold font-semibold">IN PROGRESS</span></>}
          {isLocked && <><Lock size={12} className="text-mid-gray" /><span className="text-[0.625rem] uppercase tracking-[0.1em] text-mid-gray font-semibold">LOCKED</span></>}
        </div>

        {/* Hover button */}
        {!isLocked && (
          <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span
              className="inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-semibold"
              style={{
                backgroundColor: `${region.accentColor}15`,
                borderColor: `${region.accentColor}40`,
                color: region.accentColor,
              }}
            >
              Open Region <ChevronRight size={14} />
            </span>
          </div>
        )}

        {/* Boss lock overlay */}
        {isBoss && isLocked && (
          <div className="absolute inset-0 bg-near-black/80 backdrop-blur-md z-20 rounded-2xl flex flex-col items-center justify-center">
            <Lock size={32} className="text-mid-gray mb-2" />
            <span className="text-xs text-mid-gray text-center px-4 font-semibold uppercase tracking-wider">Complete All Regions to Unlock</span>
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

  const rp = { completed: region.status === 'completed', lessonsCompleted: region.status === 'completed' ? region.lessons.length : region.status === 'current' ? 2 : 0, totalLessons: region.lessons.length };
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

          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${region.accentColor}15` }}>
            <span className="font-mono text-2xl font-bold" style={{ color: region.accentColor }}>{region.name.charAt(0)}</span>
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
                <button className="mt-4 px-6 py-2.5 bg-gold text-near-black font-semibold text-sm rounded-lg hover:bg-[#d4b76e] transition-colors">
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
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

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

      <div ref={mapRef} className="relative" style={{ height: '4800px' }}>
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
          <path
            ref={pathRef}
            d={buildPath()}
            fill="none"
            stroke="#c8a45e"
            strokeWidth="0.15"
            style={{ filter: 'drop-shadow(0 0 6px rgba(200,164,94,0.4))' }}
          />
          {/* Dimmed upcoming path */}
          <path
            d={buildPath()}
            fill="none"
            stroke="rgba(200,164,94,0.15)"
            strokeWidth="0.15"
          />
        </svg>

        {/* Region Nodes */}
        {regions.map((region) => (
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
              onClick={() => setSelectedRegion(region)}
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

      {/* Region Detail Panel */}
      {selectedRegion && (
        <RegionDetailPanel region={selectedRegion} onClose={() => setSelectedRegion(null)} />
      )}
    </main>
  );
}
