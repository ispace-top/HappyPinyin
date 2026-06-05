<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAudioMode } from '@/composables/useAudioMode'

const route = useRoute()
const { isAutoMode, toggle } = useAudioMode()
const isHomePage = computed(() => route.name === 'home')
</script>

<template>
  <header class="app-header" :class="{ 'is-home': isHomePage }">
    <div class="header-inner">
      <RouterLink to="/" class="logo">
        <svg width="32" height="32" viewBox="0 0 64 64" class="logo-icon">
          <circle cx="32" cy="34" r="26" fill="#FF8C42"/>
          <circle cx="14" cy="14" r="9" fill="#2C3E50"/>
          <circle cx="50" cy="14" r="9" fill="#2C3E50"/>
          <circle cx="14" cy="14" r="5" fill="#4A6A8A"/>
          <circle cx="50" cy="14" r="5" fill="#4A6A8A"/>
          <circle cx="24" cy="31" r="7" fill="#FFFFFF"/>
          <circle cx="40" cy="31" r="7" fill="#FFFFFF"/>
          <circle cx="25" cy="32" r="4" fill="#2C3E50"/>
          <circle cx="41" cy="32" r="4" fill="#2C3E50"/>
          <circle cx="27" cy="30" r="1.5" fill="#FFFFFF"/>
          <circle cx="43" cy="30" r="1.5" fill="#FFFFFF"/>
          <ellipse cx="32" cy="40" rx="3.5" ry="2.5" fill="#2C3E50"/>
          <path d="M27 45 Q32 50 37 45" stroke="#2C3E50" stroke-width="2" fill="none" stroke-linecap="round"/>
          <circle cx="18" cy="39" r="5" fill="#FFB380" opacity="0.6"/>
          <circle cx="46" cy="39" r="5" fill="#FFB380" opacity="0.6"/>
        </svg>
        <span class="logo-text">快乐拼音</span>
      </RouterLink>
      <div class="header-right">
        <nav class="header-nav">
          <RouterLink to="/browser" class="nav-link" :class="{ active: route.name === 'browser' }">
            读一读
          </RouterLink>
          <RouterLink to="/builder" class="nav-link" :class="{ active: route.name === 'builder' }">
            拼一拼
          </RouterLink>
        </nav>
        <button
          class="audio-toggle"
          :class="{ manual: !isAutoMode }"
          :aria-label="isAutoMode ? '自动朗读已开启' : '自动朗读已关闭'"
          :title="isAutoMode ? '自动朗读：开' : '手动模式：关'"
          @click="toggle"
        >
          <span class="toggle-icon">{{ isAutoMode ? '🔊' : '🔇' }}</span>
          <span class="toggle-label">{{ isAutoMode ? '自动' : '手动' }}</span>
        </button>
      </div>
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

.app-header.is-home {
  background: linear-gradient(135deg, #FFF3E9 0%, #FFFFFF 100%);
  border-bottom: 2px solid var(--color-brand-orange-light);
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
  flex-shrink: 0;
}

.logo-icon {
  width: 28px;
  height: 28px;
}

.is-home .logo-icon {
  width: 36px;
  height: 36px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-2);
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

.audio-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--color-brand-orange-bg);
  border: 2px solid var(--color-brand-orange-light);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--color-brand-orange);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
  white-space: nowrap;
  flex-shrink: 0;
}

.audio-toggle:hover {
  background: var(--color-brand-orange-light);
  border-color: var(--color-brand-orange);
}

.audio-toggle.manual {
  background: #F5F5F5;
  border-color: var(--color-border);
  color: var(--color-text-secondary);
}

.toggle-icon { font-size: var(--font-size-md); line-height: 1; }

@media (max-width: 639px) {
  .toggle-label { display: none; }
  .audio-toggle { min-width: 36px; justify-content: center; padding: var(--space-1); }
}

@media (min-width: 1024px) {
  .audio-toggle { height: 40px; }
  .toggle-label { font-size: var(--font-size-sm); }
  .is-home .logo-icon { width: 44px; height: 44px; }
}
</style>
