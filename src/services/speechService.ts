export interface SpeechOptions {
  rate?: number
  pitch?: number
  volume?: number
  lang?: string
}

class SpeechService {
  private synth: SpeechSynthesis | null
  private voice: SpeechSynthesisVoice | null
  private speaking = false
  private queue: Array<{ text: string; options: SpeechOptions }> = []

  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null
    this.voice = null
    if (this.synth) {
      this.synth.onvoiceschanged = () => this.selectVoice()
      setTimeout(() => this.selectVoice(), 200)
    }
  }

  private selectVoice(): void {
    if (!this.synth) return
    const voices = this.synth.getVoices()
    this.voice =
      voices.find(v => v.lang === 'zh-CN' && v.localService) ??
      voices.find(v => v.lang === 'zh-CN') ??
      voices.find(v => v.lang.startsWith('zh')) ??
      voices[0] ??
      null
  }

  isSupported(): boolean {
    return this.synth !== null
  }

  speak(text: string, options?: SpeechOptions): void {
    if (!this.synth) return
    if (this.speaking) {
      this.queue.push({ text, options: options ?? {} })
      return
    }
    this.speakNow(text, options)
  }

  private speakNow(text: string, options?: SpeechOptions): void {
    if (!this.synth) return
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = this.voice
    utterance.rate = options?.rate ?? 0.7
    utterance.pitch = options?.pitch ?? 1.0
    utterance.volume = options?.volume ?? 1.0
    utterance.lang = options?.lang ?? 'zh-CN'

    utterance.onend = () => {
      this.speaking = false
      this.processQueue()
    }
    utterance.onerror = (event) => {
      if (event.error !== 'interrupted') {
        console.warn('SpeechSynthesis error:', event.error)
      }
      this.speaking = false
      this.processQueue()
    }

    this.speaking = true
    this.synth.speak(utterance)
  }

  private processQueue(): void {
    const next = this.queue.shift()
    if (next) this.speakNow(next.text, next.options)
  }

  stop(): void {
    if (this.synth) {
      this.synth.cancel()
    }
    this.speaking = false
    this.queue = []
  }
}

export const speechService = new SpeechService()
