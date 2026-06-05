<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { GameState } from '@/types/game'
import type { StickerGrade } from '@/types/game'
import { STICKER_DEFS, ROUNDS_PER_GAME } from '@/types/game'
import { updateLevelProgress, getLevelProgress, checkAndUnlockAchievements } from '@/utils/gameStorage'
import StarRating from './StarRating.vue'

const props = defineProps<{
  engine: ReturnType<typeof import('@/composables/useGameEngine')['useGameEngine']>
}>()

const emit = defineEmits<{
  replay: []
  nextLevel: []
  backToLobby: []
}>()

const state = props.engine.state as GameState
const stars = props.engine.stars

const stickerGrade = computed<StickerGrade | null>(() => {
  if (stars.value >= 3) return 'gold'
  if (stars.value >= 2) return 'silver'
  if (stars.value >= 1) return 'bronze'
  return null
})

const stickerDef = computed(() => STICKER_DEFS.find(s => s.level === state.level))
const stickerName = computed(() => stickerDef.value?.name ?? '')
const stickerEmoji = computed(() => stickerDef.value?.emoji ?? '')

const prevBest = computed(() => getLevelProgress(state.level).bestStars)
const isNewHighScore = computed(() => stars.value > prevBest.value)
const isFirstClear = computed(() => prevBest.value === 0 && stars.value >= 1)

const newAchievements = ref<string[]>([])

onMounted(() => {
  updateLevelProgress(state.level, state.score, stars.value, stickerGrade.value)
  newAchievements.value = checkAndUnlockAchievements()
})
</script>

<template>
  <div class="result-overlay">
    <div class="result-panel">
      <div class="panda-celebrate">🐼</div>
      <p class="congrats-text">
        <template v-if="stars >= 3">太厉害了!</template>
        <template v-else-if="stars >= 2">真棒!</template>
        <template v-else-if="stars >= 1">不错哦!</template>
        <template v-else>再试一次吧!</template>
      </p>

      <StarRating :stars="stars" size="lg" />

      <!-- sticker -->
      <div v-if="stickerGrade" class="sticker-award" :class="`grade-${stickerGrade}`">
        <span class="sticker-emoji">{{ stickerEmoji }}</span>
        <span class="sticker-name">获得贴纸: {{ stickerName }}!</span>
        <span v-if="isNewHighScore" class="record-badge">新纪录!</span>
        <span v-if="isFirstClear" class="first-badge">首次通关!</span>
      </div>

      <!-- stats -->
      <div class="stats">
        <div class="stat">
          <span class="stat-value">{{ state.score }}</span>
          <span class="stat-label">得分</span>
        </div>
        <div class="stat">
          <span class="stat-value">{{ state.correctFirstTry }}/{{ ROUNDS_PER_GAME }}</span>
          <span class="stat-label">首次正确</span>
        </div>
        <div class="stat">
          <span class="stat-value">x{{ state.maxCombo }}</span>
          <span class="stat-label">最高连击</span>
        </div>
      </div>

      <!-- buttons -->
      <div class="actions">
        <button class="btn btn-replay" @click="emit('replay')">🔄 再玩一次</button>
        <button
          class="btn btn-next"
          :disabled="state.level >= 6"
          @click="emit('nextLevel')"
        >
          ▶ {{ state.level >= 6 ? '已是最后一关' : '下一关' }}
        </button>
        <button class="btn btn-back" @click="emit('backToLobby')">📋 返回关卡</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  backdrop-filter: blur(2px);
}

.result-panel {
  background: var(--color-surface, #fff);
  border-radius: 24px 24px 0 0;
  padding: 32px 24px 40px;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  animation: slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.panda-celebrate { font-size: 3.5rem; }

.congrats-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-brand-orange, #FF8C42);
}

.sticker-award {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 16px;
  background: var(--color-neutral-50, #f9f9f9);
  position: relative;
  border: 2px solid;
}

.grade-gold { border-color: #F0C75E; box-shadow: 0 0 12px rgba(240, 199, 94, 0.3); }
.grade-silver { border-color: #C0C0C0; }
.grade-bronze { border-color: #CD7F32; }

.sticker-emoji { font-size: 2rem; }
.sticker-name { font-size: 1rem; font-weight: 600; color: var(--color-text-primary, #333); }

.record-badge, .first-badge {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 10px;
  background: #F0C75E;
  color: #fff;
  font-weight: 700;
}

.stats {
  display: flex;
  gap: 24px;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat-value { font-size: 1.2rem; font-weight: 700; color: var(--color-text-primary, #333); }
.stat-label { font-size: 0.75rem; color: var(--color-text-secondary, #888); }

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  width: 100%;
}

.btn {
  padding: 12px 20px;
  border-radius: 14px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
}

.btn:hover:not(:disabled) { transform: scale(1.03); }
.btn:disabled { opacity: 0.4; cursor: default; }

.btn-replay { background: var(--color-brand-orange-bg, #FFF3E6); color: var(--color-brand-orange, #FF8C42); }
.btn-next { background: var(--color-brand-orange, #FF8C42); color: #fff; }
.btn-back { background: var(--color-divider, #e8e8e8); color: var(--color-text-secondary, #888); }

@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@media (min-width: 768px) {
  .result-overlay { align-items: center; }
  .result-panel { border-radius: 24px; max-width: 420px; }
}
</style>
