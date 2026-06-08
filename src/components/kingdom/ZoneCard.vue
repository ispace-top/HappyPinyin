<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { ZoneConfig } from '@/types/kingdom'
import { getZoneStars, getZoneMaxStars } from '@/utils/kingdomStorage'

const props = defineProps<{
  zone: ZoneConfig
  unlocked: boolean
}>()

const router = useRouter()

const zoneStars = computed(() => getZoneStars(props.zone.id))
const maxStars = computed(() => getZoneMaxStars(props.zone.id))

const progress = computed(() => {
  if (maxStars.value === 0) return 0
  return Math.round((zoneStars.value / maxStars.value) * 100)
})

function handleClick() {
  if (!props.unlocked) return

  // Navigate to zone page
  const routeName = `${props.zone.id}` as string
  router.push({ name: routeName })
}
</script>

<template>
  <div
    class="zone-card"
    :class="{ unlocked, locked: !unlocked }"
    :style="{
      '--zone-color': zone.color,
      '--zone-gradient': zone.bgGradient,
    }"
    @click="handleClick"
  >
    <div class="zone-icon">
      <span class="emoji">{{ zone.emoji }}</span>
    </div>

    <div class="zone-content">
      <h3 class="zone-name">{{ zone.name }}</h3>
      <p class="zone-subtitle">{{ zone.subtitle }}</p>

      <div class="zone-stats">
        <div class="star-progress">
          <span class="star-icon">⭐</span>
          <span class="star-text">{{ zoneStars }} / {{ maxStars }}</span>
        </div>

        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }" />
        </div>
      </div>
    </div>

    <div v-if="!unlocked" class="lock-overlay">
      <span class="lock-icon">🔒</span>
      <span class="lock-text">需要 {{ zone.unlockRequirement?.value }} 颗星星</span>
    </div>
  </div>
</template>

<style scoped>
.zone-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--zone-gradient);
  border-radius: 1.5rem;
  padding: 1.25rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.25s ease;
  cursor: pointer;
  overflow: hidden;
  min-height: 140px;
}

.zone-card.unlocked:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
}

.zone-card.unlocked:active {
  transform: translateY(-2px);
}

.zone-card.locked {
  filter: grayscale(0.6);
  opacity: 0.7;
  cursor: not-allowed;
}

.zone-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  text-align: center;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
}

.zone-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.zone-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-primary, #2C3E50);
  margin: 0;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
}

.zone-subtitle {
  font-size: 0.85rem;
  color: var(--color-text-secondary, #5A6C7D);
  margin: 0;
}

.zone-stats {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.star-progress {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.star-icon {
  font-size: 1rem;
}

.star-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-primary, #2C3E50);
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--zone-color);
  border-radius: 4px;
  transition: width 0.3s ease;
  box-shadow: 0 0 8px var(--zone-color);
}

.lock-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border-radius: 1.5rem;
}

.lock-icon {
  font-size: 3rem;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
}

.lock-text {
  font-size: 1rem;
  font-weight: 600;
  color: white;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
  .zone-card {
    padding: 1rem;
    min-height: 120px;
  }

  .zone-icon {
    font-size: 2rem;
  }

  .zone-name {
    font-size: 1.1rem;
  }

  .zone-subtitle {
    font-size: 0.8rem;
  }

  .lock-icon {
    font-size: 2rem;
  }

  .lock-text {
    font-size: 0.85rem;
  }
}
</style>
