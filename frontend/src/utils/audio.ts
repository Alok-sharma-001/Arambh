/**
 * Synthesizes retro 8-bit chimes dynamically using the native browser Web Audio API.
 * Ensures sound support without adding static asset dependencies.
 */
export const playSound = {
  success: () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      osc.type = 'triangle';
      
      // Retro success chime: 4 notes rising quickly
      osc.frequency.setValueAtTime(261.63, now); // C4
      osc.frequency.setValueAtTime(329.63, now + 0.08); // E4
      osc.frequency.setValueAtTime(392.00, now + 0.16); // G4
      osc.frequency.setValueAtTime(523.25, now + 0.24); // C5
      
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      
      osc.start(now);
      osc.stop(now + 0.5);
    } catch (e) {
      console.warn("Audio Context success sound error:", e);
    }
  },

  levelUp: () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      osc.type = 'sawtooth';
      
      // Triumph Level Up fanfare
      osc.frequency.setValueAtTime(261.63, now); // C4
      osc.frequency.setValueAtTime(329.63, now + 0.07); // E4
      osc.frequency.setValueAtTime(392.00, now + 0.14); // G4
      osc.frequency.setValueAtTime(523.25, now + 0.21); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.28); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.35); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.42); // C6
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
      
      osc.start(now);
      osc.stop(now + 0.7);
    } catch (e) {
      console.warn("Audio Context levelUp sound error:", e);
    }
  },

  combo: (streak: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      osc.type = 'sine';
      
      // Pitch raises with combo streak
      const baseFreq = 300 + Math.min(streak * 100, 800);
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.12);
      
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      console.warn("Audio Context combo sound error:", e);
    }
  }
};
