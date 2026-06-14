<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  character: string
  words?: string
  feedbackState?: 'idle' | 'correct' | 'wrong'
}>(), {
  words: '',
  feedbackState: 'idle',
})

defineEmits<{
  replay: []
}>()

const burstParticles = ref<{ id: number; x: number; y: number; color: string; size: number }[]>([])
const showBurst = ref(false)
let particleId = 0

const FRAGMENT_COLORS = ['#FF6B6B', '#E55A5A', '#FF8C42', '#F0C75E', '#7EC8A0', '#5C8A3C', '#FFB380', '#FF4444']

watch(() => props.feedbackState, (state) => {
  if (state === 'correct') {
    const particles = []
    for (let i = 0; i < 18; i++) {
      const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5) * 0.3
      const distance = 40 + Math.random() * 60
      particles.push({
        id: particleId++,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        color: FRAGMENT_COLORS[i % FRAGMENT_COLORS.length]!,
        size: 6 + Math.random() * 10,
      })
    }
    burstParticles.value = particles
    showBurst.value = true
    setTimeout(() => { showBurst.value = false }, 800)
  } else {
    showBurst.value = false
    burstParticles.value = []
  }
})
</script>

<template>
  <div
    class="char-object"
    :class="`feedback-${feedbackState}`"
  >
    <div class="object-body">
      <span class="object-emoji">🍎</span>
      <span class="object-char">{{ character }}</span>

      <!-- Burst particles -->
      <span
        v-for="p in burstParticles"
        v-show="showBurst"
        :key="p.id"
        class="burst-particle"
        :style="{
          '--dx': `${p.x}px`,
          '--dy': `${p.y}px`,
          '--size': `${p.size}px`,
          '--color': p.color,
        }"
      />
    </div>
    <button class="object-speaker" @click="$emit('replay')" aria-label="重听发音">
      🔊
    </button>
    <span v-if="words" class="object-words">{{ words }}</span>
  </div>
</template>

<style scoped>
.char-object {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.object-body {
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #FF6B6B 0%, #E55A5A 100%);
  border-radius: 50% 50% 50% 50% / 45% 45% 55% 55%;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.25);
  transition: background 0.3s, box-shadow 0.3s;
}

/* Stem */
.object-body::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 14px;
  background: #5C8A3C;
  border-radius: 3px 3px 0 0;
}

/* Leaf */
.object-body::after {
  content: '';
  position: absolute;
  top: 2px;
  left: calc(50% + 6px);
  width: 16px;
  height: 8px;
  background: #7EC8A0;
  border-radius: 0 50% 50% 0;
  transform: rotate(-20deg);
}

.object-emoji {
  position: absolute;
  font-size: 1.8rem;
  opacity: 0.18;
  pointer-events: none;
}

.object-char {
  position: relative;
  z-index: 1;
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  line-height: 1;
}

.object-speaker {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid rgba(255, 140, 66, 0.25);
  background: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.object-speaker:hover {
  background: #fff;
  border-color: rgba(255, 140, 66, 0.5);
  transform: scale(1.1);
}

.object-speaker:active {
  transform: scale(0.9);
}

.object-words {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-secondary, #777);
  text-align: center;
  line-height: 1.3;
  max-width: 120px;
}

/* Burst particles */
.burst-particle {
  position: absolute;
  z-index: 10;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  background: var(--color);
  top: 50%;
  left: 50%;
  margin-left: calc(var(--size) / -2);
  margin-top: calc(var(--size) / -2);
  pointer-events: none;
  animation: burst-out 0.7s cubic-bezier(0, 0.7, 0.3, 1) forwards;
}

/* Feedback states */
.feedback-correct .object-body {
  background: linear-gradient(160deg, #7EC8A0 0%, #5A9E75 100%);
  box-shadow: 0 4px 24px rgba(126, 200, 160, 0.5);
  animation: pop-burst 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.feedback-wrong .object-body {
  animation: shake 0.5s ease-in-out;
}

@keyframes pop-burst {
  0%   { transform: scale(0.4); opacity: 0; }
  40%  { transform: scale(1.25); }
  70%  { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes burst-out {
  0%   { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-12px); }
  30% { transform: translateX(12px); }
  45% { transform: translateX(-8px); }
  60% { transform: translateX(8px); }
  75% { transform: translateX(-4px); }
  90% { transform: translateX(4px); }
}

@media (min-width: 768px) {
  .object-body {
    width: 110px;
    height: 110px;
  }
  .object-char { font-size: 2.6rem; }
  .object-emoji { font-size: 2.2rem; }
}
</style>
