<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <nav class="mobile-nav">
    <RouterLink to="/" class="nav-item" :class="{ active: route.name === 'home' }">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 10.5L12 3l9 7.5"/>
        <path d="M5.5 9v10.5h13V9"/>
        <rect x="9" y="14" width="6" height="5.5" rx="0.5"/>
      </svg>
      <span class="nav-label">首页</span>
    </RouterLink>

    <RouterLink to="/browser" class="nav-item" :class="{ active: route.name === 'browser' }">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 4h16v16H4z" stroke="currentColor" fill="none"/>
        <path d="M4 6h16"/>
        <path d="M8 6v14"/>
        <path d="M11 10h3"/>
      </svg>
      <span class="nav-label">读一读</span>
    </RouterLink>

    <RouterLink to="/builder" class="nav-item" :class="{ active: route.name === 'builder' }">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="8" height="8" rx="1.5"/>
        <rect x="13" y="3" width="8" height="8" rx="1.5"/>
        <rect x="13" y="13" width="8" height="8" rx="1.5"/>
        <rect x="3" y="13" width="8" height="8" rx="1.5"/>
      </svg>
      <span class="nav-label">拼一拼</span>
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

.nav-item svg {
  flex-shrink: 0;
}

.nav-label {
  font-size: var(--font-size-xs);
  font-weight: 500;
}

@media (min-width: 768px) {
  .mobile-nav {
    display: none;
  }
}
</style>
