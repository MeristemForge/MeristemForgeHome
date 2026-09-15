import { createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'
import App from '@/App.vue'
import Navbar from '@/components/Navbar.vue'
import en from './en'
import zh from './zh'

async function plugins() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: ['/', '/projects', '/admin/login'].map((path) => ({
      path,
      component: { template: '<div>Page</div>' },
    })),
  })
  await router.push('/')
  await router.isReady()
  const i18n = createI18n({ legacy: false, locale: 'zh', messages: { en, zh } })
  return { router, i18n, pinia: createPinia() }
}

describe('old app compatibility', () => {
  it('renders the structured copyright copy in the existing footer', async () => {
    const { router, i18n, pinia } = await plugins()
    const wrapper = mount(App, { global: { plugins: [router, i18n, pinia] } })

    expect(wrapper.find('.site-footer').text()).toContain('© 2026 MeristemForge.')
  })

  it('updates the document language on each old-navbar toggle', async () => {
    const { router, i18n, pinia } = await plugins()
    document.documentElement.lang = 'zh-CN'
    const wrapper = mount(Navbar, { global: { plugins: [router, i18n, pinia] } })

    await wrapper.find('.lang-switch').trigger('click')
    expect(i18n.global.locale.value).toBe('en')
    expect(localStorage.getItem('locale')).toBe('en')
    expect(document.documentElement.lang).toBe('en')

    await wrapper.find('.lang-switch').trigger('click')
    expect(i18n.global.locale.value).toBe('zh')
    expect(localStorage.getItem('locale')).toBe('zh')
    expect(document.documentElement.lang).toBe('zh-CN')
  })
})
