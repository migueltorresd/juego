// Retro Synth Sound Service using Web Audio API
// Lightweight, zero dependencies, no assets to load!

class SoundService {
  constructor() {
    this.ctx = null;
    this.soundEnabled = false; // Muted by default
    this.musicEnabled = false; // Music muted by default
    this.musicInterval = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    if (enabled) this.init();
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
    if (enabled) {
      this.init();
      this.startMusic();
    } else {
      this.stopMusic();
    }
  }

  // Helper to play a tone
  playTone(freq, type, duration, startTimeOffset = 0) {
    if (!this.soundEnabled || !this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTimeOffset);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime + startTimeOffset);
      gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + startTimeOffset + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + startTimeOffset);
      osc.stop(this.ctx.currentTime + startTimeOffset + duration);
    } catch (e) {
      console.warn("Audio failed to play", e);
    }
  }

  playClick() {
    this.playTone(300, 'sine', 0.1);
  }

  playMatch() {
    // Arpeggio
    this.playTone(523.25, 'triangle', 0.15, 0);     // C5
    this.playTone(659.25, 'triangle', 0.15, 0.08);  // E5
    this.playTone(783.99, 'triangle', 0.2, 0.16);   // G5
    this.playTone(1046.50, 'triangle', 0.3, 0.24);  // C6
  }

  playMismatch() {
    // Descending sad tone
    this.playTone(220, 'sawtooth', 0.2, 0);       // A3
    this.playTone(164.81, 'sawtooth', 0.35, 0.1); // E3
  }

  playLevelUp() {
    // Happy scale
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
      this.playTone(freq, 'sine', 0.25, index * 0.08);
    });
  }

  playVictory() {
    // Fanfare
    const tempo = 0.15;
    this.playTone(523.25, 'sine', 0.2, 0 * tempo); // C5
    this.playTone(523.25, 'sine', 0.2, 1 * tempo); // C5
    this.playTone(523.25, 'sine', 0.2, 2 * tempo); // C5
    this.playTone(523.25, 'sine', 0.4, 3 * tempo); // C5
    
    this.playTone(415.30, 'sine', 0.4, 4.5 * tempo); // G#4
    this.playTone(466.16, 'sine', 0.4, 6 * tempo);   // A#4
    this.playTone(523.25, 'sine', 0.6, 7.5 * tempo); // C5
  }

  playHint() {
    this.playTone(880, 'sine', 0.1, 0);
    this.playTone(1320, 'sine', 0.2, 0.06);
  }

  startMusic() {
    this.stopMusic();
    if (!this.musicEnabled) return;

    // Simple 8-bit retro loops
    let step = 0;
    const notes = [130.81, 196.00, 164.81, 196.00, 146.83, 220.00, 174.61, 220.00]; // Bass melody
    
    this.musicInterval = setInterval(() => {
      if (!this.musicEnabled || !this.ctx) {
        this.stopMusic();
        return;
      }
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(notes[step % notes.length], this.ctx.currentTime);

        gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.45);

        step++;
      } catch (e) {
        console.warn("Background music failed", e);
      }
    }, 500);
  }

  stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const sound = new SoundService();
