<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchLatestRelease, type ReleaseInfo } from '@/api/release'

const props = withDefaults(defineProps<{ testId?: string; compact?: boolean }>(), {
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
  <div class="download-status-wrapper" :class="{ 'download-status-wrapper--compact': props.compact }">
    <a
      v-if="release && release.downloadUrl !== '#'
      "
      class="download-status"
      :href="release.downloadUrl"
      :download="release.filename"
      :data-testid="props.testId"
    >
      {{ $t('release.download') }} {{ release.version }}
    </a>
    <button
      v-else
      type="button"
      class="download-status"
      :data-testid="props.testId"
      disabled
    >
      {{ loading ? $t('release.checking') : $t('release.unavailable') }}
    </button>
    <small v-if="release" class="download-meta">
      {{ release.platform }} · {{ release.size }}
    </small>
  </div>
</template>
