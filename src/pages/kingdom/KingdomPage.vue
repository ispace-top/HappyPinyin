<script setup lang="ts">
import { computed } from 'vue'
import { ZONES } from '@/data/kingdom'
import ZoneCard from '@/components/kingdom/ZoneCard.vue'
import { getTotalStars, isZoneUnlocked } from '@/utils/kingdomStorage'
import type { ZoneId } from '@/types/kingdom'

const totalStars = computed(() => getTotalStars())

function checkZoneUnlocked(zoneId: ZoneId): boolean {
  return isZoneUnlocked(zoneId)
}
</script>

<template>
  <div class="kingdom-page">
    <div class="kingdom-header">
      <h1 class="kingdom-title">拼音王国</h1>
      <div class="star-counter">
        <span class="star-icon">⭐</span>
        <span class="star-count">{{ totalStars }}</span>
      </div>
    </div>

    <p class="kingdom-subtitle">欢迎来到拼音王国！选择你想探索的区域</p>

    <div class="zone-grid">
      <ZoneCard
        v-for="zone in ZONES"
        :key="zone.id"
        :zone="zone"
        :unlocked="checkZoneUnlocked(zone.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.kingdom-page {
  min-height: 100%;
  padding: 1.25rem 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  background: linear-gradient(180deg, #E8F4FF 0%, #FFF5E8 100%);
}

.kingdom-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.kingdom-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text-primary, #2C3E50);
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.star-counter {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: white;
  padding: 0.35rem 0.75rem;
  border-radius: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.star-icon {
  font-size: 1.25rem;
}

.star-count {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-brand-orange, #FF8C42);
}

.kingdom-subtitle {
  font-size: 1rem;
  color: var(--color-text-secondary, #7F8C8D);
  margin: 0;
  text-align: center;
}

.zone-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  width: 100%;
  max-width: 1200px;
  padding: 0.5rem;
}

@media (max-width: 768px) {
  .kingdom-page {
    padding: 0.75rem 0.5rem;
    gap: 1rem;
  }

  .kingdom-title {
    font-size: 1.75rem;
  }

  .kingdom-subtitle {
    font-size: 0.875rem;
  }

  .zone-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 0.25rem;
  }
}
</style>
