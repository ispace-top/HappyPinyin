<script setup lang="ts">
import { computed } from 'vue'
import type { GameConfig } from '@/types/kingdom'
import { getGameProgress } from '@/utils/kingdomStorage'

const props = defineProps<{
  game: GameConfig
}>()

const emit = defineEmits<{
  select: [gameId: string]
}>()

const progress = computed(() => getGameProgress(props.game.id))

const hasPlayed = computed(() => progress.value.attempts > 0)

function handleClick() {
  emit('select', props.game.id)
}
</script>

<template>
  <div class="game-card" @click="handleClick">
    <div class="game-icon">
      <span class="emoji">{{ game.emoji }}</span>
    </div>

    <div class="game-content">
      <h3 class="game-name">{{ game.name }}</h3>
      <p class="game-info">第 {{ game.level }} 关 · {{ game.roundsPerGame }} 轮</p>

      <div class="game-stars">
        <span
          v-for="i in 3"
          :key="i"
          class="star"
          :class="{ filled: i <= progress.bestStars, empty: i > progress.bestStars }"
        >
          ⭐
        </span>
      </div>

      <div v-if="!hasPlayed" class="new-badge">新游戏!</div>
    </div>

    <div class="play-indicator">
      <span class="play-icon">▶</span>
    </div>
  </div>
</template>

<style scoped>
.game-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.game-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.game-card:active {
  transform: translateY(-1px);
}

.game-icon {
  font-size: 2rem;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
  flex-shrink: 0;
}

.game-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.game-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary, #2C3E50);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.game-info {
  font-size: 0.8rem;
  color: var(--color-text-secondary, #7F8C8D);
  margin: 0;
}

.game-stars {
  display: flex;
  gap: 0.25rem;
  margin-top: 0.5rem;
}

.star {
  font-size: 1.5rem;
  transition: all 0.2s ease;
}

.star.filled {
  filter: drop-shadow(0 0 4px rgba(255, 193, 7, 0.5));
  transform: scale(1.1);
}

.star.empty {
  opacity: 0.3;
  filter: grayscale(1);
}

.new-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: var(--color-brand-orange, #FF8C42);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  animation: pulse 2s infinite;
}

.play-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: var(--color-brand-orange, #FF8C42);
  border-radius: 50%;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(255, 140, 66, 0.3);
  transition: all 0.2s ease;
}

.game-card:hover .play-indicator {
  background: var(--color-brand-orange-dark, #E67A3C);
  transform: scale(1.05);
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}

@media (max-width: 768px) {
  .game-card {
    padding: 0.75rem;
  }

  .game-icon {
    font-size: 1.75rem;
  }

  .game-name {
    font-size: 1rem;
  }

  .game-info {
    font-size: 0.8rem;
  }

  .star {
    font-size: 1.1rem;
  }

  .play-indicator {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 1.1rem;
  }
}
</style>
