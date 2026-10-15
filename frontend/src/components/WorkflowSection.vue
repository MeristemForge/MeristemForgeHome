<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()
const benefits = computed(() => tm('workflow.benefits') as string[])
</script>

<template>
  <section id="workflow" class="workflow section-shell">
    <div class="workflow__panel glass-panel">
      <div class="workflow__copy">
        <p class="eyebrow">{{ t('workflow.eyebrow') }}</p>
        <h2>{{ t('workflow.title') }}</h2>
        <p>{{ t('workflow.description') }}</p>
        <ul class="benefit-grid">
          <li v-for="benefit in benefits" :key="benefit" data-testid="workflow-benefit">
            <span aria-hidden="true">✓</span> {{ benefit }}
          </li>
        </ul>
      </div>
    </div>
    <div class="preparation">
      <h3>{{ t('workflow.preparation') }}</h3>
      <ol class="preparation__steps">
        <li v-for="index in [0, 1, 2]" :key="index">
          <span class="preparation__number" aria-hidden="true">0{{ index + 1 }}</span>
          <h4>{{ t(`workflow.steps.${index}.title`) }}</h4>
          <p>{{ t(`workflow.steps.${index}.detail`) }}</p>
          <span class="preparation__action">{{ t(`workflow.steps.${index}.action`) }}</span>
        </li>
      </ol>
    </div>
  </section>
</template>
