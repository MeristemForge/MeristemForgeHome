<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DownloadStatus from './DownloadStatus.vue'

const { t } = useI18n()
</script>

<template>
  <section id="release" class="release section-shell">
    <div class="release__panel glass-panel">
      <p class="eyebrow">{{ t('release.eyebrow') }}</p>
      <h2>{{ t('release.title') }}</h2>
      <p>{{ t('release.description') }}</p>
      <DownloadStatus test-id="release-download" />
    </div>
  </section>
</template>
