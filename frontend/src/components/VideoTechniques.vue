<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { VideoTechniqueKey } from '@/i18n/schema'

const { t } = useI18n()
const techniques: VideoTechniqueKey[] = ['pose', 'depth', 'time', 'face', 'continuation', 'repair']
const icons: Record<VideoTechniqueKey, string> = {
  pose: 'M48 14a7 7 0 1 0 0-14 7 7 0 0 0 0 14M48 18v25m0-17-14 9m14-9 14 8M48 43l-12 21m12-21 13 21',
  depth: 'M12 14h56l15 8H27zm0 18h56l15 8H27zm0 18h56l15 8H27z',
  time: 'M12 32a28 28 0 1 1 8 20M12 32h15M12 32l9-11m27-3v18l13 8',
  face: 'M48 7a20 20 0 0 0-20 20v10a20 20 0 0 0 40 0V27A20 20 0 0 0 48 7m-8 24h2m12 0h2m-17 10q9 8 18 0M12 15V7h12m48 0h12v8M12 57v8h12m48 0h12v-8',
  continuation: 'M12 20h45v35H12zm51 0h21v35H63m-42 10h58M43 9l10 11-10 11',
  repair: 'M15 12h62v44H15zm10 33 14-19 9 10 7-7 13 16M61 45l11 11m0 0 11-11m-11 11V70m-42 0h24',
}
</script>

<template>
  <section class="video-techniques" aria-labelledby="video-techniques-title">
    <header class="video-techniques__heading">
      <p class="eyebrow">{{ t('guide.videoTechniques.title') }}</p>
      <p>{{ t('guide.videoTechniques.subtitle') }}</p>
    </header>
    <div class="video-techniques__grid">
      <details v-for="key in techniques" :key="key" class="technique-card" :data-technique="key">
        <summary>
          <span class="technique-card__icon" aria-hidden="true">
            <svg viewBox="0 0 96 80" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path :d="icons[key]" /></svg>
          </span>
          <span class="technique-card__heading">
            <strong>{{ t(`guide.videoTechniques.items.${key}.title`) }}</strong>
            <span>{{ t(`guide.videoTechniques.items.${key}.summary`) }}</span>
          </span>
          <span class="technique-card__toggle" aria-hidden="true">+</span>
        </summary>
        <div class="technique-card__body">
          <p class="technique-card__entry"><span>{{ t('guide.videoTechniques.entryLabel') }}</span>{{ t(`guide.videoTechniques.items.${key}.entry`) }}</p>
          <ol>
            <li v-for="step in [0, 1, 2]" :key="step">{{ t(`guide.videoTechniques.items.${key}.steps.${step}`) }}</li>
          </ol>
        </div>
      </details>
    </div>
  </section>
</template>
