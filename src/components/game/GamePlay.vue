<script setup lang="ts">
import { computed, watch, ref, nextTick } from 'vue'
import type { GameState } from '@/types/game'
import { ROUNDS_PER_GAME } from '@/types/game'
import type { useGameEngine } from '@/composables/useGameEngine'
import BubbleItem from './BubbleItem.vue'
import ProgressBar from './ProgressBar.vue'
import { speechService } from '@/services/speechService'
import { sfxManager } from '@/utils/sfxManager'

const speechSupported = speechService.isSupported()

const props = defineProps<{
  engine: ReturnType<typeof useGameEngine>
}>()

const emit = defineEmits<{
  finished: []
}>()

// re-expose for template
const state = props.engine.state as GameState
const currentRoundData = props.engine.currentRoundData

// per-level progress bar color
const progressColor = computed(() => {
  const colors = ['#7EC8A0', '#4ECDC4', '#FFB380', '#6C9BD2', '#E8839A', '#F0C75E']
  return colors[state.level - 1] ?? '#7EC8A0'
})

const BUBBLE_COLORS = ['#FF6B6B', '#4ECDC4', '#FF8C42', '#FFB380', '#7EC8A0', '#F0C75E', '#6C9BD2', '#E8839A']

function getBubbleColor(index: number): string {
  return BUBBLE_COLORS[index % BUBBLE_COLORS.length]!
}

const bubbleStates = ref<Record<string, 'idle' | 'correct-pop' | 'wrong-bounce'>>({})
const feedbackActive = ref(false)
const roundTransitioning = ref(false)

function resetBubbleStates(options: Array<{ id: string }>) {
  const states: Record<string, 'idle' | 'correct-pop' | 'wrong-bounce'> = {}
  for (const opt of options) {
    states[opt.id] = 'idle'
  }
  bubbleStates.value = states
}

function handleSelect(elementId: string) {
  if (feedbackActive.value || roundTransitioning.value) return

  const result = props.engine.selectBubble(elementId)

  if (result === 'correct') {
    bubbleStates.value[elementId] = 'correct-pop'
    feedbackActive.value = true
    sfxManager.play('pop-correct')
    setTimeout(() => {
      feedbackActive.value = false
      roundTransitioning.value = true
      setTimeout(() => {
        roundTransitioning.value = false
        const hasMore = props.engine.nextRound()
        if (!hasMore) {
          emit('finished')
        } else {
          nextTick(() => {
            const round = currentRoundData.value
            if (round) {
              resetBubbleStates(round.options)
              props.engine.replayAudio()
            }
          })
        }
      }, 300)
    }, 600)
  } else {
    bubbleStates.value[elementId] = 'wrong-bounce'
    sfxManager.play('pop-wrong')
    setTimeout(() => {
      if (bubbleStates.value[elementId] === 'wrong-bounce') {
        bubbleStates.value[elementId] = 'idle'
      }
    }, 800)
  }
}

function handleReplay() {
  props.engine.replayAudio()
}

// reset bubble states when round data changes
watch(() => state.currentRound, () => {
  nextTick(() => {
    const round = currentRoundData.value
    if (round) resetBubbleStates(round.options)
  })
})
</script>

<template>
  <div class="gameplay">
    <!-- TTS not supported warning -->
    <div v-if="!speechSupported" class="tts-warning">
      ⚠️ 你的浏览器不支持语音功能，请在爸爸妈妈的帮助下使用 Chrome 或 Edge 浏览器打开
    </div>

    <!-- Panda HUD -->
    <div class="hud">
      <div class="panda-area">
        <span class="panda-emoji">🐼</span>
        <div class="panda-bubble">
          <span class="bubble-label">
            找一找
          </span>
          <button class="replay-btn" @click="handleReplay" aria-label="再听一次发音">
            🔈
          </button>
        </div>
      </div>
      <div class="round-info">
        <span class="round-text">第 {{ state.currentRound + 1 }} / {{ ROUNDS_PER_GAME }} 题</span>
        <div class="round-dots">
          <span
            v-for="r in ROUNDS_PER_GAME"
            :key="r"
            class="dot"
            :class="{
              done: r <= state.currentRound,
              active: r === state.currentRound + 1,
            }"
          />
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <ProgressBar
      :current="state.currentRound"
      :total="ROUNDS_PER_GAME"
      :color="progressColor"
    />

    <!-- Bubble Grid -->
    <div v-if="currentRoundData" class="bubble-grid" :class="`grid-${currentRoundData.options.length}`">
      <BubbleItem
        v-for="(opt, idx) in currentRoundData.options"
        :key="opt.id"
        :element="opt"
        :color="getBubbleColor(idx)"
        :anim-state="bubbleStates[opt.id] ?? 'idle'"
        :disabled="feedbackActive || roundTransitioning"
        :style="{ '--float-delay': `${idx * 0.3}s` }"
        @select="handleSelect"
      />
    </div>

    <!-- Score HUD -->
    <div class="score-hud">
      <span class="score">得分: {{ state.score }}</span>
      <span v-if="state.combo >= 2" class="combo">连击: x{{ state.combo }}</span>
    </div>
  </div>
</template>

<style scoped>
.gameplay {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 24px 16px;
  min-height: 100%;
}

.tts-warning {
  background: #FFF3CD;
  color: #856404;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  text-align: center;
  max-width: 400px;
  line-height: 1.5;
}

.hud {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  max-width: 500px;
}

.panda-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.panda-emoji {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.panda-bubble {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--color-surface, #fff);
  border-radius: 12px;
  padding: 8px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary, #333);
}

.replay-btn {
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 2px;
  line-height: 1;
}

.round-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.round-text {
  font-size: 0.85rem;
  color: var(--color-text-secondary, #888);
}

.round-dots {
  display: flex;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-divider, #e8e8e8);
  transition: background 0.2s;
}

.dot.done { background: var(--color-brand-orange, #FF8C42); }
.dot.active { background: var(--color-brand-orange, #FF8C42); transform: scale(1.4); }

.bubble-grid {
  display: grid;
  gap: 20px;
  justify-items: center;
  align-items: center;
  padding: 20px 0;
}

.grid-4 { grid-template-columns: repeat(2, 1fr); }
.grid-5 { grid-template-columns: repeat(3, 1fr); }
.grid-6 { grid-template-columns: repeat(3, 1fr); }

@media (min-width: 600px) {
  .grid-4, .grid-5, .grid-6 {
    grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
    max-width: 600px;
  }
}

@media (min-width: 768px) {
  .bubble-grid { gap: 28px; }
}

.score-hud {
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-primary, #333);
}

.combo {
  color: var(--color-brand-orange, #FF8C42);
  animation: pulse 0.5s ease-in-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
</style>
