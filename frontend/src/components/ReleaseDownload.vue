<script setup lang="ts">
import { WINDOWS_INSTALLER_FILENAME, WINDOWS_INSTALLER_URL } from '@/api/download'

defineProps<{
  available: boolean
  loading: boolean
}>()

</script>

<template>
  <a
    v-if="available && !loading"
    class="download-status"
    :href="WINDOWS_INSTALLER_URL"
    :download="WINDOWS_INSTALLER_FILENAME"
    data-testid="hero-download"
  >
    {{ $t('release.download') }}
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
