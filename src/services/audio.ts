// src/services/audio.ts

class AudioService {
  private audioCtx: AudioContext | null = null;

  private init() {
    if (!this.audioCtx) {
      this.audioCtx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    // Resume se estiver suspenso (necessário após interação do usuário)
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Som de tecla (clique curto)
  playKeyPress() {
    try {
      const ctx = this.init();
      if (!ctx) return;

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        600,
        ctx.currentTime + 0.02,
      );

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Silencia erros de áudio
    }
  }

  // Som de Enter (beep médio)
  playEnter() {
    try {
      const ctx = this.init();
      if (!ctx) return;

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(440, ctx.currentTime);

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.08);
    } catch (e) {
      // Silencia erros
    }
  }

  // Som de erro (buzzer)
  playError() {
    try {
      const ctx = this.init();
      if (!ctx) return;

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(150, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        80,
        ctx.currentTime + 0.2,
      );

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    } catch (e) {
      // Silencia erros
    }
  }

  // Som de boot (beep ascendente)
  playBoot() {
    try {
      const ctx = this.init();
      if (!ctx) return;

      // Primeiro beep curto
      let osc = ctx.createOscillator();
      let gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);

      // Segundo beep mais agudo após 0.15s
      setTimeout(() => {
        try {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.type = "sine";
          osc2.frequency.setValueAtTime(900, ctx.currentTime + 0.15);
          gain2.gain.setValueAtTime(0.08, ctx.currentTime + 0.15);
          gain2.gain.exponentialRampToValueAtTime(
            0.001,
            ctx.currentTime + 0.25,
          );
          osc2.start(ctx.currentTime + 0.15);
          osc2.stop(ctx.currentTime + 0.25);
        } catch (e) {}
      }, 150);
    } catch (e) {}
  }

  // Som de conclusão (sucesso)
  playSuccess() {
    try {
      const ctx = this.init();
      if (!ctx) return;

      // Sequência de duas notas ascendentes
      const playNote = (freq: number, delay: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + delay + 0.15,
        );
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.15);
      };
      playNote(523, 0); // C5
      playNote(659, 0.12); // E5
      playNote(784, 0.24); // G5
    } catch (e) {}
  }

  // Som de "pronto" (boot completo)
  playReady() {
    try {
      const ctx = this.init();
      if (!ctx) return;

      // Beep longo e grave
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  }
}

export const audio = new AudioService();
