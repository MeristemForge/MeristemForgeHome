<script setup lang="ts">
withDefaults(defineProps<{ testId?: string; compact?: boolean }>(), {
  testId: 'download-status',
  compact: false,
})
</script>

<template>
  <button
    type="button"
    class="download-status"
    :class="{ 'download-status--compact': compact }"
    :data-testid="testId"
    disabled
  >
    {{ $t('release.button') }}
  </button>
</template>
