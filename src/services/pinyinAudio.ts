let currentAudio: HTMLAudioElement | null = null
const onEndCallbacks: Array<() => void> = []

export function play(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    stop()
    const audio = new Audio(path)
    currentAudio = audio

    audio.onended = () => {
      if (currentAudio === audio) currentAudio = null
      onEndCallbacks.forEach(cb => cb())
      resolve(true)
    }
    audio.onerror = () => {
      if (currentAudio === audio) currentAudio = null
      resolve(false)
    }

    audio.play().catch(() => {
      if (currentAudio === audio) currentAudio = null
      resolve(false)
    })
  })
}

export function stop(): void {
  if (currentAudio) {
    currentAudio.onended = null
    currentAudio.onerror = null
    currentAudio.pause()
    currentAudio = null
  }
}

export function onEnd(cb: () => void): () => void {
  onEndCallbacks.push(cb)
  return () => {
    const idx = onEndCallbacks.indexOf(cb)
    if (idx >= 0) onEndCallbacks.splice(idx, 1)
  }
}

export function getAudioPath(category: 'initial' | 'final' | 'wholeSyllable', text: string): string | null {
  if (category === 'initial') {
    return `/audio/initials/${text}.mp3`
  }
  if (category === 'final') {
    const mapping: Record<string, string> = { 'ü': 'v', 'üe': 've', 'ün': 'vn' }
    const mapped = mapping[text] ?? text
    return `/audio/finals/${mapped}.mp3`
  }
  if (category === 'wholeSyllable') {
    return `/audio/whole-syllables/${text}1.mp3`
  }
  return null
}
