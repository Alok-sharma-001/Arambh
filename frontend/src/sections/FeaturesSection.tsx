import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    number: '01',
    title: 'Visual Execution Engine',
    description: 'Watch your code come alive. Every variable assignment, loop iteration, and function call is visualized in real-time, turning abstract concepts into concrete understanding.',
  },
  {
    number: '02',
    title: 'RPG Progression System',
    description: 'Earn XP, level up, collect artifacts, and unlock new regions. Your learning journey becomes an epic quest with tangible milestones and rewarding achievements.',
  },
  {
    number: '03',
    title: 'Boss Battle Challenges',
    description: "Test your skills in epic coding battles. Each Boss Challenge combines multiple concepts into a single epic encounter that validates your mastery before you advance.",
  },
  {
    number: '04',
    title: 'Knowledge Library',
    description: 'A comprehensive Python reference built for learners. From basic syntax to advanced patterns — every concept explained with interactive examples and clear explanations.',
  },
  {
    number: '05',
    title: 'AI Mentor',
    description: "Stuck on a challenge? Your AI Mentor provides hints, explains concepts, and guides you toward the solution without giving away the answer. Learn, don't copy.",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const header = sectionRef.current?.querySelector('.features-header');
      const cards = sectionRef.current?.querySelectorAll('.feature-card');

      if (header) {
        gsap.fromTo(header, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.6, ease: 'expo.out',
          scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }

      if (cards) {
        gsap.fromTo(cards, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.1,
          scrollTrigger: { trigger: cards[0], start: 'top 85%', toggleActions: 'play none none none' },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-near-black py-[120px] px-6 lg:px-20">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="features-header text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-gold">PLATFORM</span>
          <h2 className="mt-4 font-display font-bold text-warm-white" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            Your Learning Arsenal
          </h2>
          <p className="mt-4 text-mid-gray text-lg max-w-[640px] mx-auto">
            Every tool you need to master Python, wrapped in an adventure that keeps you coming back.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="feature-card group relative bg-deep-charcoal border border-warm-white/[0.06] rounded-2xl p-8 hover:border-gold/30 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300"
            >
              <span className="font-mono text-4xl font-bold text-gold/40">{feature.number}</span>
              <h3 className="mt-4 font-display font-bold text-xl text-warm-white">{feature.title}</h3>
              <p className="mt-3 text-mid-gray text-sm leading-relaxed">{feature.description}</p>
              <div className="absolute bottom-0 left-8 right-8 h-0.5 rounded-full bg-gradient-to-r from-gold to-transparent opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
