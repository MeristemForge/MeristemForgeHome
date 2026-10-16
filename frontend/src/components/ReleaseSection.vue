<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{ available: boolean; loading: boolean }>()
const { t } = useI18n()
</script>

<template>
  <section id="release" class="release section-shell">
    <div class="release__panel glass-panel">
      <p class="eyebrow">{{ t('release.eyebrow') }}</p>
      <h2>{{ t('release.title') }}</h2>
      <p>{{ t(loading ? 'release.checking' : available ? 'release.publishedDescription' : 'release.pendingDescription') }}</p>

      <div class="release-meta">
        <span>{{ t('release.platform') }}</span>
        <span>{{ loading ? t('release.checking') : t(available ? 'release.status.published' : 'release.status.pending') }}</span>
      </div>

      <ul class="release-notes">
        <li>{{ t('release.note1') }}</li>
        <li>{{ t('release.note2') }}</li>
        <li>{{ t('release.note3') }}</li>
      </ul>
      <a class="release-back" href="#top">{{ t('release.backToDownload') }} <span aria-hidden="true">↑</span></a>
    </div>
  </section>
</template>
