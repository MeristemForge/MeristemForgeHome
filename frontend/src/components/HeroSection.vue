<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ReleaseInfo } from '@/api/release'
import ReleaseDownload from './ReleaseDownload.vue'

defineProps<{ release: ReleaseInfo | null; loading: boolean }>()
const { t } = useI18n()
</script>

<template>
  <section id="top" class="hero section-shell">
    <div class="hero__copy">
      <p class="eyebrow">{{ t('hero.eyebrow') }}</p>
      <h1>{{ t('hero.title') }}</h1>
      <p class="hero__description">{{ t('hero.subtitle') }}</p>
      <div class="hero__actions">
        <ReleaseDownload :release="release" :loading="loading" />
        <a class="secondary-action" href="#capabilities">{{ t('hero.explore') }}</a>
      </div>
    </div>
    <div class="duck-stage">
      <span class="duck-glow" aria-hidden="true"></span>
      <span class="duck-shadow" aria-hidden="true"></span>
      <img
        data-testid="hero-mascot"
        class="duck-mascot"
        src="/meristemforge-duck.png"
        :alt="t('hero.mascotAlt')"
      />
    </div>
  </section>
</template>
