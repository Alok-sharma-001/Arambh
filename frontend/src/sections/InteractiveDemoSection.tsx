import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CategoryPill from '@/components/CategoryPill';
import SyntaxHighlighter from '@/components/SyntaxHighlighter';

gsap.registerPlugin(ScrollTrigger);

const DEMO_CODE = `hero = "You"
xp = 0
quest = "Learn Python"

print(f"{hero} started {quest}!")`;

export default function InteractiveDemoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const codeBlockRef = useRef<HTMLDivElement>(null);
  const [codeVisible, setCodeVisible] = useState(false);
  const [outputVisible, setOutputVisible] = useState(false);
  const [displayedCode, setDisplayedCode] = useState('');

  // Typing animation
  useEffect(() => {
    if (!codeVisible) return;

    let index = 0;
    let lineIndex = 0;
    const lines = DEMO_CODE.split('\n');

    const typeNextChar = () => {
      if (lineIndex >= lines.length) {
        setTimeout(() => setOutputVisible(true), 300);
        return;
      }

      const currentLine = lines[lineIndex];
      if (index < currentLine.length) {
        index++;
        setDisplayedCode(lines.slice(0, lineIndex).join('\n') + (lineIndex > 0 ? '\n' : '') + currentLine.slice(0, index));
        setTimeout(typeNextChar, 30);
      } else {
        lineIndex++;
        index = 0;
        setTimeout(typeNextChar, 200);
      }
    };

    const timer = setTimeout(typeNextChar, 500);
    return () => clearTimeout(timer);
  }, [codeVisible]);

  // Scroll-triggered entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      const leftCol = sectionRef.current?.querySelector('.demo-left');
      const rightCol = sectionRef.current?.querySelector('.demo-right');

      if (leftCol) {
        gsap.fromTo(leftCol, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.6, ease: 'expo.out',
          scrollTrigger: { trigger: leftCol, start: 'top 85%', toggleActions: 'play none none none' },
          onComplete: () => setCodeVisible(true),
        });
      }

      if (rightCol) {
        gsap.fromTo(rightCol, { opacity: 0, scale: 0.95 }, {
          opacity: 1, scale: 1, duration: 0.8, ease: 'expo.out', delay: 0.2,
          scrollTrigger: { trigger: rightCol, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }

      // SVG bracket stroke animation
      const brackets = sectionRef.current?.querySelectorAll('.bracket-svg');
      brackets?.forEach((bracket) => {
        const path = bracket.querySelector('path');
        if (path) {
          const length = (path as SVGPathElement).getTotalLength?.() || 300;
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(path, {
            strokeDashoffset: 0, duration: 1.5, ease: 'expo.out',
            scrollTrigger: { trigger: bracket, start: 'top 70%', toggleActions: 'play none none none' },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-near-black py-[120px] px-6 lg:px-20 relative overflow-hidden">
      {/* Purple glow behind illustration */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[80%] pointer-events-none"
        style={{ background: 'radial-gradient(circle at 75% 50%, rgba(124,92,255,0.06) 0%, transparent 50%)' }}
      />

      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-16 items-center">
          {/* Left - Code Visualizer */}
          <div className="demo-left relative">
            <CategoryPill text="VISUAL EXECUTION" />
            <h2 className="mt-6 font-display font-bold text-warm-white" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              See Your Code Come Alive
            </h2>

            <div className="mt-8 relative" ref={codeBlockRef}>
              {/* Decorative brackets */}
              <svg className="bracket-svg absolute -left-6 top-4 w-8 h-32 text-gold/20" viewBox="0 0 30 120" fill="none">
                <path d="M25 5 Q5 5 5 30 L5 90 Q5 115 25 115" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
              <svg className="bracket-svg absolute -right-6 top-4 w-8 h-32 text-gold/20" viewBox="0 0 30 120" fill="none">
                <path d="M5 5 Q25 5 25 30 L25 90 Q25 115 5 115" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>

              {/* Code window */}
              <div className="bg-dark-surface border border-warm-white/[0.08] rounded-xl overflow-hidden">
                {/* Window chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-warm-white/[0.06]">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>

                {/* Code area */}
                <div className="p-6 min-h-[200px]">
                  <div className="flex">
                    {/* Line numbers */}
                    <div className="w-10 pr-4 text-right font-mono text-xs text-warm-white/15 select-none shrink-0">
                      {displayedCode.split('\n').map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    {/* Code */}
                    <div className="flex-1 overflow-x-auto">
                      <SyntaxHighlighter code={displayedCode || ' '} />
                      {!codeVisible && (
                        <span className="inline-block w-2 h-4 bg-gold/60 animate-pulse ml-0.5" />
                      )}
                    </div>
                  </div>

                  {/* Output */}
                  {outputVisible && (
                    <div className="mt-4 bg-code-editor-bg rounded-lg px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <span className="font-mono text-sm text-emerald">{`>>> You started Learn Python!`}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Illustration */}
          <div className="demo-right relative">
            <div className="relative">
              <img
                src="/assets/demo-hero-illustration.jpg"
                alt="Hero character facing a code boss monster"
                className="w-full max-w-[500px] mx-auto rounded-2xl"
              />

              {/* Floating badges */}
              <div className="absolute -top-2 -right-2 animate-float" style={{ animationDelay: '0s' }}>
                <span className="inline-block px-3 py-1 bg-gold text-near-black font-mono text-xs font-bold rounded-full">
                  +150 XP
                </span>
              </div>

              <div className="absolute bottom-8 -left-4 animate-float" style={{ animationDelay: '1s' }}>
                <div className="w-10 h-10 rounded-full bg-royal-purple/20 border border-royal-purple flex items-center justify-center">
                  <span className="font-mono text-xs font-bold text-royal-purple">05</span>
                </div>
              </div>

              <div className="absolute bottom-4 -right-2 animate-float" style={{ animationDelay: '2s' }}>
                <span className="inline-block px-2.5 py-1 bg-emerald/15 border border-emerald text-emerald text-[0.625rem] font-semibold uppercase rounded-lg">
                  BOSS SLAIN
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
