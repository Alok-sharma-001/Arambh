import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  speed: number;
  opacity: number;
  size: number;
  symbol: string;
  life: number;
  maxLife: number;
}

interface UseParticleSystemOptions {
  symbols?: string[];
  density?: number;
  colors?: string[];
}

export function useParticleSystem(canvasRef: React.RefObject<HTMLCanvasElement | null>, options: UseParticleSystemOptions = {}) {
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const {
    symbols = ['{', '}', '(', ')', '=', '+', '<', '>', 'x', 'y', '0', '1'],
    density = 15,
    colors = ['#c8a45e'],
  } = options;

  const spawnParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      speed: 0.5 + Math.random() * 1.5,
      opacity: 0.1 + Math.random() * 0.3,
      size: 12 + Math.random() * 8,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      life: 0,
      maxLife: 300 + Math.random() * 300,
    };
  }, [symbols]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < density; i++) {
      const p = spawnParticle(canvas);
      p.y = Math.random() * canvas.height;
      p.life = Math.random() * p.maxLife;
      particlesRef.current.push(p);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current = particlesRef.current.filter((p) => {
        p.y -= p.speed;
        p.life++;
        const lifeRatio = p.life / p.maxLife;
        const fadeOpacity = lifeRatio < 0.1
          ? p.opacity * (lifeRatio / 0.1)
          : lifeRatio > 0.8
            ? p.opacity * ((1 - lifeRatio) / 0.2)
            : p.opacity;

        if (p.life >= p.maxLife || p.y < -30) return false;

        ctx.save();
        ctx.globalAlpha = fadeOpacity;
        ctx.font = `${p.size}px "JetBrains Mono", monospace`;
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillText(p.symbol, p.x, p.y);
        ctx.restore();

        return true;
      });

      while (particlesRef.current.length < density) {
        particlesRef.current.push(spawnParticle(canvas));
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      particlesRef.current = [];
    };
  }, [canvasRef, density, colors, spawnParticle]);
}
