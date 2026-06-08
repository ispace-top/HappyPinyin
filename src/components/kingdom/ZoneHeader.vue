<script setup lang="ts">
import { computed } from 'vue'
import type { ZoneConfig } from '@/types/kingdom'
import { getZoneStars, getZoneMaxStars } from '@/utils/kingdomStorage'

const props = defineProps<{
  zone: ZoneConfig
}>()

const emit = defineEmits<{
  back: []
}>()

const zoneStars = computed(() => getZoneStars(props.zone.id))
const maxStars = computed(() => getZoneMaxStars(props.zone.id))
</script>

<template>
  <div class="zone-header">
    <button class="back-btn" @click="emit('back')">
      <span class="back-icon">←</span>
      <span class="back-text">返回王国</span>
    </button>

    <div class="zone-info">
      <span class="zone-emoji">{{ zone.emoji }}</span>
      <h1 class="zone-title">{{ zone.name }}</h1>
    </div>

    <div class="star-display">
      <span class="star-icon">⭐</span>
      <span class="star-count">{{ zoneStars }} / {{ maxStars }}</span>
    </div>
  </div>
</template>

<style scoped>
.zone-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1rem;
  margin-bottom: 0.5rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 2px solid var(--color-border, #E8E8E8);
  border-radius: 2rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary, #2C3E50);
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: var(--color-surface-hover, #F5F5F5);
  border-color: var(--color-brand-orange, #FF8C42);
  transform: translateX(-2px);
}

.back-btn:active {
  transform: translateX(-1px);
}

.back-icon {
  font-size: 1.2rem;
}

.zone-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.zone-emoji {
  font-size: 2rem;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
}

.zone-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-text-primary, #2C3E50);
  margin: 0;
}

.star-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.star-icon {
  font-size: 1.5rem;
}

.star-count {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-brand-orange, #FF8C42);
}

@media (max-width: 768px) {
  .zone-header {
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.5rem;
  }

  .back-btn {
    width: 100%;
    justify-content: center;
  }

  .zone-info {
    flex-direction: column;
    gap: 0.5rem;
  }

  .zone-emoji {
    font-size: 1.5rem;
  }

  .zone-title {
    font-size: 1.25rem;
  }

  .star-display {
    width: 100%;
    justify-content: center;
  }
}
</style>
