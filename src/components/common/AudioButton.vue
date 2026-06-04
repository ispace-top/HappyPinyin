<script setup lang="ts">
import { useSpeech } from '@/composables/useSpeech'

const props = defineProps<{
  text: string
  disabled?: boolean
}>()

const { speak, isSpeaking, isSupported } = useSpeech()

function handleClick() {
  if (!props.disabled) {
    speak(props.text, { rate: 0.6 })
  }
}
</script>

<template>
  <button
    class="audio-btn"
    :class="{ speaking: isSpeaking, disabled: disabled || !isSupported }"
    :disabled="disabled || !isSupported"
    :title="isSupported ? '点击发音' : '您的浏览器不支持语音'"
    @click.stop="handleClick"
  >
    <span v-if="isSupported" class="speaker-icon">{{ isSpeaking ? '🔊' : '🔈' }}</span>
    <span v-else class="speaker-icon muted">🔇</span>
  </button>
</template>

<style scoped>
.audio-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: var(--touch-target-min);
  min-height: var(--touch-target-min);
  border-radius: var(--radius-full);
  background: var(--color-brand-orange-bg);
  transition: all var(--transition-fast);
  cursor: pointer;
}

.audio-btn:hover:not(.disabled) {
  background: var(--color-brand-orange-light);
  transform: scale(1.1);
}

.audio-btn.speaking {
  background: var(--color-brand-orange);
  animation: pulse 0.6s ease-in-out infinite;
}

.audio-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.speaker-icon {
  font-size: var(--font-size-xl);
}

.speaker-icon.muted {
  opacity: 0.5;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
</style>
