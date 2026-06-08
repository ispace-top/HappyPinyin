<script setup lang="ts">
import { useRouter } from 'vue-router'
import { WORKSHOP_GAMES } from '@/data/kingdom'
import GameCard from '@/components/kingdom/GameCard.vue'
import ZoneHeader from '@/components/kingdom/ZoneHeader.vue'
import { ZONES } from '@/data/kingdom'

const router = useRouter()
const zone = ZONES.find(z => z.id === 'workshop')!

function handleGameSelect(gameId: string) {
  router.push({ name: 'game-play', params: { gameId } })
}

function handleBack() {
  router.push({ name: 'kingdom' })
}
</script>

<template>
  <div class="zone-page" :style="{ '--zone-gradient': zone.bgGradient }">
    <ZoneHeader :zone="zone" @back="handleBack" />

    <div class="game-list">
      <GameCard
        v-for="game in WORKSHOP_GAMES"
        :key="game.id"
        :game="game"
        @select="handleGameSelect"
      />
    </div>
  </div>
</template>

<style scoped>
.zone-page {
  min-height: 100%;
  background: var(--zone-gradient);
  padding: 0.75rem;
}

.game-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem;
}

@media (max-width: 768px) {
  .zone-page {
    padding: 0.5rem;
  }

  .game-list {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 0.25rem;
  }
}
</style>
