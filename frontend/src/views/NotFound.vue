<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="not-found">
    <h1>404</h1>
    <p>Page not found</p>
    <RouterLink to="/" class="back-btn">← Back to Home</RouterLink>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.not-found h1 {
  font-size: 6rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.not-found p {
  font-size: 1.3rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.back-btn {
  padding: 0.7rem 2rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 50px;
  color: var(--accent);
  font-size: 0.95rem;
  transition: border-color 0.3s;
}

.back-btn:hover {
  border-color: var(--accent);
}
</style>
