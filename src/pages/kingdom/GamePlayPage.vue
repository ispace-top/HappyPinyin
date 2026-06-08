<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useKingdomGameEngine } from '@/composables/useKingdomGameEngine'
import { getGameById, ZONES } from '@/data/kingdom'
import { updateGameProgress, unlockSticker, checkAndUnlockAchievements } from '@/utils/kingdomStorage'
import { getStickerForGame } from '@/data/kingdom'
import CountdownOverlay from '@/components/game/CountdownOverlay.vue'
import StarRating from '@/components/game/StarRating.vue'
import RecognitionGame from '@/components/kingdom/RecognitionGame.vue'
import SpellingGame from '@/components/kingdom/SpellingGame.vue'
import TypingGame from '@/components/kingdom/TypingGame.vue'

const route = useRoute()
const router = useRouter()

const gameId = route.params.gameId as string
const gameConfig = computed(() => getGameById(gameId) ?? null)
const zone = computed(() => ZONES.find(z => z.id === gameConfig.value?.zoneId))

const engine = useKingdomGameEngine(gameConfig)

const gamePhase = computed(() => engine.state.phase)
const showCountdown = computed(() => gamePhase.value === 'countdown')
const showPlaying = computed(() => gamePhase.value === 'playing' || gamePhase.value === 'feedback')
const showResult = computed(() => gamePhase.value === 'result')

const resultSaved = ref(false)

function handleStart() {
  engine.startGame()
}

function handleCountdownDone() {
  engine.onCountdownEnd()
}

function handleGameFinished() {
  // Wait for nextRound to set phase to 'result'
}

function handleReplay() {
  resultSaved.value = false
  engine.startGame()
}

function handleBack() {
  engine.resetGame()
  if (zone.value) {
    router.push({ name: zone.value.id })
  } else {
    router.push({ name: 'kingdom' })
  }
}

// Save progress when result phase is reached
watch(() => engine.state.phase, (phase) => {
  if (phase === 'result' && !resultSaved.value) {
    resultSaved.value = true
    updateGameProgress(
      gameId,
      engine.state.score,
      engine.stars.value,
      engine.stickerGrade.value
    )
    // Unlock sticker if earned
    if (engine.stickerGrade.value) {
      const sticker = getStickerForGame(gameId)
      if (sticker) {
        unlockSticker(sticker.id)
      }
    }
    // Check for newly earned achievements
    checkAndUnlockAchievements()
  }
})

// Start game on mount
handleStart()
</script>

<template>
  <div class="game-play-page">
    <!-- Not found -->
    <div v-if="!gameConfig" class="not-found">
      <p>游戏未找到</p>
      <button class="back-btn" @click="handleBack">返回</button>
    </div>

    <template v-else>
      <!-- Countdown -->
      <CountdownOverlay
        v-if="showCountdown"
        @done="handleCountdownDone"
      />

      <!-- Recognition / Bubble Gameplay -->
      <RecognitionGame
        v-if="showPlaying && (gameConfig.mechanic === 'recognition' || gameConfig.mechanic === 'bubble')"
        :engine="engine"
        :config="gameConfig"
        @finished="handleGameFinished"
      />

      <!-- Spelling Gameplay -->
      <SpellingGame
        v-if="showPlaying && gameConfig.mechanic === 'spelling'"
        :engine="engine"
        :config="gameConfig"
        @finished="handleGameFinished"
      />

      <!-- Typing Gameplay -->
      <TypingGame
        v-if="showPlaying && gameConfig.mechanic === 'typing'"
        :engine="engine"
        :config="gameConfig"
        @finished="handleGameFinished"
      />

      <!-- Result -->
      <div v-if="showResult" class="result-overlay">
        <div class="result-panel">
          <div class="panda-celebrate">🐼</div>
          <p class="congrats-text">
            <template v-if="engine.stars.value >= 3">太厉害了!</template>
            <template v-else-if="engine.stars.value >= 2">真棒!</template>
            <template v-else-if="engine.stars.value >= 1">不错哦!</template>
            <template v-else>再试一次吧!</template>
          </p>

          <StarRating :stars="engine.stars.value" size="lg" />

          <div v-if="engine.stickerGrade.value" class="sticker-award" :class="`grade-${engine.stickerGrade.value}`">
            <span class="sticker-emoji">{{ gameConfig.emoji }}</span>
            <span class="sticker-name">获得贴纸: {{ gameConfig.name }}!</span>
          </div>

          <div class="stats">
            <div class="stat">
              <span class="stat-value">{{ engine.state.score }}</span>
              <span class="stat-label">得分</span>
            </div>
            <div class="stat">
              <span class="stat-value">{{ engine.state.correctFirstTry }}/{{ engine.state.rounds.length }}</span>
              <span class="stat-label">首次正确</span>
            </div>
            <div class="stat">
              <span class="stat-value">x{{ engine.state.maxCombo }}</span>
              <span class="stat-label">最高连击</span>
            </div>
          </div>

          <div class="actions">
            <button class="btn btn-replay" @click="handleReplay">🔄 再玩一次</button>
            <button class="btn btn-back" @click="handleBack">📋 返回</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.game-play-page {
  min-height: 100dvh;
  background: linear-gradient(180deg, #E8F8FF 0%, #FFF5E8 100%);
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  min-height: 60dvh;
  font-size: 1.2rem;
  color: var(--color-text-secondary, #888);
}

.back-btn {
  padding: 12px 24px;
  border-radius: 14px;
  border: none;
  background: var(--color-brand-orange, #FF8C42);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

/* Result overlay */
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
  margin: 0;
}

.sticker-award {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 16px;
  background: var(--color-neutral-50, #f9f9f9);
  border: 2px solid;
}

.grade-gold { border-color: #F0C75E; box-shadow: 0 0 12px rgba(240, 199, 94, 0.3); }
.grade-silver { border-color: #C0C0C0; }
.grade-bronze { border-color: #CD7F32; }

.sticker-emoji { font-size: 2rem; }
.sticker-name { font-size: 1rem; font-weight: 600; color: var(--color-text-primary, #333); }

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
  transition: transform 0.15s;
}

.btn:hover { transform: scale(1.03); }

.btn-replay { background: var(--color-brand-orange-bg, #FFF3E6); color: var(--color-brand-orange, #FF8C42); }
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
