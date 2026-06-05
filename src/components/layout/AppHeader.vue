<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <RouterLink to="/" class="logo">
        <svg width="32" height="32" viewBox="0 0 64 64" class="logo-icon">
          <!-- Face -->
          <circle cx="32" cy="34" r="26" fill="#FF8C42"/>
          <!-- Ears -->
          <circle cx="14" cy="14" r="9" fill="#2C3E50"/>
          <circle cx="50" cy="14" r="9" fill="#2C3E50"/>
          <circle cx="14" cy="14" r="5" fill="#4A6A8A"/>
          <circle cx="50" cy="14" r="5" fill="#4A6A8A"/>
          <!-- Eye whites -->
          <circle cx="24" cy="31" r="7" fill="#FFFFFF"/>
          <circle cx="40" cy="31" r="7" fill="#FFFFFF"/>
          <!-- Pupils -->
          <circle cx="25" cy="32" r="4" fill="#2C3E50"/>
          <circle cx="41" cy="32" r="4" fill="#2C3E50"/>
          <!-- Eye shine -->
          <circle cx="27" cy="30" r="1.5" fill="#FFFFFF"/>
          <circle cx="43" cy="30" r="1.5" fill="#FFFFFF"/>
          <!-- Nose -->
          <ellipse cx="32" cy="40" rx="3.5" ry="2.5" fill="#2C3E50"/>
          <!-- Mouth -->
          <path d="M27 45 Q32 50 37 45" stroke="#2C3E50" stroke-width="2" fill="none" stroke-linecap="round"/>
          <!-- Blush -->
          <circle cx="18" cy="39" r="5" fill="#FFB380" opacity="0.6"/>
          <circle cx="46" cy="39" r="5" fill="#FFB380" opacity="0.6"/>
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
