<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { checkInstallerAvailability } from '@/api/download'
import CapabilityCards from '@/components/CapabilityCards.vue'
import HeroSection from '@/components/HeroSection.vue'
import ReleaseSection from '@/components/ReleaseSection.vue'
import WorkflowSection from '@/components/WorkflowSection.vue'
import CreationGuide from '@/components/CreationGuide.vue'
import type { CapabilityKey } from '@/i18n/schema'

const installerAvailable = ref(false)
const loading = ref(true)
const guideModule = ref<CapabilityKey>('video')

onMounted(async () => {
  try {
    installerAvailable.value = await checkInstallerAvailability()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <HeroSection :available="installerAvailable" :loading="loading" />
  <CapabilityCards @learn="guideModule = $event" />
  <WorkflowSection />
  <CreationGuide v-model="guideModule" />
  <ReleaseSection :available="installerAvailable" :loading="loading" />
</template>
