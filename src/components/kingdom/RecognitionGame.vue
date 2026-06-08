<script setup lang="ts">
import { computed, watch, ref, nextTick } from 'vue'
import type { GameConfig } from '@/types/kingdom'
import type { useKingdomGameEngine } from '@/composables/useKingdomGameEngine'
import BubbleItem from '@/components/game/BubbleItem.vue'
import ProgressBar from '@/components/game/ProgressBar.vue'
import { speechService } from '@/services/speechService'
import { sfxManager } from '@/utils/sfxManager'

const props = defineProps<{
  engine: ReturnType<typeof useKingdomGameEngine>
  config: GameConfig
}>()

const emit = defineEmits<{
  finished: []
}>()

const state = props.engine.state
const currentRoundData = props.engine.currentRoundData

const speechSupported = speechService.isSupported()

const isBubble = computed(() => props.config.mechanic === 'bubble')

const progressColor = computed(() => props.config.id.includes('forest') ? '#7EC8A0' : '#E8839A')

const BUBBLE_COLORS = ['#FF6B6B', '#4ECDC4', '#FF8C42', '#FFB380', '#7EC8A0', '#F0C75E', '#6C9BD2', '#E8839A']
function getBubbleColor(index: number) { return BUBBLE_COLORS[index % BUBBLE_COLORS.length]! }

const itemStates = ref<Record<string, 'idle' | 'correct-pop' | 'wrong-bounce'>>({})
const feedbackActive = ref(false)
const roundTransitioning = ref(false)
const scoreBump = ref(false)

function resetItemStates() {
  const round = currentRoundData.value
  if (!round) return
  const states: Record<string, 'idle' | 'correct-pop' | 'wrong-bounce'> = {}
  for (const opt of round.options) states[opt.id] = 'idle'
  itemStates.value = states
}

function handleSelect(elementId: string) {
  if (feedbackActive.value || roundTransitioning.value) return

  const result = props.engine.selectAnswer(elementId)

  if (result === 'correct') {
    itemStates.value[elementId] = 'correct-pop'
    feedbackActive.value = true
    sfxManager.play('pop-correct')
    scoreBump.value = true
    setTimeout(() => { scoreBump.value = false }, 350)
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
            resetItemStates()
            props.engine.replayAudio()
          })
        }
      }, 300)
    }, 600)
  } else {
    itemStates.value[elementId] = 'wrong-bounce'
    feedbackActive.value = true
    sfxManager.play('pop-wrong')
    setTimeout(() => {
      feedbackActive.value = false
      if (itemStates.value[elementId] === 'wrong-bounce') {
        itemStates.value[elementId] = 'idle'
      }
    }, 800)
  }
}

function handleReplay() {
  props.engine.replayAudio()
}

watch(() => state.currentRound, () => {
  nextTick(() => resetItemStates())
})
</script>

<template>
  <div class="gameplay">
    <div v-if="!speechSupported" class="tts-warning">
      ⚠️ 你的浏览器不支持语音功能，请在爸爸妈妈的帮助下使用 Chrome 或 Edge 浏览器打开
    </div>

    <div class="hud">
      <div class="panda-area">
        <span class="panda-emoji">🐼</span>
        <div class="panda-bubble">
          <span class="bubble-label">找一找</span>
          <button class="replay-btn" @click="handleReplay" aria-label="再听一次发音">🔈</button>
        </div>
      </div>
      <div class="round-info">
        <span class="round-text">第 {{ state.currentRound + 1 }} / {{ state.rounds.length }} 题</span>
        <div class="round-dots">
          <span
            v-for="r in state.rounds.length" :key="r"
            class="dot"
            :class="{ done: r <= state.currentRound, active: r === state.currentRound + 1 }"
          />
        </div>
      </div>
    </div>

    <ProgressBar
      :current="state.currentRound"
      :total="state.rounds.length"
      :color="progressColor"
    />

    <!-- Bubble Grid -->
    <div v-if="currentRoundData && isBubble" class="bubble-grid" :class="`grid-${currentRoundData.options.length}`">
      <BubbleItem
        v-for="(opt, idx) in currentRoundData.options"
        :key="opt.id"
        :element="opt"
        :color="getBubbleColor(idx)"
        :anim-state="itemStates[opt.id] ?? 'idle'"
        :disabled="feedbackActive || roundTransitioning"
        :style="{ '--float-delay': `${idx * 0.3}s` }"
        @select="handleSelect"
      />
    </div>

    <!-- Card Grid (non-bubble) -->
    <div v-if="currentRoundData && !isBubble" class="card-grid" :class="`card-cols-${Math.min(currentRoundData.options.length, 4)}`">
      <button
        v-for="opt in currentRoundData.options"
        :key="opt.id"
        class="pinyin-card"
        :class="itemStates[opt.id] ?? 'idle'"
        :disabled="feedbackActive || roundTransitioning"
        @click="handleSelect(opt.id)"
      >
        <span class="card-emoji">{{ opt.category === 'initial' ? '🔤' : opt.category === 'final' ? '🎵' : '⭐' }}</span>
        <span class="card-text">{{ opt.text }}</span>
        <span class="card-highlight" />
      </button>
    </div>

    <div class="score-hud">
      <span class="score" :class="{ bump: scoreBump }">得分: {{ state.score }}</span>
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

