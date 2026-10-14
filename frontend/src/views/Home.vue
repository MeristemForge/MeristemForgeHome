<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { fetchLatestRelease, type ReleaseInfo } from '@/api/release'
import CapabilityCards from '@/components/CapabilityCards.vue'
import HeroSection from '@/components/HeroSection.vue'
import ReleaseSection from '@/components/ReleaseSection.vue'
import WorkflowSection from '@/components/WorkflowSection.vue'

const release = ref<ReleaseInfo | null>(null)
const loading = ref(true)

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
  <CapabilityCards />
  <WorkflowSection />
  <ReleaseSection :release="release" />
</template>
