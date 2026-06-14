import { useEffect, useState } from 'react';

/**
 * SplashScreen – A cinematic intro page that shows the "Arambh" brand
 * with a glowing logo animation before transitioning to the main app.
 *
 * Shows once per session (sessionStorage flag).
 */
export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'logo' | 'text' | 'exit'>('logo');

  useEffect(() => {
    // Phase 1 → 2: reveal text after logo animates
    const t1 = setTimeout(() => setPhase('text'), 900);
    // Phase 2 → 3: begin exit
    const t2 = setTimeout(() => setPhase('exit'), 2800);
    // Complete: unmount
    const t3 = setTimeout(() => onComplete(), 3400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-near-black transition-opacity duration-600 ${
        phase === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Radial glow behind logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={`h-[400px] w-[400px] rounded-full transition-all duration-1000 ${
            phase === 'logo'
              ? 'scale-50 opacity-0'
              : 'scale-100 opacity-100'
          }`}
          style={{
            background:
              'radial-gradient(circle, rgba(200,164,94,0.15) 0%, rgba(200,164,94,0.04) 40%, transparent 70%)',
          }}
        />
      </div>

      {/* Logo Mark – Stylised Compass / Shield */}
      <div
        className={`relative transition-all duration-700 ease-out ${
          phase === 'logo'
            ? 'scale-75 opacity-0 translate-y-4'
            : 'scale-100 opacity-100 translate-y-0'
        }`}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_30px_rgba(200,164,94,0.4)]"
        >
          {/* Outer ring */}
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="#c8a45e"
            strokeWidth="1.5"
            opacity="0.4"
          />
          {/* Inner ring */}
          <circle
            cx="40"
            cy="40"
            r="28"
            stroke="#c8a45e"
            strokeWidth="1"
            opacity="0.2"
          />
          {/* Diamond / compass shape */}
          <path
            d="M40 12L52 40L40 68L28 40Z"
            stroke="#c8a45e"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M12 40L40 28L68 40L40 52Z"
            stroke="#c8a45e"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
          {/* Center gem */}
          <circle cx="40" cy="40" r="5" fill="#c8a45e" opacity="0.9" />
          <circle cx="40" cy="40" r="2.5" fill="#0a0908" />
        </svg>
      </div>

      {/* Brand Text */}
      <div
        className={`mt-8 text-center transition-all duration-700 ease-out ${
          phase === 'text' || phase === 'exit'
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-6'
        }`}
      >
        <h1
          className="font-display text-5xl md:text-6xl font-bold tracking-[0.08em] text-transparent bg-clip-text"
          style={{
            backgroundImage:
              'linear-gradient(135deg, #c8a45e 0%, #e8d5a3 40%, #c8a45e 60%, #a88a3e 100%)',
          }}
        >
          ARAMBH
        </h1>
        <p className="mt-3 text-sm tracking-[0.3em] uppercase text-mid-gray/70 font-medium">
          Begin your Python Quest
        </p>
      </div>

      {/* Subtle loading bar */}
      <div className="absolute bottom-16 w-40 h-[2px] bg-warm-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full bg-gold/60 rounded-full transition-all ease-linear"
          style={{
            width: phase === 'logo' ? '0%' : phase === 'text' ? '70%' : '100%',
            transitionDuration: phase === 'text' ? '1900ms' : '600ms',
          }}
        />
      </div>
    </div>
  );
}
