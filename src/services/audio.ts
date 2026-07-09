// src/services/audio.ts
class AudioService {
  private audioContext: AudioContext | null = null
  private initialized = false
  private pendingBootSound: boolean = false

  private init() {
    if (!this.initialized) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        this.initialized = true
        // Se houver som pendente, toca agora
        if (this.pendingBootSound) {
          this.playBoot()
          this.pendingBootSound = false
        }
      } catch (e) {
        console.warn('Web Audio API não suportada')
      }
    }
  }

  // Método para garantir que o contexto seja iniciado por interação do usuário
  public resume() {
    this.init()
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  playKeyPress() {
    this.init()
    if (!this.audioContext) return
    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      gainNode.gain.setValueAtTime(0.08, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.04)
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.04)
    } catch (e) {}
  }

  playEnter() {
    this.init()
    if (!this.audioContext) return
    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      oscillator.frequency.value = 600
      oscillator.type = 'sine'
      gainNode.gain.setValueAtTime(0.12, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.08)
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.08)
    } catch (e) {}
  }

  playError() {
    this.init()
    if (!this.audioContext) return
    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      oscillator.frequency.value = 440
      oscillator.type = 'square'
      gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15)
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + 0.15)
    } catch (e) {}
  }

  playBoot() {
    this.init()
    if (!this.audioContext) {
      // Marca como pendente para tocar quando o contexto for inicializado
      this.pendingBootSound = true
      return
    }
    const frequencies = [523, 659, 784, 1047]
    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        try {
          const osc = this.audioContext!.createOscillator()
          const gain = this.audioContext!.createGain()
          osc.connect(gain)
          gain.connect(this.audioContext!.destination)
          osc.frequency.value = freq
          osc.type = 'sine'
          gain.gain.setValueAtTime(0.1, this.audioContext!.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext!.currentTime + 0.1)
          osc.start(this.audioContext!.currentTime)
          osc.stop(this.audioContext!.currentTime + 0.1)
        } catch (e) {}
      }, i * 120)
    })
  }

  playSuccess() {
    this.init()
    if (!this.audioContext) return
    try {
      const osc = this.audioContext.createOscillator()
      const gain = this.audioContext.createGain()
      osc.connect(gain)
      gain.connect(this.audioContext.destination)
      osc.frequency.value = 880
      osc.type = 'sine'
      gain.gain.setValueAtTime(0.12, this.audioContext.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.12)
      osc.start(this.audioContext.currentTime)
      osc.stop(this.audioContext.currentTime + 0.12)
    } catch (e) {}
  }

  playReady() {
    this.init()
    if (!this.audioContext) return
    try {
      const playTone = (freq: number, delay: number) => {
        setTimeout(() => {
          try {
            const osc = this.audioContext!.createOscillator()
            const gain = this.audioContext!.createGain()
            osc.connect(gain)
            gain.connect(this.audioContext!.destination)
            osc.frequency.value = freq
            osc.type = 'sine'
            gain.gain.setValueAtTime(0.1, this.audioContext!.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext!.currentTime + 0.06)
            osc.start(this.audioContext!.currentTime)
            osc.stop(this.audioContext!.currentTime + 0.06)
          } catch (e) {}
        }, delay)
      }
      playTone(660, 0)
      playTone(880, 100)
    } catch (e) {}
  }
}

export const audio = new AudioService()