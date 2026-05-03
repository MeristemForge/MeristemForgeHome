<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getProject, getVersions, getDownloadUrl } from '@/api/projects'
import type { Project, Version } from '@/types'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const project = ref<Project | null>(null)
const versions = ref<Version[]>([])
const loading = ref(true)

onMounted(async () => {
  const id = Number(route.params.id)
  try {
    project.value = await getProject(id)
    versions.value = await getVersions(id)
  } catch {
    // API unavailable
  } finally {
    loading.value = false
  }
})

function getDesc(p: Project): string {
  return locale.value === 'zh' ? p.description_zh : p.description_en
}

function getChangelog(v: Version): string {
  return locale.value === 'zh' ? v.changelog_zh : v.changelog_en
}

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString()
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<template>
  <div class="detail-page" v-if="project">
    <button class="back-link" @click="router.push('/projects')">
      ← {{ t('nav.projects') }}
    </button>

    <header class="detail-header">
      <span class="icon">{{ project.icon }}</span>
      <h1>{{ project.name }}</h1>
      <p>{{ getDesc(project) }}</p>
    </header>

    <section class="versions">
      <h2>{{ t('projects.version') }}</h2>
      <div v-for="ver in versions" :key="ver.id" class="version-card">
        <div class="version-header">
          <strong>v{{ ver.version }}</strong>
          <span class="date">{{ formatDate(ver.released_at) }}</span>
        </div>
        <p class="changelog" v-if="getChangelog(ver)">
          {{ getChangelog(ver) }}
        </p>
        <div class="platforms" v-if="ver.platforms?.length">
          <span v-for="p in ver.platforms" :key="p" class="platform-badge">{{
            p
          }}</span>
        </div>
        <div class="files" v-if="ver.files?.length">
          <a
            v-for="f in ver.files"
            :key="f.id"
            :href="getDownloadUrl(f.id)"
            class="file-link"
          >
            📦 {{ f.filename }}
            <span class="size">({{ formatSize(f.file_size) }})</span>
          </a>
        </div>
      </div>
      <div v-if="!versions.length" class="empty-state">
        <span class="empty-icon">📦</span>
        <p>{{ t('projects.noVersions') }}</p>
      </div>
    </section>
  </div>
  <div v-else-if="loading" class="detail-page">
    <p class="loading">Loading...</p>
  </div>
</template>

<style scoped>
.detail-page {
  padding: 8rem 3rem 4rem;
  max-width: 900px;
  margin: 0 auto;
}

.back-link {
  background: none;
  border: none;
  color: var(--accent);
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  display: inline-block;
  padding: 0;
}

.back-link:hover {
  opacity: 0.8;
}

.detail-header {
  margin-bottom: 3rem;
}

.detail-header .icon {
  font-size: 3rem;
}

.detail-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
}

.detail-header p {
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.6;
}

.versions h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.version-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.version-header strong {
  font-size: 1.1rem;
  color: var(--accent);
}

.date {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.changelog {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
}

.platforms {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 0.8rem;
}

.platform-badge {
  display: inline-block;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.files {
  margin-top: 0.8rem;
}

.file-link {
  display: block;
  padding: 0.4rem 0;
  color: var(--accent);
  font-size: 0.9rem;
  transition: opacity 0.2s;
}

.file-link:hover {
  opacity: 0.8;
}

.size {
  color: var(--text-muted);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.8rem;
}

.loading {
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .detail-page {
    padding: 6rem 1.5rem 3rem;
  }

  .detail-header h1 {
    font-size: 1.8rem;
  }
}
</style>
