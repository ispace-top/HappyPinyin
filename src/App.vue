<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import MobileNav from '@/components/layout/MobileNav.vue'

const route = useRoute()
const showMobileNav = computed(() => route.name !== 'builder')
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <MobileNav v-if="showMobileNav" />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-bottom: calc(var(--mobile-nav-height) + var(--space-4));
  max-width: var(--max-content-width);
  width: 100%;
  margin: 0 auto;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity var(--transition-normal), transform var(--transition-normal);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (min-width: 768px) {
  .main-content {
    padding-bottom: var(--space-8);
  }
}
</style>
