<script setup lang="ts">
import type { Project } from '@/types'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

defineProps<{ project: Project }>()
const { locale } = useI18n()

function getDescription(project: Project): string {
  return locale.value === 'zh' ? project.description_zh : project.description_en
}
</script>

<template>
  <RouterLink :to="`/projects/${project.id}`" class="card">
    <div class="card-icon">{{ project.icon }}</div>
    <h3>{{ project.name }}</h3>
    <p>{{ getDescription(project) }}</p>
  </RouterLink>
</template>

<style scoped>
.card {
  display: block;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 2.5rem;
  transition: transform 0.3s, border-color 0.3s;
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.card h3 {
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
}

.card p {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.6;
}
</style>
