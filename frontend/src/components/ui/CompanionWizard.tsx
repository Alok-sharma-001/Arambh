import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CompanionWizardProps {
  state: 'idle' | 'walking' | 'pulling' | 'talking';
  message?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const CompanionWizard: React.FC<CompanionWizardProps> = ({
  state,
  message,
  className = '',
  style = {},
  onClick,
}) => {
  // Left leg swing variants
  const leftLegVariants = {
    idle: {
      rotate: [0, 2, -2, 0],
      transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
    },
    walking: {
      rotate: [0, 25, -20, 0],
      transition: { repeat: Infinity, duration: 0.5, ease: 'easeInOut' },
    },
    pulling: {
      rotate: 5,
      transition: { duration: 0.4 },
    },
    talking: {
      rotate: [0, 3, -3, 0],
      transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
    },
  };

  // Right leg swing variants (offset from left)
  const rightLegVariants = {
    idle: {
      rotate: [0, -2, 2, 0],
      transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: 0.15 },
    },
    walking: {
      rotate: [0, -20, 25, 0],
      transition: { repeat: Infinity, duration: 0.5, ease: 'easeInOut' },
    },
    pulling: {
      rotate: -5,
      transition: { duration: 0.4 },
    },
    talking: {
      rotate: [0, -3, 3, 0],
      transition: { repeat: Infinity, duration: 2, ease: 'easeInOut', delay: 0.15 },
    },
  };

  // Left arm variants (the pulling arm)
  const leftArmVariants = {
    idle: {
      rotate: [0, -5, 5, 0],
      transition: { repeat: Infinity, duration: 2.8, ease: 'easeInOut' },
    },
    walking: {
      rotate: [0, 20, -15, 0],
      transition: { repeat: Infinity, duration: 0.5, ease: 'easeInOut' },
    },
    pulling: {
      rotate: [-60, -100, -60],
      y: [0, -18, 0],
      transition: { duration: 1.2, repeat: 1, ease: 'easeInOut' },
    },
    talking: {
      rotate: [0, -10, 8, 0],
      transition: { repeat: Infinity, repeatType: 'reverse' as const, duration: 1.4 },
    },
  };

  // Right arm variants (gesturing)
  const rightArmVariants = {
    idle: {
      rotate: [0, 4, -4, 0],
      transition: { repeat: Infinity, duration: 2.6, ease: 'easeInOut' },
    },
    walking: {
      rotate: [0, -15, 20, 0],
      transition: { repeat: Infinity, duration: 0.5, ease: 'easeInOut' },
    },
    pulling: {
      rotate: 8,
      transition: { duration: 0.5 },
    },
    talking: {
      rotate: [0, 12, -8, 5, 0],
      transition: { repeat: Infinity, repeatType: 'reverse' as const, duration: 1.2 },
    },
  };

  // Eye blink variants
  const eyeVariants = {
    idle: {
      scaleY: [1, 1, 0.1, 1, 1, 1, 0.1, 1],
      transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' },
    },
    walking: {
      scaleY: 1,
      transition: { duration: 0.3 },
    },
    pulling: {
      scaleY: 0.3,
      transition: { duration: 0.3 },
    },
    talking: {
      scaleY: [1, 0.8, 1.1, 0.9, 1],
      transition: { repeat: Infinity, duration: 0.8, ease: 'easeInOut' },
    },
  };

  // Gentle body bob
  const bodyBobVariants = {
    idle: {
      y: [0, -2, 0],
      transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
    },
    walking: {
      y: [0, -4, 0, -4, 0],
      transition: { repeat: Infinity, duration: 0.5, ease: 'easeInOut' },
    },
    pulling: {
      y: [0, -3, 0],
      transition: { duration: 0.6 },
    },
    talking: {
      y: [0, -1.5, 0],
      transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
    },
  };

  return (
    <div
      className={`relative flex items-center gap-4 select-none ${className}`}
      style={style}
      onClick={onClick}
    >
      {/* ─── Animated Boy Squire Avatar (SVG) ─── */}
      <div className="relative w-36 h-48 flex-shrink-0">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 160 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Skin tone gradient */}
            <linearGradient id="skinGrad" x1="80" y1="27" x2="80" y2="69" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFDBAC" />
              <stop offset="100%" stopColor="#F1C27D" />
            </linearGradient>

            {/* Dark premium jacket gradient */}
            <linearGradient id="jacketGrad" x1="80" y1="75" x2="80" y2="145" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E1E24" />
              <stop offset="100%" stopColor="#0B0B0D" />
            </linearGradient>

            {/* Hair gradient */}
            <linearGradient id="hairGrad" x1="80" y1="12" x2="80" y2="40" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2E2A25" />
              <stop offset="100%" stopColor="#12100E" />
            </linearGradient>
            
            {/* Gold accents */}
            <linearGradient id="goldAccent" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFE8DB" />
              <stop offset="100%" stopColor="#D4B76E" />
            </linearGradient>

            {/* Warm glow filter for eyes */}
            <filter id="warmGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ─── Ground Shadow ─── */}
          <ellipse cx="80" cy="200" rx="28" ry="5" fill="#000000" fillOpacity="0.45" />

          {/* ─── Body Group (with bob animation) ─── */}
          <motion.g
            variants={bodyBobVariants}
            animate={state}
            style={{ originX: 0.5, originY: 0.9 }}
          >
            {/* ─── LEFT LEG ─── */}
            <motion.g
              variants={leftLegVariants}
              animate={state}
              style={{ originX: 0.44, originY: 0.65 }} /* Pivot at hip */
            >
              {/* Thigh / Pants */}
              <rect x="61" y="143" width="10" height="26" rx="4.5" fill="url(#jacketGrad)" stroke="#16161a" strokeWidth="1" />
              {/* Knee joint */}
              <circle cx="66" cy="169" r="4.5" fill="url(#goldAccent)" />
              {/* Calf */}
              <rect x="63" y="169" width="6" height="20" rx="3" fill="#1C1B1F" />
              {/* Sneaker */}
              <path d="M 57 185 L 75 185 Q 79 185 79 190 L 57 190 Q 53 190 53 187 Z" fill="url(#goldAccent)" />
              <rect x="59" y="186" width="13" height="2.5" fill="#FFFFFF" opacity="0.9"/>
            </motion.g>

            {/* ─── RIGHT LEG ─── */}
            <motion.g
              variants={rightLegVariants}
              animate={state}
              style={{ originX: 0.56, originY: 0.65 }} /* Pivot at hip */
            >
              {/* Thigh / Pants */}
              <rect x="89" y="143" width="10" height="26" rx="4.5" fill="url(#jacketGrad)" stroke="#16161a" strokeWidth="1" />
              {/* Knee joint */}
              <circle cx="94" cy="169" r="4.5" fill="url(#goldAccent)" />
              {/* Calf */}
              <rect x="91" y="169" width="6" height="20" rx="3" fill="#1C1B1F" />
              {/* Sneaker */}
              <path d="M 85 185 L 103 185 Q 107 185 107 190 L 85 190 Q 81 190 81 187 Z" fill="url(#goldAccent)" />
              <rect x="87" y="186" width="13" height="2.5" fill="#FFFFFF" opacity="0.9"/>
            </motion.g>

            {/* ─── TORSO (Jacket/Hoodie) ─── */}
            <rect x="55" y="75" width="50" height="70" rx="14" fill="url(#jacketGrad)" stroke="url(#goldAccent)" strokeWidth="1.5" />
            
            {/* V-neck Inner Shirt */}
            <path d="M 70 75 Q 80 92 90 75 Z" fill="#0A0A0A" />
            <path d="M 72 75 Q 80 87 88 75 Z" fill="url(#goldAccent)" />
            
            {/* Zipper / Drawstrings */}
            <line x1="80" y1="88" x2="80" y2="120" stroke="url(#goldAccent)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="80" cy="122" r="3.5" fill="#FFFFFF" />

            {/* ─── LEFT ARM (pulling arm) ─── */}
            <motion.g
              variants={leftArmVariants}
              animate={state}
              style={{ originX: 0.31, originY: 0.40 }} /* Pivot at shoulder */
            >
              {/* Shoulder */}
              <circle cx="50" cy="85" r="7" fill="url(#goldAccent)" />
              {/* Upper arm sleeve */}
              <rect x="46" y="85" width="8" height="24" rx="4" fill="url(#jacketGrad)" stroke="#16161a" />
              {/* Elbow */}
              <circle cx="50" cy="109" r="4" fill="url(#goldAccent)" />
              {/* Lower arm (skin) */}
              <rect x="47" y="109" width="6" height="18" rx="3" fill="url(#skinGrad)" />
              {/* Hand */}
              <path d="M 42 127 Q 50 122 58 127 L 55 135 Q 50 132 45 135 Z" fill="url(#skinGrad)" />
            </motion.g>

            {/* ─── RIGHT ARM (gesturing arm) ─── */}
            <motion.g
              variants={rightArmVariants}
              animate={state}
              style={{ originX: 0.69, originY: 0.40 }} /* Pivot at shoulder */
            >
              {/* Shoulder */}
              <circle cx="110" cy="85" r="7" fill="url(#goldAccent)" />
              {/* Upper arm sleeve */}
              <rect x="106" y="85" width="8" height="24" rx="4" fill="url(#jacketGrad)" stroke="#16161a" />
              {/* Elbow */}
              <circle cx="110" cy="109" r="4" fill="url(#goldAccent)" />
              {/* Lower arm (skin) */}
              <rect x="107" y="109" width="6" height="18" rx="3" fill="url(#skinGrad)" />
              {/* Hand */}
              <path d="M 102 127 Q 110 122 118 127 L 115 135 Q 110 132 105 135 Z" fill="url(#skinGrad)" />
            </motion.g>

            {/* ─── NECK ─── */}
            <rect x="74" y="65" width="12" height="13" rx="3" fill="url(#skinGrad)" />

            {/* ─── HEAD ─── */}
            <g id="head">
              {/* Back Hair */}
              <path d="M 46 36 Q 44 14 62 12 Q 72 18 80 12 Q 88 18 98 12 Q 116 14 114 36 L 114 42 L 46 42 Z" fill="url(#hairGrad)" />

              {/* Face Shape */}
              <rect x="52" y="27" width="56" height="42" rx="14" fill="url(#skinGrad)" />

              {/* Front Hair Bangs */}
              <path d="M 46 32 Q 53 22 62 26 Q 66 17 74 23 Q 80 15 88 23 Q 96 17 104 26 Q 108 20 114 32 Q 103 36 94 30 Q 86 36 80 30 Q 74 36 66 30 Q 57 36 46 32 Z" fill="url(#hairGrad)" />

              {/* Blush Cheeks */}
              <circle cx="61" cy="54" r="2.5" fill="#EF4444" opacity="0.3" />
              <circle cx="99" cy="54" r="2.5" fill="#EF4444" opacity="0.3" />

              {/* ─── EYES ─── */}
              <g>
                {/* Left eye */}
                <motion.ellipse
                  cx="66"
                  cy="47"
                  rx="4.5"
                  ry="6"
                  fill="#1C1B1F"
                  variants={eyeVariants}
                  animate={state}
                  style={{ originX: '66px', originY: '47px' }}
                />
                <circle cx="67.5" cy="45" r="1.5" fill="#FFFFFF" />

                {/* Right eye */}
                <motion.ellipse
                  cx="94"
                  cy="47"
                  rx="4.5"
                  ry="6"
                  fill="#1C1B1F"
                  variants={eyeVariants}
                  animate={state}
                  style={{ originX: '94px', originY: '47px' }}
                />
                <circle cx="95.5" cy="45" r="1.5" fill="#FFFFFF" />
              </g>

              {/* Talking indicator / Mouth */}
              {state === 'talking' ? (
                <motion.path
                  d="M 75 58 Q 80 65 85 58"
                  stroke="#1C1B1F"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  fill="none"
                  animate={{ scaleY: [1, 1.8, 0.8, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
                />
              ) : (
                <path
                  d="M 76 58 Q 80 60 84 58"
                  stroke="#1C1B1F"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </g>
          </motion.g>
        </svg>
      </div>

      {/* ─── Floating Speech Bubble ─── */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="relative z-50 w-[280px] md:w-[340px] min-h-[90px] p-4 rounded-2xl bg-[#0C0C0E]/95 backdrop-blur-md border border-gold/20 shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_25px_rgba(212,183,110,0.06)] text-warm-white flex flex-col justify-center"
          >
            {/* Bubble Tail */}
            <div className="absolute left-[-8px] top-6 w-0 h-0 border-t-[8px] border-t-transparent border-r-[10px] border-r-[#0C0C0E]/95 border-b-[8px] border-b-transparent filter drop-shadow-[-1px_0_0_rgba(212,183,110,0.15)]" />
            
            {/* Bubble Text Content */}
            <div className="text-xs sm:text-[13px] font-mono leading-relaxed text-warm-white/90">
              <span className="text-[10px] text-gold font-bold uppercase tracking-[0.15em] block mb-1">
                ARAMBH SQUIRE
              </span>
              <p className="text-warm-white/85">{message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
