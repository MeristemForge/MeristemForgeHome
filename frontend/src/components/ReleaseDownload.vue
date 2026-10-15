<script setup lang="ts">
import { computed } from 'vue'
import { isSafeDownloadUrl, type ReleaseInfo } from '@/api/release'

const props = defineProps<{
  release: ReleaseInfo | null
  loading: boolean
}>()

const canDownload = computed(
  () =>
    !props.loading &&
    props.release?.status === 'published' &&
    isSafeDownloadUrl(props.release?.downloadUrl),
)
</script>

<template>
  <a
    v-if="canDownload"
    class="download-status"
    :href="release?.downloadUrl ?? undefined"
    :download="release?.filename"
    data-testid="hero-download"
  >
    {{ $t('release.download') }} {{ release?.version }}
  </a>
  <span
    v-else
    class="download-status download-status--pending"
    data-testid="hero-download"
    role="status"
    aria-live="polite"
  >
    <span class="download-status__dot" aria-hidden="true"></span>
    {{ loading ? $t('release.checking') : $t('release.pendingCta') }}
  </span>
</template>
