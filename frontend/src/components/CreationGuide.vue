<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CapabilityKey } from '@/i18n/schema'
import VideoTechniques from './VideoTechniques.vue'

const props = defineProps<{ modelValue: CapabilityKey }>()
const emit = defineEmits<{ 'update:modelValue': [value: CapabilityKey] }>()
const { t } = useI18n()
const modules: CapabilityKey[] = ['video', 'image', 'music', 'voice']
const step = ref(0)
const tabs = ref<HTMLButtonElement[]>([])
const numbers = [0, 1, 2, 3]

watch(() => props.modelValue, () => { step.value = 0 })

async function navigateTabs(event: KeyboardEvent, index: number) {
  let next = index
  if (event.key === 'ArrowRight') next = (index + 1) % modules.length
  else if (event.key === 'ArrowLeft') next = (index + modules.length - 1) % modules.length
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = modules.length - 1
  else return
  event.preventDefault()
  emit('update:modelValue', modules[next])
  await nextTick()
  tabs.value[next]?.focus()
}
</script>

<template>
  <section id="guide" class="creation-guide section-shell">
    <header class="section-heading">
      <p class="eyebrow">{{ t('guide.eyebrow') }}</p>
      <h2>{{ t('guide.title') }}</h2>
      <p>{{ t('guide.subtitle') }}</p>
    </header>

    <div class="guide-tabs" role="tablist" :aria-label="t('guide.tabsLabel')">
      <button
        v-for="(module, index) in modules"
        :id="`guide-tab-${module}`"
        :key="module"
        ref="tabs"
        type="button"
        role="tab"
        :aria-selected="modelValue === module"
        :aria-controls="`guide-panel-${module}`"
        :tabindex="modelValue === module ? 0 : -1"
        :data-module="module"
        @click="emit('update:modelValue', module)"
        @keydown="navigateTabs($event, index)"
      >
        <span class="guide-tabs__number" aria-hidden="true">0{{ index + 1 }}</span>
        {{ t(`capabilities.items.${module}.label`) }}
      </button>
    </div>

    <section
      v-for="module in modules"
      v-show="modelValue === module"
      :id="`guide-panel-${module}`"
      :key="module"
      class="guide-panel"
      :data-module="module"
      role="tabpanel"
      :aria-labelledby="`guide-tab-${module}`"
      tabindex="0"
    >
      <header class="guide-panel__header">
        <div>
          <h3>{{ t(`guide.items.${module}.title`) }}</h3>
          <p>{{ t(`guide.items.${module}.intro`) }}</p>
        </div>
        <span class="guide-modes">{{ t(`guide.items.${module}.modes`) }}</span>
      </header>

      <figure class="guide-figure">
        <figcaption>{{ t('guide.diagram') }}</figcaption>
        <ol class="guide-map">
          <li v-for="index in numbers" :key="index">
            <button
              type="button"
              :class="{ 'is-current': step === index }"
              :aria-pressed="step === index"
              :aria-controls="`guide-detail-${module}`"
              @click="step = index"
            >
              <span class="guide-map__number">0{{ index + 1 }}</span>
              <svg class="guide-map__icon" viewBox="0 0 120 88" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <g v-if="index === 0">
                  <path d="M18 26h31l8 9h45v42H18z" fill="currentColor" fill-opacity=".08" />
                  <path d="M18 27v-9h29l9 9h46v8M53 55h17M61.5 47v16" />
                  <path d="M28 76v-9M91 76V46" opacity=".3" />
                </g>
                <g v-else-if="index === 1">
                  <rect x="12" y="14" width="96" height="62" rx="8" fill="currentColor" fill-opacity=".08" />
                  <path d="M12 29h96M22 22h2m6 0h2m6 0h2" opacity=".5" />
                  <g v-if="module === 'video'">
                    <rect x="23" y="40" width="45" height="25" rx="4" /><path d="m45 46 9 7-9 6zM79 42h18M79 52h13M79 62h18" />
                  </g>
                  <g v-else-if="module === 'image'">
                    <path d="M23 65V40h44v25zm3-3 13-12 10 9 7-6 9 9" /><circle cx="55" cy="47" r="3" /><path d="M78 42h19M78 52h13M78 62h19" />
                  </g>
                  <g v-else-if="module === 'music'">
                    <path d="M32 58V40l23-5v19M32 43l23-5" /><ellipse cx="27" cy="60" rx="5" ry="4" /><ellipse cx="50" cy="56" rx="5" ry="4" /><path d="M75 42h22M75 52h16M75 62h22" />
                  </g>
                  <g v-else>
                    <rect x="35" y="37" width="14" height="22" rx="7" /><path d="M28 51a14 14 0 0 0 28 0M42 65v5M75 42h22M75 52h16M75 62h22" />
                  </g>
                </g>
                <g v-else-if="index === 2">
                  <rect x="17" y="13" width="86" height="63" rx="8" fill="currentColor" fill-opacity=".08" />
                  <path d="M29 29h37M29 38h23M29 57h62M29 66h62" opacity=".5" />
                  <circle cx="48" cy="57" r="4" fill="var(--guide-paper)" /><circle cx="75" cy="66" r="4" fill="var(--guide-paper)" />
                  <path d="m76 27 4-8 4 8 8 4-8 4-4 8-4-8-8-4z" />
                </g>
                <g v-else>
                  <rect x="17" y="13" width="86" height="54" rx="8" fill="currentColor" fill-opacity=".08" />
                  <path v-if="module === 'video'" d="m52 29 21 12-21 12z" />
                  <g v-else-if="module === 'image'"><path d="m25 57 22-19 15 13 14-10 19 16" /><circle cx="75" cy="29" r="6" /></g>
                  <path v-else d="M32 35v12m9-18v24m9-31v38m10-31v24m10-35v46m10-34v22m9-15v8" />
                  <path d="M60 71v12m-6-5 6 6 6-6M28 76H17m86 0H91" />
                </g>
              </svg>
              <strong>{{ t(`guide.items.${module}.steps.${index}.title`) }}</strong>
            </button>
          </li>
        </ol>
      </figure>

      <div :id="`guide-detail-${module}`" class="guide-detail" aria-live="polite" aria-atomic="true">
        <span class="guide-detail__number" aria-hidden="true">0{{ step + 1 }}</span>
        <div>
          <p class="guide-detail__label">{{ t('guide.stepLabel') }} {{ step + 1 }} / 4</p>
          <h4>{{ t(`guide.items.${module}.steps.${step}.title`) }}</h4>
          <p>{{ t(`guide.items.${module}.steps.${step}.detail`) }}</p>
          <p class="guide-action">{{ t(`guide.items.${module}.steps.${step}.action`) }}</p>
        </div>
      </div>
      <div class="guide-pagination">
        <span>{{ t('guide.stepLabel') }} {{ step + 1 }} / 4</span>
        <div>
          <button type="button" :disabled="step === 0" @click="step--">← {{ t('guide.previous') }}</button>
          <button type="button" :disabled="step === 3" @click="step++">{{ t('guide.next') }} →</button>
        </div>
      </div>
      <aside class="guide-tip"><strong>{{ t('guide.tipLabel') }}</strong><p>{{ t(`guide.items.${module}.tip`) }}</p></aside>
      <VideoTechniques v-if="module === 'video'" />
    </section>
  </section>
</template>
