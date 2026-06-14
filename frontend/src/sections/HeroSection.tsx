import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useParticleSystem } from '@/hooks/useParticleSystem';
import CategoryPill from '@/components/CategoryPill';

gsap.registerPlugin(ScrollTrigger);

const PYTHON_KEYWORDS = ['def', 'class', 'import', 'for', 'while', 'if', 'else', 'return', 'yield', 'lambda', 'async', 'await', 'try', 'except', 'finally', 'with', 'as', 'from', 'raise', 'break', 'continue', 'pass', 'global', 'nonlocal', 'assert', 'del'];

const marqueeContent = PYTHON_KEYWORDS.join(' \u25C6 ') + ' \u25C6 ';

const heroCards = [
  { image: '/assets/hero-card-python.jpg', title: 'Python Basics', offset: { x: -300, y: -50 }, rotate: -8, scale: 0.85 },
  { image: '/assets/hero-card-code.jpg', title: 'Code Mastery', offset: { x: -100, y: 30 }, rotate: -3, scale: 0.9 },
  { image: '/assets/hero-card-arena.jpg', title: 'Boss Battles', offset: { x: 100, y: -20 }, rotate: 3, scale: 0.9 },
  { image: '/assets/hero-card-python.jpg', title: 'Advanced', offset: { x: 300, y: 40 }, rotate: 8, scale: 0.85 },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useParticleSystem(canvasRef, {
    symbols: ['{', '}', '(', ')', '=', '+', '<', '>', 'x', 'y', '0', '1'],
    density: 15,
    colors: ['#c8a45e'],
  });

  // 3D card tilt on mouse move
  useEffect(() => {
    const container = cardsRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      container.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    };

    const handleMouseLeave = () => {
      container.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Entrance animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      tl.fromTo(
        cardsRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'expo.out' }
      );

      if (contentRef.current) {
        const pill = contentRef.current.querySelector('.hero-pill');
        const title = contentRef.current.querySelector('.hero-title');
        const subtitle = contentRef.current.querySelector('.hero-subtitle');
        const ctas = contentRef.current.querySelectorAll('.hero-cta');

        tl.fromTo(pill, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out' }, '-=0.4');
        tl.fromTo(title, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, '-=0.3');
        tl.fromTo(subtitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }, '-=0.4');
        tl.fromTo(ctas, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'expo.out', stagger: 0.1 }, '-=0.3');
      }

      tl.fromTo(
        marqueeRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'expo.out' },
        '-=0.2'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Parallax on scroll
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const ctx = gsap.context(() => {
        gsap.to(cardsRef.current, {
          y: 150,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }, sectionRef);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-[100dvh] overflow-hidden flex items-center justify-center bg-near-black"
    >
      {/* Purple atmospheric glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(124,92,255,0.08) 0%, transparent 60%)',
        }}
      />

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-[1] pointer-events-none"
      />

      {/* 3D Card Carousel Background */}
      <div
        ref={cardsRef}
        className="absolute inset-0 z-0 flex items-center justify-center transition-transform duration-200 ease-out"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {heroCards.map((card, i) => (
          <div
            key={i}
            className="absolute rounded-2xl overflow-hidden shadow-2xl animate-float"
            style={{
              width: 240,
              height: 320,
              transform: `translate3d(${card.offset.x}px, ${card.offset.y}px, ${-100 * Math.abs(i - 1.5)}px) rotate(${card.rotate}deg) scale(${card.scale})`,
              animationDelay: `${i * 0.5}s`,
              opacity: 0.25,
              filter: `blur(${Math.abs(i - 1.5) * 2}px)`,
            }}
          >
            <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-near-black/80 to-transparent" />
          </div>
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 gradient-hero-overlay z-[1]" />

      {/* Content */}
      <div ref={contentRef} className="relative z-[2] text-center px-6 max-w-[900px] mx-auto">
        <div className="hero-pill mb-6">
          <CategoryPill text="LEARNING RPG PLATFORM" />
        </div>

        <h1 className="hero-title font-display font-black text-warm-white leading-[1.1] tracking-[-0.02em]"
          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
          Begin Your{' '}
          <span className="text-gradient-gold-purple">Python</span>{' '}
          Quest
        </h1>

        <p className="hero-subtitle mt-6 text-mid-gray max-w-[600px] mx-auto" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)' }}>
          Master Python through challenges, quests, and visual execution. From your first line of code to becoming a Code Legend — your journey starts here.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/map"
            className="hero-cta inline-flex items-center px-8 py-3.5 bg-gold text-near-black font-body font-semibold text-sm uppercase tracking-[0.1em] rounded-lg hover:bg-[#d4b76e] hover:-translate-y-0.5 hover:shadow-gold-glow transition-all duration-300"
          >
            Start Your Adventure
          </Link>
          <Link
            to="/map"
            className="hero-cta inline-flex items-center px-8 py-3.5 border border-gold text-gold font-body font-semibold text-sm uppercase tracking-[0.1em] rounded-lg hover:bg-gold/10 transition-all duration-300"
          >
            Explore the World
          </Link>
        </div>
      </div>

      {/* Marquee */}
      <div ref={marqueeRef} className="absolute bottom-20 left-0 right-0 z-[2] overflow-hidden opacity-0">
        {/* Row 1 - scrolls left */}
        <div className="flex animate-marquee-left whitespace-nowrap">
          <span className="font-mono text-xl text-gold/40 mx-4">{marqueeContent}{marqueeContent}</span>
          <span className="font-mono text-xl text-gold/40 mx-4">{marqueeContent}{marqueeContent}</span>
        </div>
        {/* Row 2 - scrolls right */}
        <div className="flex animate-marquee-right whitespace-nowrap mt-2">
          <span className="font-mono text-xl text-gold/40 mx-4">{marqueeContent}{marqueeContent}</span>
          <span className="font-mono text-xl text-gold/40 mx-4">{marqueeContent}{marqueeContent}</span>
        </div>
      </div>
    </section>
  );
}
