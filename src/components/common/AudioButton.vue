<script setup lang="ts">
import { useSpeech } from '@/composables/useSpeech'

const props = defineProps<{
  text: string
  disabled?: boolean
  subtle?: boolean
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
    :class="{ speaking: isSpeaking, disabled: disabled || !isSupported, subtle }"
    :disabled="disabled || !isSupported"
    :title="isSupported ? '点击发音' : '您的浏览器不支持语音'"
    @click.stop="handleClick"
  >
    <span class="speaker-icon">{{ isSupported ? (isSpeaking ? '🔊' : '🔈') : '🔇' }}</span>
    <span v-if="isSpeaking" class="wave-ring" />
  </button>
</template>

<style scoped>
.audio-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  min-height: 36px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(4px);
  transition: all var(--transition-fast);
  cursor: pointer;
  position: relative;
}

.audio-btn:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.9);
  transform: scale(1.1);
}

.audio-btn.speaking {
  background: var(--color-brand-orange);
  animation: pulse 0.6s ease-in-out infinite;
}

.audio-btn.speaking .speaker-icon {
  filter: brightness(0) invert(1);
}

.audio-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Subtle — smaller, for browse cards */
.audio-btn.subtle {
  min-width: 28px;
  min-height: 28px;
  background: rgba(255, 255, 255, 0.5);
}

.audio-btn.subtle:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.85);
}

.audio-btn.subtle.speaking {
  background: var(--color-brand-orange);
}

.wave-ring {
  position: absolute;
  inset: -4px;
  border-radius: inherit;
  border: 2px solid rgba(255, 140, 66, 0.5);
  animation: waveOut 1s ease-out infinite;
  pointer-events: none;
}

.speaker-icon {
  font-size: var(--font-size-base);
  transition: transform var(--transition-fast);
  position: relative;
  z-index: 1;
}

.audio-btn.subtle .speaker-icon {
  font-size: var(--font-size-sm);
}

.audio-btn.speaking .speaker-icon {
  animation: bounceIcon 0.3s var(--ease-bounce);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

@keyframes waveOut {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.4); opacity: 0; }
}

@keyframes bounceIcon {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
</style>
