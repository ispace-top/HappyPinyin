<script setup lang="ts">
import { computed } from 'vue'
import type { LevelProgress } from '@/types/game'
import { STICKER_DEFS } from '@/types/game'
import { getLevelProgress, isLevelUnlocked, getCollectedStickers } from '@/utils/gameStorage'
import StarRating from './StarRating.vue'

const emit = defineEmits<{
  startLevel: [level: number]
  openStickerBook: []
}>()

interface LevelCardData {
  level: number
  name: string
  emoji: string
  unlocked: boolean
  played: boolean
  progress: LevelProgress
  stickerEmoji: string
}

const levelCards = computed<LevelCardData[]>(() => {
  return STICKER_DEFS.map((def) => {
    const progress = getLevelProgress(def.level)
    return {
      level: def.level,
      name: def.name,
      emoji: def.emoji,
      unlocked: isLevelUnlocked(def.level),
      played: progress.attempts > 0,
      progress,
      stickerEmoji: def.emoji,
    }
  })
})

const collectedCount = computed(() => getCollectedStickers().length)

function cardClass(card: LevelCardData) {
  return {
    'level-card': true,
    locked: !card.unlocked,
    'has-sticker': card.progress.stickerCollected,
    new: card.unlocked && !card.played,
  }
}

function handleCardClick(card: LevelCardData) {
  if (card.unlocked) {
    emit('startLevel', card.level)
  }
}
</script>

<template>
  <div class="lobby">
    <div class="lobby-header">
      <h1 class="lobby-title">拼音泡泡乐</h1>
      <button class="sticker-btn" @click="emit('openStickerBook')" aria-label="我的贴纸">
        🧸 我的贴纸
        <span class="sticker-count">{{ collectedCount }}/6</span>
      </button>
    </div>

    <p class="lobby-intro">听到发音，找到拼音，点破泡泡，收集贴纸！</p>

    <div class="level-grid">
      <button
        v-for="card in levelCards"
        :key="card.level"
        :class="cardClass(card)"
        :disabled="!card.unlocked"
        @click="handleCardClick(card)"
        :aria-label="`${card.name}${card.unlocked ? '' : '，未解锁'}`"
      >
        <span class="card-emoji">{{ card.unlocked ? card.emoji : '🔒' }}</span>
        <div class="card-body">
          <span class="card-name">第{{ card.level }}关: {{ card.name }}</span>
          <StarRating v-if="card.played" :stars="card.progress.bestStars" size="sm" />
          <span v-else-if="card.unlocked" class="new-badge">新!</span>
        </div>
        <span v-if="card.progress.stickerCollected" class="card-sticker">{{ card.stickerEmoji }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.lobby {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px 16px;
}

.lobby-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 500px;
}

.lobby-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-brand-orange, #FF8C42);
}

.sticker-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--color-surface, #fff);
  border: 2px solid var(--color-divider, #e8e8e8);
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.2s;
}

.sticker-btn:hover { border-color: var(--color-brand-orange, #FF8C42); }
.sticker-count { color: var(--color-brand-orange, #FF8C42); font-weight: 700; }

.lobby-intro {
  font-size: 0.95rem;
  color: var(--color-text-secondary, #888);
  text-align: center;
  max-width: 400px;
}

.level-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
  max-width: 500px;
}

.level-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 18px 12px;
  background: var(--color-surface, #fff);
  border-radius: 16px;
  border: 2px solid var(--color-divider, #e8e8e8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s, opacity 0.2s;
  position: relative;
}

.level-card:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: var(--color-brand-orange, #FF8C42);
}

.level-card.locked {
  opacity: 0.45;
  cursor: default;
  filter: grayscale(0.8);
}

.level-card.has-sticker {
  border-color: #F0C75E;
}

.card-emoji {
  font-size: 2.2rem;
}

.card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.card-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-primary, #333);
  text-align: center;
}

.new-badge {
  font-size: 0.75rem;
  background: var(--color-brand-orange, #FF8C42);
  color: #fff;
  padding: 2px 8px;
  border-radius: 10px;
  animation: pulse-badge 1.5s ease-in-out infinite;
}

.card-sticker {
  position: absolute;
  top: -6px;
  right: -6px;
  font-size: 1.4rem;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.15));
}

@keyframes pulse-badge {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@media (min-width: 768px) {
  .level-grid {
    grid-template-columns: repeat(3, 1fr);
    max-width: 600px;
  }

  .lobby-title { font-size: 2rem; }
}
</style>
