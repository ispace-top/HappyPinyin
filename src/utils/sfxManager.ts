import type { SfxId } from '@/types/game'

class SFXManager {
  private ctx: AudioContext | null = null
  private buffers: Map<string, AudioBuffer> = new Map()
  private loaded = false
  private resumed = false

  private getContext(): AudioContext | null {
    if (!this.ctx) {
      try {
        this.ctx = new AudioContext()
      } catch {
        return null
      }
    }
    if (this.ctx.state === 'suspended' && !this.resumed) {
      this.ctx.resume().then(() => { this.resumed = true })
    }
    return this.ctx
  }

  async preloadAll(): Promise<void> {
    if (this.loaded) return
    const ctx = this.getContext()
    if (!ctx) return

    const sounds: Array<{ id: SfxId; generate: (ctx: AudioContext) => AudioBuffer }> = [
      { id: 'pop-correct', generate: this.genPopCorrect },
      { id: 'pop-wrong', generate: this.genPopWrong },
      { id: 'sticker-fly', generate: this.genStickerFly },
      { id: 'star-appear', generate: this.genStarAppear },
      { id: 'sticker-collect', generate: this.genStickerCollect },
      { id: 'countdown', generate: this.genCountdown },
      { id: 'countdown-go', generate: this.genCountdownGo },
      { id: 'achievement', generate: this.genAchievement },
    ]

    for (const s of sounds) {
      try {
        this.buffers.set(s.id, s.generate(ctx))
      } catch {
        // skip on generation failure
      }
    }
    this.loaded = true
  }

  play(id: SfxId): void {
    const ctx = this.getContext()
    if (!ctx) return
    const buffer = this.buffers.get(id)
    if (!buffer) return
    try {
      const source = ctx.createBufferSource()
      source.buffer = buffer
      const gain = ctx.createGain()
      gain.gain.value = 0.3
      source.connect(gain)
      gain.connect(ctx.destination)
      source.start()
    } catch {
      // silently fail — audio is enhancement, not critical
    }
  }

  resumeContext(): void {
    const ctx = this.getContext()
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().then(() => { this.resumed = true })
    }
  }

  // === Procedural sound generators ===

  private genPopCorrect = (ctx: AudioContext): AudioBuffer => {
    const duration = 0.3
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      const t = i / ctx.sampleRate
      const env = Math.exp(-t * 12)
      data[i] = (Math.sin(2 * Math.PI * 800 * t) + Math.sin(2 * Math.PI * 1200 * t) * 0.5) * env * 0.4
    }
    return buffer
  }

  private genPopWrong = (ctx: AudioContext): AudioBuffer => {
    const duration = 0.2
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      const t = i / ctx.sampleRate
      const env = Math.exp(-t * 16)
      data[i] = Math.sin(2 * Math.PI * 300 * t) * env * 0.3
    }
    return buffer
  }

  private genStickerFly = (ctx: AudioContext): AudioBuffer => {
    const duration = 0.3
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      const t = i / ctx.sampleRate
      const env = Math.exp(-t * 10)
      const freq = 1200 + t * 2000
      data[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.2
    }
    return buffer
  }

  private genStarAppear = (ctx: AudioContext): AudioBuffer => {
    const duration = 0.4
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      const t = i / ctx.sampleRate
      const env = Math.exp(-t * 8)
      data[i] = Math.sin(2 * Math.PI * 1600 * t) * env * 0.3
    }
    return buffer
  }

  private genStickerCollect = (ctx: AudioContext): AudioBuffer => {
    const duration = 0.6
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      const t = i / ctx.sampleRate
      const env = Math.exp(-t * 5)
      data[i] = (Math.sin(2 * Math.PI * 1000 * t) + Math.sin(2 * Math.PI * 1500 * t) * 0.5 + Math.sin(2 * Math.PI * 2000 * t) * 0.25) * env * 0.2
    }
    return buffer
  }

  private genCountdown = (ctx: AudioContext): AudioBuffer => {
    const duration = 0.15
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      const t = i / ctx.sampleRate
      const env = Math.exp(-t * 20)
      data[i] = Math.sin(2 * Math.PI * 600 * t) * env * 0.3
    }
    return buffer
  }

  private genCountdownGo = (ctx: AudioContext): AudioBuffer => {
    const duration = 0.3
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      const t = i / ctx.sampleRate
      const env = Math.exp(-t * 6)
      const freq = 600 + t * 1000
      data[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.3
    }
    return buffer
  }

  private genAchievement = (ctx: AudioContext): AudioBuffer => {
    const duration = 1.5
    const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    const notes = [523, 659, 784, 1047]
    for (let i = 0; i < data.length; i++) {
      const t = i / ctx.sampleRate
      const noteIdx = Math.min(Math.floor(t / 0.3), notes.length - 1)
      const freq = notes[noteIdx]!
      const localT = t - noteIdx * 0.3
      const env = Math.exp(-localT * 5)
      data[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.2
    }
    return buffer
  }
}

export const sfxManager = new SFXManager()
