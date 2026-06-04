<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  delay: number
}

const particles = ref<Particle[]>([])
const colors = ['#FF6B6B', '#4ECDC4', '#FF8C42', '#FFB380', '#7EC8A0', '#F0C75E', '#6C9BD2', '#E8839A']

onMounted(() => {
  const items: Particle[] = []
  for (let i = 0; i < 20; i++) {
    items.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60,
      color: colors[Math.floor(Math.random() * colors.length)]!,
      size: 6 + Math.random() * 10,
      delay: Math.random() * 0.5,
    })
  }
  particles.value = items
})
</script>

<template>
  <div class="celebration" aria-hidden="true">
    <span
      v-for="p in particles"
      :key="p.id"
      class="particle"
      :style="{
        left: p.x + '%',
        top: p.y + '%',
        backgroundColor: p.color,
        width: p.size + 'px',
        height: p.size + 'px',
        animationDelay: p.delay + 's',
      }"
    />
  </div>
</template>

<style scoped>
.celebration {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 200;
  overflow: hidden;
}

.particle {
  position: absolute;
  border-radius: var(--radius-full);
  animation: particleFly 1.5s ease-out forwards;
  opacity: 0;
}

@keyframes particleFly {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-200px) scale(0);
    opacity: 0;
  }
}
</style>
