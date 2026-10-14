<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchLatestRelease, type ReleaseInfo } from '@/api/release'
import DownloadStatus from './DownloadStatus.vue'

const { t } = useI18n()
const release = ref<ReleaseInfo | null>(null)

onMounted(async () => {
  release.value = await fetchLatestRelease()
})
</script>

<template>
  <section id="release" class="release section-shell">
    <div class="release__panel glass-panel">
      <p class="eyebrow">{{ t('release.eyebrow') }}</p>
      <h2>{{ t('release.title') }}</h2>
      <p>{{ t('release.description') }}</p>

      <div v-if="release" class="release-meta">
        <span>{{ t('release.version') }} {{ release.version }}</span>
        <span>{{ release.platform }}</span>
        <span>{{ release.size }}</span>
        <span>{{ release.publishedAt }}</span>
      </div>

      <ul class="release-notes">
        <li v-for="note in release?.notes ?? []" :key="note">{{ note }}</li>
        <template v-if="!release">
          <li>{{ t('release.note1') }}</li>
          <li>{{ t('release.note2') }}</li>
          <li>{{ t('release.note3') }}</li>
        </template>
      </ul>

      <DownloadStatus test-id="release-download" />
    </div>
  </section>
</template>
