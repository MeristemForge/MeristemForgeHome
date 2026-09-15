<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import DownloadStatus from './DownloadStatus.vue'

const { locale, t } = useI18n()

function toggleLocale() {
  const next = locale.value === 'zh' ? 'en' : 'zh'
  locale.value = next
  localStorage.setItem('locale', next)
  document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en'
}
</script>

<template>
  <nav class="navbar" :aria-label="t('nav.ariaLabel')">
    <div class="navbar__inner">
      <a class="brand" href="#top">
        <img :src="'/meristemforge-icon.svg'" alt="" />
        MeristemForge
      </a>
      <div class="nav-links">
        <a href="#capabilities">{{ t('nav.capabilities') }}</a>
        <a href="#workflow">{{ t('nav.workflow') }}</a>
        <a href="#about">{{ t('nav.about') }}</a>
      </div>
      <div class="nav-actions">
        <button
          data-testid="language-switch"
          class="language-switch"
          type="button"
          :aria-label="t('nav.language')"
          @click="toggleLocale"
        >
          {{ locale === 'zh' ? 'EN' : '中文' }}
        </button>
        <DownloadStatus test-id="nav-download" compact />
      </div>
    </div>
  </nav>
</template>
