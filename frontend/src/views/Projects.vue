<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ProjectCard from '@/components/ProjectCard.vue'
import { getProjects } from '@/api/projects'
import type { Project } from '@/types'

const { t } = useI18n()
const projects = ref<Project[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    projects.value = await getProjects()
  } catch {
    // API unavailable
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="projects-page">
    <h1>{{ t('projects.title') }}</h1>
    <p class="subtitle">{{ t('projects.subtitle') }}</p>
    <div class="cards" v-if="!loading">
      <ProjectCard v-for="p in projects" :key="p.id" :project="p" />
    </div>
    <p v-else class="loading">Loading...</p>
  </div>
</template>

<style scoped>
.projects-page {
  padding: 8rem 3rem 4rem;
  max-width: 1100px;
  margin: 0 auto;
}

.projects-page h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 3rem;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.loading {
  color: var(--text-muted);
}
</style>
