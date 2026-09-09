// Sound synthesizer & Speech engine for 快乐冒险岛

class SoundManager {
  private ctx: AudioContext | null = null;
  public soundEnabled: boolean = true;
  public voiceSpeed: number = 0.9;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a clean synthesis tone
  playTone(freq: number, duration: number, type: OscillatorType = 'sine', gainVal: number = 0.15) {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before first click
    }
  }

  // Crystal Collect Sound (magical arpeggio)
  playCrystalCollect() {
    if (!this.soundEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.35, 'triangle', 0.12);
      }, idx * 70);
    });
  }

  // Correct Answer fanfare
  playCorrect() {
    if (!this.soundEnabled) return;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.25, 'sine', 0.15);
      }, idx * 80);
    });
  }

  // Try again soft thud
  playIncorrect() {
    if (!this.soundEnabled) return;
    this.playTone(220, 0.25, 'sawtooth', 0.08);
    setTimeout(() => {
      this.playTone(185, 0.3, 'sawtooth', 0.07);
    }, 150);
  }

  // Chest / Door Open
  playDoorOpen() {
    if (!this.soundEnabled) return;
    const notes = [329.63, 392.00, 493.88, 587.33, 659.25];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 0.3, 'triangle', 0.1);
      }, idx * 60);
    });
  }

  // Soft step
  playStep() {
    if (!this.soundEnabled) return;
    this.playTone(140 + Math.random() * 20, 0.05, 'sine', 0.03);
  }

  // Button click
  playClick() {
    if (!this.soundEnabled) return;
    this.playTone(600, 0.06, 'sine', 0.08);
  }

  // Victory fanfare
  playVictory() {
    if (!this.soundEnabled) return;
    const melody = [
      { f: 523.25, d: 150 },
      { f: 523.25, d: 150 },
      { f: 523.25, d: 150 },
      { f: 659.25, d: 350 },
      { f: 783.99, d: 300 },
      { f: 1046.5, d: 600 },
    ];
    let time = 0;
    melody.forEach((note) => {
      setTimeout(() => {
        this.playTone(note.f, note.d / 1000, 'triangle', 0.2);
      }, time);
      time += note.d + 50;
    });
  }

  // Web Speech API for Chinese pronunciation
  speakChinese(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      // Clean punctuation for pronunciation
      const cleanText = text.replace(/[!?,.，。！？、“”]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText || text);
      utterance.lang = 'zh-CN';
      utterance.rate = this.voiceSpeed;
      utterance.pitch = 1.05; // Slightly cheerful pitch

      // Try to select a Chinese voice if available
      const voices = window.speechSynthesis.getVoices();
      const zhVoice = voices.find(
        (v) => v.lang.startsWith('zh') || v.lang.includes('cmn') || v.name.includes('Chinese')
      );
      if (zhVoice) {
        utterance.voice = zhVoice;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      if (onEnd) onEnd();
    }
  }
}

export const sound = new SoundManager();
