<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ReleaseDownload from './ReleaseDownload.vue'

defineProps<{ available: boolean; loading: boolean }>()
const { t } = useI18n()
</script>

<template>
  <section id="top" class="hero section-shell">
    <div class="hero__copy">
      <p class="eyebrow">{{ t('hero.eyebrow') }}</p>
      <h1>{{ t('hero.title') }}</h1>
      <p class="hero__description">{{ t('hero.subtitle') }}</p>
      <div class="hero__actions">
        <ReleaseDownload :available="available" :loading="loading" />
        <a class="secondary-action" href="#guide">{{ t('hero.explore') }}</a>
      </div>
      <p class="hero__availability">{{ t('hero.availability') }}</p>
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
