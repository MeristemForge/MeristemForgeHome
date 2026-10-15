<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { CapabilityKey } from '@/i18n/schema'

defineEmits<{ learn: [module: CapabilityKey] }>()

const { t } = useI18n()
const capabilities = [
  { id: 'video', number: '01', english: 'VIDEO' },
  { id: 'image', number: '02', english: 'IMAGE' },
  { id: 'music', number: '03', english: 'MUSIC' },
  { id: 'voice', number: '04', english: 'VOICE' },
] as const
</script>

<template>
  <section id="capabilities" class="capabilities section-shell">
    <header class="section-heading">
      <p class="eyebrow">{{ t('capabilities.eyebrow') }}</p>
      <h2>{{ t('capabilities.title') }}</h2>
      <p>{{ t('capabilities.subtitle') }}</p>
    </header>
    <div class="capability-row" role="list">
      <article
        v-for="capability in capabilities"
        :key="capability.id"
        class="capability-card"
        :class="`capability-card--${capability.id}`"
        data-testid="capability-card"
        :data-capability="capability.id"
        role="listitem"
      >
        <header class="capability-card__top">
          <span>
            <strong class="capability-card__number">{{ capability.number }}</strong>
            <small>{{ capability.english }}</small>
          </span>
        </header>
        <div class="capability-card__visual">
          <svg class="capability-card__icon" viewBox="0 0 120 120" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <g v-if="capability.id === 'video'">
              <rect x="18" y="28" width="84" height="64" rx="14" />
              <path d="m50 45 28 15-28 15z" />
              <path d="M33 102h54" opacity=".62" />
            </g>
            <g v-else-if="capability.id === 'image'">
              <rect x="20" y="22" width="80" height="76" rx="13" />
              <circle cx="72" cy="43" r="8" />
              <path d="m29 85 23-25 16 16 11-12 13 15" />
            </g>
            <g v-else-if="capability.id === 'music'">
              <path d="M54 80V34l39-9v47" />
              <path d="m54 45 39-9" />
              <ellipse cx="43" cy="83" rx="11" ry="8" fill="currentColor" />
              <ellipse cx="82" cy="74" rx="11" ry="8" fill="currentColor" />
            </g>
            <g v-else>
              <path d="M60 24v72M43 39v42M77 39v42M27 51v18M93 51v18" />
              <path d="M42 99h36" opacity=".62" />
            </g>
          </svg>
        </div>
        <h3>{{ t(`capabilities.items.${capability.id}.label`) }}</h3>
        <p>{{ t(`capabilities.items.${capability.id}.description`) }}</p>
        <a class="capability-card__learn" href="#guide" @click="$emit('learn', capability.id)">{{ t('guide.learn') }} <span aria-hidden="true">↗</span></a>
      </article>
    </div>
    <p class="capability-scroll-hint">
      {{ t('capabilities.scrollHint') }}
      <span aria-hidden="true">↔</span>
    </p>
  </section>
</template>
