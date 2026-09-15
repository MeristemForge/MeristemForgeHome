import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it, vi } from 'vitest'
import en from '@/i18n/en'
import zh from '@/i18n/zh'
import DownloadStatus from './DownloadStatus.vue'
import Navbar from './Navbar.vue'

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({ isAuthenticated: false }),
}))

function renderNavbar(initialLocale: 'zh' | 'en' = 'zh') {
  const i18n = createI18n({
    legacy: false,
    locale: initialLocale,
    messages: { zh, en },
  })

  const wrapper = mount(Navbar, {
    global: {
      plugins: [i18n],
      stubs: { RouterLink: { template: '<a><slot /></a>' } },
    },
  })

  return { wrapper, i18n }
}

describe('Navbar', () => {
  it('links to the product sections without a project route', () => {
    const { wrapper } = renderNavbar()

    expect(wrapper.get('nav').attributes('aria-label')).toBe('主导航')
    expect(wrapper.get('a[href="#top"]').text()).toBe('MeristemForge')
    expect(wrapper.get('a[href="#top"] img').attributes('src')).toBe('/meristemforge-icon.svg')
    expect(wrapper.get('a[href="#capabilities"]').text()).toBe(zh.nav.capabilities)
    expect(wrapper.get('a[href="#workflow"]').text()).toBe(zh.nav.workflow)
    expect(wrapper.get('a[href="#about"]').text()).toBe(zh.nav.about)
    expect(wrapper.find('a[href="/projects"]').exists()).toBe(false)
    expect(wrapper.html()).not.toContain('/projects')
  })

  it('shows a disabled, compact Windows release status', () => {
    const { wrapper } = renderNavbar()
    const button = wrapper.get('[data-testid="nav-download"]')

    expect(button.element.tagName).toBe('BUTTON')
    expect(button.attributes('disabled')).toBeDefined()
    expect(button.classes()).toContain('download-status--compact')
    expect(button.text()).toBe(zh.release.button)
  })

  it('labels the navigation landmark in English for English visitors', () => {
    const { wrapper } = renderNavbar('en')

    expect(wrapper.get('nav').attributes('aria-label')).toBe('Primary navigation')
  })

  it('switches Chinese to English and persists the document language', async () => {
    const { wrapper, i18n } = renderNavbar()
    const button = wrapper.get('[data-testid="language-switch"]')
    expect(button.attributes('aria-label')).toBe(zh.nav.language)

    await button.trigger('click')

    expect(i18n.global.locale.value).toBe('en')
    expect(document.documentElement.lang).toBe('en')
    expect(localStorage.getItem('locale')).toBe('en')
    expect(button.attributes('aria-label')).toBe(en.nav.language)
  })

  it('switches English to Chinese and persists the document language', async () => {
    const { wrapper, i18n } = renderNavbar('en')

    await wrapper.get('[data-testid="language-switch"]').trigger('click')

    expect(i18n.global.locale.value).toBe('zh')
    expect(document.documentElement.lang).toBe('zh-CN')
    expect(localStorage.getItem('locale')).toBe('zh')
  })

  it('uses the reusable release status defaults and translates its label', () => {
    const i18n = createI18n({ legacy: false, locale: 'en', messages: { zh, en } })
    const wrapper = mount(DownloadStatus, { global: { plugins: [i18n] } })

    expect(wrapper.attributes('data-testid')).toBe('download-status')
    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).not.toContain('download-status--compact')
    expect(wrapper.text()).toBe(en.release.button)
  })
})
