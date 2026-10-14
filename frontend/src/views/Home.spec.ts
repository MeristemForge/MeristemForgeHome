import { flushPromises, mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ReleaseInfo } from '@/api/release'
import * as releaseApi from '@/api/release'
import en from '@/i18n/en'
import zh from '@/i18n/zh'
import App from '@/App.vue'
import Home from './Home.vue'

function renderHome() {
  const i18n = createI18n({ legacy: false, locale: 'zh', messages: { zh, en } })
  return mount(Home, { global: { plugins: [i18n] } })
}

describe('Home', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('presents the product and mascot', () => {
    const wrapper = renderHome()
    expect(wrapper.get('h1').text()).toContain('让每一种灵感')
    expect(wrapper.get('[data-testid="hero-mascot"]').attributes('src')).toBe('/meristemforge-duck.png')
    expect(wrapper.get('[data-testid="hero-download"]')).toBeTruthy()
  })

  it('renders four creative modules', () => {
    const wrapper = renderHome()
    expect(wrapper.findAll('[data-testid="capability-card"]')).toHaveLength(4)
  })

  it('keeps workflow and release sections', () => {
    const wrapper = renderHome()
    expect(wrapper.get('#workflow').text()).toContain('复杂能力，简单地放在一起')
    expect(wrapper.get('#release')).toBeTruthy()
  })

  it('loads release data once and renders one hero download control', async () => {
    const pendingRelease: ReleaseInfo = {
      version: '0.1.0',
      platform: 'windows-x64',
      filename: 'MeristemForge-Setup-0.1.0.exe',
      status: 'pending',
      size: null,
      publishedAt: null,
      downloadUrl: null,
      notes: { zh: [], en: [] },
    }
    const fetchLatestReleaseSpy = vi
      .spyOn(releaseApi, 'fetchLatestRelease')
      .mockResolvedValue(pendingRelease)

    const wrapper = renderHome()
    await flushPromises()

    expect(fetchLatestReleaseSpy).toHaveBeenCalledTimes(1)
    expect(wrapper.findAll('[data-testid="hero-download"]')).toHaveLength(1)
    expect(wrapper.find('#release [data-testid="hero-download"]').exists()).toBe(false)
  })

  it('renders a single page shell', () => {
    const i18n = createI18n({ legacy: false, locale: 'zh', messages: { zh, en } })
    const wrapper = mount(App, { global: { plugins: [i18n] } })
    expect(wrapper.get('main #top').attributes('id')).toBe('top')
  })
})
