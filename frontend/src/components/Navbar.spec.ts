import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { describe, expect, it } from 'vitest'
import en from '@/i18n/en'
import zh from '@/i18n/zh'
import DownloadStatus from './DownloadStatus.vue'
import Navbar from './Navbar.vue'

function renderNavbar(initialLocale: 'zh' | 'en' = 'zh') {
  const i18n = createI18n({
    legacy: false,
    locale: initialLocale,
    messages: { zh, en },
  })
  return { wrapper: mount(Navbar, { global: { plugins: [i18n] } }), i18n }
}

describe('Navbar', () => {
  it('links to product sections', () => {
    const { wrapper } = renderNavbar()
    expect(wrapper.get('nav').attributes('aria-label')).toBe('主导航')
    expect(wrapper.get('a[href="#top"]').text()).toBe('MeristemForge')
  })

  it('keeps the compact release download entry', () => {
    const { wrapper } = renderNavbar()
    const download = wrapper.get('[data-testid="nav-download"]')
    expect(download.classes()).toContain('download-status')
  })

  it('switches languages', async () => {
    const { wrapper, i18n } = renderNavbar()
    await wrapper.get('[data-testid="language-switch"]').trigger('click')
    expect(i18n.global.locale.value).toBe('en')
    expect(document.documentElement.lang).toBe('en')
    expect(localStorage.getItem('locale')).toBe('en')
  })

  it('renders reusable release status', () => {
    const i18n = createI18n({ legacy: false, locale: 'en', messages: { zh, en } })
    const wrapper = mount(DownloadStatus, { global: { plugins: [i18n] } })
    expect(wrapper.get('.download-status')).toBeTruthy()
  })
})
