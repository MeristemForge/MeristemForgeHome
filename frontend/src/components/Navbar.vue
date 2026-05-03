<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'
import { useAuthStore } from '@/stores/auth'

const { t, locale } = useI18n()
const auth = useAuthStore()

function toggleLocale() {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
  localStorage.setItem('locale', locale.value)
}
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/" class="logo">MeristemForge</RouterLink>
    <div class="nav-right">
      <div class="nav-links">
        <RouterLink to="/projects">{{ t('nav.projects') }}</RouterLink>
        <RouterLink v-if="auth.isAuthenticated" to="/admin/projects">{{
          t('nav.admin')
        }}</RouterLink>
        <RouterLink v-else to="/admin/login">{{
          t('nav.admin')
        }}</RouterLink>
      </div>
      <ThemeToggle />
      <button class="lang-switch" @click="toggleLocale" aria-label="Toggle language">
        <span :class="{ active: locale === 'en' }">EN</span>
        <span :class="{ active: locale === 'zh' }">CN</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  padding: 1.5rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  background: linear-gradient(to bottom, var(--nav-bg), transparent);
}

.logo {
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: var(--accent);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: color 0.3s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--accent);
}

.lang-switch {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
}

.lang-switch span {
  padding: 0.2rem 0.6rem;
  border-radius: 14px;
  font-size: 0.8rem;
  color: var(--text-muted);
  transition: all 0.3s;
}

.lang-switch span.active {
  background: var(--accent);
  color: #000;
  font-weight: 600;
}
</style>
