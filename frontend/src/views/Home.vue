<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import ParticleCanvas from '@/components/ParticleCanvas.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import { getProjects } from '@/api/projects'
import type { Project } from '@/types'

const { t } = useI18n()
const projects = ref<Project[]>([])

onMounted(async () => {
  try {
    projects.value = await getProjects()
  } catch {
    // API not available yet
  }

  // Scroll fade-in observer
  await nextTick()
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible')
      })
    },
    { threshold: 0.1 }
  )
  document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el))
})
</script>

<template>
  <section class="hero">
    <ParticleCanvas />
    <div class="hero-content">
      <h1>{{ t('hero.title') }}</h1>
      <p>{{ t('hero.subtitle') }}</p>
      <RouterLink to="/projects" class="cta-btn">{{
        t('hero.cta')
      }}</RouterLink>
    </div>
    <div class="scroll-hint">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
        <path d="M7 13l5 5 5-5M7 6l5 5 5-5" stroke="currentColor" />
      </svg>
    </div>
  </section>

  <section class="section" id="projects">
    <div class="fade-in">
      <h2>{{ t('projects.title') }}</h2>
      <p class="section-subtitle">{{ t('projects.subtitle') }}</p>
    </div>
    <div class="cards fade-in" v-if="projects.length">
      <ProjectCard v-for="p in projects" :key="p.id" :project="p" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.hero-content {
  position: relative;
  z-index: 10;
  max-width: 800px;
  padding: 0 2rem;
}

.hero h1 {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -2px;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero p {
  font-size: clamp(1rem, 2vw, 1.3rem);
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.cta-btn {
  display: inline-block;
  padding: 0.9rem 2.5rem;
  background: linear-gradient(135deg, var(--accent), var(--accent-secondary));
  color: #000;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 50px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px var(--accent-glow);
}

.scroll-hint {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  animation: bounce 2s infinite;
  color: var(--accent);
  opacity: 0.6;
}

.scroll-hint svg {
  width: 24px;
  height: 24px;
}

.section {
  padding: 8rem 3rem;
  max-width: 1100px;
  margin: 0 auto;
}

.section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: -1px;
}

.section-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.8;
  max-width: 600px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}
</style>
