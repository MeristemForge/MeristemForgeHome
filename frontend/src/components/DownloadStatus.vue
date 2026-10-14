<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchLatestRelease, type ReleaseInfo } from '@/api/release'

withDefaults(defineProps<{ testId?: string; compact?: boolean }>(), {
  testId: 'download-status',
  compact: false,
})

const release = ref<ReleaseInfo | null>(null)
const loading = ref(true)

onMounted(async () => {
  release.value = await fetchLatestRelease()
  loading.value = false
})
</script>

<template>
  <a
    v-if="release && release.downloadUrl !== '#'
      "
    class="download-status"
    :href="release.downloadUrl"
    :download="release.filename"
  >
    {{ $t('release.download') }} {{ release.version }}
  </a>
  <button
    v-else
    type="button"
    class="download-status"
    disabled
  >
    {{ loading ? $t('release.checking') : $t('release.unavailable') }}
  </button>
</template>
