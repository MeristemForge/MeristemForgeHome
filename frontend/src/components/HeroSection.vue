<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DownloadStatus from './DownloadStatus.vue'

const { t } = useI18n()
</script>

<template>
  <section id="top" class="hero section-shell">
    <div class="hero__copy">
      <p class="eyebrow">{{ t('hero.eyebrow') }}</p>
      <h1>{{ t('hero.title') }}</h1>
      <p class="hero__description">{{ t('hero.subtitle') }}</p>
      <div class="hero__actions">
        <DownloadStatus test-id="hero-download" />
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
