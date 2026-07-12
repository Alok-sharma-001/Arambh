class AudioManager {
  private ctx: AudioContext | null = null;
  private musicInterval: any = null;
  private isMusicPlaying = false;
  private currentTempo = 100;
  private beatCount = 0;
  private chordIndex = 0;

  private init() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not supported in this browser', e);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Helper to create oscillator node
  private osc(type: OscillatorType, freq: number, duration: number, gainValue = 0.1) {
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gainNode.gain.setValueAtTime(gainValue, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // Play a retro casting spell sound (ascending sweep)
  public playSpell() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.start();
    osc.stop(now + 0.3);
  }

  // Play a metallic sword slash sound (noise-like modulation + decay)
  public playStrike() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.15);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.start();
    osc.stop(now + 0.18);
  }

  // Play a high-impact critical hit explosion sound
  public playCrit() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Bass thud
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(200, now);
    osc1.frequency.linearRampToValueAtTime(40, now + 0.4);
    gain1.gain.setValueAtTime(0.25, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc1.start();
    osc1.stop(now + 0.4);

    // High metal slash
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(1000, now);
    osc2.frequency.exponentialRampToValueAtTime(100, now + 0.25);
    gain2.gain.setValueAtTime(0.08, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc2.start();
    osc2.stop(now + 0.25);
  }

  // Play ascending pitch combo indicator chime
  public playCombo(comboCount: number) {
    const baseFreq = 261.63; // C4
    const semitones = comboCount * 2; // Ascend by whole steps
    const freq = baseFreq * Math.pow(2, semitones / 12);
    this.osc('sine', freq, 0.25, 0.15);
  }

  // Play screen-vibrating ultimate sound
  public playUltimate() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Play multiple overlapping oscillators for fat synth chord
    const freqs = [130.81, 164.81, 196.00, 261.63]; // C3, E3, G3, C4
    freqs.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now);
      // Sweeps down
      osc.frequency.exponentialRampToValueAtTime(f / 2, now + 1.2 + idx * 0.1);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2 + idx * 0.1);
      osc.start();
      osc.stop(now + 1.5);
    });
  }

  // Play triumphant major chord victory tune
  public playVictory() {
    this.stopBossMusic();
    this.init();
    if (!this.ctx) return;
    
    const now = this.ctx.currentTime;
    const notes = [
      { f: 261.63, t: 0 },    // C4
      { f: 329.63, t: 0.15 }, // E4
      { f: 392.00, t: 0.3 },  // G4
      { f: 523.25, t: 0.45 }, // C5
    ];

    notes.forEach((n) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now + n.t);
      gain.gain.setValueAtTime(0.12, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + 0.8);
      osc.start(now + n.t);
      osc.stop(now + n.t + 0.85);
    });
  }

  // Play low minor chord defeat tune
  public playDefeat() {
    this.stopBossMusic();
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [
      { f: 220.00, t: 0 },    // A3
      { f: 185.00, t: 0.35 }, // G#3
      { f: 146.83, t: 0.7 }   // D3 (low minor resolution)
    ];

    notes.forEach((n) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(n.f, now + n.t);
      gain.gain.setValueAtTime(0.15, now + n.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + 0.9);
      osc.start(now + n.t);
      osc.stop(now + n.t + 1.05);
    });
  }

  // Play dynamic boss background music based on health/phase
  public startBossMusic(phase: 'intro' | 'battle' | 'enraged' | 'desperation') {
    this.stopBossMusic();
    this.init();
    this.isMusicPlaying = true;

    // Adjust tempo and speed based on phase
    if (phase === 'intro') this.currentTempo = 85;
    else if (phase === 'battle') this.currentTempo = 110;
    else if (phase === 'enraged') this.currentTempo = 135;
    else if (phase === 'desperation') this.currentTempo = 155;

    const intervalMs = (60 / this.currentTempo) * 1000 / 2; // Eighth notes
    const chords = [
      [110.00, 130.81, 164.81], // Am (A2, C3, E3)
      [130.81, 164.81, 196.00], // C (C3, E3, G3)
      [116.54, 138.59, 174.61], // A#m (A#2, C#3, F3)
      [98.00, 123.47, 146.83]   // G (G2, B2, D3)
    ];

    this.musicInterval = setInterval(() => {
      if (!this.ctx || this.ctx.state === 'suspended') return;
      const now = this.ctx.currentTime;
      
      // Play bass arpeggio
      const chord = chords[this.chordIndex];
      const baseNote = chord[this.beatCount % chord.length];
      const octaveNote = baseNote * 2;
      
      // Bass line oscillator
      const oscBass = this.ctx.createOscillator();
      const gainBass = this.ctx.createGain();
      oscBass.connect(gainBass);
      gainBass.connect(this.ctx.destination);
      oscBass.type = 'triangle';
      
      // Toggle octaves on beat
      const playNote = this.beatCount % 2 === 0 ? baseNote : octaveNote;
      oscBass.frequency.setValueAtTime(playNote, now);
      
      gainBass.gain.setValueAtTime(phase === 'desperation' ? 0.08 : 0.05, now);
      gainBass.gain.exponentialRampToValueAtTime(0.0001, now + (intervalMs / 1000) * 0.9);
      
      oscBass.start();
      oscBass.stop(now + intervalMs / 1000);

      // Play lead melodies during enraged and desperation phases
      if ((phase === 'enraged' || phase === 'desperation') && this.beatCount % 4 === 0) {
        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();
        leadOsc.connect(leadGain);
        leadGain.connect(this.ctx.destination);
        leadOsc.type = 'sine';
        
        // Melodic notes
        const melody = [220.00, 261.63, 293.66, 329.63, 392.00, 440.00];
        const note = melody[Math.floor(Math.random() * melody.length)];
        
        leadOsc.frequency.setValueAtTime(note, now);
        leadGain.gain.setValueAtTime(0.03, now);
        leadGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        leadOsc.start();
        leadOsc.stop(now + 0.75);
      }

      this.beatCount++;
      if (this.beatCount >= 8) {
        this.beatCount = 0;
        this.chordIndex = (this.chordIndex + 1) % chords.length;
      }
    }, intervalMs);
  }

  public stopBossMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const audioManager = new AudioManager();
export default audioManager;
