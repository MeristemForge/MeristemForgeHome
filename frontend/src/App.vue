<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import { useTheme } from '@/composables/useTheme'

useTheme()
const route = useRoute()
</script>

<template>
  <Navbar />
  <main>
    <RouterView v-slot="{ Component }" :key="route.fullPath">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
  <footer class="site-footer">
    <span>{{ $t('footer') }}</span>
  </footer>
</template>

<style scoped>
main {
  min-height: 100vh;
}

.site-footer {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
  font-size: 0.85rem;
  border-top: 1px solid var(--border);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
