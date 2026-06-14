import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function MapCTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = sectionRef.current?.querySelectorAll('.cta-animate');
      if (elements) {
        gsap.fromTo(elements, { opacity: 0, y: 30 }, {
          opacity: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        });
      }

      const mapImg = sectionRef.current?.querySelector('.map-preview');
      if (mapImg) {
        gsap.fromTo(mapImg, { opacity: 0, scale: 0.98 }, {
          opacity: 1, scale: 1, duration: 0.8, ease: 'expo.out', delay: 0.4,
          scrollTrigger: { trigger: mapImg, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full gradient-map-cta py-40 px-6 lg:px-20 relative overflow-hidden">
      {/* Purple atmospheric haze */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(124,92,255,0.12) 0%, transparent 60%)' }}
      />

      <div className="max-w-[800px] mx-auto text-center relative z-10">
        <span className="cta-animate text-xs font-semibold uppercase tracking-[0.15em] text-gold">YOUR JOURNEY AWAITS</span>

        <h2
          className="cta-animate mt-6 font-display font-bold text-warm-white"
          style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            textShadow: '0 0 40px rgba(124,92,255,0.2)',
          }}
        >
          Explore the World of Python
        </h2>

        <p className="cta-animate mt-6 text-mid-gray text-lg max-w-[560px] mx-auto">
          11 regions. Countless challenges. Epic boss battles. Every line of code you write unlocks new powers and advances your quest to become a Python Legend.
        </p>

        <div className="cta-animate mt-10">
          <Link
            to="/map"
            className="inline-flex items-center px-12 py-4 bg-gold text-near-black font-body font-semibold uppercase tracking-[0.1em] rounded-lg hover:bg-[#d4b76e] hover:-translate-y-0.5 hover:shadow-gold-glow transition-all duration-300 text-base"
          >
            Enter the World Map
          </Link>
          <div className="mt-4 flex justify-center">
            <ChevronDown className="w-6 h-6 text-gold animate-bounce-arrow" />
          </div>
        </div>

        {/* Map preview image */}
        <div className="map-preview mt-16 max-w-[900px] mx-auto">
          <Link to="/map" className="block group">
            <div className="relative rounded-2xl border-2 border-gold/20 overflow-hidden group-hover:border-gold/40 transition-all duration-300"
              style={{ boxShadow: '0 0 60px rgba(124,92,255,0.15)' }}>
              <img
                src="/assets/map-preview-cta.jpg"
                alt="PyQuest World Map showing 11 learning regions connected by a golden path"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-near-black/40 to-transparent" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
