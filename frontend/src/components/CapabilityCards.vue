<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const capabilities = [
  { id: 'video', number: '01', english: 'VIDEO', suit: '◆', symbol: '▶' },
  { id: 'image', number: '02', english: 'IMAGE', suit: '●', symbol: '✦' },
  { id: 'music', number: '03', english: 'MUSIC', suit: '▲', symbol: '♫' },
  { id: 'voice', number: '04', english: 'VOICE', suit: '♥', symbol: '◉' },
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
        tabindex="0"
      >
        <header class="capability-card__top">
          <span>
            <strong class="capability-card__number">{{ capability.number }}</strong>
            <small>{{ capability.english }}</small>
          </span>
          <span aria-hidden="true">{{ capability.suit }}</span>
        </header>
        <div class="capability-card__visual" aria-hidden="true">{{ capability.symbol }}</div>
        <h3>{{ t(`capabilities.items.${capability.id}.label`) }}</h3>
        <p>{{ t(`capabilities.items.${capability.id}.description`) }}</p>
        <span class="capability-card__corner" aria-hidden="true">{{ capability.suit }}</span>
      </article>
    </div>
  </section>
</template>
