<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()
const benefits = computed(() => tm('workflow.benefits') as string[])
</script>

<template>
  <section id="workflow" class="workflow section-shell">
    <div class="workflow__panel glass-panel">
      <div class="workflow__preview" aria-hidden="true">
        <span class="preview-line"></span>
        <div class="preview-columns"><i></i><i></i><i></i></div>
      </div>
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
  </section>
</template>
