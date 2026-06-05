<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameEngine } from '@/composables/useGameEngine'
import GameLobby from '@/components/game/GameLobby.vue'
import GamePlay from '@/components/game/GamePlay.vue'
import GameResult from '@/components/game/GameResult.vue'
import CountdownOverlay from '@/components/game/CountdownOverlay.vue'
import StickerBook from '@/components/game/StickerBook.vue'

const engine = useGameEngine()
const state = engine.state

const showingStickerBook = ref(false)

const isCountdown = computed(() => state.phase === 'countdown')
const isPlaying = computed(() => state.phase === 'playing' || state.phase === 'feedback')
const isResult = computed(() => state.phase === 'result')

function handleStartLevel(level: number) {
  engine.startGame(level)
}

function handleCountdownDone() {
  engine.onCountdownEnd()
}

function handleGameFinished() {
  // engine.nextRound already set phase to 'result'
}

function handleReplay() {
  engine.startGame(state.level)
}

function handleNextLevel() {
  if (state.level < 6) {
    engine.startGame(state.level + 1)
  }
}

function handleBackToLobby() {
  engine.resetGame()
}
</script>

<template>
  <div class="game-page" :style="{ background: 'var(--game-bg-gradient, linear-gradient(180deg, #E8F8FF 0%, #FFF5E8 100%))' }">
    <!-- Lobby -->
    <GameLobby
      v-if="state.phase === 'idle' && !showingStickerBook"
      @start-level="handleStartLevel"
      @open-sticker-book="showingStickerBook = true"
    />

    <!-- Sticker Book (overlays lobby) -->
    <StickerBook
      v-if="showingStickerBook && state.phase === 'idle'"
      @close="showingStickerBook = false"
    />

    <!-- Countdown -->
    <CountdownOverlay
      v-if="isCountdown"
      @done="handleCountdownDone"
    />

    <!-- Gameplay -->
    <GamePlay
      v-if="isPlaying || isResult"
      :engine="engine"
      @finished="handleGameFinished"
    />

    <!-- Result -->
    <GameResult
      v-if="isResult"
      :engine="engine"
      @replay="handleReplay"
      @next-level="handleNextLevel"
      @back-to-lobby="handleBackToLobby"
    />
  </div>
</template>

<style scoped>
.game-page {
  min-height: calc(100dvh - var(--header-height, 56px));
}
</style>
