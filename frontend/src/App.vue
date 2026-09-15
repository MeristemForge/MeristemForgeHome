<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Home from '@/views/Home.vue'
</script>

<template>
  <div class="site-shell">
    <Navbar />
    <main><Home /></main>
    <footer id="about" class="site-footer">
      <span>{{ $t('footer.copyright') }}</span>
      <span>{{ $t('footer.tagline') }}</span>
    </footer>
  </div>
</template>
