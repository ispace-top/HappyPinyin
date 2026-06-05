import { ref } from 'vue'
import { speechService, type SpeechOptions } from '@/services/speechService'

// Module-level singleton — ALL components share the same isSpeaking state
const isSpeaking = ref(false)

export function useSpeech() {
  const isSupported = speechService.isSupported()

  function speak(text: string, options?: SpeechOptions): void {
    if (!speechService.isSupported()) return
    speechService.stop()
    isSpeaking.value = true
    speechService.speak(text, options)
    const estimatedDuration = Math.max(text.length * 150, 600)
    setTimeout(() => {
      isSpeaking.value = false
    }, estimatedDuration)
  }

  function speakSequence(texts: string[], options?: SpeechOptions): void {
    if (!speechService.isSupported()) return
    speechService.stop()
    isSpeaking.value = true
    texts.forEach((text) => {
      speechService.speak(text, options)
    })
    const totalDuration = texts.reduce((sum, t) => sum + Math.max(t.length * 150, 500), 0) + 300
    setTimeout(() => {
      isSpeaking.value = false
    }, totalDuration)
  }

  function stop(): void {
    speechService.stop()
    isSpeaking.value = false
  }

  return { speak, speakSequence, stop, isSpeaking, isSupported }
}
