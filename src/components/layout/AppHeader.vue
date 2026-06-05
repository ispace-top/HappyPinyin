<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <RouterLink to="/" class="logo">
        <svg width="32" height="32" viewBox="0 0 64 64" class="logo-icon">
          <circle cx="32" cy="32" r="30" fill="#FF8C42"/>
          <circle cx="24" cy="26" r="4" fill="#2C3E50"/>
          <circle cx="40" cy="26" r="4" fill="#2C3E50"/>
          <ellipse cx="32" cy="42" rx="8" ry="5" fill="#2C3E50"/>
          <circle cx="32" cy="46" r="3" fill="#FF8C42"/>
        </svg>
        <span class="logo-text">快乐拼音</span>
      </RouterLink>
      <nav class="header-nav">
        <RouterLink to="/browser" class="nav-link" :class="{ active: route.name === 'browser' }">
          读一读
        </RouterLink>
        <RouterLink to="/builder" class="nav-link" :class="{ active: route.name === 'builder' }">
          拼一拼
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  height: var(--header-height);
}

.header-inner {
  max-width: var(--max-content-width);
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-4);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-brand-orange);
}

.logo-icon {
  width: 28px;
  height: 28px;
}

.header-nav {
  display: flex;
  gap: var(--space-1);
}

.nav-link {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.nav-link:hover {
  background: var(--color-brand-orange-bg);
  color: var(--color-brand-orange);
}

.nav-link.active {
  background: var(--color-brand-orange-bg);
  color: var(--color-brand-orange);
  font-weight: 600;
}
</style>
