<script setup lang="ts">
defineProps<{
  mood?: 'idle' | 'happy' | 'thinking'
}>()
</script>

<template>
  <div class="panda-mascot" :class="mood ?? 'idle'">
    <svg width="80" height="80" viewBox="0 0 80 80">
      <!-- Ears -->
      <circle cx="22" cy="18" r="10" fill="#2C3E50"/>
      <circle cx="58" cy="18" r="10" fill="#2C3E50"/>
      <!-- Head -->
      <circle cx="40" cy="40" r="28" fill="#FFFFFF" stroke="#E8E8E8" stroke-width="1"/>
      <!-- Eyes -->
      <circle cx="30" cy="36" r="5" fill="#2C3E50"/>
      <circle cx="50" cy="36" r="5" fill="#2C3E50"/>
      <circle cx="32" cy="34" r="2" fill="#FFFFFF"/>
      <circle cx="52" cy="34" r="2" fill="#FFFFFF"/>
      <!-- Nose -->
      <ellipse cx="40" cy="44" rx="4" ry="3" fill="#2C3E50"/>
      <!-- Mouth -->
      <path v-if="mood === 'happy'" d="M34 50 Q40 56 46 50" stroke="#2C3E50" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse v-else cx="40" cy="50" rx="5" ry="2" fill="#2C3E50"/>
      <!-- Blush -->
      <circle cx="22" cy="42" r="6" fill="#FFB380" opacity="0.5"/>
      <circle cx="58" cy="42" r="6" fill="#FFB380" opacity="0.5"/>
    </svg>
    <p v-if="mood === 'happy'" class="bubble">太棒了!</p>
    <p v-else-if="mood === 'thinking'" class="bubble">来拼一拼吧!</p>
  </div>
</template>

<style scoped>
.panda-mascot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.panda-mascot.idle svg {
  animation: idleBounce 3s ease-in-out infinite;
}

.panda-mascot.happy svg {
  animation: happySpin 0.6s var(--ease-bounce);
}

.bubble {
  background: var(--color-surface);
  border: 2px solid var(--color-brand-orange-light);
  border-radius: var(--radius-lg);
  padding: var(--space-1) var(--space-3);
  font-size: var(--font-size-sm);
  color: var(--color-brand-orange);
  font-weight: 600;
  animation: popIn 0.3s var(--ease-bounce);
}

@keyframes idleBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes happySpin {
  0% { transform: scale(1) rotate(0); }
  30% { transform: scale(1.15) rotate(-10deg); }
  60% { transform: scale(1.15) rotate(10deg); }
  100% { transform: scale(1) rotate(0); }
}

@keyframes popIn {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
