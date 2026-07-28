// Web Audio API Synthesized Fantasy Sound Engine for Arambh

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;

  constructor() {
    // AudioContext will be initialized on first user interaction
    const savedMute = localStorage.getItem('arambh_audio_muted');
    const savedVol = localStorage.getItem('arambh_audio_volume');
    if (savedMute !== null) this.isMuted = savedMute === 'true';
    if (savedVol !== null) this.volume = parseFloat(savedVol);
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('arambh_audio_muted', String(muted));
  }

  public isAudioMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('arambh_audio_volume', String(this.volume));
  }

  public getVolume(): number {
    return this.volume;
  }

  // 1. Mechanical Button Click Sound
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.03);

      gain.gain.setValueAtTime(this.volume * 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // Ignore web audio errors
    }
  }

  // 2. Crystal Chime (Correct Answer / Quest Complete)
  public playChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const freqs = [659.25, 880.0, 1318.51]; // E5, A5, E6

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(this.volume * 0.25, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch {
      // Ignore web audio errors
    }
  }

  // 3. Wooden Thud (Wrong Answer / Gentle Retry)
  public playThud() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

      gain.gain.setValueAtTime(this.volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore web audio errors
    }
  }

  // 4. Brass Fanfare (Level Up / Boss Victory)
  public playFanfare() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [
        { freq: 523.25, time: 0, dur: 0.15 },     // C5
        { freq: 659.25, time: 0.15, dur: 0.15 },  // E5
        { freq: 783.99, time: 0.30, dur: 0.15 },  // G5
        { freq: 1046.50, time: 0.45, dur: 0.60 }  // C6
      ];

      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + note.time;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.freq, startTime);

        gain.gain.setValueAtTime(this.volume * 0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + note.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + note.dur);
      });
    } catch {
      // Ignore web audio errors
    }
  }
}

export const audioEngine = new SoundEngine();
