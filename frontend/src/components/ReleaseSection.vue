<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ReleaseInfo } from '@/api/release'

const props = defineProps<{ release: ReleaseInfo | null }>()
const { locale, t } = useI18n()

const localizedNotes = computed(() => {
  const fallback = [t('release.note1'), t('release.note2'), t('release.note3')]
  if (!props.release) return fallback

  const key = locale.value === 'en' ? 'en' : 'zh'
  return props.release.notes[key].length ? props.release.notes[key] : fallback
})

const statusLabel = computed(() => t(`release.status.${props.release?.status ?? 'pending'}`))
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
        <span>{{ statusLabel }}</span>
        <span v-if="release.size">{{ release.size }}</span>
        <span v-if="release.publishedAt">{{ release.publishedAt }}</span>
      </div>

      <ul class="release-notes">
        <li v-for="note in localizedNotes" :key="note">{{ note }}</li>
      </ul>
    </div>
  </section>
</template>
