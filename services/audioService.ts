// Using Web Audio API to synthesize sounds since we cannot bundle MP3s.
// This ensures the user hears sound effects immediately.

class AudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.error("Web Audio API not supported");
    }
  }

  private getContext(): AudioContext | null {
    if (!this.ctx) return null;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
  }

  playSelect() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  playCorrect() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    
    // Ding-dong effect
    const t = ctx.currentTime;
    
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.frequency.setValueAtTime(600, t);
    gain1.gain.setValueAtTime(0.1, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 1);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 1);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.frequency.setValueAtTime(800, t + 0.2);
    gain2.gain.setValueAtTime(0.1, t + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t + 0.2);
    osc2.stop(t + 1.2);
  }

  playWrong() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.linearRampToValueAtTime(100, t + 0.5);
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  }

  playIntro() {
     // A simple rising drone
     if (this.isMuted) return;
     const ctx = this.getContext();
     if (!ctx) return;
     const osc = ctx.createOscillator();
     const gain = ctx.createGain();
     osc.type = 'triangle';
     osc.frequency.setValueAtTime(110, ctx.currentTime);
     osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 2);
     gain.gain.setValueAtTime(0, ctx.currentTime);
     gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 1);
     gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 3);
     osc.connect(gain);
     gain.connect(ctx.destination);
     osc.start();
     osc.stop(ctx.currentTime + 3);
  }
  
  playLockIn() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }
}

export const audioService = new AudioService();