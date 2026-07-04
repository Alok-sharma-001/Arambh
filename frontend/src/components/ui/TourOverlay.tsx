import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTour } from '../../context/TourContext';
import { CompanionWizard } from './CompanionWizard';

export const TourOverlay: React.FC = () => {
  const {
    isActive,
    currentStepIndex,
    currentStep,
    steps,
    nextStep,
    prevStep,
    skipTour,
    highlightRect,
  } = useTour();

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isActive || !currentStep) return null;

  // Calculate coordinates for highlighting cutout mask
  const padding = 8;
  const rect = highlightRect
    ? {
        x: highlightRect.left - padding,
        y: highlightRect.top - padding,
        w: highlightRect.width + padding * 2,
        h: highlightRect.height + padding * 2,
        r: 12,
      }
    : {
        x: windowSize.width / 2 - 50,
        y: windowSize.height / 2 - 50,
        w: 100,
        h: 100,
        r: 50,
      };

  // Determine speech card placement
  const cardStyles: React.CSSProperties = {};
  const isDesktop = windowSize.width >= 768;

  if (highlightRect && isDesktop) {
    const margin = 20;
    if (currentStep.placement === 'bottom') {
      cardStyles.top = `${rect.y + rect.h + margin}px`;
      cardStyles.left = `${Math.max(20, Math.min(windowSize.width - 460, rect.x + rect.w / 2 - 220))}px`;
    } else if (currentStep.placement === 'top') {
      cardStyles.top = `${Math.max(20, rect.y - 270)}px`; // slightly taller for new card structure
      cardStyles.left = `${Math.max(20, Math.min(windowSize.width - 460, rect.x + rect.w / 2 - 220))}px`;
    } else {
      cardStyles.bottom = '40px';
      cardStyles.right = '40px';
    }
  } else {
    // Mobile: fixed bottom banner card centered nicely
    cardStyles.bottom = '20px';
    cardStyles.left = '50%';
    cardStyles.transform = 'translateX(-50%)';
    cardStyles.width = 'calc(100% - 32px)';
    cardStyles.maxWidth = '420px';
  }

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* ─── Dimmed Backdrop with Cutout ─── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-auto"
        style={{ mixBlendMode: 'multiply' }}
      >
        <defs>
          <mask id="tour-mask">
            {/* White covers entire screen (blocks opacity) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {/* Black cutout (transparent window for target element) */}
            <rect
              x={rect.x}
              y={rect.y}
              width={rect.w}
              height={rect.h}
              rx={rect.r}
              ry={rect.r}
              fill="black"
            />
          </mask>
        </defs>
        
        {/* Semi-transparent dark overlay */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="#000"
          fillOpacity="0.75"
          mask="url(#tour-mask)"
        />
      </svg>

      {/* ─── Glow Border around highlighted target ─── */}
      <AnimatePresence>
        {highlightRect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute border-2 border-amber-500 rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.5)] pointer-events-none"
            style={{
              left: `${rect.x}px`,
              top: `${rect.y}px`,
              width: `${rect.w}px`,
              height: `${rect.h}px`,
              transition: 'all 0.3s ease-out',
            }}
          />
        )}
      </AnimatePresence>

      {/* ─── Premium Integrated Onboarding Card ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="fixed z-50 pointer-events-auto w-[440px] rounded-2xl bg-zinc-950/90 backdrop-blur-xl border border-gold/25 shadow-[0_15px_40px_rgba(0,0,0,0.85),0_0_30px_rgba(212,183,110,0.05)] text-zinc-100 overflow-hidden"
        style={cardStyles}
      >
        <div className="flex gap-4 p-5 items-start">
          {/* Arambh Squire Avatar on the left */}
          <div className="flex-shrink-0 scale-75 md:scale-90 origin-top-left -mt-2 -ml-2">
            <CompanionWizard state="talking" />
          </div>

          {/* Step content & controls on the right */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-gold font-bold uppercase tracking-widest font-mono">
                ARAMBH SQUIRE • Step {currentStepIndex + 1} of {steps.length}
              </span>
            </div>
            
            <h3 className="text-sm font-bold text-warm-white font-display mb-1.5">
              {currentStep.title}
            </h3>
            
            <p className="text-xs text-zinc-300 font-mono leading-relaxed mb-4">
              {currentStep.content}
            </p>

            {/* Custom Navigation Controls inside the card */}
            <div className="flex items-center justify-between pt-3 border-t border-zinc-900">
              <button
                onClick={skipTour}
                className="text-[10px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-wider"
              >
                Skip Tour
              </button>

              <div className="flex items-center gap-2">
                {currentStepIndex > 0 && (
                  <button
                    onClick={prevStep}
                    className="px-2.5 py-1 text-xs font-mono rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-300 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={nextStep}
                  className="px-3.5 py-1 text-xs font-mono font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-black transition-colors flex items-center gap-1 shadow-md"
                >
                  {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
