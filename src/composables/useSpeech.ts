import { ref } from 'vue'
import { speechService, type SpeechOptions } from '@/services/speechService'

// Track which text is currently being spoken
const speakingText = ref<string | null>(null)

export function useSpeech() {
  const isSupported = speechService.isSupported()

  function speak(text: string, options?: SpeechOptions): void {
    if (!speechService.isSupported()) return
    speechService.stop()
    speakingText.value = text
    const unsub = speechService.onEnd(() => {
      if (speakingText.value === text) {
        speakingText.value = null
      }
      unsub()
    })
    speechService.speak(text, options)
  }

  function speakSequence(texts: string[], options?: SpeechOptions): void {
    if (!speechService.isSupported()) return
    speechService.stop()
    const first = texts[0]
    if (first) speakingText.value = first
    let completed = 0
    texts.forEach((text) => {
      const unsub = speechService.onEnd(() => {
        completed++
        if (completed >= texts.length) {
          speakingText.value = null
        }
        unsub()
      })
      speechService.speak(text, options)
    })
  }

  function stop(): void {
    speechService.stop()
    speakingText.value = null
  }

  function isSpeaking(text?: string): boolean {
    if (text !== undefined) return speakingText.value === text
    return speakingText.value !== null
  }

  return { speak, speakSequence, stop, isSpeaking, isSupported }
}
