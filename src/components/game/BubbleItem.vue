<script setup lang="ts">
import { computed } from 'vue'
import type { PinyinElement } from '@/types/pinyin'

const props = defineProps<{
  element: PinyinElement
  color: string
  animState: 'idle' | 'correct-pop' | 'wrong-bounce'
  disabled: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
}>()

const fontSize = computed(() => {
  const len = props.element.text.length
  if (len <= 1) return '1.8rem'
  if (len <= 2) return '1.4rem'
  return '1.1rem'
})

const bubbleStyle = computed(() => ({
  '--bubble-color': props.color,
  '--font-size': fontSize.value,
}))

const bubbleClass = computed(() => ({
  bubble: true,
  [`state-${props.animState}`]: true,
  disabled: props.disabled,
}))

function handleClick() {
  if (!props.disabled && props.animState === 'idle') {
    emit('select', props.element.id)
  }
}
</script>

<template>
  <button
    :class="bubbleClass"
    :style="bubbleStyle"
    :aria-label="`拼音 ${element.text}，${element.category === 'initial' ? '声母' : element.category === 'final' ? '韵母' : '整体认读音节'}`"
    :disabled="disabled || animState !== 'idle'"
    @click="handleClick"
  >
    <span class="bubble-highlight" />
    <span class="bubble-text">{{ element.text }}</span>
  </button>
</template>

<style scoped>
.bubble {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.45), var(--bubble-color) 70%);
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.08),
    inset 0 -3px 6px rgba(0, 0, 0, 0.06),
    inset 0 3px 6px rgba(255, 255, 255, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}

.bubble-highlight {
  position: absolute;
  top: 14%;
  left: 22%;
  width: 28%;
  height: 22%;
  background: radial-gradient(ellipse, rgba(255,255,255,0.7), transparent);
  border-radius: 50%;
  pointer-events: none;
}

.bubble-text {
  position: relative;
  z-index: 1;
  font-family: var(--font-family-display, 'Nunito', 'PingFang SC', sans-serif);
  font-size: var(--font-size);
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  line-height: 1;
  user-select: none;
}

/* idle: gentle float */
.state-idle {
  animation: float 2.5s ease-in-out infinite;
  animation-delay: var(--float-delay, 0s);
}

/* hover: subtle scale */
@media (hover: hover) {
  .state-idle:hover:not(:disabled) {
    transform: scale(1.08);
    box-shadow:
      0 6px 20px rgba(0, 0, 0, 0.12),
      inset 0 -3px 6px rgba(0, 0, 0, 0.06),
      inset 0 3px 6px rgba(255, 255, 255, 0.3);
  }
}

/* pressed/active */
.state-idle:active:not(:disabled) {
  transform: scale(0.93);
  transition: transform 0.08s ease-out;
}

/* correct-pop: explode then disappear */
.state-correct-pop {
  animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  pointer-events: none;
}

/* wrong-bounce: shrink, shake, recover */
.state-wrong-bounce {
  animation: bounce 0.8s ease-out forwards;
  pointer-events: none;
}

/* disabled (during feedback phase, all bubbles disable) */
.disabled {
  pointer-events: none;
  opacity: 0.5;
}

/* keyboard focus */
.bubble:focus-visible {
  outline: 3px solid var(--color-brand-orange, #FF8C42);
  outline-offset: 3px;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes pop {
  0% { transform: scale(1); opacity: 1; }
  40% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0); opacity: 0; }
}

@keyframes bounce {
  0% { transform: scale(1); }
  15% { transform: scale(0.75); }
  30% { transform: scale(0.75) translateX(-4px); }
  45% { transform: scale(0.75) translateX(4px); }
  60% { transform: scale(0.75) translateX(-3px); }
  75% { transform: scale(0.95) translateX(0); }
  100% { transform: scale(1); }
}

/* responsive sizing */
@media (min-width: 768px) {
  .bubble {
    width: 96px;
    height: 96px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .state-idle { animation: none; }
  .state-correct-pop {
    animation: none;
    opacity: 0;
  }
  .state-wrong-bounce {
    animation: none;
    transform: scale(0.85);
  }
}
</style>
