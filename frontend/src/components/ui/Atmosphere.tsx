import React from 'react';
import { motion } from 'framer-motion';

export const Atmosphere: React.FC = () => {
  // Generate random particles
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * -20,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-950">
      
      {/* Base Gradient Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(139,92,246,0.15),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(251,191,36,0.05),transparent_40%)]" />

      {/* Animated Drifting Fog/Light Blobs */}
      <motion.div 
        animate={{ 
          x: ['-10%', '10%', '-10%'],
          y: ['-5%', '5%', '-5%'],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute top-0 left-0 w-full h-full opacity-30"
      >
        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-game-purple/10 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-1/4 right-1/4 w-[50rem] h-[50rem] bg-game-gold/5 rounded-full blur-[150px] mix-blend-screen" />
      </motion.div>

      {/* Floating Particles */}
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-game-purple/40"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            top: p.top,
          }}
          animate={{
            y: ['0vh', '-100vh'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
};