.panda-emoji { font-size: 2.5rem; flex-shrink: 0; }

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

.round-text { font-size: 0.85rem; color: var(--color-text-secondary, #888); }

.round-dots { display: flex; gap: 4px; }

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-divider, #e8e8e8);
  transition: background 0.2s;
}

.dot.done { background: var(--color-brand-orange, #FF8C42); }
.dot.active { background: var(--color-brand-orange, #FF8C42); transform: scale(1.4); }

/* Card Grid */
.card-grid {
  display: grid;
  gap: 14px;
  justify-items: center;
  padding: 20px 0;
  width: 100%;
  max-width: 500px;
}

.card-cols-3 { grid-template-columns: repeat(3, 1fr); }
.card-cols-4 { grid-template-columns: repeat(4, 1fr); }
.card-cols-5, .card-cols-6 { grid-template-columns: repeat(3, 1fr); }

.pinyin-card {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 16px;
  border: 2px solid var(--color-divider, #e0e0e0);
  background: linear-gradient(145deg, #FFFFFF, #F5F7FA);
  box-shadow: 0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s, box-shadow 0.2s;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
}

.pinyin-card.idle:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.03);
  border-color: var(--color-brand-orange, #FF8C42);
  box-shadow: 0 8px 24px rgba(255,140,66,0.15), 0 2px 6px rgba(0,0,0,0.08);
}

.pinyin-card.idle:active:not(:disabled) {
  transform: scale(0.93);
}

.card-emoji {
  position: relative;
  z-index: 1;
  font-size: 0.75rem;
  line-height: 1;
  opacity: 0.6;
}

.card-text {
  position: relative;
  z-index: 1;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-text-primary, #2C3E50);
  transition: color 0.15s;
}

.card-highlight {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,140,66,0.06), rgba(255,179,128,0.02));
  transition: opacity 0.2s;
  opacity: 0;
}

.pinyin-card.idle:hover .card-highlight { opacity: 1; }

.pinyin-card.correct-pop {
  animation: card-correct 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards;
  border-color: #7EC8A0;
  box-shadow: 0 0 20px rgba(126,200,160,0.4);
  pointer-events: none;
}

.pinyin-card.wrong-bounce {
  animation: card-wrong 0.55s ease-out;
  border-color: #FF6B6B;
  box-shadow: 0 0 16px rgba(255,107,107,0.25);
  pointer-events: none;
}

.pinyin-card.correct-pop .card-text { color: #7EC8A0; }
.pinyin-card.wrong-bounce .card-text { color: #FF6B6B; }

@keyframes card-correct {
  0% { transform: scale(1); }
  30% { transform: scale(1.2); }
  60% { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 0.75; border-color: #7EC8A0; }
}

@keyframes card-wrong {
  0%, 100% { transform: translateX(0); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
  15% { transform: translateX(-8px); box-shadow: 0 0 16px rgba(255,107,107,0.3); }
  30% { transform: translateX(8px); }
  45% { transform: translateX(-6px); }
  60% { transform: translateX(6px); }
  75% { transform: translateX(-3px); }
  90% { transform: translateX(3px); }
}

/* Bubble Grid */
.bubble-grid {
  display: grid;
  gap: 20px;
  justify-items: center;
  align-items: center;
  padding: 20px 0;
}

.grid-4 { grid-template-columns: repeat(2, 1fr); }
.grid-5, .grid-6 { grid-template-columns: repeat(3, 1fr); }

.score-hud {
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-primary, #333);
}

.score.bump {
  animation: score-pop 0.35s cubic-bezier(0.34,1.56,0.64,1);
}

.combo {
  color: var(--color-brand-orange, #FF8C42);
  animation: pulse 0.5s ease-in-out;
}

@keyframes score-pop {
  0% { transform: scale(1); }
  40% { transform: scale(1.3); color: var(--color-brand-orange, #FF8C42); }
  100% { transform: scale(1); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

@media (min-width: 600px) {
  .bubble-grid { max-width: 600px; }
  .card-cols-5, .card-cols-6 { grid-template-columns: repeat(4, 1fr); }
}

@media (min-width: 768px) {
  .pinyin-card { width: 96px; height: 96px; }
  .card-text { font-size: 1.8rem; }
  .card-emoji { font-size: 0.85rem; }
  .bubble-grid { gap: 28px; }
}
</style>
