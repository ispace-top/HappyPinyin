import { ref } from 'vue'
import { speechService, type SpeechOptions } from '@/services/speechService'

// Track which text is currently being spoken — only the matching AudioButton animates
const speakingText = ref<string | null>(null)

export function useSpeech() {
  const isSupported = speechService.isSupported()

  function speak(text: string, options?: SpeechOptions): void {
    if (!speechService.isSupported()) return
    speechService.stop()
    speakingText.value = text
    speechService.speak(text, options)
    const estimatedDuration = Math.max(text.length * 150, 600)
    setTimeout(() => {
      if (speakingText.value === text) {
        speakingText.value = null
      }
    }, estimatedDuration)
  }

  function speakSequence(texts: string[], options?: SpeechOptions): void {
    if (!speechService.isSupported()) return
    speechService.stop()
    const first = texts[0]
    if (first) speakingText.value = first
    texts.forEach((t) => {
      speechService.speak(t, options)
    })
    const totalDuration = texts.reduce((sum, t) => sum + Math.max(t.length * 150, 500), 0) + 300
    setTimeout(() => {
      speakingText.value = null
    }, totalDuration)
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
