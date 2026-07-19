import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useTour } from '../../context/TourContext';

export const TourHelpButton: React.FC = () => {
  const { isActive, currentPageKey, startTourForCurrentPage } = useTour();

  if (isActive || !currentPageKey) return null;

  return (
    <button
      onClick={startTourForCurrentPage}
      title="Page Guide - Restart Tour"
      aria-label="Restart Guided Tour for this page"
      className="fixed bottom-6 left-6 z-40 md:bottom-6 md:left-6 flex items-center justify-center gap-2 rounded-full border border-gold/40 bg-zinc-950/90 backdrop-blur-md px-3.5 py-2.5 text-xs font-bold text-gold shadow-xl shadow-black/80 hover:bg-gold hover:text-near-black hover:border-gold transition-all duration-300 transform hover:scale-105 active:scale-95 group"
    >
      <HelpCircle className="w-4 h-4 text-gold group-hover:text-near-black transition-colors" />
      <span className="hidden sm:inline font-mono text-[11px] tracking-wider uppercase">Page Guide</span>
    </button>
  );
};
