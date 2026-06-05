<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps<{
  stars: number   // 0-3
  size?: 'sm' | 'md' | 'lg'
}>()

const visibleStars = ref(0)
let animInterval: ReturnType<typeof setInterval> | null = null

function clearAnim() {
  if (animInterval) { clearInterval(animInterval); animInterval = null }
}

onBeforeUnmount(() => clearAnim())

watch(() => props.stars, (val) => {
  clearAnim()
  if (val <= 0) { visibleStars.value = 0; return }
  let i = 1
  visibleStars.value = 1
  animInterval = setInterval(() => {
    i++
    if (i > val) { clearAnim(); return }
    visibleStars.value = i
  }, 300)
}, { immediate: true })
</script>

<template>
  <div class="star-rating" :class="`size-${size ?? 'md'}`" aria-label="星级评价">
    <span
      v-for="i in 3"
      :key="i"
      class="star"
      :class="{ filled: i <= visibleStars }"
    >★</span>
  </div>
</template>

<style scoped>
.star-rating {
  display: inline-flex;
  gap: 4px;
}

.star {
  font-size: 2rem;
  line-height: 1;
  color: #D4D4D4;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.3s ease;
}

.star.filled {
  color: #F0C75E;
  text-shadow: 0 0 8px rgba(240, 199, 94, 0.5);
}

.size-sm .star { font-size: 1.4rem; }
.size-lg .star { font-size: 2.8rem; }

@media (prefers-reduced-motion: reduce) {
  .star {
    transition: none;
  }
}
</style>
