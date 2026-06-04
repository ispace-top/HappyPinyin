<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <nav class="mobile-nav">
    <RouterLink to="/" class="nav-item" :class="{ active: route.name === 'home' }">
      <span class="nav-icon">🏠</span>
      <span class="nav-label">首页</span>
    </RouterLink>
    <RouterLink to="/browser" class="nav-item" :class="{ active: route.name === 'browser' }">
      <span class="nav-icon">📖</span>
      <span class="nav-label">浏览</span>
    </RouterLink>
    <RouterLink to="/builder" class="nav-item builder-cta" :class="{ active: route.name === 'builder' }">
      <span class="nav-icon">🧩</span>
      <span class="nav-label">拼读</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.mobile-nav {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--mobile-nav-height);
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: var(--color-text-secondary);
  transition: color var(--transition-fast);
}

.nav-item.active {
  color: var(--color-brand-orange);
}

.nav-icon {
  font-size: var(--font-size-xl);
}

.nav-label {
  font-size: var(--font-size-xs);
  font-weight: 500;
}

.builder-cta {
  position: relative;
}

.builder-cta::before {
  content: '';
  position: absolute;
  top: -12px;
  width: 44px;
  height: 44px;
  background: var(--color-brand-orange);
  border-radius: var(--radius-full);
  z-index: -1;
}

.builder-cta.active {
  color: var(--color-surface);
}

@media (min-width: 768px) {
  .mobile-nav {
    display: none;
  }
}
</style>
