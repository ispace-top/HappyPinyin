import { ref, computed } from 'vue'

type AudioMode = 'auto' | 'manual'
const STORAGE_KEY = 'happypinyin_audio_mode'

function loadMode(): AudioMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'manual') return 'manual'
  } catch { /* ignore */ }
  return 'auto'
}

// Module-level singleton — all components share the same state
const audioMode = ref<AudioMode>(loadMode())

function persistMode(mode: AudioMode): void {
  try { localStorage.setItem(STORAGE_KEY, mode) } catch { /* ignore */ }
}

export function useAudioMode() {
  const isAutoMode = computed(() => audioMode.value === 'auto')

  function toggle(): void {
    audioMode.value = audioMode.value === 'auto' ? 'manual' : 'auto'
    persistMode(audioMode.value)
  }

  function shouldAutoSpeak(): boolean {
    return audioMode.value === 'auto'
  }

  return { audioMode, isAutoMode, toggle, shouldAutoSpeak }
}
