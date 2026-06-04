import { ref } from 'vue'
import { speechService, type SpeechOptions } from '@/services/speechService'

export function useSpeech() {
  const isSpeaking = ref(false)
  const isSupported = speechService.isSupported()

  function speak(text: string, options?: SpeechOptions): void {
    if (!speechService.isSupported()) return
    isSpeaking.value = true
    speechService.speak(text, options)
    const estimatedDuration = Math.max(text.length * 150, 600)
    setTimeout(() => {
      isSpeaking.value = false
    }, estimatedDuration)
  }

  /**
   * Speak multiple texts in sequence. Each text is queued and spoken after the previous finishes.
   */
  function speakSequence(texts: string[], options?: SpeechOptions): void {
    if (!speechService.isSupported()) return
    isSpeaking.value = true
    texts.forEach((text) => {
      speechService.speak(text, options)
    })
    // Estimate total duration for isSpeaking flag
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
