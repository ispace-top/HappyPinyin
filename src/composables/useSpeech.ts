import { ref } from 'vue'
import { speechService, type SpeechOptions } from '@/services/speechService'
import * as pinyinAudio from '@/services/pinyinAudio'

// Track which specific text or sequence is currently being spoken
const speakingText = ref<string | null>(null)
// Generic flag: true while any speech is active (for result card etc.)
const isSpeakingNow = ref(false)

export function useSpeech() {
  const isSupported = speechService.isSupported()

  function speak(text: string, options?: SpeechOptions): void {
    if (!speechService.isSupported()) return
    speechService.stop()
    speakingText.value = text
    isSpeakingNow.value = true
    const unsub = speechService.onEnd(() => {
      if (speakingText.value === text) {
        speakingText.value = null
      }
      isSpeakingNow.value = false
      unsub()
    })
    speechService.speak(text, options)
  }

  function speakSequence(texts: string[], options?: SpeechOptions): void {
    if (!speechService.isSupported()) return
    speechService.stop()
    const first = texts[0]
    if (first) {
      speakingText.value = first
      isSpeakingNow.value = true
    }
    let completed = 0
    texts.forEach((text) => {
      const unsub = speechService.onEnd(() => {
        completed++
        if (completed >= texts.length) {
          speakingText.value = null
          isSpeakingNow.value = false
        }
        unsub()
      })
      speechService.speak(text, options)
    })
  }

  function stop(): void {
    speechService.stop()
    pinyinAudio.stop()
    speakingText.value = null
    isSpeakingNow.value = false
  }

  function playAudioThenSpeak(audioPath: string, texts: string[], options?: SpeechOptions): void {
    speechService.stop()
    pinyinAudio.stop()
    speakingText.value = audioPath
    isSpeakingNow.value = true

    pinyinAudio.play(audioPath).then((success) => {
      if (!success || texts.length === 0) {
        speakingText.value = null
        isSpeakingNow.value = false
        return
      }
      speakSequence(texts, options)
    })
  }

  function playAudioSequence(audioPaths: string[], texts: string[], options?: SpeechOptions): void {
    speechService.stop()
    pinyinAudio.stop()
    isSpeakingNow.value = true

    if (audioPaths.length === 0) {
      if (texts.length === 0) {
        isSpeakingNow.value = false
        return
      }
      speakSequence(texts, options)
      return
    }

    speakingText.value = audioPaths[0]!
    const firstPath = audioPaths[0]!
    pinyinAudio.play(firstPath).then((success) => {
      if (!success) {
        speakingText.value = null
        isSpeakingNow.value = false
        return
      }
      // 递归播放剩余的本地音频
      if (audioPaths.length > 1) {
        playAudioSequence(audioPaths.slice(1), texts, options)
      } else {
        // 所有本地音频播放完毕，开始TTS
        if (texts.length === 0) {
          speakingText.value = null
          isSpeakingNow.value = false
        } else {
          speakSequence(texts, options)
        }
      }
    })
  }

  function playAudio(audioPath: string): void {
    speechService.stop()
    pinyinAudio.stop()
    speakingText.value = audioPath
    isSpeakingNow.value = true

    pinyinAudio.play(audioPath).then(() => {
      speakingText.value = null
      isSpeakingNow.value = false
    })
  }

  // With text: per-instance match; without: generic "anything speaking?"
  function isSpeaking(text?: string): boolean {
    if (text !== undefined) return speakingText.value === text
    return isSpeakingNow.value
  }

  return { speak, speakSequence, playAudio, playAudioThenSpeak, playAudioSequence, stop, isSpeaking, isSupported }
}
