<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchLatestRelease, type ReleaseInfo } from '@/api/release'
import CapabilityCards from '@/components/CapabilityCards.vue'
import HeroSection from '@/components/HeroSection.vue'
import ReleaseSection from '@/components/ReleaseSection.vue'
import WorkflowSection from '@/components/WorkflowSection.vue'
import CreationGuide from '@/components/CreationGuide.vue'
import type { CapabilityKey } from '@/i18n/schema'

const release = ref<ReleaseInfo | null>(null)
const loading = ref(true)
const guideModule = ref<CapabilityKey>('video')

onMounted(async () => {
  try {
    release.value = await fetchLatestRelease()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <HeroSection :release="release" :loading="loading" />
  <CapabilityCards @learn="guideModule = $event" />
  <WorkflowSection />
  <CreationGuide v-model="guideModule" />
  <ReleaseSection :release="release" />
</template>
