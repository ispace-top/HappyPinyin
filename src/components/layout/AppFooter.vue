<script setup lang="ts">
</script>

<template>
  <footer class="app-footer">
    <div class="footer-inner">
      <RouterLink to="/about" class="footer-link">关于快乐拼音</RouterLink>
      <span class="footer-dot">·</span>
      <span class="footer-copy">© 2026 i·Space</span>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  padding: var(--space-4) 0;
  text-align: center;
  border-top: 1px solid var(--color-border);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.footer-link { color: var(--color-brand-orange); font-weight: 500; }
.footer-link:hover { opacity: 0.7; }
.footer-dot { opacity: 0.4; }
.footer-copy { opacity: 0.6; }

@media (max-width: 1023px) {
  .app-footer { display: none; }
}
</style>
